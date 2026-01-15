import re


# --- mappingi dokładnie pod wartości z Data.csv ---
PREP_MAP = {
    "0-1 Hour": 0.2,
    "2-3 Hours": 0.6,
    "More than 3 Hours": 0.9,
}

GAMING_MAP = {
    "0-1 Hour": 0.85,
    "2-3 Hours": 0.55,
    "More than 3 Hours": 0.25,
}

ATTENDANCE_MAP = {
    "Below 40%": 0.15,
    "40%-59%": 0.4,
    "60%-79%": 0.7,
    "80%-100%": 0.95,
}

YESNO_MAP = {"Yes": 1.0, "No": 0.0}

INCOME_MAP = {
    "Low (Below 15,000)": 0.2,
    "Lower middle (15,000-30,000)": 0.45,
    "Upper middle (30,000-50,000)": 0.7,
    "High (Above 50,000)": 0.9,
}

HOMETOWN_MAP = {
    "Village": 0.3,
    "Town": 0.5,
    "City": 0.7,
    "Other": 0.6,
}

GENDER_MAP = {
    "Male": 1.0,
    "Female": 0.0,
    "Other": 0.5,
}


def _clean(s):
    if s is None:
        return ""
    return (
        str(s)
        .strip()
        .replace("\u00a0", " ")
    )


def _semester_to_num(x):
    """
    CSV czasem ma '7th' / '7' / '7th Semester' itp.
    Front wysyła często int.
    """
    if x is None:
        return 0.0
    if isinstance(x, int):
        return float(x)
    s = _clean(x)
    m = re.search(r"(\d+)", s)
    return float(m.group(1)) if m else 0.0


def compute_self_discipline(payload: dict) -> float:
    prep = PREP_MAP.get(_clean(payload.get("Preparation")), 0.0)
    att = ATTENDANCE_MAP.get(_clean(payload.get("Attendance")), 0.0)
    game = GAMING_MAP.get(_clean(payload.get("Gaming")), 0.0)
    job = YESNO_MAP.get(_clean(payload.get("Job")), 0.0)
    extra = YESNO_MAP.get(_clean(payload.get("Extra")), 0.0)

    # identyczny wzór jak w notebooku
    return (
        0.30 * prep +
        0.25 * att +
        0.20 * game +
        0.10 * (1.0 - job) +
        0.15 * extra
    )


def compute_academic_score(payload: dict) -> float:
    # Tu masz "na żywo" — bez max z datasetu.
    # Robimy normalizację do 0..1 zakładając skale 0..5.
    ssc = float(payload.get("SSC", 0.0))
    hsc = float(payload.get("HSC", 0.0))
    last = float(payload.get("Last", 0.0))
    overall = float(payload.get("Overall", 0.0))
    raw = 0.25 * ssc + 0.25 * hsc + 0.25 * last + 0.25 * overall
    return max(0.0, min(raw / 5.0, 1.0))


def build_features(payload: dict):
    """
    Zwraca listę feature’ów w tej samej kolejności jak w notebooku:
    FEATURES = [
      self_discipline, academic_score, computer_skill, english_skill,
      income_norm, hometown_norm, gender_norm, semester_norm
    ]
    """
    income = INCOME_MAP.get(_clean(payload.get("Income")), 0.0)
    hometown = HOMETOWN_MAP.get(_clean(payload.get("Hometown")), 0.0)
    gender = GENDER_MAP.get(_clean(payload.get("Gender")), 0.5)

    computer = float(payload.get("Computer", 0.0)) / 5.0
    english = float(payload.get("English", 0.0)) / 5.0

    sem_num = _semester_to_num(payload.get("Semester"))
    semester_norm = max(0.0, min(sem_num / 8.0, 1.0))

    self_disc = compute_self_discipline(payload)
    academic = compute_academic_score(payload)

    return [
        self_disc,
        academic,
        computer,
        english,
        income,
        hometown,
        gender,
        semester_norm,
    ]


def build_components_for_ui(payload: dict) -> dict:
    """
    To jest tylko pod wykres (0..100), żeby UI miało ładne słupki.
    """
    self_disc = compute_self_discipline(payload) * 100.0
    academic = compute_academic_score(payload) * 100.0
    computer = (float(payload.get("Computer", 0.0)) / 5.0) * 100.0
    english = (float(payload.get("English", 0.0)) / 5.0) * 100.0
    income = INCOME_MAP.get(_clean(payload.get("Income")), 0.0) * 100.0
    hometown = HOMETOWN_MAP.get(_clean(payload.get("Hometown")), 0.0) * 100.0
    gender = GENDER_MAP.get(_clean(payload.get("Gender")), 0.5) * 100.0
    semester = (max(0.0, min(_semester_to_num(payload.get("Semester")) / 8.0, 1.0))) * 100.0

    return {
        "Self-discipline": round(self_disc, 1),
        "Academic": round(academic, 1),
        "Computer": round(computer, 1),
        "English": round(english, 1),
        "Income": round(income, 1),
        "Hometown": round(hometown, 1),
        "Gender": round(gender, 1),
        "Semester": round(semester, 1),
    }