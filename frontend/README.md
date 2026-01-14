# Frontend - Kwestionariusz STEM vs non-STEM 🇵🇱

Aplikacja frontendowa do zbierania danych od polskich studentów w celu predykcji wyboru kierunku studiów.

## ✨ Nowości - Polska wersja

- ✅ **Wszystkie pytania po polsku** - dostosowane do polskiego systemu edukacji
- ✅ **Polska skala ocen** - 2.0-5.0 zamiast GPA
- ✅ **Matura i egzamin ósmoklasisty** - wyniki w procentach (0-100)
- ✅ **Dochody w PLN** - miesięczne zamiast rocznych w USD
- ✅ **Zachowana stylistyka** - identyczny wygląd i animacje

## 🚀 Quick Start

```bash
# Instalacja zależności
npm install

# Uruchomienie deweloperskiego serwera
npm run dev

# Build produkcyjny
npm run build
```

Aplikacja będzie dostępna na: `http://localhost:5173`

## 📋 Wymagania

- Node.js 16+ 
- npm lub yarn
- **API modelu** uruchomione na `http://localhost:5001` (patrz: `../model/`)

**Uwaga:** Port 5001 (nie 5000) z powodu konfliktu z macOS AirPlay Receiver. Zobacz: `../PORT_CHANGE.md`

## 🔗 Integracja z API

Frontend łączy się z API modelu ML:

```javascript
const API_URL = 'http://localhost:5001/predict'
```

API automatycznie wykrywa polski format danych i konwertuje je przed wysłaniem do modelu.

### Przykładowe dane wysyłane:
```json
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

## 📁 Struktura projektu

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                    # Strona główna
│   │   ├── Questionnaire.jsx           # Kwestionariusz (🇵🇱 polska wersja)
│   │   ├── ResultScreen.jsx            # Ekran wyników
│   │   ├── SelfDisciplineInfo.jsx      # Info o samodyscyplinie
│   │   ├── StemPredictionInfo.jsx      # Info o predykcji STEM
│   │   └── IncomeFactorsInfo.jsx       # Info o czynnikach dochodów
│   ├── App.jsx                         # Router główny
│   ├── index.css                       # Style globalne
│   └── main.jsx                        # Entry point
├── public/                             # Zasoby statyczne
├── ZMIANY_PL.md                        # 🇵🇱 Dokumentacja zmian
├── POROWNANIE.md                       # Porównanie EN vs PL
├── QUICK_START.md                      # Przewodnik testowania
└── package.json                        # Zależności npm
```

## 📚 Dokumentacja

- **[ZMIANY_PL.md](ZMIANY_PL.md)** - Szczegółowy opis wszystkich zmian na polski
- **[POROWNANIE.md](POROWNANIE.md)** - Wizualne porównanie wersji angielskiej i polskiej
- **[QUICK_START.md](QUICK_START.md)** - Przewodnik testowania całego systemu

## 🎨 Technologie

- **React 18** - framework UI
- **Vite** - bundler i dev server
- **React Router** - routing
- **Recharts** - wykresy wyników
- **CSS Modules** - stylowanie

## 🔧 Konfiguracja

### Zmiana URL API

W pliku `src/pages/Questionnaire.jsx` (linia ~162):

```javascript
const API_URL = 'http://localhost:5001/predict'
```

### CORS

API modelu ma już włączoną obsługę CORS dla `localhost:5173`.

**Uwaga:** Port API to 5001 (nie 5000) - szczegóły w `../PORT_CHANGE.md`

## 🧪 Testowanie

Zobacz: [QUICK_START.md](QUICK_START.md) dla pełnego przewodnika testowania.

### Szybki test:

1. Uruchom API: `cd ../model && python api_polish.py`
2. Uruchom frontend: `npm run dev`
3. Otwórz: `http://localhost:5173`
4. Wypełnij kwestionariusz przykładowymi danymi

## 🌐 Routing

- `/` - Strona główna
- `/questionnaire` - Kwestionariusz
- `/self-discipline` - Info o wskaźniku samodyscypliny
- `/stem-prediction` - Info o predykcji STEM
- `/income-performance` - Info o dochodach i wynikach

## 📊 Przepływ danych

```
Użytkownik wypełnia formularz (Polski format)
            ↓
   Frontend zbiera dane
            ↓
   POST /predict → API modelu
            ↓
   API wykrywa format polski
            ↓
   polish_adapter.py konwertuje PL → US
            ↓
   Model ML wykonuje predykcję
            ↓
   Wynik wraca do frontendu
            ↓
   ResultScreen wyświetla wyniki po polsku
```

## 🎯 Cel projektu

System służy do:
1. Zbierania danych od polskich studentów
2. Analizy nawyków studenckich (samodyscyplina)
3. Predykcji wyboru kierunku STEM vs non-STEM
4. Badań naukowych na potrzeby projektu studenckiego

---

## React + Vite (Technical Notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

