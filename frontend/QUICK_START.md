# 🚀 Szybki Start - Testowanie Systemu

## Uruchomienie kompletnego systemu

### Krok 1: Uruchom API modelu
```bash
cd model
source venv/bin/activate
python api_polish.py
```

API będzie działać na `http://localhost:5001`

**Alternatywnie (prostszy sposób):**
```bash
cd model
./start_api.sh
```

### Krok 2: Uruchom frontend
W **nowym oknie terminala**:
```bash
cd frontend
npm install  # tylko przy pierwszym uruchomieniu
npm run dev
```

Frontend będzie dostępny na `http://localhost:5173`

### Krok 3: Otwórz przeglądarkę
Wejdź na: `http://localhost:5173`

## 🧪 Test funkcjonalności

### Przykładowy student do testowania:

**Student 1 - Profil STEM:**
- Płeć: Mężczyzna
- Pochodzenie: Miasto
- Matura: 85%
- Egzamin ósmoklasisty: 80%
- Dochody rodziny: Wyżej średnie (6000-10000 PLN)
- Umiejętności komputerowe: 4/5
- Nauka: 2-3 godziny dziennie
- Gry: 1-3 godziny
- Frekwencja: 80-100%
- Zajęcia dodatkowe: Tak
- Praca: Nie
- Angielski: 4/5
- Semestr: 2
- Średnia ostatnia: 4.5
- Średnia ogólna: 4.3

**Oczekiwany wynik:** STEM (~85-90% pewności)

---

**Student 2 - Profil non-STEM:**
- Płeć: Kobieta
- Pochodzenie: Małe miasto
- Matura: 70%
- Egzamin ósmoklasisty: 65%
- Dochody rodziny: Niżej średnie (3000-6000 PLN)
- Umiejętności komputerowe: 2/5
- Nauka: 1-2 godziny dziennie
- Gry: 0-1 godzina
- Frekwencja: 50-80%
- Zajęcia dodatkowe: Nie
- Praca: Tak
- Angielski: 3/5
- Semestr: 3
- Średnia ostatnia: 3.5
- Średnia ogólna: 3.7

**Oczekiwany wynik:** non-STEM (~60-70% pewności)

## ✅ Co sprawdzić

1. **Frontend:**
   - [ ] Wszystkie pytania są po polsku
   - [ ] Oceny są w skali 2-5
   - [ ] Wyniki egzaminów w procentach (0-100)
   - [ ] Dochody w PLN
   - [ ] Płynne przechodzenie między pytaniami

2. **API:**
   - [ ] Serwer odpowiada na `http://localhost:5000/health`
   - [ ] Endpoint `/model-info` zwraca info o modelu
   - [ ] Endpoint `/polish-format` zwraca specyfikację

3. **Wynik predykcji:**
   - [ ] Wyświetla się procent samodyscypliny
   - [ ] Pokazuje STEM lub non-STEM
   - [ ] Pokazuje poziom pewności
   - [ ] Można rozpocząć kwestionariusz ponownie

## 🔍 Testowanie API bezpośrednio

### Test przez terminal (curl):
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Plec": "Mężczyzna",
    "Pochodzenie": "Miasto",
    "Matura": 85,
    "Egzamin8": 80,
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
    "Srednia": 4.3
  }'
```

### Oczekiwana odpowiedź:
```json
{
  "prediction": "STEM",
  "confidence": 0.89,
  "data_source": "polish",
  "model_version": "1.0",
  "features_used": 15
}
```

## 🐛 Troubleshooting

### Problem: API nie startuje
**Rozwiązanie:**
```bash
cd model
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements_api.txt
python api_polish.py
```

### Problem: Frontend nie łączy się z API
**Rozwiązanie:**
1. Sprawdź czy API działa: `curl http://localhost:5001/health`
2. Sprawdź URL w `frontend/src/pages/Questionnaire.jsx` (linia ~162):
   ```javascript
   const API_URL = 'http://localhost:5001/predict'
   ```

### Problem: Błąd CORS
**Rozwiązanie:**
API ma już włączoną obsługę CORS. Jeśli problem nadal występuje:
1. Sprawdź czy frontend działa na `http://localhost:5173`
2. Zrestartuj oba serwery

### Problem: Błąd 422 (Validation Error)
**Rozwiązanie:**
Sprawdź format danych:
- Matura/Egzamin8: liczby 0-100
- Ostatnia/Srednia: liczby 2.0-5.0
- Komputer/Angielski: liczby 1-5
- Wszystkie wybory (Plec, Dochody, etc.): dokładnie takie jak w opcjach

## 📊 Monitorowanie

### Logi API:
Serwer Flask wyświetla wszystkie requesty w konsoli:
```
127.0.0.1 - - [14/Jan/2026 10:30:15] "POST /predict HTTP/1.1" 200 -
Format danych: polish
```

### DevTools przeglądarki:
1. Otwórz DevTools (F12)
2. Zakładka "Network"
3. Zobacz zapytania do `/predict`
4. Sprawdź Response dla szczegółów

## ✨ Gotowe!

System jest w pełni funkcjonalny. Możecie zacząć zbierać dane od prawdziwych studentów!

---

**Dodatkowe zasoby:**
- [`model/README.md`](../model/README.md) - Pełna dokumentacja modelu
- [`model/FRONTEND_INTEGRATION.md`](../model/FRONTEND_INTEGRATION.md) - Integracja frontend-backend
- [`frontend/ZMIANY_PL.md`](ZMIANY_PL.md) - Szczegóły zmian w frontendzie
