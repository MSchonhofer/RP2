# ⚠️ UWAGA: Zmiana portu API

## Problem
Port 5000 na macOS jest domyślnie zajęty przez **AirPlay Receiver** (Control Center).

## Rozwiązanie
API zostało skonfigurowane do pracy na porcie **5001** zamiast 5000.

## Co zostało zmienione?

### 1. API Backend (`model/api_polish.py`)
```python
# Linia 329
app.run(debug=True, host='0.0.0.0', port=5001)  # Było: 5000
```

### 2. Frontend (`frontend/src/pages/Questionnaire.jsx`)
```javascript
// Linia ~162
const API_URL = 'http://localhost:5001/predict'  // Było: 5000
```

### 3. Dokumentacja
- ✅ `frontend/QUICK_START.md` - zaktualizowane wszystkie przykłady
- ✅ `frontend/README.md` - zaktualizowany URL API
- ✅ Wszystkie instrukcje curl używają portu 5001

## Nowy URL API

```
http://localhost:5001
```

### Endpointy:
- `GET  http://localhost:5001/health` - Status API
- `GET  http://localhost:5001/model-info` - Informacje o modelu
- `GET  http://localhost:5001/polish-format` - Format danych PL
- `POST http://localhost:5001/predict` - Predykcja

## Jak uruchomić API?

### Sposób 1 (Prosty - użyj skryptu):
```bash
cd model
./start_api.sh
```

### Sposób 2 (Manualny):
```bash
cd model
source venv/bin/activate
pip install -r requirements_api.txt  # tylko jeśli Flask nie jest zainstalowany
python api_polish.py
```

## Test połączenia

```bash
# Sprawdź czy API działa
curl http://localhost:5001/health

# Oczekiwany wynik:
# {"status":"ok","model_loaded":true,"adapter_loaded":true}
```

## Alternatywne rozwiązanie (opcjonalne)

Jeśli chcesz używać portu 5000, wyłącz AirPlay Receiver w macOS:

1. Otwórz **System Settings** (Ustawienia Systemowe)
2. Przejdź do **General** → **AirDrop & Handoff**
3. Wyłącz **AirPlay Receiver**

Następnie zmień z powrotem port na 5000 w:
- `model/api_polish.py` (linia 329)
- `frontend/src/pages/Questionnaire.jsx` (linia ~162)

---

**Data zmiany:** 14 stycznia 2026  
**Powód:** Port 5000 zajęty przez macOS Control Center
