# Zmiany w frontendzie - Polska wersja

## 🇵🇱 Co zostało zmienione?

### 1. **Pytania kwestionariusza** (`Questionnaire.jsx`)

#### Format danych (zgodny z `polish_adapter.py`):
```javascript
{
  Plec: "Mężczyzna" | "Kobieta" | "Inna",
  Pochodzenie: "Wieś" | "Małe miasto" | "Miasto" | "Inne",
  Matura: 0-100,              // procenty
  Egzamin8: 0-100,            // procenty
  Dochody: "Niskie (poniżej 3000 PLN)" | "Niżej średnie (3000-6000 PLN)" | ...,
  Komputer: 1-5,              // skala
  Przygotowanie: "0-1 godzina" | "1-2 godziny" | "2-3 godziny" | "Więcej niż 3 godziny",
  Gry: "0-1 godzina" | "1-3 godziny" | "Więcej niż 3 godziny",
  Frekwencja: "0-50%" | "50-80%" | "80-100%",
  Dodatkowe: "Tak" | "Nie",
  Praca: "Tak" | "Nie",
  Angielski: 1-5,            // skala
  Semestr: "1" | "2" | ... | "8" | "Inny",
  Ostatnia: 2.0-5.0,         // średnia ostatniego semestru
  Srednia: 2.0-5.0           // średnia ogólna
}
```

#### Zmiany w pytaniach:
- ✅ **Matura zamiast HSC** - wynik w procentach (0-100)
- ✅ **Egzamin ósmoklasisty zamiast SSC** - wynik w procentach (0-100)
- ✅ **Dochody w PLN** - zamiast USD/rok
- ✅ **Średnia 2.0-5.0** - polska skala ocen zamiast GPA 0-4
- ✅ **Przygotowanie dzienne** - godziny dziennie zamiast tygodniowo
- ✅ **Polska terminologia** - Wieś/Miasto, Tak/Nie

### 2. **Endpoint API**
```javascript
const API_URL = 'http://localhost:5000/predict'  // Model API
```

API automatycznie wykryje polski format i skonwertuje dane przed predykcją.

### 3. **Tłumaczenia UI**

#### Strona główna (`Home.jsx`):
- "Rozpocznij kwestionariusz" zamiast "Start questionnaire"
- "Dowiedz się więcej o badaniu" zamiast "Learn about the research"
- Wszystkie nagłówki i opisy w języku polskim

#### Kwestionariusz (`Questionnaire.jsx`):
- "Kwestionariusz samodyscypliny"
- "Pytanie X z Y"
- Przyciski: "Wstecz", "Dalej", "Wyjdź", "Obliczanie…"

#### Ekran wyników (`ResultScreen.jsx`):
- "Twój wynik"
- "Wynik samodyscypliny"
- "Predykcja kierunku"
- "Rozpocznij ponownie"
- "Powrót do strony głównej"

#### Strony informacyjne:
- `SelfDisciplineInfo.jsx` - "Wskaźnik samodyscypliny"
- `StemPredictionInfo.jsx` - "Predykcja STEM vs non-STEM"
- `IncomeFactorsInfo.jsx` - "Dochody i czynniki wyników"

## 🎨 Zachowana stylistyka

✅ Wszystkie klasy CSS pozostały **niezmienione**
✅ Kolory, animacje, gradienty - **bez zmian**
✅ Layout i struktura komponentów - **identyczne**
✅ Wykresy i wizualizacje - **te same style**

## 🔄 Integracja z backendem

### Struktura zapytania do API:
```javascript
POST http://localhost:5000/predict
Content-Type: application/json

{
  "Plec": "Mężczyzna",
  "Pochodzenie": "Miasto",
  "Matura": 85,
  "Egzamin8": 78,
  "Dochody": "Wyżej średnie (6000-10000 PLN)",
  "Komputer": 4,
  "Przygotowanie": "2-3 godziny",
  "Gry": "1-3 godziny",
  "Frekwencja": "80-100%",
  "Dodatkowe": "Tak",
  "Praca": "Nie",
  "Angielski": 4,
  "Semestr": "2",
  "Ostatnia": 4.5,
  "Srednia": 4.2
}
```

### Oczekiwana odpowiedź:
```javascript
{
  "prediction": "STEM" | "non-STEM",
  "confidence": 0.89,
  "data_source": "polish",
  "converted_data": { ... },  // opcjonalnie w debug mode
  "self_discipline_score": 0.75,
  "stem_fit_probability": 0.89,
  "stem_fit_label": "Kierunek STEM"
}
```

## 🚀 Testowanie

### Uruchomienie frontendu:
```bash
cd frontend
npm install
npm run dev
```

### Uruchomienie API modelu:
```bash
cd model
source venv/bin/activate
python api_polish.py
```

API będzie działać na `http://localhost:5000`

## 📝 Mapowanie pól

| Polski frontend | Adapter → Model (US) |
|----------------|----------------------|
| Plec | Gender |
| Pochodzenie | Hometown |
| Matura (%) | HSC (GPA) |
| Egzamin8 (%) | SSC (GPA) |
| Dochody (PLN) | Income (USD) |
| Komputer (1-5) | Computer (1-5) |
| Przygotowanie | Preparation |
| Gry | Gaming |
| Frekwencja | Attendance |
| Dodatkowe | Extra |
| Praca | Job |
| Angielski (1-5) | English (1-5) |
| Semestr | Semester |
| Ostatnia (2-5) | Last (1-4.5) |
| Srednia (2-5) | Overall (1-4.5) |

Wszystkie konwersje są wykonywane automatycznie przez `polish_adapter.py` w backendzie!

## ✅ Gotowe do użycia

Frontend jest w pełni funkcjonalny i gotowy do zbierania danych od polskich studentów. Dane są automatycznie konwertowane do formatu amerykańskiego przed wysłaniem do modelu ML.
