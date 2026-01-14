# 📊 Porównanie: Wersja angielska vs polska

## Pytania kwestionariusza

### ❌ PRZED (Angielski - USA)
```
1. What is your gender?
   → Male / Female / Other

2. What was your HSC GPA or percentage?
   → 0-5 (GPA scale)

3. What is your family income level?
   → Low (Below 15,000) / Lower middle (15,000–30,000) / ...
   → W USD rocznie

4. How many hours per week do you spend preparing/studying?
   → 0–1 Hour / 1–3 Hours / More than 3 Hours
   → NA TYDZIEŃ

5. What was your GPA point for the last semester?
   → 0-5 (GPA scale)
```

### ✅ PO (Polski - Polska)
```
1. Jaka jest Twoja płeć?
   → Mężczyzna / Kobieta / Inna

2. Jaki wynik uzyskałeś/-aś z matury? (w procentach)
   → 0-100 (skala procentowa)

3. Jaki jest miesięczny dochód Twojej rodziny?
   → Niskie (poniżej 3000 PLN) / Niżej średnie (3000-6000 PLN) / ...
   → W PLN miesięcznie

4. Ile godzin dziennie poświęcasz na naukę?
   → 0-1 godzina / 1-2 godziny / 2-3 godziny / Więcej niż 3 godziny
   → DZIENNIE (bardziej szczegółowo)

5. Jaka była Twoja średnia ocen z ostatniego semestru?
   → 2.0-5.0 (polska skala)
```

## Mapowanie danych

| Pytanie | Format angielski | Format polski | Konwersja |
|---------|-----------------|---------------|-----------|
| **Główny egzamin** | HSC (0-5 GPA) | Matura (0-100%) | Adapter: % → GPA |
| **Egzamin niższy** | SSC (0-5 GPA) | Egzamin 8 (0-100%) | Adapter: % → GPA |
| **Dochody** | USD/rok | PLN/miesiąc | Adapter: PLN/m → USD/y |
| **Średnia** | GPA 0-4 | Ocena 2-5 | Adapter: PL → US scale |
| **Nauka** | Godziny/tydzień | Godziny/dzień | Adapter: mapowanie kategorii |
| **Pochodzenie** | Village/Town/City | Wieś/Małe miasto/Miasto | Adapter: tłumaczenie |

## Format danych API

### ❌ PRZED (US Format)
```json
{
  "gender": "Male",
  "hsc_score": 4.17,
  "ssc_score": 3.81,
  "income": "Lower middle (15,000–30,000)",
  "hometown": "City",
  "computer_proficiency": 4,
  "preparation_time": "1–3 Hours",
  "gaming_time": "1–3 Hours",
  "attendance": "80–100%",
  "extracurricular": "Yes",
  "job": "No",
  "english_proficiency": 4,
  "semester": "2nd",
  "last_sem_gpa": 3.5,
  "overall_gpa": 3.5
}
```

### ✅ PO (Polish Format)
```json
{
  "Plec": "Mężczyzna",
  "Matura": 85,
  "Egzamin8": 78,
  "Dochody": "Niżej średnie (3000-6000 PLN)",
  "Pochodzenie": "Miasto",
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

## Tekst w interfejsie

| Element | Przed | Po |
|---------|-------|-----|
| **Tytuł główny** | "Self-discipline questionnaire" | "Kwestionariusz samodyscypliny" |
| **Postęp** | "Question 5 of 15" | "Pytanie 5 z 15" |
| **Przyciski nawigacji** | "Back" / "Next" | "Wstecz" / "Dalej" |
| **Obliczanie** | "Calculating…" | "Obliczanie…" |
| **Wyniki** | "Your result" | "Twój wynik" |
| **Samodyscyplina** | "Self-discipline score" | "Wynik samodyscypliny" |
| **Akcje** | "Restart questionnaire" | "Rozpocznij ponownie" |
| **Powrót** | "Back to home" | "Powrót do strony głównej" |

## Sekcje pytań

| Przed (EN) | Po (PL) |
|-----------|---------|
| Personal Information | Informacje osobiste |
| Previous Academic Performance | Wyniki z egzaminów |
| Family & Socioeconomic Background | Tło rodzinne i ekonomiczne |
| Technology Access | Umiejętności komputerowe |
| Study & Preparation Habits | Nawyki nauki i przygotowania |
| Class Engagement | Zaangażowanie w zajęcia |
| Work & Language Skills | Praca i umiejętności językowe |
| Course Information | Informacje o studiach |

## Przykładowe opcje odpowiedzi

### Dochody rodziny
**Przed (USD/rok):**
- Low (Below 15,000)
- Lower middle (15,000–30,000)
- Upper middle (30,000–50,000)
- High (Above 50,000)

**Po (PLN/miesiąc):**
- Niskie (poniżej 3000 PLN)
- Niżej średnie (3000-6000 PLN)
- Wyżej średnie (6000-10000 PLN)
- Wysokie (powyżej 10000 PLN)

### Czas nauki
**Przed (tygodniowo):**
- 0–1 Hour
- 1–3 Hours
- More than 3 Hours

**Po (dziennie, bardziej szczegółowo):**
- 0-1 godzina
- 1-2 godziny
- 2-3 godziny
- Więcej niż 3 godziny

### Tak/Nie
**Przed:** Yes / No  
**Po:** Tak / Nie

### Płeć
**Przed:** Male / Female / Other  
**Po:** Mężczyzna / Kobieta / Inna

## 🎯 Kluczowe korzyści

1. ✅ **Zrozumiałość**: Polscy studenci rozumieją pytania bez tłumaczenia
2. ✅ **Dokładność**: Polska skala ocen (2-5) zamiast amerykańskiego GPA
3. ✅ **Realność**: Dochody w PLN pasują do polskich realiów
4. ✅ **Szczegółowość**: Więcej opcji dla czasu nauki (dziennie zamiast tygodniowo)
5. ✅ **Kompatybilność**: Dane automatycznie konwertowane do modelu US

## 🔄 Proces konwersji

```
Polski student wypełnia formularz
         ↓
    Dane w formacie PL
    {Matura: 85, Dochody: "3000-6000 PLN", ...}
         ↓
    Frontend wysyła do API
         ↓
    API wykrywa polski format
         ↓
    polish_adapter.py konwertuje PL → US
    {HSC: 3.6, Income: "Lower middle", ...}
         ↓
    Model ML przetwarza dane US
         ↓
    Predykcja: STEM / non-STEM
         ↓
    Frontend wyświetla wynik po polsku
```

## 📱 Zachowana stylistyka

**Niezmienione elementy:**
- ✅ Kolory i gradienty
- ✅ Animacje i przejścia
- ✅ Layout i rozmieszczenie
- ✅ Ikony i grafika
- ✅ Responsywność
- ✅ Struktura komponentów
- ✅ Klasy CSS

**Zmienione tylko:**
- ✅ Teksty (EN → PL)
- ✅ Formaty danych (US → PL)
- ✅ URL API (backend → model)
- ✅ Nazwy pól (snake_case US → PascalCase PL)

Dzięki temu strona wygląda **identycznie**, ale działa z **polskimi danymi**! 🎉
