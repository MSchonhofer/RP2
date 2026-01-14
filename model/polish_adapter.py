"""
Adapter do przekształcania polskich danych studentów na format amerykański
dla modelu predykcyjnego STEM vs non-STEM

Ten moduł umożliwia używanie modelu wytrenowanego na danych amerykańskich
z polskimi danymi wejściowymi poprzez inteligentne mapowanie wartości.
"""

import numpy as np
from typing import Dict, Any, Union

class PolishToUSAdapter:
    """
    Klasa do konwersji polskich danych studenckich na format amerykański
    """
    
    def __init__(self):
        """Inicjalizacja mapowań"""
        
        # Mapowanie ocen: Polska (2-5) → USA GPA (1-5)
        self.grade_mapping = {
            2.0: 1.0,   # niedostateczny
            2.5: 1.5,
            3.0: 2.0,   # dostateczny
            3.5: 2.5,   # dostateczny plus / dobry minus
            4.0: 3.0,   # dobry
            4.5: 3.5,   # dobry plus / bardzo dobry minus
            5.0: 4.5,   # bardzo dobry
        }
        
        # Mapowanie dochodów: PLN/miesiąc → USD/rok
        self.income_mapping = {
            "Niskie (poniżej 3000 PLN)": "Low (Below 15,000)",
            "Niżej średnie (3000-6000 PLN)": "Lower middle (15,000-30,000)",
            "Wyżej średnie (6000-12000 PLN)": "Upper middle (30,000-50,000)",
            "Wysokie (powyżej 12000 PLN)": "High (Above 50,000)",
            
            # Alternatywne polskie nazwy
            "niskie": "Low (Below 15,000)",
            "nizej srednie": "Lower middle (15,000-30,000)",
            "wyzej srednie": "Upper middle (30,000-50,000)",
            "wysokie": "High (Above 50,000)",
        }
        
        # Mapowanie miejsca pochodzenia
        self.hometown_mapping = {
            "Wieś": "Village",
            "wies": "Village",
            "Miasto": "City",
            "miasto": "City",
        }
        
        # Mapowanie czasu przygotowań
        self.preparation_mapping = {
            "0-1 godzina": "0-1 Hour",
            "2-3 godziny": "2-3 Hours",
            "Więcej niż 3 godziny": "More than 3 Hours",
            
            # Angielskie (już w odpowiednim formacie)
            "0-1 Hour": "0-1 Hour",
            "2-3 Hours": "2-3 Hours",
            "More than 3 Hours": "More than 3 Hours",
        }
        
        # Mapowanie czasu gier
        self.gaming_mapping = {
            "0-1 godzina": "0-1 Hour",
            "2-3 godziny": "2-3 Hours",
            "Więcej niż 3 godziny": "More than 3 Hours",
            
            # Angielskie
            "0-1 Hour": "0-1 Hour",
            "2-3 Hours": "2-3 Hours",
            "More than 3 Hours": "More than 3 Hours",
        }
        
        # Mapowanie frekwencji
        self.attendance_mapping = {
            "Poniżej 40%": "Below 40%",
            "40%-59%": "40%-59%",
            "60%-79%": "60%-79%",
            "80%-100%": "80%-100%",
            
            # Angielskie (już w odpowiednim formacie)
            "Below 40%": "Below 40%",
            "40%-59%": "40%-59%",
            "60%-79%": "60%-79%",
            "80%-100%": "80%-100%",
        }
        
        # Mapowanie płci
        self.gender_mapping = {
            "Mężczyzna": "Male",
            "mezczyzna": "Male",
            "M": "Male",
            "Kobieta": "Female",
            "kobieta": "Female",
            "K": "Female",
            
            # Angielskie
            "Male": "Male",
            "Female": "Female",
        }
        
        # Mapowanie Tak/Nie
        self.yes_no_mapping = {
            "Tak": "Yes",
            "tak": "Yes",
            "T": "Yes",
            "Nie": "No",
            "nie": "No",
            "N": "No",
            
            # Angielskie
            "Yes": "Yes",
            "No": "No",
        }
        
        # Mapowanie semestru (polski system: 1-10, amerykański: 1st-12th)
        self.semester_mapping = {
            1: "2nd",
            2: "3rd", 
            3: "4th",
            4: "5th",
            5: "6th",
            6: "7th",
            7: "8th",
            8: "9th",
            9: "10th",
            10: "11th",
        }
    
    def convert_grade(self, polish_grade: float) -> float:
        """
        Konwertuje polską ocenę (2-5) na amerykańską skalę GPA (1-5)
        
        Parameters:
        -----------
        polish_grade : float
            Ocena w polskiej skali (2.0 - 5.0)
            
        Returns:
        --------
        float : Ocena w skali amerykańskiej
        """
        # Interpolacja liniowa dla wartości pomiędzy
        if polish_grade <= 2.0:
            return 1.0
        elif polish_grade >= 5.0:
            return 4.5
        
        # Znajdź najbliższe wartości w mapowaniu
        keys = sorted(self.grade_mapping.keys())
        for i in range(len(keys) - 1):
            if keys[i] <= polish_grade <= keys[i + 1]:
                # Interpolacja liniowa
                t = (polish_grade - keys[i]) / (keys[i + 1] - keys[i])
                return self.grade_mapping[keys[i]] + t * (
                    self.grade_mapping[keys[i + 1]] - self.grade_mapping[keys[i]]
                )
        
        return self.grade_mapping.get(polish_grade, 3.0)
    
    def convert_polish_to_us_format(self, polish_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Główna funkcja konwertująca pełny zestaw polskich danych na format amerykański
        
        Parameters:
        -----------
        polish_data : dict
            Słownik z polskimi danymi studenta
            
        Oczekiwane klucze (polskie nazwy):
        - Gender/Plec: "Mężczyzna" lub "Kobieta"
        - Matura: wynik z matury (skala 2-5 lub 0-100%)
        - Egzamin8: wynik z egzaminu ósmoklasisty (skala 2-5 lub 0-100%)
        - Income/Dochody: kategoria dochodów
        - Hometown/Pochodzenie: "Miasto" lub "Wieś"
        - Computer/Komputer: umiejętności 1-5
        - Preparation/Przygotowanie: czas przygotowań
        - Gaming/Gry: czas grania
        - Attendance/Frekwencja: procent obecności
        - Job/Praca: "Tak" lub "Nie"
        - English/Angielski: poziom 1-5
        - Extra/Dodatkowe: "Tak" lub "Nie"
        - Semester/Semestr: numer semestru
        - Last/Ostatnia: ostatnia ocena
        - Overall/Srednia: średnia ocen
        
        Returns:
        --------
        dict : Słownik z danymi w formacie amerykańskim
        """
        us_data = {}
        
        # 1. Płeć
        gender_key = self._find_key(polish_data, ['Gender', 'Plec', 'gender', 'plec'])
        if gender_key:
            us_data['Gender'] = self.gender_mapping.get(
                str(polish_data[gender_key]), "Male"
            )
        
        # 2. Matura (HSC)
        matura_key = self._find_key(polish_data, ['HSC', 'Matura', 'matura'])
        if matura_key:
            matura_value = float(polish_data[matura_key])
            # Jeśli w skali 0-100 (procenty), przelicz na 2-5
            if matura_value > 5:
                matura_value = 2.0 + (matura_value / 100) * 3.0  # 0-100% → 2-5
            us_data['HSC'] = self.convert_grade(matura_value)
        
        # 3. Egzamin ósmoklasisty (SSC)
        egzamin8_key = self._find_key(polish_data, ['SSC', 'Egzamin8', 'egzamin8'])
        if egzamin8_key:
            egzamin8_value = float(polish_data[egzamin8_key])
            if egzamin8_value > 5:
                egzamin8_value = 2.0 + (egzamin8_value / 100) * 3.0
            us_data['SSC'] = self.convert_grade(egzamin8_value)
        
        # 4. Dochody
        income_key = self._find_key(polish_data, ['Income', 'Dochody', 'income', 'dochody'])
        if income_key:
            income_value = str(polish_data[income_key])
            us_data['Income'] = self.income_mapping.get(income_value, "Lower middle (15,000-30,000)")
        
        # 5. Pochodzenie
        hometown_key = self._find_key(polish_data, ['Hometown', 'Pochodzenie', 'hometown', 'pochodzenie'])
        if hometown_key:
            hometown_value = str(polish_data[hometown_key])
            us_data['Hometown'] = self.hometown_mapping.get(hometown_value, "City")
        
        # 6. Umiejętności komputerowe (1-5)
        computer_key = self._find_key(polish_data, ['Computer', 'Komputer', 'computer', 'komputer'])
        if computer_key:
            us_data['Computer'] = int(polish_data[computer_key])
        
        # 7. Czas przygotowań
        prep_key = self._find_key(polish_data, ['Preparation', 'Przygotowanie', 'preparation', 'przygotowanie'])
        if prep_key:
            prep_value = str(polish_data[prep_key])
            us_data['Preparation'] = self.preparation_mapping.get(prep_value, "2-3 Hours")
        
        # 8. Czas gier
        gaming_key = self._find_key(polish_data, ['Gaming', 'Gry', 'gaming', 'gry'])
        if gaming_key:
            gaming_value = str(polish_data[gaming_key])
            us_data['Gaming'] = self.gaming_mapping.get(gaming_value, "2-3 Hours")
        
        # 9. Frekwencja
        attendance_key = self._find_key(polish_data, ['Attendance', 'Frekwencja', 'attendance', 'frekwencja'])
        if attendance_key:
            attendance_value = str(polish_data[attendance_key])
            us_data['Attendance'] = self.attendance_mapping.get(attendance_value, "80%-100%")
        
        # 10. Praca
        job_key = self._find_key(polish_data, ['Job', 'Praca', 'job', 'praca'])
        if job_key:
            job_value = str(polish_data[job_key])
            us_data['Job'] = self.yes_no_mapping.get(job_value, "No")
        
        # 11. Poziom angielskiego (1-5)
        english_key = self._find_key(polish_data, ['English', 'Angielski', 'english', 'angielski'])
        if english_key:
            us_data['English'] = int(polish_data[english_key])
        
        # 12. Zajęcia dodatkowe
        extra_key = self._find_key(polish_data, ['Extra', 'Dodatkowe', 'extra', 'dodatkowe'])
        if extra_key:
            extra_value = str(polish_data[extra_key])
            us_data['Extra'] = self.yes_no_mapping.get(extra_value, "No")
        
        # 13. Semestr
        semester_key = self._find_key(polish_data, ['Semester', 'Semestr', 'semester', 'semestr'])
        if semester_key:
            semester_value = int(polish_data[semester_key])
            us_data['Semester'] = self.semester_mapping.get(semester_value, "2nd")
        
        # 14. Ostatnia ocena
        last_key = self._find_key(polish_data, ['Last', 'Ostatnia', 'last', 'ostatnia'])
        if last_key:
            last_value = float(polish_data[last_key])
            if last_value > 5:
                last_value = 2.0 + (last_value / 100) * 3.0
            us_data['Last'] = self.convert_grade(last_value)
        
        # 15. Średnia ocen
        overall_key = self._find_key(polish_data, ['Overall', 'Srednia', 'overall', 'srednia'])
        if overall_key:
            overall_value = float(polish_data[overall_key])
            if overall_value > 5:
                overall_value = 2.0 + (overall_value / 100) * 3.0
            us_data['Overall'] = self.convert_grade(overall_value)
        
        return us_data
    
    def _find_key(self, data: Dict, possible_keys: list) -> Union[str, None]:
        """
        Pomocnicza funkcja do znajdowania klucza w słowniku
        (obsługuje różne warianty nazw)
        """
        for key in possible_keys:
            if key in data:
                return key
        return None


# Przykład użycia
if __name__ == "__main__":
    adapter = PolishToUSAdapter()
    
    # Przykładowe polskie dane
    polish_student = {
        'Plec': 'Mężczyzna',
        'Matura': 4.5,  # w skali 2-5
        'Egzamin8': 4.0,
        'Dochody': 'Niżej średnie (3000-6000 PLN)',
        'Pochodzenie': 'Wieś',
        'Komputer': 3,
        'Przygotowanie': '2-3 godziny',
        'Gry': 'Więcej niż 3 godziny',
        'Frekwencja': '80%-100%',
        'Praca': 'Nie',
        'Angielski': 4,
        'Dodatkowe': 'Tak',
        'Semestr': 2,
        'Ostatnia': 4.0,
        'Srednia': 4.2
    }
    
    # Konwersja
    us_student = adapter.convert_polish_to_us_format(polish_student)
    
    print("="*70)
    print("PRZYKŁAD KONWERSJI POLSKICH DANYCH NA AMERYKAŃSKIE")
    print("="*70)
    print("\nPolskie dane:")
    for key, value in polish_student.items():
        print(f"  {key:15s}: {value}")
    
    print("\n" + "="*70)
    print("Amerykańskie dane:")
    for key, value in us_student.items():
        print(f"  {key:15s}: {value}")
    print("="*70)
