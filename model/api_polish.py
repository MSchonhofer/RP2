"""
REST API dla modelu STEM vs non-STEM
Obsługuje zarówno polskie, jak i amerykańskie dane
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from polish_adapter import PolishToUSAdapter

app = Flask(__name__)
CORS(app)

# Załaduj model przy starcie
MODEL_PATH = "stem_classifier_model.pkl"
SCALER_PATH = "scaler.pkl"
ENCODERS_PATH = "label_encoders.pkl"
METADATA_PATH = "model_metadata.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
label_encoders = joblib.load(ENCODERS_PATH)
metadata = joblib.load(METADATA_PATH)
adapter = PolishToUSAdapter()

print(f"✓ Załadowano model: {metadata['model_name']}")
print(f"✓ Zainicjalizowano adapter polskich danych")

@app.route('/health', methods=['GET'])
def health():
    """Sprawdza czy API działa"""
    return jsonify({
        'status': 'ok',
        'model': metadata['model_name'],
        'supports_polish': True
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint do predykcji STEM vs non-STEM
    Automatycznie wykrywa czy dane są polskie czy amerykańskie
    
    POLSKIE DANE - przykład zapytania:
    {
        "Plec": "Mężczyzna",
        "Matura": 85,
        "Egzamin8": 75,
        "Dochody": "Niżej średnie (3000-6000 PLN)",
        "Pochodzenie": "Wieś",
        "Komputer": 4,
        "Przygotowanie": "2-3 godziny",
        "Gry": "Więcej niż 3 godziny",
        "Frekwencja": "80%-100%",
        "Praca": "Nie",
        "Angielski": 4,
        "Dodatkowe": "Tak",
        "Semestr": 2,
        "Ostatnia": 4.5,
        "Srednia": 4.3
    }
    
    AMERYKAŃSKIE DANE - przykład zapytania:
    {
        "Gender": "Male",
        "HSC": 4.5,
        "SSC": 4.75,
        ... (jak w oryginalnym API)
    }
    """
    try:
        data = request.get_json()
        
        # Wykryj czy dane są polskie czy amerykańskie
        is_polish = _is_polish_data(data)
        
        if is_polish:
            # Konwertuj polskie dane na format amerykański
            us_data = adapter.convert_polish_to_us_format(data)
            data_source = "polish"
        else:
            us_data = data
            data_source = "us"
        
        # Walidacja
        required_fields = metadata['feature_names']
        missing_fields = [field for field in required_fields if field not in us_data]
        
        if missing_fields:
            return jsonify({
                'error': 'Missing fields after conversion',
                'missing': missing_fields,
                'data_source': data_source
            }), 400
        
        # Przygotuj dane
        df = pd.DataFrame([us_data])
        
        # Zakoduj kolumny kategoryczne
        for col, encoder in label_encoders.items():
            if col in df.columns:
                try:
                    df[col] = encoder.transform(df[col].astype(str))
                except ValueError as e:
                    return jsonify({
                        'error': f'Invalid value for {col}',
                        'details': str(e),
                        'valid_values': encoder.classes_.tolist(),
                        'data_source': data_source
                    }), 400
        
        # Upewnij się, że kolejność kolumn jest poprawna
        df = df[metadata['feature_names']]
        
        # Normalizacja
        X = scaler.transform(df.values)
        
        # Predykcja
        prediction = int(model.predict(X)[0])
        
        # Oblicz pewność
        if hasattr(model, 'decision_function'):
            confidence = float(model.decision_function(X)[0])
        elif hasattr(model, 'predict_proba'):
            proba = model.predict_proba(X)[0]
            confidence = float(proba[1])
        else:
            confidence = None
        
        # Przygotuj odpowiedź
        result = {
            'prediction': 'STEM' if prediction == 1 else 'non-STEM',
            'prediction_code': prediction,
            'model': metadata['model_name'],
            'data_source': data_source
        }
        
        if confidence is not None:
            result['confidence'] = confidence
        
        # Dodaj przekonwertowane dane dla polskich zapytań (opcjonalnie)
        if is_polish and request.args.get('debug') == 'true':
            result['converted_data'] = us_data
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Zwraca informacje o modelu"""
    return jsonify({
        'model_name': metadata['model_name'],
        'features': metadata['feature_names'],
        'supports_polish': True,
        'polish_fields': _get_polish_field_info(),
        'us_encoders': {
            col: encoder.classes_.tolist() 
            for col, encoder in label_encoders.items()
        }
    })

@app.route('/polish-format', methods=['GET'])
def polish_format():
    """
    Zwraca przykładowy format polskich danych wraz z opisami
    """
    return jsonify({
        'format': 'polish',
        'fields': {
            'Plec': {
                'type': 'string',
                'options': ['Mężczyzna', 'Kobieta'],
                'required': True
            },
            'Matura': {
                'type': 'number',
                'format': 'Skala 2-5 lub 0-100%',
                'example': '4.5 lub 85',
                'required': True
            },
            'Egzamin8': {
                'type': 'number',
                'format': 'Skala 2-5 lub 0-100%',
                'example': '4.0 lub 75',
                'required': True
            },
            'Dochody': {
                'type': 'string',
                'options': [
                    'Niskie (poniżej 3000 PLN)',
                    'Niżej średnie (3000-6000 PLN)',
                    'Wyżej średnie (6000-12000 PLN)',
                    'Wysokie (powyżej 12000 PLN)'
                ],
                'required': True
            },
            'Pochodzenie': {
                'type': 'string',
                'options': ['Miasto', 'Wieś'],
                'required': True
            },
            'Komputer': {
                'type': 'integer',
                'range': '1-5',
                'description': 'Poziom umiejętności komputerowych',
                'required': True
            },
            'Przygotowanie': {
                'type': 'string',
                'options': ['0-1 godzina', '2-3 godziny', 'Więcej niż 3 godziny'],
                'description': 'Czas przygotowań do zajęć dziennie',
                'required': True
            },
            'Gry': {
                'type': 'string',
                'options': ['0-1 godzina', '2-3 godziny', 'Więcej niż 3 godziny'],
                'description': 'Czas spędzany na grach dziennie',
                'required': True
            },
            'Frekwencja': {
                'type': 'string',
                'options': ['Poniżej 40%', '40%-59%', '60%-79%', '80%-100%'],
                'required': True
            },
            'Praca': {
                'type': 'string',
                'options': ['Tak', 'Nie'],
                'description': 'Czy student pracuje',
                'required': True
            },
            'Angielski': {
                'type': 'integer',
                'range': '1-5',
                'description': 'Poziom języka angielskiego',
                'required': True
            },
            'Dodatkowe': {
                'type': 'string',
                'options': ['Tak', 'Nie'],
                'description': 'Czy uczestniczy w zajęciach dodatkowych',
                'required': True
            },
            'Semestr': {
                'type': 'integer',
                'range': '1-10',
                'description': 'Który semestr studiów',
                'required': True
            },
            'Ostatnia': {
                'type': 'number',
                'format': 'Skala 2-5',
                'description': 'Ostatnia ocena',
                'required': True
            },
            'Srednia': {
                'type': 'number',
                'format': 'Skala 2-5',
                'description': 'Średnia ocen',
                'required': True
            }
        },
        'example': {
            'Plec': 'Mężczyzna',
            'Matura': 85,
            'Egzamin8': 75,
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
    })

def _is_polish_data(data):
    """
    Wykrywa czy dane są w formacie polskim czy amerykańskim
    """
    polish_keys = ['Plec', 'Matura', 'Egzamin8', 'Dochody', 'Pochodzenie', 
                   'Komputer', 'Przygotowanie', 'Gry', 'Frekwencja', 
                   'Praca', 'Angielski', 'Dodatkowe', 'Semestr', 
                   'Ostatnia', 'Srednia']
    
    us_keys = ['Gender', 'HSC', 'SSC', 'Income', 'Hometown']
    
    polish_count = sum(1 for key in polish_keys if key in data)
    us_count = sum(1 for key in us_keys if key in data)
    
    return polish_count > us_count

def _get_polish_field_info():
    """Zwraca informacje o polskich polach"""
    return [
        'Plec', 'Matura', 'Egzamin8', 'Dochody', 'Pochodzenie',
        'Komputer', 'Przygotowanie', 'Gry', 'Frekwencja',
        'Praca', 'Angielski', 'Dodatkowe', 'Semestr',
        'Ostatnia', 'Srednia'
    ]

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🇵🇱 URUCHAMIANIE API SERWERA (POLSKIE + AMERYKAŃSKIE DANE)")
    print("="*70)
    print(f"Model: {metadata['model_name']}")
    print(f"\nEndpointy:")
    print(f"  GET  /health          - Sprawdza status API")
    print(f"  GET  /model-info      - Informacje o modelu")
    print(f"  GET  /polish-format   - Format polskich danych")
    print(f"  POST /predict         - Wykonuje predykcję (PL lub US)")
    print("="*70)
    print("\n✅ Obsługuje polskie i amerykańskie dane!")
    print("🔄 Automatyczne wykrywanie formatu danych")
    print("\nSerwer uruchomiony na: http://localhost:5001")
    print("Naciśnij Ctrl+C aby zatrzymać serwer\n")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
