# Podsumowanie Modelu Predykcyjnego STEM vs non-STEM

## Informacje o datasecie

- **Całkowita liczba próbek**: 493
- **STEM (klasa 1)**: 444 próbek (90.1%)
- **non-STEM (klasa 0)**: 49 próbek (9.9%)
- **Podział**: 80% trening (394 próbek) / 20% test (99 próbek)

### Klasyfikacja kierunków:

**STEM:**
- Computer Science and Engineering
- Electrical and Electronic Engineering

**non-STEM:**
- Business Administration
- Economics
- English
- Journalism, Communication and Media Studies
- Law and Human Rights
- Political Science
- Public Health
- Sociology

## Cechy użyte w modelu (15)

1. Gender - płeć (Male/Female)
2. HSC - wyniki z egzaminu HSC (0-5)
3. SSC - wyniki z egzaminu SSC (0-5)
4. Income - poziom dochodów (5 kategorii)
5. Hometown - miejsce pochodzenia (City/Village)
6. Computer - umiejętności komputerowe (1-5)
7. Preparation - czas przygotowań do zajęć (3 kategorie)
8. Gaming - czas spędzany na grach (3 kategorie)
9. Attendance - frekwencja (4 kategorie)
10. Job - czy pracuje (Yes/No)
11. English - poziom języka angielskiego (1-5)
12. Extra - czy bierze udział w zajęciach dodatkowych (Yes/No)
13. Semester - który semestr (2nd-12th)
14. Last - ostatnia ocena (0-5)
15. Overall - średnia ocen (0-5)

**Uwaga:** Kolumna `Department` NIE jest używana do trenowania!

## Wyniki porównania modeli

| Model | Accuracy | Precision | Recall | F1-Score | CV Mean | CV Std |
|-------|----------|-----------|--------|----------|---------|--------|
| **SVM** | **0.8990** | **0.8990** | **1.0000** | **0.9468** | 0.8985 | 0.0077 |
| Gradient Boosting | 0.8889 | 0.9062 | 0.9775 | 0.9405 | 0.8935 | 0.0232 |
| Random Forest | 0.8788 | 0.8969 | 0.9775 | 0.9355 | 0.9138 | 0.0145 |
| Logistic Regression | 0.8687 | 0.8958 | 0.9663 | 0.9297 | 0.9163 | 0.0098 |

## Najlepszy model: SVM (Support Vector Machine)

### Metryki na zbiorze testowym:
- **Accuracy**: 89.90%
- **Precision**: 89.90%
- **Recall**: 100.00%
- **F1-Score**: 94.68%

### Confusion Matrix:
```
                Predicted
              non-STEM  STEM
Actual non-STEM    0     10
       STEM        0     89
```

### Interpretacja wyników:

✅ **Mocne strony:**
- Bardzo wysoki Recall (100%) - model nie przegapił ŻADNEGO studenta STEM
- Wysoka dokładność ogólna (89.9%)
- Dobry F1-Score (94.68%)
- Stabilny na cross-validation (CV std = 0.0077)

⚠️ **Słabe strony:**
- Wszystkie błędy to False Positives (10 studentów non-STEM przewidzianych jako STEM)
- Wynika to z nierównowagi klas (90% STEM w danych)
- Model ma tendencję do przewidywania STEM

### Przyczyny błędów:
- Dataset ma silną nierównowagę klas (90% STEM)
- Niektórzy studenci non-STEM mogą mieć profile podobne do STEM
- Może być potrzebne zebranie więcej danych non-STEM

## Rekomendacje

### Do dalszej pracy:

1. **Zbierz więcej danych non-STEM** - to znacznie poprawi balanced accuracy
2. **Dostosuj wagi klas** - można użyć `class_weight='balanced'` w modelach
3. **Feature engineering** - możliwe kombinacje cech mogą pomóc
4. **Threshold tuning** - dostosowanie progu decyzji może zmniejszyć False Positives

### Do integracji z polską stroną:

1. **Dostosuj pytania** do polskich standardów:
   - HSC/SSC → matura/egzamin ósmoklasisty
   - Income → polskie zakresy dochodów
   - Semester → polski system semestralny

2. **Dodaj polskie kierunki STEM**:
   - Informatyka, Matematyka, Fizyka, Chemia, Biologia
   - Inżynieria (wszystkie rodzaje)
   - Medycyna, Farmacja

3. **Zbierz polskie dane treningowe**:
   - Użyj obecnego modelu jako baseline
   - Zbieraj dane od polskich studentów
   - Retrenuj model na polskich danych

## Pliki modelu

Po treningu zapisane zostały następujące pliki:

- `stem_classifier_model.pkl` - wytrenowany model SVM
- `scaler.pkl` - normalizator danych
- `label_encoders.pkl` - enkodery zmiennych kategorycznych
- `model_metadata.pkl` - metadata (nazwy cech, nazwa modelu)

Wszystkie te pliki są **WYMAGANE** do wykonywania predykcji!

## Następne kroki

1. ✅ Model został wytrenowany i przetestowany
2. ✅ API endpoint został przygotowany (`api.py`)
3. ⏳ Integracja z frontendem (React)
4. ⏳ Dostosowanie do polskich standardów
5. ⏳ Zebranie polskich danych treningowych
6. ⏳ Retrenowanie na polskich danych

---
**Data utworzenia:** 14 stycznia 2026
**Autor modelu:** GitHub Copilot
**Framework:** scikit-learn 1.8.0
