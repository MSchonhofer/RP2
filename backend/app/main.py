from functools import lru_cache
from pathlib import Path
from typing import List, Optional, Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.model import load_model
from ml.features import build_features, build_components_for_ui
from ml.polish_adapter import (
    polish_income_to_category,
    adapt_ssc,
    adapt_hsc,
    adapt_last_semester,
    adapt_overall_gpa,
)


app = FastAPI(title="ResearchProject2 API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://stem-fit-rp.vercel.app",
    "https://rp-2-bcpucz7-mschonhofers-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Schemas
# -----------------------------
class EvaluateRequest(BaseModel):
    """
    Request schema accepting Polish educational system data.
    Backend will convert to Malaysian format for the model.
    """
    # Aliasy = backend akceptuje payload z frontu w PascalCase
    Gender: str = Field(..., alias="Gender")
    Hometown: str = Field(..., alias="Hometown")
    
    # Income now expects Polish category string (e.g. "Low (Below 7,000 PLN)")
    Income: str = Field(..., alias="Income", description="Polish income category")

    # Grades in Polish scale (1-6 for school, 2-5 for university)
    SSC: float = Field(..., alias="SSC", ge=1.0, le=6.0, description="Primary school grade (1-6)")
    HSC: float = Field(..., alias="HSC", ge=1.0, le=6.0, description="High school grade (1-6)")

    Computer: float = Field(..., alias="Computer")
    Preparation: str = Field(..., alias="Preparation")
    Gaming: str = Field(..., alias="Gaming")
    Attendance: str = Field(..., alias="Attendance")
    Job: str = Field(..., alias="Job")
    Extra: str = Field(..., alias="Extra")
    English: float = Field(..., alias="English")

    # Semester bywa string w CSV, ale frontend często wysyła int -> przyjmujemy oba
    Semester: Union[int, str] = Field(..., alias="Semester")
    
    # University grades in Polish scale (2.0-5.0)
    Last: float = Field(..., alias="Last", ge=2.0, le=5.0, description="Last semester grade (2.0-5.0)")
    Overall: float = Field(..., alias="Overall", ge=2.0, le=5.0, description="Overall university grade (2.0-5.0)")

    class Config:
        populate_by_name = True  # pozwala też na wysłanie po polach (nie tylko aliasach)


class Component(BaseModel):
    name: str
    value: float  # w % (0-100)


class EvaluateResponse(BaseModel):
    self_discipline_score: float          # 0..1
    stem_fit_probability: float           # 0..1
    stem_fit_label: str
    components: List[Component]


def stem_label(p: float) -> str:
    if p >= 0.75:
        return "High STEM fit"
    if p >= 0.55:
        return "Moderate STEM fit"
    if p >= 0.40:
        return "Slight STEM fit"
    return "Non-STEM tendency"


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/evaluate", response_model=EvaluateResponse)
def evaluate(payload: EvaluateRequest):
    """
    Evaluate student data and predict STEM fit.
    Converts Polish educational data to Malaysian format for the model.
    """
    # Convert Polish data to Malaysian format
    data_dict = payload.model_dump(by_alias=True)
    
    # Apply Polish adapters
    adapted_data = {
        "Gender": data_dict["Gender"],
        "Hometown": data_dict["Hometown"],
        "Income": polish_income_to_category(data_dict["Income"]),  # PLN → category
        "SSC": adapt_ssc(data_dict["SSC"]),  # Polish 1-6 → Malaysian 0-5
        "HSC": adapt_hsc(data_dict["HSC"]),  # Polish 1-6 → Malaysian 0-5
        "Computer": data_dict["Computer"],
        "Preparation": data_dict["Preparation"],
        "Gaming": data_dict["Gaming"],
        "Attendance": data_dict["Attendance"],
        "Job": data_dict["Job"],
        "Extra": data_dict["Extra"],
        "English": data_dict["English"],
        "Semester": data_dict["Semester"],
        "Last": adapt_last_semester(data_dict["Last"]),  # Polish 2-5 → Malaysian 0-5
        "Overall": adapt_overall_gpa(data_dict["Overall"]),  # Polish 2-5 → Malaysian 0-5
    }
    
    # 1) Build features for the model (in Malaysian format)
    X = build_features(adapted_data)

    # 2) Prediction
    model = load_model()
    proba = float(model.predict_proba([X])[0][1])  # P(STEM)

    # 3) Self-discipline score for UI (0..1)
    comp = build_components_for_ui(adapted_data)
    self_discipline_01 = comp["Self-discipline"] / 100.0

    # 4) Components as list (UI-friendly)
    components_list = [Component(name=k, value=v) for k, v in comp.items()]

    return EvaluateResponse(
        self_discipline_score=self_discipline_01,
        stem_fit_probability=proba,
        stem_fit_label=stem_label(proba),
        components=components_list,
    )