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

### 3. Predykcja na polskich danych (NOWOŚĆ! 🇵🇱)

Model został wyposażony w adapter automatycznie konwertujący polskie dane na format amerykański:

```bash
python predict_polish.py
```

Możesz także używać polskich danych bezpośrednio w API!

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

### 4. Predykcja (amerykańskie dane)

Użyj wytrenowanego modelu do predykcji na danych amerykańskich:

```bash
python predict.py
```

#### Przykład użycia w kodzie (amerykańskie dane):

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

#### Przykład użycia w kodzie (POLSKIE dane 🇵🇱):

```python
from predict_polish import PolishSTEMPredictor

predictor = PolishSTEMPredictor()

# Dane polskiego studenta
student = {
    'Plec': 'Mężczyzna',
    'Matura': 85,              # w procentach
    'Egzamin8': 75,            # w procentach
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

# Predykcja (automatyczna konwersja PL → US)
prediction, confidence, us_data = predictor.predict(student)

print(f"Student wybierze: {prediction}")
print(f"Pewność: {confidence:.2f}")
```

## 🇵🇱 Adapter Polskich Danych

Model został wyposażony w **inteligentny adapter** konwertujący polskie dane na format amerykański!

### Mapowania:

- **Oceny**: Polska (2-5) → USA GPA (1-4.5)
- **Matura/Egzamin**: 0-100% lub skala 2-5
- **Dochody**: PLN/miesiąc → USD/rok
- **Pochodzenie**: Miasto/Wieś → City/Village
- **Wszystkie inne pola**: Automatyczne tłumaczenie

### Więcej informacji:

- [`polish_adapter.py`](polish_adapter.py) - kod adaptera
- [`predict_polish.py`](predict_polish.py) - predictor dla polskich danych
- [`FRONTEND_INTEGRATION.md`](FRONTEND_INTEGRATION.md) - szczegółowa instrukcja dla frontendu

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

### Uruchomienie API serwera (z obsługą polskich danych! 🇵🇱)

1. Zainstaluj dodatkowe zależności dla API:
```bash
pip install -r requirements_api.txt
```

2. Uruchom serwer API:
```bash
python api_polish.py
```

Serwer uruchomi się na `http://localhost:5000`

**WAŻNE:** Używaj `api_polish.py` zamiast `api.py` - obsługuje polskie i amerykańskie dane!

### Endpointy API

#### GET /polish-format
Zwraca specyfikację formatu polskich danych
```bash
curl http://localhost:5000/polish-format
```

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
Wykonuje predykcję - **automatycznie wykrywa format danych (PL lub US)**

Przykład zapytania (POLSKIE dane):
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

Przykładowa odpowiedź:
```json
{
  "prediction": "STEM",
  "prediction_code": 1,
  "model": "SVM",
  "confidence": 0.85,
  "data_source": "polish"
}
```

API także wspiera amerykańskie dane (backward compatible)!

### Integracja z Frontendem (React/Vue)

Przykład wywołania API z JavaScript (POLSKIE dane):

```javascript
async function predictSTEM(studentData) {
  // studentData zawiera polskie pola (Plec, Matura, Egzamin8, etc.)
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData)
  });
  
  const result = await response.json();
  console.log('Predykcja:', result.prediction);  // "STEM" lub "non-STEM"
  console.log('Pewność:', result.confidence);
  console.log('Źródło danych:', result.data_source);  // "polish"
  return result;
}

// Przykładowe użycie
const polishStudent = {
  Plec: 'Mężczyzna',
  Matura: 85,
  Egzamin8: 75,
  Dochody: 'Niżej średnie (3000-6000 PLN)',
  Pochodzenie: 'Wieś',
  Komputer: 4,
  Przygotowanie: '2-3 godziny',
  Gry: 'Więcej niż 3 godziny',
  Frekwencja: '80%-100%',
  Praca: 'Nie',
  Angielski: 4,
  Dodatkowe: 'Tak',
  Semestr: 2,
  Ostatnia: 4.5,
  Srednia: 4.3
};

const result = await predictSTEM(polishStudent);
```

**📄 Pełna dokumentacja integracji:** [`FRONTEND_INTEGRATION.md`](FRONTEND_INTEGRATION.md)

## Uwagi

- Dataset pochodzi z USA, więc podczas integracji ze stroną trzeba będzie dostosować pytania do polskich standardów
- Model można łatwo przećwiczyć na nowych danych polskich studentów
- Wszystkie zapisane pliki modelu są potrzebne do wykonywania predykcji
