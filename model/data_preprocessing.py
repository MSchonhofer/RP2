"""
Skrypt do przetwarzania danych i dodania kolumny STEM/non-STEM
"""
import pandas as pd
import os

# Ścieżki do plików
DATA_PATH = "../backend/data/Data.csv"
OUTPUT_PATH = "../backend/data/Data_with_STEM.csv"

def add_stem_column():
    """
    Dodaje kolumnę STEM do datasetu.
    1 = STEM (Computer Science, Engineering, etc.)
    0 = non-STEM (Business, Economics, English, etc.)
    """
    # Wczytaj dane
    df = pd.read_csv(DATA_PATH)
    
    print(f"Wczytano {len(df)} wierszy")
    print(f"\nUnikalne departamenty:")
    print(df['Department'].unique())
    
    # Definicja departamentów STEM
    stem_departments = [
        'Computer Science and Engineering',
        'Electrical and Electronic Engineering'
    ]
    
    # Dodaj kolumnę STEM (1 dla STEM, 0 dla non-STEM)
    df['STEM'] = df['Department'].apply(lambda x: 1 if x in stem_departments else 0)
    
    # Statystyki
    stem_count = df['STEM'].sum()
    non_stem_count = len(df) - stem_count
    
    print(f"\n{'='*50}")
    print(f"Statystyki:")
    print(f"  STEM: {stem_count} ({stem_count/len(df)*100:.1f}%)")
    print(f"  non-STEM: {non_stem_count} ({non_stem_count/len(df)*100:.1f}%)")
    print(f"{'='*50}\n")
    
    # Zapisz nowy plik
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Zapisano dane z kolumną STEM do: {OUTPUT_PATH}")
    
    return df

if __name__ == "__main__":
    df = add_stem_column()
    print("\nPierwsze 5 wierszy z nową kolumną:")
    print(df[['Department', 'STEM']].head(10))
