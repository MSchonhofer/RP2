from fastapi import FastAPI
from pydantic import BaseModel
from math import exp

app = FastAPI()

# --- mapowania kategorii na [0,1] ---

STUDY_MAP = {
    "0–1 hour": 0.25,
    "1–2 hours": 0.55,
    "2–3 hours": 0.8,
    "More than 3 hours": 1.0,
}

GAMING_MAP = {
    "0–1 hour": 1.0,
    "2–3 hours": 0.6,
    "More than 3 hours": 0.2,
}

ATTENDANCE_MAP = {
    "Below 60%": 0.2,
    "60–80%": 0.6,
    "Above 80%": 1.0,
}

JOB_MAP = {
    "No": 1.0,
    "Yes, part-time": 0.8,
    "Yes, full-time": 0.6,
}

INCOME_MAP = {
    "Low": 0.4,
    "Lower middle": 0.55,
    "Upper middle": 0.7,
    "High": 0.8,
}

HOMETOWN_MAP = {
    "Rural area / village": 0.4,
    "Small town": 0.55,
    "Medium-size city": 0.7,
    "Large city / metropolitan area": 0.8,
}

DEPT_STEM_MAP = {
    "STEM (science / engineering / technology / maths)": 1.0,
    "Business / economics / management": 0.6,
    "Humanities / social sciences / arts": 0.3,
    "Other / mixed programme": 0.5,
}

# NOWE: samoocena wyników z matmy
MATH_MAP = {
    "Below average": 0.3,
    "Around average": 0.5,
    "Above average": 0.75,
    "Top of the class": 1.0,
}


# --- modele wejścia / wyjścia ---


class QuestionnaireInput(BaseModel):
    study_hours: str
    gaming: str
    attendance: str
    job: str
    income: str
    gender: str
    department: str
    hometown: str
    math_performance: str   # NOWE POLE


class QuestionnaireResult(BaseModel):
    self_discipline_score: float
    stem_fit_probability: float
    stem_fit_label: str

    study_component: float
    gaming_component: float
    attendance_component: float
    job_component: float

    math_component: float             # % z matmy (0–100)
    academic_potential_score: float   # łączny „potencjał akademicki” (self-disc + math)


# --- funkcje pomocnicze ---


def sigmoid(z: float) -> float:
    return 1.0 / (1.0 + exp(-z))


def safe_map(value: str, mapping: dict, default: float = 0.5) -> float:
    return mapping.get(value, default)


def compute_scores(payload: QuestionnaireInput) -> QuestionnaireResult:
    # 1. komponenty w [0,1]
    study_score = safe_map(payload.study_hours, STUDY_MAP)
    gaming_score = safe_map(payload.gaming, GAMING_MAP)
    attendance_score = safe_map(payload.attendance, ATTENDANCE_MAP)
    job_score = safe_map(payload.job, JOB_MAP)

    income_score = safe_map(payload.income, INCOME_MAP)
    hometown_score = safe_map(payload.hometown, HOMETOWN_MAP)
    dept_stem_score = safe_map(payload.department, DEPT_STEM_MAP)

    math_score = safe_map(payload.math_performance, MATH_MAP)

    # 2. self-discipline (główny bohater)
    self_disc_raw = (
        0.40 * study_score
        + 0.25 * attendance_score
        + 0.20 * gaming_score
        + 0.15 * job_score
    )
    self_discipline_score = self_disc_raw * 100.0

    # 3. STEM fit – self-discipline ma trochę większą wagę niż math
    self_disc_norm = self_discipline_score / 100.0

    z = (
        -0.8
        + 1.4 * self_disc_norm     # mocny wpływ samodyscypliny
        + 0.9 * math_score         # nieco słabszy, ale wciąż ważny wpływ matmy
        + 0.6 * dept_stem_score
        + 0.25 * income_score
        + 0.25 * hometown_score
    )
    stem_fit_probability = sigmoid(z)

    if stem_fit_probability < 0.4:
        stem_fit_label = "more likely non-STEM"
    elif stem_fit_probability < 0.6:
        stem_fit_label = "balanced / either"
    else:
        stem_fit_label = "more likely STEM"

    # 4. „Academic potential” – 60% self-discipline, 40% math
    academic_potential_score = (
        0.6 * self_disc_norm + 0.4 * math_score
    ) * 100.0

    return QuestionnaireResult(
        self_discipline_score=round(self_discipline_score, 2),
        stem_fit_probability=stem_fit_probability,
        stem_fit_label=stem_fit_label,

        study_component=round(study_score * 100.0, 2),
        gaming_component=round(gaming_score * 100.0, 2),
        attendance_component=round(attendance_score * 100.0, 2),
        job_component=round(job_score * 100.0, 2),

        math_component=round(math_score * 100.0, 2),
        academic_potential_score=round(academic_potential_score, 2),
    )


@app.post("/api/evaluate", response_model=QuestionnaireResult)
def evaluate(input_data: QuestionnaireInput):
    return compute_scores(input_data)
