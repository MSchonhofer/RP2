"""
Skrypt do wykonywania predykcji na podstawie wytrenowanego modelu
"""
import pandas as pd
import joblib
import numpy as np

# Ścieżki do zapisanych modeli
MODEL_PATH = "stem_classifier_model.pkl"
SCALER_PATH = "scaler.pkl"
ENCODERS_PATH = "label_encoders.pkl"
METADATA_PATH = "model_metadata.pkl"

class STEMPredictor:
    """
    Klasa do wykonywania predykcji STEM vs non-STEM
    """
    
    def __init__(self):
        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.label_encoders = joblib.load(ENCODERS_PATH)
        self.metadata = joblib.load(METADATA_PATH)
        
        print(f"Załadowano model: {self.metadata['model_name']}")
        print(f"Cechy modelu: {len(self.metadata['feature_names'])}")
    
    def predict_single(self, student_data):
        """
        Przewiduje czy student wybierze STEM czy non-STEM
        
        Parameters:
        -----------
        student_data : dict
            Słownik z danymi studenta (bez Department)
            
        Returns:
        --------
        prediction : int (0 lub 1)
            0 = non-STEM, 1 = STEM
        probability : float
            Prawdopodobieństwo wyboru STEM
        """
        # Konwertuj dane na DataFrame
        df = pd.DataFrame([student_data])
        
        # Zakoduj kolumny kategoryczne
        for col, encoder in self.label_encoders.items():
            if col in df.columns:
                df[col] = encoder.transform(df[col].astype(str))
        
        # Upewnij się, że kolejność kolumn jest poprawna
        df = df[self.metadata['feature_names']]
        
        # Normalizacja
        X = self.scaler.transform(df.values)
        
        # Predykcja
        prediction = self.model.predict(X)[0]
        
        # Prawdopodobieństwo (jeśli model to wspiera)
        if hasattr(self.model, 'predict_proba'):
            probability = self.model.predict_proba(X)[0][1]
        else:
            probability = None
        
        return prediction, probability
    
    def predict_batch(self, csv_path):
        """
        Przewiduje dla wielu studentów z pliku CSV
        """
        df = pd.read_csv(csv_path)
        
        # Usuń Department jeśli istnieje
        if 'Department' in df.columns:
            df = df.drop('Department', axis=1)
        
        # Zakoduj kolumny kategoryczne
        for col, encoder in self.label_encoders.items():
            if col in df.columns:
                df[col] = encoder.transform(df[col].astype(str))
        
        # Upewnij się, że kolejność kolumn jest poprawna
        df = df[self.metadata['feature_names']]
        
        # Normalizacja
        X = self.scaler.transform(df.values)
        
        # Predykcje
        predictions = self.model.predict(X)
        
        if hasattr(self.model, 'predict_proba'):
            probabilities = self.model.predict_proba(X)[:, 1]
        else:
            probabilities = None
        
        return predictions, probabilities

def example_usage():
    """
    Przykład użycia modelu do predykcji
    """
    print("="*70)
    print("PRZYKŁAD UŻYCIA MODELU")
    print("="*70)
    
    predictor = STEMPredictor()
    
    # Przykładowy student
    student = {
        'Gender': 'Male',
        'HSC': 4.5,
        'SSC': 4.75,
        'Income': 'Lower middle (15,000-30,000)',
        'Hometown': 'Village',
        'Computer': 3,
        'Preparation': '2-3 Hours',
        'Gaming': 'More than 3 Hours',
        'Attendance': '80%-100%',
        'Job': 'No',
        'English': 4,
        'Extra': 'Yes',
        'Semester': '2nd',
        'Last': 3.5,
        'Overall': 3.5
    }
    
    prediction, probability = predictor.predict_single(student)
    
    print("\nDane studenta:")
    for key, value in student.items():
        print(f"  {key}: {value}")
    
    print("\n" + "="*70)
    print("WYNIK PREDYKCJI:")
    print("="*70)
    
    if prediction == 1:
        print(f"  Student wybierze: STEM")
    else:
        print(f"  Student wybierze: non-STEM")
    
    if probability is not None:
        print(f"  Prawdopodobieństwo STEM: {probability:.2%}")
        print(f"  Prawdopodobieństwo non-STEM: {1-probability:.2%}")
    
    print("="*70)

if __name__ == "__main__":
    example_usage()
