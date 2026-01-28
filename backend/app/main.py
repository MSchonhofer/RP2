from functools import lru_cache
from pathlib import Path
from typing import List, Optional, Union, Dict, Tuple

import numpy as np
import pandas as pd
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
    "https://rp-2-bcpucz7-mschonhofers-projects.vercel.app",
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
    Backend will convert to Malaysian-like format for the model.
    """
    Gender: str = Field(..., alias="Gender")
    Hometown: str = Field(..., alias="Hometown")

    # Income expects Polish category string (e.g. "Low (Below 7,000 PLN)")
    Income: str = Field(..., alias="Income", description="Polish income category")

    # Polish school grades (1-6)
    SSC: float = Field(..., alias="SSC", ge=1.0, le=6.0, description="Primary school grade (1-6)")
    HSC: float = Field(..., alias="HSC", ge=1.0, le=6.0, description="High school grade (1-6)")

    Computer: float = Field(..., alias="Computer")
    Preparation: str = Field(..., alias="Preparation")
    Gaming: str = Field(..., alias="Gaming")
    Attendance: str = Field(..., alias="Attendance")
    Job: str = Field(..., alias="Job")
    Extra: str = Field(..., alias="Extra")
    English: float = Field(..., alias="English")

    # Semester can be int or string
    Semester: Union[int, str] = Field(..., alias="Semester")

    # Polish university grades (2-5)
    Last: float = Field(..., alias="Last", ge=2.0, le=5.0, description="Last semester grade (2.0-5.0)")
    Overall: float = Field(..., alias="Overall", ge=2.0, le=5.0, description="Overall university grade (2.0-5.0)")

    class Config:
        populate_by_name = True


class Component(BaseModel):
    name: str
    value: float  # in % (0-100)


class DepartmentScore(BaseModel):
    department: str
    score: float  # 0..1 similarity


class EvaluateResponse(BaseModel):
    self_discipline_score: float          # 0..1
    stem_fit_probability: float           # 0..1
    stem_fit_label: str
    components: List[Component]

    # NEW
    department_fit: Optional[str] = None
    department_fit_score: Optional[float] = None
    department_top: Optional[List[DepartmentScore]] = None


# -----------------------------
# Helpers
# -----------------------------
def stem_label(p: float) -> str:
    if p >= 0.75:
        return "High STEM fit"
    if p >= 0.55:
        return "Moderate STEM fit"
    if p >= 0.40:
        return "Slight STEM fit"
    return "Non-STEM tendency"


@lru_cache(maxsize=1)
def get_model():
    # loads once per process
    return load_model()


DEPT_CENTROIDS: Dict[str, np.ndarray] = {}
DEPT_COUNTS: Dict[str, int] = {}


def _find_data_csv() -> Optional[Path]:
    here = Path(__file__).resolve()
    candidates = [
        here.parent / "Data.csv",                     # backend/app/Data.csv
        here.parent.parent / "Data.csv",              # backend/Data.csv
        here.parent.parent / "data" / "Data.csv",     # backend/data/Data.csv  ✅
        here.parent.parent.parent / "Data.csv",       # repo-root/Data.csv
    ]
    for p in candidates:
        if p.exists():
            return p
    return None


def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    na = float(np.linalg.norm(a))
    nb = float(np.linalg.norm(b))
    if na == 0.0 or nb == 0.0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def best_department_fit(x8: np.ndarray, top_k: int = 3) -> Tuple[Optional[str], Optional[float], List[Tuple[str, float]]]:
    if not DEPT_CENTROIDS:
        return None, None, []

    scored: List[Tuple[str, float]] = []
    for dept, centroid in DEPT_CENTROIDS.items():
        s = _cosine(x8, centroid)  # ~0..1
        scored.append((dept, s))

    scored.sort(key=lambda t: t[1], reverse=True)
    top = scored[:top_k]
    best_dept, best_score = top[0]
    return best_dept, best_score, top


def _compute_department_centroids():
    """
    Precompute mean feature-vector (8D) per Department from Data.csv.
    Uses build_features() on raw CSV rows (dataset format).
    Runs once on startup.
    """
    global DEPT_CENTROIDS, DEPT_COUNTS

    csv_path = _find_data_csv()
    if not csv_path:
        print("[WARN] Data.csv not found -> department fit disabled")
        DEPT_CENTROIDS = {}
        DEPT_COUNTS = {}
        return

    df = pd.read_csv(csv_path)

    required_cols = [
        "Gender", "Hometown", "Income", "SSC", "HSC", "Computer", "Preparation", "Gaming",
        "Attendance", "Job", "Extra", "English", "Semester", "Last", "Overall", "Department"
    ]
    for c in required_cols:
        if c not in df.columns:
            print(f"[WARN] Data.csv missing column: {c} -> department fit disabled")
            DEPT_CENTROIDS = {}
            DEPT_COUNTS = {}
            return

    rows: List[np.ndarray] = []
    depts: List[str] = []

    df2 = df.dropna(subset=["Department"]).copy()

    for _, r in df2.iterrows():
        raw = {
            "Gender": r["Gender"],
            "Hometown": r["Hometown"],
            "Income": r["Income"],
            "SSC": float(r["SSC"]),
            "HSC": float(r["HSC"]),
            "Computer": float(r["Computer"]),
            "Preparation": r["Preparation"],
            "Gaming": r["Gaming"],
            "Attendance": r["Attendance"],
            "Job": r["Job"],
            "Extra": r["Extra"],
            "English": float(r["English"]),
            "Semester": str(r["Semester"]),
            "Last": float(r["Last"]),
            "Overall": float(r["Overall"]),
        }

        x8 = build_features(raw)  # returns 8-feature vector
        rows.append(np.asarray(x8, dtype=float))
        depts.append(str(r["Department"]))

    X = np.vstack(rows) if rows else np.zeros((0, 8), dtype=float)

    DEPT_CENTROIDS = {}
    DEPT_COUNTS = {}
    for d in sorted(set(depts)):
        idx = [i for i, dd in enumerate(depts) if dd == d]
        if not idx:
            continue
        DEPT_COUNTS[d] = len(idx)
        DEPT_CENTROIDS[d] = X[idx].mean(axis=0)

    print(f"[OK] Department centroids loaded: {len(DEPT_CENTROIDS)} departments from {csv_path}")


@app.on_event("startup")
def on_startup():
    # compute once per deployment start
    _compute_department_centroids()
    # optionally warm model too:
    _ = get_model()


# -----------------------------
# Routes
# -----------------------------
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "departments_loaded": len(DEPT_CENTROIDS),
    }


@app.post("/api/evaluate", response_model=EvaluateResponse)
def evaluate(payload: EvaluateRequest):
    """
    Evaluate student data and predict STEM fit.
    Converts Polish educational data to dataset/model format.
    """
    data_dict = payload.model_dump(by_alias=True)

    # Convert Polish data to model/dataset format
    adapted_data = {
        "Gender": data_dict["Gender"],
        "Hometown": data_dict["Hometown"],
        "Income": polish_income_to_category(data_dict["Income"]),  # PLN category -> dataset category
        "SSC": adapt_ssc(float(data_dict["SSC"])),                  # PL 1-6 -> 0-5-ish
        "HSC": adapt_hsc(float(data_dict["HSC"])),                  # PL 1-6 -> 0-5-ish
        "Computer": float(data_dict["Computer"]),
        "Preparation": data_dict["Preparation"],
        "Gaming": data_dict["Gaming"],
        "Attendance": data_dict["Attendance"],
        "Job": data_dict["Job"],
        "Extra": data_dict["Extra"],
        "English": float(data_dict["English"]),
        "Semester": str(data_dict["Semester"]),                     # keep consistent
        "Last": adapt_last_semester(float(data_dict["Last"])),       # PL 2-5 -> 0-5-ish
        "Overall": adapt_overall_gpa(float(data_dict["Overall"])),   # PL 2-5 -> 0-5-ish
    }

    # 1) Build 8D features for model
    X8 = np.asarray(build_features(adapted_data), dtype=float)

    # 2) Prediction (STEM probability)
    model = get_model()
    proba = float(model.predict_proba([X8])[0][1])  # P(STEM)

    # 3) Self-discipline score (0..1) + chart components (0..100)
    comp = build_components_for_ui(adapted_data)
    self_discipline_01 = float(comp.get("Self-discipline", 0.0)) / 100.0
    components_list = [Component(name=str(k), value=float(v)) for k, v in comp.items()]

    # 4) Department fit (closest centroid)
    best_dept, best_score, top = best_department_fit(X8, top_k=3)

    return EvaluateResponse(
        self_discipline_score=self_discipline_01,
        stem_fit_probability=proba,
        stem_fit_label=stem_label(proba),
        components=components_list,

        department_fit=best_dept,
        department_fit_score=float(best_score) if best_score is not None else None,
        department_top=[DepartmentScore(department=d, score=float(s)) for d, s in top] if top else None,
    )