# Projekt Predykcyjny STEM vs non-STEM

Projekt na studia - system przewidywania wyboru kierunku studiów (STEM vs non-STEM) na podstawie ankiety studenckiej.

## Struktura projektu

```
RP2/
├── backend/           # Backend aplikacji
│   ├── app/          # Kod aplikacji
│   └── data/         # Datasety
│       ├── Data.csv  # Oryginalny dataset
│       └── Data_with_STEM.csv  # Dataset z kolumną STEM
│
├── frontend/         # Frontend aplikacji (React/Vue)
│   ├── src/         # Kod źródłowy
│   ├── public/      # Pliki publiczne
│   └── package.json # Zależności npm
│
└── model/           # Model Machine Learning
    ├── data_preprocessing.py  # Przygotowanie danych
    ├── train_model.py        # Trenowanie modelu
    ├── predict.py            # Wykonywanie predykcji
    ├── api.py                # API endpoint dla frontendu
    ├── *.pkl                 # Zapisane modele i preprocessory
    ├── README.md             # Dokumentacja modelu
    └── WYNIKI_MODELU.md      # Szczegółowe wyniki
```

## Quick Start

### 1. Model Machine Learning

```bash
cd model

# Utwórz środowisko wirtualne
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# lub
venv\Scripts\activate  # Windows

# Zainstaluj zależności
pip install -r requirements.txt

# Przygotuj dane (dodaj kolumnę STEM)
python data_preprocessing.py

# Wytrenuj model
python train_model.py

# Przetestuj predykcję
python predict.py
```

### 2. API Server

```bash
cd model
source venv/bin/activate

# Zainstaluj dodatkowe zależności dla API
pip install -r requirements_api.txt

# Uruchom serwer API
python api.py
```

API będzie dostępne na: `http://localhost:5000`

Endpointy:
- `GET /health` - status API
- `GET /model-info` - informacje o modelu
- `POST /predict` - wykonaj predykcję

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Model predykcyjny

### Informacje o modelu

- **Algorytm**: SVM (Support Vector Machine)
- **Accuracy**: 89.90%
- **F1-Score**: 94.68%
- **Cechy**: 15 parametrów studenta (bez Department)

### Klasyfikacja

**STEM (1):**
- Computer Science and Engineering
- Electrical and Electronic Engineering

**non-STEM (0):**
- Business Administration, Economics, English
- Journalism, Law, Political Science, Public Health, Sociology

### Szczegóły

Zobacz pełną dokumentację w:
- [`model/README.md`](model/README.md) - instrukcje użycia
- [`model/WYNIKI_MODELU.md`](model/WYNIKI_MODELU.md) - szczegółowe wyniki

## Integracja frontend ↔ backend ↔ model

```
┌──────────┐          ┌─────────┐          ┌───────┐
│ Frontend │  HTTP    │ Backend │  API     │ Model │
│  React   │ ──────→  │  Flask  │ ──────→  │  SVM  │
│          │ ←──────  │   API   │ ←──────  │  .pkl │
└──────────┘  JSON    └─────────┘  Python  └───────┘
```

Przykład wywołania z JavaScript:

```javascript
const studentData = {
  Gender: "Male",
  HSC: 4.5,
  SSC: 4.75,
  Income: "Lower middle (15,000-30,000)",
  Hometown: "Village",
  Computer: 3,
  Preparation: "2-3 Hours",
  Gaming: "More than 3 Hours",
  Attendance: "80%-100%",
  Job: "No",
  English: 4,
  Extra: "Yes",
  Semester: "2nd",
  Last: 3.5,
  Overall: 3.5
};

const response = await fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(studentData)
});

const result = await response.json();
console.log(result.prediction); // "STEM" lub "non-STEM"
```

## Roadmap

- [x] ~~Przygotowanie datasetu~~
- [x] ~~Trenowanie i porównanie modeli~~
- [x] ~~API endpoint dla modelu~~
- [ ] Integracja z frontendem
- [ ] Dostosowanie pytań do polskich standardów
- [ ] Zebranie polskich danych treningowych
- [ ] Retrenowanie na polskich danych

## Uwagi

⚠️ **Obecny dataset pochodzi z USA** - pytania i kategorie będą wymagały adaptacji do polskiego systemu edukacji podczas integracji z frontendem.

## Autorzy

Projekt studencki - Research Project, II stopień, Semestr 3

## Licencja

Projekt edukacyjny
