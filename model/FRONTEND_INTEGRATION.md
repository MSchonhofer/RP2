# Integracja z Frontendem - Instrukcja dla Polskich Danych

## 🇵🇱 Format Polskich Danych

Model automatycznie wykrywa czy otrzymuje dane polskie czy amerykańskie i odpowiednio je przetwarza.

## API Endpoints

### 1. GET `/polish-format`
Pobiera pełną specyfikację formatu polskich danych

```javascript
const response = await fetch('http://localhost:5000/polish-format');
const format = await response.json();
console.log(format.fields);  // Pełna specyfikacja pól
console.log(format.example); // Przykładowe dane
```

### 2. POST `/predict`
Wykonuje predykcję na polskich danych

```javascript
const studentData = {
  Plec: 'Mężczyzna',
  Matura: 85,              // w procentach lub skala 2-5
  Egzamin8: 75,            // w procentach lub skala 2-5
  Dochody: 'Niżej średnie (3000-6000 PLN)',
  Pochodzenie: 'Wieś',
  Komputer: 4,             // 1-5
  Przygotowanie: '2-3 godziny',
  Gry: 'Więcej niż 3 godziny',
  Frekwencja: '80%-100%',
  Praca: 'Nie',
  Angielski: 4,            // 1-5
  Dodatkowe: 'Tak',
  Semestr: 2,              // 1-10
  Ostatnia: 4.5,           // skala 2-5
  Srednia: 4.3             // skala 2-5
};

const response = await fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(studentData)
});

const result = await response.json();
console.log(result.prediction);      // "STEM" lub "non-STEM"
console.log(result.confidence);      // poziom pewności
console.log(result.data_source);     // "polish" lub "us"
```

## 📋 Specyfikacja Pól

### Pola obowiązkowe:

| Pole Polski | Typ | Możliwe wartości | Opis |
|-------------|-----|------------------|------|
| **Plec** | string | "Mężczyzna", "Kobieta" | Płeć studenta |
| **Matura** | number | 2-5 lub 0-100 | Wynik z matury (skala lub %) |
| **Egzamin8** | number | 2-5 lub 0-100 | Wynik z egzaminu ósmoklasisty |
| **Dochody** | string | Zobacz poniżej | Miesięczne dochody rodziny |
| **Pochodzenie** | string | "Miasto", "Wieś" | Miejsce pochodzenia |
| **Komputer** | integer | 1-5 | Poziom umiejętności komputerowych |
| **Przygotowanie** | string | Zobacz poniżej | Czas przygotowań do zajęć |
| **Gry** | string | Zobacz poniżej | Czas spędzany na grach |
| **Frekwencja** | string | Zobacz poniżej | Frekwencja na zajęciach |
| **Praca** | string | "Tak", "Nie" | Czy student pracuje |
| **Angielski** | integer | 1-5 | Poziom języka angielskiego |
| **Dodatkowe** | string | "Tak", "Nie" | Czy uczestniczy w zajęciach dodatkowych |
| **Semestr** | integer | 1-10 | Który semestr studiów |
| **Ostatnia** | number | 2-5 | Ostatnia ocena |
| **Srednia** | number | 2-5 | Średnia ocen |

### Wartości kategoryczne:

**Dochody:**
- `"Niskie (poniżej 3000 PLN)"`
- `"Niżej średnie (3000-6000 PLN)"`
- `"Wyżej średnie (6000-12000 PLN)"`
- `"Wysokie (powyżej 12000 PLN)"`

**Przygotowanie / Gry:**
- `"0-1 godzina"`
- `"2-3 godziny"`
- `"Więcej niż 3 godziny"`

**Frekwencja:**
- `"Poniżej 40%"`
- `"40%-59%"`
- `"60%-79%"`
- `"80%-100%"`

## 🎨 Przykład Komponentu React

### Hook do predykcji:

```javascript
// hooks/useSTEMPrediction.js
import { useState } from 'react';

export const useSTEMPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const predict = async (studentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      
      if (!response.ok) {
        throw new Error('Błąd predykcji');
      }
      
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { predict, loading, result, error };
};
```

### Komponent formularza:

```javascript
// components/StudentForm.jsx
import { useState } from 'react';
import { useSTEMPrediction } from '../hooks/useSTEMPrediction';

export const StudentForm = () => {
  const { predict, loading, result } = useSTEMPrediction();
  
  const [formData, setFormData] = useState({
    Plec: '',
    Matura: '',
    Egzamin8: '',
    Dochody: '',
    Pochodzenie: '',
    Komputer: 3,
    Przygotowanie: '',
    Gry: '',
    Frekwencja: '',
    Praca: 'Nie',
    Angielski: 3,
    Dodatkowe: 'Nie',
    Semestr: 1,
    Ostatnia: '',
    Srednia: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Konwertuj wartości na odpowiednie typy
    const processedData = {
      ...formData,
      Matura: parseFloat(formData.Matura),
      Egzamin8: parseFloat(formData.Egzamin8),
      Komputer: parseInt(formData.Komputer),
      Angielski: parseInt(formData.Angielski),
      Semestr: parseInt(formData.Semestr),
      Ostatnia: parseFloat(formData.Ostatnia),
      Srednia: parseFloat(formData.Srednia)
    };
    
    await predict(processedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Płeć */}
      <div>
        <label>Płeć:</label>
        <select 
          value={formData.Plec}
          onChange={(e) => setFormData({...formData, Plec: e.target.value})}
          required
        >
          <option value="">Wybierz...</option>
          <option value="Mężczyzna">Mężczyzna</option>
          <option value="Kobieta">Kobieta</option>
        </select>
      </div>

      {/* Matura */}
      <div>
        <label>Wynik z matury (w procentach):</label>
        <input 
          type="number"
          min="0"
          max="100"
          value={formData.Matura}
          onChange={(e) => setFormData({...formData, Matura: e.target.value})}
          placeholder="np. 85"
          required
        />
      </div>

      {/* Egzamin ósmoklasisty */}
      <div>
        <label>Wynik z egzaminu ósmoklasisty (w procentach):</label>
        <input 
          type="number"
          min="0"
          max="100"
          value={formData.Egzamin8}
          onChange={(e) => setFormData({...formData, Egzamin8: e.target.value})}
          placeholder="np. 75"
          required
        />
      </div>

      {/* Dochody */}
      <div>
        <label>Dochody rodziny:</label>
        <select 
          value={formData.Dochody}
          onChange={(e) => setFormData({...formData, Dochody: e.target.value})}
          required
        >
          <option value="">Wybierz...</option>
          <option value="Niskie (poniżej 3000 PLN)">Niskie (poniżej 3000 PLN)</option>
          <option value="Niżej średnie (3000-6000 PLN)">Niżej średnie (3000-6000 PLN)</option>
          <option value="Wyżej średnie (6000-12000 PLN)">Wyżej średnie (6000-12000 PLN)</option>
          <option value="Wysokie (powyżej 12000 PLN)">Wysokie (powyżej 12000 PLN)</option>
        </select>
      </div>

      {/* Pochodzenie */}
      <div>
        <label>Pochodzenie:</label>
        <select 
          value={formData.Pochodzenie}
          onChange={(e) => setFormData({...formData, Pochodzenie: e.target.value})}
          required
        >
          <option value="">Wybierz...</option>
          <option value="Miasto">Miasto</option>
          <option value="Wieś">Wieś</option>
        </select>
      </div>

      {/* Umiejętności komputerowe */}
      <div>
        <label>Umiejętności komputerowe (1-5):</label>
        <input 
          type="range"
          min="1"
          max="5"
          value={formData.Komputer}
          onChange={(e) => setFormData({...formData, Komputer: e.target.value})}
        />
        <span>{formData.Komputer}</span>
      </div>

      {/* ... pozostałe pola ... */}

      <button type="submit" disabled={loading}>
        {loading ? 'Analizowanie...' : 'Przewiduj kierunek'}
      </button>

      {/* Wyświetl wynik */}
      {result && (
        <div className="result">
          <h3>Wynik predykcji:</h3>
          <p>Przewidywany kierunek: <strong>{result.prediction}</strong></p>
          {result.confidence && (
            <p>Pewność modelu: {(Math.abs(result.confidence) * 100).toFixed(1)}%</p>
          )}
        </div>
      )}
    </form>
  );
};
```

## 🧪 Testowanie API

### Test 1: Pobierz format danych
```bash
curl http://localhost:5000/polish-format
```

### Test 2: Predykcja (student STEM)
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Plec": "Mężczyzna",
    "Matura": 90,
    "Egzamin8": 85,
    "Dochody": "Wyżej średnie (6000-12000 PLN)",
    "Pochodzenie": "Miasto",
    "Komputer": 5,
    "Przygotowanie": "Więcej niż 3 godziny",
    "Gry": "2-3 godziny",
    "Frekwencja": "80%-100%",
    "Praca": "Nie",
    "Angielski": 5,
    "Dodatkowe": "Tak",
    "Semestr": 2,
    "Ostatnia": 5.0,
    "Srednia": 4.8
  }'
```

### Test 3: Debug mode (zobacz konwersję danych)
```bash
curl -X POST "http://localhost:5000/predict?debug=true" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## 💡 Tips & Tricks

### 1. Walidacja na frontendzie

Dodaj walidację przed wysłaniem do API:

```javascript
const validateFormData = (data) => {
  const errors = [];
  
  if (data.Matura < 0 || data.Matura > 100) {
    errors.push('Wynik z matury musi być w przedziale 0-100%');
  }
  
  if (data.Komputer < 1 || data.Komputer > 5) {
    errors.push('Umiejętności komputerowe muszą być w przedziale 1-5');
  }
  
  // ... więcej walidacji
  
  return errors;
};
```

### 2. Formatowanie wyników

```javascript
const formatPrediction = (result) => {
  const confidence = Math.abs(result.confidence) * 100;
  
  return {
    kierunek: result.prediction === 'STEM' ? 'STEM (techniczny)' : 'non-STEM (nietechniczny)',
    pewnosc: `${confidence.toFixed(0)}%`,
    opis: result.prediction === 'STEM' 
      ? 'Twój profil pasuje do kierunków technicznych (informatyka, inżynieria, matematyka, nauki ścisłe)'
      : 'Twój profil pasuje do kierunków nietechnicznych (humanistyka, biznes, prawo, nauki społeczne)'
  };
};
```

### 3. Obsługa błędów

```javascript
try {
  const result = await predict(formData);
  // Sukces
} catch (error) {
  if (error.response?.status === 400) {
    // Błąd walidacji
    alert('Sprawdź poprawność wprowadzonych danych');
  } else if (error.response?.status === 500) {
    // Błąd serwera
    alert('Błąd serwera. Spróbuj ponownie później');
  } else {
    // Błąd sieci
    alert('Brak połączenia z serwerem');
  }
}
```

## 🚀 Deploy

Gdy będziecie deployować API na produkcję, nie zapomnijcie:

1. Zmienić URL API w frontendzie (z `localhost` na produkcyjny URL)
2. Skonfigurować CORS dla produkcyjnej domeny
3. Dodać rate limiting
4. Włączyć HTTPS

```javascript
// config.js
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.wasz-projekt.pl'
  : 'http://localhost:5000';
```
