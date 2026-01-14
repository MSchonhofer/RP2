# Projekt Predykcyjny STEM vs non-STEM 🇵🇱

Projekt na studia - system przewidywania wyboru kierunku studiów (STEM vs non-STEM) na podstawie ankiety studenckiej.

**✨ NOWOŚĆ: Pełna obsługa polskich danych!** System automatycznie konwertuje polskie dane (oceny, dochody, terminologia) do formatu modelu.

## Struktura projektu

```
RP2/
├── backend/           # Backend aplikacji
│   ├── app/          # Kod aplikacji
│   └── data/         # Datasety
│       ├── Data.csv  # Oryginalny dataset (US)
│       └── Data_with_STEM.csv  # Dataset z kolumną STEM
│
├── frontend/         # Frontend aplikacji (React + Vite) 🇵🇱
│   ├── src/         # Kod źródłowy
│   │   └── pages/   # Strony (polskie pytania!)
│   ├── public/      # Pliki publiczne
│   ├── package.json # Zależności npm
│   └── ZMIANY_PL.md # Dokumentacja zmian na polski
│
└── model/           # Model Machine Learning + API
    ├── data_preprocessing.py  # Przygotowanie danych
    ├── train_model.py        # Trenowanie modelu
    ├── predict.py            # Predykcje (US format)
    ├── predict_polish.py     # Predykcje (PL format) 🇵🇱
    ├── polish_adapter.py     # Adapter PL→US 🇵🇱
    ├── api_polish.py         # API z auto-detekcją formatu 🇵🇱
    ├── *.pkl                 # Zapisane modele
    ├── README.md             # Dokumentacja modelu
    ├── WYNIKI_MODELU.md      # Szczegółowe wyniki
    └── FRONTEND_INTEGRATION.md  # Dokumentacja dla frontendu
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

### 2. API Server (z obsługą polskich danych! 🇵🇱)

```bash
cd model
source venv/bin/activate

# Zainstaluj dodatkowe zależności dla API
pip install -r requirements_api.txt

# Uruchom serwer API (WAŻNE: użyj api_polish.py!)
python api_polish.py
```

API będzie dostępne na: `http://localhost:5000`

Endpointy:
- `GET /health` - status API
- `GET /model-info` - informacje o modelu
- `GET /polish-format` - specyfikacja polskich danych
- `POST /predict` - wykonaj predykcję (automatycznie wykrywa PL/US format!)

### 3. Frontend (Polski interfejs 🇵🇱)

```bash
cd frontend
npm install
npm run dev
```

Frontend będzie dostępny na: `http://localhost:5173`

**Co się zmieniło:**
- ✅ Wszystkie pytania w języku polskim
- ✅ Polska skala ocen (2-5) i wyników egzaminów (%)
- ✅ Dochody w PLN zamiast USD
- ✅ Polska terminologia (Wieś/Miasto, Matura/Egzamin ósmoklasisty)

📖 Szczegóły: [`frontend/ZMIANY_PL.md`](frontend/ZMIANY_PL.md)

## Model predykcyjny

### Informacje o modelu

- **Algorytm**: SVM (Support Vector Machine)
- **Accuracy**: 89.90%
- **F1-Score**: 94.68%
- **Cechy**: 15 parametrów studenta (bez Department)
- **🇵🇱 NOWOŚĆ**: Automatyczna konwersja polskich danych!

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
┌──────────┐          ┌─────────┐          ┌───────────┐
│ Frontend │  HTTP    │ Backend │  API     │   Model   │
│  React   │ ──────→  │  Flask  │ ──────→  │    SVM    │
│ (Polski) │ ←──────  │   API   │ ←──────  │  + Adapter│
└──────────┘  JSON    └─────────┘  Python  └───────────┘
    🇵🇱                                         PL → US
```

Przykład wywołania z JavaScript (POLSKIE dane):

```javascript
const studentData = {
  Plec: "Mężczyzna",
  Matura: 85,              // w procentach
  Egzamin8: 75,
  Dochody: "Niżej średnie (3000-6000 PLN)",
  Pochodzenie: "Wieś",
  Komputer: 4,             // 1-5
  Przygotowanie: "2-3 godziny",
  Gry: "Więcej niż 3 godziny",
  Frekwencja: "80%-100%",
  Praca: "Nie",
  Angielski: 4,
  Dodatkowe: "Tak",
  Semestr: 2,
  Ostatnia: 4.5,
  Srednia: 4.3
};

const response = await fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(studentData)
});

const result = await response.json();
console.log(result.prediction); // "STEM" lub "non-STEM"
console.log(result.confidence); // poziom pewności
console.log(result.data_source); // "polish"
```

**📄 Pełna dokumentacja:** [`model/FRONTEND_INTEGRATION.md`](model/FRONTEND_INTEGRATION.md)

## Roadmap

- [x] ~~Przygotowanie datasetu~~
- [x] ~~Trenowanie i porównanie modeli~~
- [x] ~~API endpoint dla modelu~~
- [x] ~~**Adapter polskich danych (mapowanie PL → US)** 🇵🇱~~
- [ ] Integracja z frontendem
- [ ] Finalne testy na polskich danych użytkowników

## Uwagi

✅ **Model obsługuje polskie dane!** Stworzony adapter automatycznie konwertuje polskie dane (oceny 2-5, PLN, polska terminologia) na format amerykański przed wysłaniem do modelu.

### Jak działa adapter:

- **Oceny**: Polska skala 2-5 → USA GPA 1-4.5
- **Wyniki egzaminów**: Obsługuje zarówno procenty (0-100%) jak i skalę 2-5
- **Dochody**: PLN/miesiąc → USD/rok w odpowiednich kategoriach
- **Terminologia**: Automatyczne tłumaczenie (Miasto→City, Wieś→Village, etc.)

**📚 Szczegółowa dokumentacja:** [`model/FRONTEND_INTEGRATION.md`](model/FRONTEND_INTEGRATION.md)

## Autorzy

Projekt studencki - Research Project, II stopień, Semestr 3

## Licencja

Projekt edukacyjny
