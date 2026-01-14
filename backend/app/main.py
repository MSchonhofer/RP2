from typing import Optional, Literal, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI()

# CORS (Vite/React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _coerce_float(v):
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        s = v.strip().replace(",", ".")
        if s == "":
            return None
        return float(s)
    return float(v)

class EvaluationRequest(BaseModel):
    department: str
    gender: str
    hometown: str

    hsc_score: float = Field(..., ge=0)
    ssc_score: float = Field(..., ge=0)

    income: str

    computer_proficiency: int = Field(..., ge=1, le=5)

    preparation_time: str
    gaming_time: str

    attendance: str
    extracurricular: str  # "Yes"/"No"

    job: str  # "Yes"/"No"
    english_proficiency: int = Field(..., ge=1, le=5)

    semester: str

    last_sem_gpa: float = Field(..., ge=0)
    overall_gpa: float = Field(..., ge=0)

    # pozwól przyjąć "4,17" z FE jeśli kiedyś przejdzie jako string
    @field_validator("hsc_score", "ssc_score", "last_sem_gpa", "overall_gpa", mode="before")
    @classmethod
    def parse_float(cls, v):
        return _coerce_float(v)

class EvaluationResponse(BaseModel):
    self_discipline_score: float
    stem_fit_probability: float
    stem_fit_label: str
    components: Dict[str, float]

def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))

# --- PROSTA, SENSOWNA HEURYSTYKA (na start; potem podmienimy na model z CSV) ---
def map_preparation_time(v: str) -> float:
    # 0..1
    return {
        "0–1 Hour": 0.2,
        "1–3 Hours": 0.6,
        "More than 3 Hours": 0.9,
    }.get(v, 0.5)

def map_gaming_time(v: str) -> float:
    # więcej grania = niższy komponent (0..1)
    return {
        "0–1 Hour": 0.85,
        "1–3 Hours": 0.55,
        "More than 3 Hours": 0.25,
    }.get(v, 0.5)

def map_attendance(v: str) -> float:
    return {
        "0–50%": 0.25,
        "50–80%": 0.6,
        "80–100%": 0.9,
    }.get(v, 0.5)

def map_yesno(v: str) -> float:
    return 1.0 if v == "Yes" else 0.0

def normalize_gpa(x: float, max_gpa: float = 5.0) -> float:
    return clamp01(x / max_gpa)

def stem_fit(req: EvaluationRequest) -> float:
    # “STEM-fit” – uproszczony scoring:
    # - lepsze GPA + lepszy computer proficiency + English -> wyżej
    # - department jeśli CS/Engineering -> bonus
    base = 0.35 * normalize_gpa(req.overall_gpa) + 0.25 * (req.computer_proficiency / 5) + 0.15 * (req.english_proficiency / 5)
    dept_bonus = 0.15 if req.department in ["Computer Science", "Engineering"] else 0.0
    return clamp01(base + dept_bonus)

def self_discipline(req: EvaluationRequest) -> Dict[str, float]:
    study = map_preparation_time(req.preparation_time)
    attendance = map_attendance(req.attendance)
    gaming = map_gaming_time(req.gaming_time)
    work = 0.6 if req.job == "No" else 0.45  # praca może obniżać czas; neutralnie/lekko w dół

    # akademicki komponent (GPA)
    academics = 0.5 * normalize_gpa(req.last_sem_gpa) + 0.5 * normalize_gpa(req.overall_gpa)

    # wynik końcowy 0..1
    score = clamp01(
        0.28 * study +
        0.26 * attendance +
        0.18 * gaming +
        0.10 * work +
        0.18 * academics
    )

    return {
        "score": score,
        "study": study * 100,
        "attendance": attendance * 100,
        "gaming": gaming * 100,
        "work": work * 100,
        "academics": academics * 100,
    }

@app.post("/api/evaluate", response_model=EvaluationResponse)
def evaluate(req: EvaluationRequest):
    sd = self_discipline(req)
    stem_p = stem_fit(req)

    if stem_p >= 0.65:
        label = "strong STEM fit"
    elif stem_p >= 0.50:
        label = "moderate STEM fit"
    else:
        label = "leaning non-STEM"

    return EvaluationResponse(
        self_discipline_score=sd["score"],
        stem_fit_probability=stem_p,
        stem_fit_label=label,
        components={
            "study": sd["study"],
            "attendance": sd["attendance"],
            "gaming": sd["gaming"],
            "work": sd["work"],
            "academics": sd["academics"],
        },
    )