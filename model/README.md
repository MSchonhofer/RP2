# Model Predykcyjny STEM vs non-STEM

Model uczenia maszynowego do przewidywania, czy student wybierze kierunek STEM czy non-STEM na podstawie jego odpowiedzi na pytania ankietowe.

## Struktura projektu

```
model/
├── data_preprocessing.py    # Dodaje kolumnę STEM do datasetu
├── train_model.py           # Trenuje i porównuje różne modele
├── predict.py               # Wykonuje predykcje na nowych danych
├── requirements.txt         # Wymagane biblioteki Python
└── README.md               # Ten plik
```

## Instalacja

1. Zainstaluj wymagane biblioteki:
```bash
pip install -r requirements.txt
```

## Użycie

### 1. Przygotowanie danych

Najpierw dodaj kolumnę STEM do datasetu:

```bash
python data_preprocessing.py
```

To utworzy nowy plik `Data_with_STEM.csv` w folderze `backend/data/`.

### 2. Trenowanie modelu

Trenuj i porównaj różne modele:

```bash
python train_model.py
```

Skrypt:
- Wczytuje dane z `Data_with_STEM.csv`
- Przetwarza dane (kodowanie kategoryczne, normalizacja)
- Trenuje 4 różne modele:
  - Logistic Regression
  - Random Forest
  - Gradient Boosting
  - SVM
- Porównuje wyniki (accuracy, precision, recall, F1-score)
- Zapisuje najlepszy model

Wytrenowane pliki:
- `stem_classifier_model.pkl` - najlepszy model
- `scaler.pkl` - normalizator danych
- `label_encoders.pkl` - enkodery dla zmiennych kategorycznych
- `model_metadata.pkl` - metadata modelu
- `feature_importance.png` - wykres ważności cech

### 3. Predykcja

Użyj wytrenowanego modelu do predykcji:

```bash
python predict.py
```

#### Przykład użycia w kodzie:

```python
from predict import STEMPredictor

predictor = STEMPredictor()

# Dane studenta
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

# Predykcja
prediction, probability = predictor.predict_single(student)

if prediction == 1:
    print(f"Student wybierze STEM (prawdopodobieństwo: {probability:.2%})")
else:
    print(f"Student wybierze non-STEM (prawdopodobieństwo: {1-probability:.2%})")
```

## Cechy modelu

Model wykorzystuje następujące cechy do predykcji:

- `Gender` - płeć
- `HSC` - wyniki z egzaminu HSC
- `SSC` - wyniki z egzaminu SSC
- `Income` - poziom dochodów
- `Hometown` - miejsce pochodzenia (miasto/wieś)
- `Computer` - umiejętności komputerowe (1-5)
- `Preparation` - czas przygotowań do zajęć
- `Gaming` - czas spędzany na grach
- `Attendance` - frekwencja
- `Job` - czy pracuje
- `English` - poziom języka angielskiego (1-5)
- `Extra` - czy bierze udział w zajęciach dodatkowych
- `Semester` - który semestr
- `Last` - ostatnia ocena
- `Overall` - średnia ocen

**Uwaga:** Kolumna `Department` NIE jest używana do trenowania modelu!

## Klasyfikacja STEM vs non-STEM

### STEM (1):
- Computer Science and Engineering
- Electrical and Electronic Engineering

### non-STEM (0):
- Business Administration
- Economics
- English
- Journalism, Communication and Media Studies
- Law and Human Rights
- Political Science
- Public Health
- Sociology

## Integracja ze stroną internetową

### Uruchomienie API serwera

1. Zainstaluj dodatkowe zależności dla API:
```bash
pip install -r requirements_api.txt
```

2. Uruchom serwer API:
```bash
python api.py
```

Serwer uruchomi się na `http://localhost:5000`

### Endpointy API

#### GET /health
Sprawdza czy API działa
```bash
curl http://localhost:5000/health
```

#### GET /model-info
Zwraca informacje o modelu i dostępnych wartościach
```bash
curl http://localhost:5000/model-info
```

#### POST /predict
Wykonuje predykcję na podstawie danych studenta

Przykład zapytania:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

Przykładowa odpowiedź:
```json
{
  "prediction": "STEM",
  "prediction_code": 1,
  "model": "SVM",
  "confidence": 0.85
}
```

### Integracja z Frontendem (React/Vue)

Przykład wywołania API z JavaScript:

```javascript
async function predictSTEM(studentData) {
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData)
  });
  
  const result = await response.json();
  console.log('Predykcja:', result.prediction);
  console.log('Pewność:', result.confidence);
  return result;
}
```

## Uwagi

- Dataset pochodzi z USA, więc podczas integracji ze stroną trzeba będzie dostosować pytania do polskich standardów
- Model można łatwo przećwiczyć na nowych danych polskich studentów
- Wszystkie zapisane pliki modelu są potrzebne do wykonywania predykcji
