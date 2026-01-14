#!/bin/bash
# Skrypt do uruchamiania API serwera

cd "$(dirname "$0")"

echo "🚀 Uruchamianie API serwera modelu STEM/non-STEM..."
echo ""

# Sprawdź czy venv istnieje
if [ ! -d "venv" ]; then
    echo "❌ Błąd: Środowisko wirtualne 'venv' nie istnieje!"
    echo "Uruchom najpierw: python3 -m venv venv"
    exit 1
fi

# Aktywuj venv
source venv/bin/activate

# Sprawdź czy Flask jest zainstalowany
if ! python -c "import flask" 2>/dev/null; then
    echo "⚠️  Flask nie jest zainstalowany. Instaluję zależności..."
    pip install -r requirements_api.txt
    echo ""
fi

# Sprawdź czy port 5001 jest wolny
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5001 jest zajęty!"
    echo "Zatrzymuję istniejący proces..."
    kill -9 $(lsof -ti:5001) 2>/dev/null
    sleep 1
fi

echo "✅ Wszystko gotowe. Uruchamiam serwer..."
echo ""

# Uruchom API
python api_polish.py
