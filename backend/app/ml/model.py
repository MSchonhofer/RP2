from functools import lru_cache
from pathlib import Path
import joblib


@lru_cache(maxsize=1)
def load_model():
    # models/stem_model.joblib względem backend/app/
    model_path = Path(__file__).resolve().parents[1] / "models" / "stem_model.joblib"
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")
    return joblib.load(model_path)