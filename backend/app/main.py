from functools import lru_cache
from pathlib import Path
from typing import List, Optional, Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.model import load_model
from ml.features import build_features, build_components_for_ui


app = FastAPI(title="ResearchProject2 API")

# CORS (frontend z Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Schemas
# -----------------------------
class EvaluateRequest(BaseModel):
    # Aliasy = backend akceptuje payload z frontu w PascalCase
    Gender: str = Field(..., alias="Gender")
    Hometown: str = Field(..., alias="Hometown")
    Income: str = Field(..., alias="Income")

    SSC: float = Field(..., alias="SSC")
    HSC: float = Field(..., alias="HSC")

    Computer: float = Field(..., alias="Computer")
    Preparation: str = Field(..., alias="Preparation")
    Gaming: str = Field(..., alias="Gaming")
    Attendance: str = Field(..., alias="Attendance")
    Job: str = Field(..., alias="Job")
    Extra: str = Field(..., alias="Extra")
    English: float = Field(..., alias="English")

    # Semester bywa string w CSV, ale frontend często wysyła int -> przyjmujemy oba
    Semester: Union[int, str] = Field(..., alias="Semester")
    Last: float = Field(..., alias="Last")
    Overall: float = Field(..., alias="Overall")

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
    # 1) features do modelu (w tej samej kolejności jak w notebooku)
    X = build_features(payload.model_dump(by_alias=True))

    # 2) predykcja
    model = load_model()
    proba = float(model.predict_proba([X])[0][1])  # P(STEM)

    # 3) self_discipline score do UI (0..1)
    #    Wyciągamy je z komponentów (żeby było spójnie z Waszym mappingiem)
    comp = build_components_for_ui(payload.model_dump(by_alias=True))
    self_discipline_01 = comp["Self-discipline"] / 100.0

    # 4) components jako lista (UI-friendly) — naprawia Twój błąd 400
    components_list = [Component(name=k, value=v) for k, v in comp.items()]

    return EvaluateResponse(
        self_discipline_score=self_discipline_01,
        stem_fit_probability=proba,
        stem_fit_label=stem_label(proba),
        components=components_list,
    )