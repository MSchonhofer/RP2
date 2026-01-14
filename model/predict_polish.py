"""
Klasa predyktora dla polskich danych
Łączy adapter z modelem ML
"""

import joblib
from polish_adapter import PolishToUSAdapter
from typing import Dict, Any, Tuple

class PolishSTEMPredictor:
    """
    Predictor działający bezpośrednio na polskich danych
    """
    
    def __init__(self):
        """Inicjalizacja - ładuje model i adapter"""
        # Załaduj model i preprocessory
        self.model = joblib.load("stem_classifier_model.pkl")
        self.scaler = joblib.load("scaler.pkl")
        self.label_encoders = joblib.load("label_encoders.pkl")
        self.metadata = joblib.load("model_metadata.pkl")
        
        # Inicjalizuj adapter
        self.adapter = PolishToUSAdapter()
        
        print(f"✓ Załadowano model: {self.metadata['model_name']}")
        print(f"✓ Zainicjalizowano adapter polskich danych")
    
    def predict(self, polish_data: Dict[str, Any]) -> Tuple[str, float, Dict]:
        """
        Przewiduje STEM vs non-STEM dla polskich danych studenta
        
        Parameters:
        -----------
        polish_data : dict
            Słownik z polskimi danymi studenta
            
        Returns:
        --------
        prediction : str
            "STEM" lub "non-STEM"
        confidence : float
            Poziom pewności modelu
        us_data : dict
            Przekonwertowane dane amerykańskie (dla debugowania)
        """
        # 1. Konwertuj polskie dane na format amerykański
        us_data = self.adapter.convert_polish_to_us_format(polish_data)
        
        # 2. Zakoduj dane kategoryczne
        import pandas as pd
        df = pd.DataFrame([us_data])
        
        for col, encoder in self.label_encoders.items():
            if col in df.columns:
                try:
                    df[col] = encoder.transform(df[col].astype(str))
                except ValueError as e:
                    print(f"Ostrzeżenie: Nie można zakodować {col}: {e}")
                    # Użyj wartości domyślnej
                    df[col] = 0
        
        # 3. Upewnij się, że kolejność kolumn jest poprawna
        df = df[self.metadata['feature_names']]
        
        # 4. Normalizacja
        X = self.scaler.transform(df.values)
        
        # 5. Predykcja
        prediction_code = int(self.model.predict(X)[0])
        prediction = "STEM" if prediction_code == 1 else "non-STEM"
        
        # 6. Oblicz pewność
        if hasattr(self.model, 'decision_function'):
            confidence_score = float(self.model.decision_function(X)[0])
        elif hasattr(self.model, 'predict_proba'):
            proba = self.model.predict_proba(X)[0]
            confidence_score = float(proba[1])
        else:
            confidence_score = None
        
        return prediction, confidence_score, us_data


# Przykład użycia
if __name__ == "__main__":
    print("="*70)
    print("PREDYKTOR DLA POLSKICH DANYCH")
    print("="*70)
    
    predictor = PolishSTEMPredictor()
    
    # Przykładowy polski student
    polish_student = {
        'Plec': 'Mężczyzna',
        'Matura': 85,  # w procentach
        'Egzamin8': 75,  # w procentach
        'Dochody': 'Niżej średnie (3000-6000 PLN)',
        'Pochodzenie': 'Wieś',
        'Komputer': 4,
        'Przygotowanie': '2-3 godziny',
        'Gry': 'Więcej niż 3 godziny',
        'Frekwencja': '80%-100%',
        'Praca': 'Nie',
        'Angielski': 4,
        'Dodatkowe': 'Tak',
        'Semestr': 2,
        'Ostatnia': 4.5,
        'Srednia': 4.3
    }
    
    print("\n📝 Dane polskiego studenta:")
    for key, value in polish_student.items():
        print(f"  {key:15s}: {value}")
    
    print("\n" + "="*70)
    print("🔄 Wykonywanie predykcji...")
    print("="*70)
    
    prediction, confidence, us_data = predictor.predict(polish_student)
    
    print("\n✅ WYNIK PREDYKCJI:")
    print(f"  Kierunek: {prediction}")
    if confidence is not None:
        print(f"  Pewność: {confidence:.4f}")
    
    print("\n🔍 Przekonwertowane dane (US format):")
    for key, value in us_data.items():
        print(f"  {key:15s}: {value}")
    
    print("\n" + "="*70)
