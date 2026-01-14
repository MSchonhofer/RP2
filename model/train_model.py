"""
Model predykcyjny STEM vs non-STEM
Trenuje różne modele i porównuje ich wyniki
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score, 
    precision_score, 
    recall_score, 
    f1_score,
    confusion_matrix,
    classification_report
)
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Ścieżki
DATA_PATH = "../backend/data/Data_with_STEM.csv"
MODEL_PATH = "stem_classifier_model.pkl"
SCALER_PATH = "scaler.pkl"
ENCODERS_PATH = "label_encoders.pkl"

class STEMPredictor:
    """
    Klasa do trenowania i ewaluacji modeli predykcyjnych STEM vs non-STEM
    """
    
    def __init__(self):
        self.df = None
        self.X = None
        self.y = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        self.best_model = None
        self.best_model_name = None
        
    def load_data(self):
        """Wczytuje dane z pliku CSV"""
        print("Wczytywanie danych...")
        self.df = pd.read_csv(DATA_PATH)
        print(f"Wczytano {len(self.df)} wierszy")
        print(f"Kolumny: {list(self.df.columns)}")
        
    def preprocess_data(self):
        """Przygotowuje dane do trenowania modelu"""
        print("\nPrzygotowywanie danych...")
        
        # Usuwamy kolumnę Department (nie może być użyta do predykcji)
        df_features = self.df.drop(['Department', 'STEM'], axis=1)
        
        # Kolumny kategoryczne do zakodowania
        categorical_columns = ['Gender', 'Income', 'Hometown', 'Attendance', 'Job', 'Extra', 'Semester']
        
        # Kolumny z przedziałami czasowymi
        time_columns = ['Preparation', 'Gaming']
        
        categorical_columns.extend(time_columns)
        
        print(f"\nKolumny kategoryczne do zakodowania: {categorical_columns}")
        
        # Kodowanie kolumn kategorycznych
        for col in categorical_columns:
            if col in df_features.columns:
                le = LabelEncoder()
                df_features[col] = le.fit_transform(df_features[col].astype(str))
                self.label_encoders[col] = le
                print(f"  Zakodowano: {col} ({len(le.classes_)} unikalnych wartości)")
        
        # Zachowaj nazwy cech
        self.feature_names = df_features.columns.tolist()
        
        # Przygotuj X i y
        self.X = df_features.values
        self.y = self.df['STEM'].values
        
        print(f"\nKształt danych X: {self.X.shape}")
        print(f"Rozkład klas: STEM={sum(self.y)}, non-STEM={len(self.y)-sum(self.y)}")
        
    def split_data(self, test_size=0.2, random_state=42):
        """Dzieli dane na zbiór treningowy i testowy"""
        print(f"\nDzielenie danych (test_size={test_size})...")
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=test_size, random_state=random_state, stratify=self.y
        )
        
        # Normalizacja danych
        self.X_train = self.scaler.fit_transform(self.X_train)
        self.X_test = self.scaler.transform(self.X_test)
        
        print(f"Zbiór treningowy: {self.X_train.shape}")
        print(f"Zbiór testowy: {self.X_test.shape}")
        
    def train_models(self):
        """Trenuje różne modele i porównuje wyniki"""
        print("\n" + "="*70)
        print("TRENOWANIE MODELI")
        print("="*70)
        
        # Definicja modeli do przetestowania
        models = {
            'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
            'SVM': SVC(kernel='rbf', random_state=42)
        }
        
        results = []
        best_accuracy = 0
        
        for name, model in models.items():
            print(f"\n{'='*70}")
            print(f"Model: {name}")
            print(f"{'='*70}")
            
            # Trenowanie
            model.fit(self.X_train, self.y_train)
            
            # Predykcje
            y_pred = model.predict(self.X_test)
            
            # Metryki
            accuracy = accuracy_score(self.y_test, y_pred)
            precision = precision_score(self.y_test, y_pred)
            recall = recall_score(self.y_test, y_pred)
            f1 = f1_score(self.y_test, y_pred)
            
            # Cross-validation
            cv_scores = cross_val_score(model, self.X_train, self.y_train, cv=5)
            
            print(f"\nMetryki na zbiorze testowym:")
            print(f"  Accuracy:  {accuracy:.4f}")
            print(f"  Precision: {precision:.4f}")
            print(f"  Recall:    {recall:.4f}")
            print(f"  F1-Score:  {f1:.4f}")
            print(f"\nCross-validation (5-fold):")
            print(f"  Średnia:   {cv_scores.mean():.4f}")
            print(f"  Std:       {cv_scores.std():.4f}")
            
            # Confusion matrix
            cm = confusion_matrix(self.y_test, y_pred)
            print(f"\nConfusion Matrix:")
            print(f"  {cm}")
            
            # Zapisz wyniki
            results.append({
                'Model': name,
                'Accuracy': accuracy,
                'Precision': precision,
                'Recall': recall,
                'F1-Score': f1,
                'CV Mean': cv_scores.mean(),
                'CV Std': cv_scores.std()
            })
            
            # Zapisz najlepszy model
            if accuracy > best_accuracy:
                best_accuracy = accuracy
                self.best_model = model
                self.best_model_name = name
        
        # Podsumowanie wyników
        print("\n" + "="*70)
        print("PODSUMOWANIE WYNIKÓW")
        print("="*70)
        
        results_df = pd.DataFrame(results)
        results_df = results_df.sort_values('Accuracy', ascending=False)
        print("\n", results_df.to_string(index=False))
        
        print(f"\n{'='*70}")
        print(f"NAJLEPSZY MODEL: {self.best_model_name}")
        print(f"Accuracy: {best_accuracy:.4f}")
        print(f"{'='*70}")
        
        return results_df
    
    def feature_importance(self):
        """Pokazuje ważność cech (jeśli model to wspiera)"""
        if self.best_model_name in ['Random Forest', 'Gradient Boosting']:
            print("\n" + "="*70)
            print("WAŻNOŚĆ CECH")
            print("="*70)
            
            importances = self.best_model.feature_importances_
            feature_importance_df = pd.DataFrame({
                'Feature': self.feature_names,
                'Importance': importances
            }).sort_values('Importance', ascending=False)
            
            print("\n", feature_importance_df.to_string(index=False))
            
            # Wykres
            plt.figure(figsize=(10, 8))
            plt.barh(feature_importance_df['Feature'][:15], feature_importance_df['Importance'][:15])
            plt.xlabel('Ważność')
            plt.title(f'Top 15 najważniejszych cech - {self.best_model_name}')
            plt.tight_layout()
            plt.savefig('feature_importance.png')
            print("\nWykres zapisany jako: feature_importance.png")
    
    def save_model(self):
        """Zapisuje najlepszy model i preprocessory"""
        print("\n" + "="*70)
        print("ZAPISYWANIE MODELU")
        print("="*70)
        
        joblib.dump(self.best_model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
        joblib.dump(self.label_encoders, ENCODERS_PATH)
        
        print(f"Model zapisany: {MODEL_PATH}")
        print(f"Scaler zapisany: {SCALER_PATH}")
        print(f"Encoders zapisane: {ENCODERS_PATH}")
        
        # Zapisz również nazwy cech i nazwę modelu
        metadata = {
            'model_name': self.best_model_name,
            'feature_names': self.feature_names
        }
        joblib.dump(metadata, 'model_metadata.pkl')
        print(f"Metadata zapisane: model_metadata.pkl")
    
    def run_full_pipeline(self):
        """Uruchamia pełny pipeline trenowania"""
        self.load_data()
        self.preprocess_data()
        self.split_data()
        results = self.train_models()
        self.feature_importance()
        self.save_model()
        
        return results

def main():
    print("="*70)
    print("MODEL PREDYKCYJNY STEM vs non-STEM")
    print("="*70)
    
    predictor = STEMPredictor()
    results = predictor.run_full_pipeline()
    
    print("\n" + "="*70)
    print("TRENOWANIE ZAKOŃCZONE!")
    print("="*70)

if __name__ == "__main__":
    main()
