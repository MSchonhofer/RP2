"""
Przykładowy API endpoint do integracji modelu ze stroną internetową
Można użyć Flask lub FastAPI
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Umożliwia zapytania z frontendu

# Ścieżki do modelu
MODEL_PATH = "stem_classifier_model.pkl"
SCALER_PATH = "scaler.pkl"
ENCODERS_PATH = "label_encoders.pkl"
METADATA_PATH = "model_metadata.pkl"

# Załaduj model przy starcie
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
label_encoders = joblib.load(ENCODERS_PATH)
metadata = joblib.load(METADATA_PATH)

print(f"✓ Załadowano model: {metadata['model_name']}")

@app.route('/health', methods=['GET'])
def health():
    """Sprawdza czy API działa"""
    return jsonify({
        'status': 'ok',
        'model': metadata['model_name']
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint do predykcji STEM vs non-STEM
    
    Przykładowe zapytanie:
    POST /predict
    {
        "Gender": "Male",
        "HSC": 4.5,
        "SSC": 4.75,
        "Income": "Lower middle (15,000-30,000)",
        "Hometown": "Village",
        "Computer": 3,
        "Preparation": "2-3 Hours",
        "Gaming": "More than 3 Hours",
        "Attendance": "80%-100%",
        "Job": "No",
        "English": 4,
        "Extra": "Yes",
        "Semester": "2nd",
        "Last": 3.5,
        "Overall": 3.5
    }
    """
    try:
        # Pobierz dane z zapytania
        data = request.get_json()
        
        # Walidacja - sprawdź czy wszystkie wymagane pola są obecne
        required_fields = metadata['feature_names']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': 'Missing fields',
                'missing': missing_fields
            }), 400
        
        # Przygotuj dane
        df = pd.DataFrame([data])
        
        # Zakoduj kolumny kategoryczne
        for col, encoder in label_encoders.items():
            if col in df.columns:
                try:
                    df[col] = encoder.transform(df[col].astype(str))
                except ValueError as e:
                    return jsonify({
                        'error': f'Invalid value for {col}',
                        'details': str(e),
                        'valid_values': encoder.classes_.tolist()
                    }), 400
        
        # Upewnij się, że kolejność kolumn jest poprawna
        df = df[metadata['feature_names']]
        
        # Normalizacja
        X = scaler.transform(df.values)
        
        # Predykcja
        prediction = int(model.predict(X)[0])
        
        # Prawdopodobieństwo (jeśli model to wspiera)
        if hasattr(model, 'decision_function'):
            # Dla SVM używamy decision_function
            confidence = float(model.decision_function(X)[0])
        elif hasattr(model, 'predict_proba'):
            # Dla innych modeli używamy predict_proba
            proba = model.predict_proba(X)[0]
            confidence = float(proba[1])
        else:
            confidence = None
        
        # Przygotuj odpowiedź
        result = {
            'prediction': 'STEM' if prediction == 1 else 'non-STEM',
            'prediction_code': prediction,
            'model': metadata['model_name']
        }
        
        if confidence is not None:
            result['confidence'] = confidence
        
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
        'encoders': {
            col: encoder.classes_.tolist() 
            for col, encoder in label_encoders.items()
        }
    })

if __name__ == '__main__':
    print("\n" + "="*70)
    print("URUCHAMIANIE API SERWERA")
    print("="*70)
    print(f"Model: {metadata['model_name']}")
    print(f"Endpointy:")
    print(f"  GET  /health       - Sprawdza status API")
    print(f"  GET  /model-info   - Informacje o modelu")
    print(f"  POST /predict      - Wykonuje predykcję")
    print("="*70)
    print("\nSerwer uruchomiony na: http://localhost:5000")
    print("Naciśnij Ctrl+C aby zatrzymać serwer\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
