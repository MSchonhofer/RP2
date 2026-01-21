"""
Polish Adapter - converts Polish educational and economic data to Malaysian format
for the ML model without retraining.
"""


def polish_income_to_category(polish_category: str) -> str:
    """
    Convert Polish income category string to Malaysian income category.
    
    Args:
        polish_category: Polish income category string from frontend
            - "Low (Below 7,000 PLN)"
            - "Lower middle (7,000-10,000 PLN)"
            - "Upper middle (10,000-13,000 PLN)"
            - "High (Above 13,000 PLN)"
        
    Returns:
        Malaysian income category string matching the model's training data
    """
    # Map Polish categories to Malaysian categories
    # Both use the same relative economic status, just different currency amounts
    if "Low" in polish_category and "Below" in polish_category:
        return "Low (Below 15,000)"
    elif "Lower middle" in polish_category:
        return "Lower middle (15,000-30,000)"
    elif "Upper middle" in polish_category:
        return "Upper middle (30,000-50,000)"
    elif "High" in polish_category and "Above" in polish_category:
        return "High (Above 50,000)"
    else:
        # Default fallback
        return "Lower middle (15,000-30,000)"


def polish_school_grade_to_gpa(grade: float) -> float:
    """
    Convert Polish school grade (1-6 scale) to Malaysian GPA (0-5 scale).
    Used for both SSC (primary school) and HSC (high school).
    
    Polish system:
    - 1 = niedostateczny (fail)
    - 2 = dopuszczający (pass)
    - 3 = dostateczny (satisfactory)
    - 4 = dobry (good)
    - 5 = bardzo dobry (very good)
    - 6 = celujący (excellent)
    
    Args:
        grade: Polish grade (1.0 - 6.0, can be decimal like 4.23)
        
    Returns:
        Malaysian GPA (0.0 - 5.0)
    """
    # Linear mapping: Polish 1→0, 2→1, 3→2, 4→3, 5→4, 6→5
    gpa = grade - 1.0
    
    # Clamp to valid range
    return max(0.0, min(5.0, gpa))


def polish_university_grade_to_gpa(grade: float) -> float:
    """
    Convert Polish university grade (2.0-5.0 scale) to Malaysian GPA (0-5 scale).
    Uses non-linear mapping (Proposal B) that preserves the difficulty of getting high grades.
    
    Polish system:
    - 2.0 = niedostateczny (fail)
    - 3.0 = dostateczny (satisfactory)
    - 3.5 = dostateczny plus
    - 4.0 = dobry (good)
    - 4.5 = dobry plus
    - 5.0 = bardzo dobry (very good/excellent)
    
    Mapping:
    - 2.0 → 0.0 (fail)
    - 3.0 → 1.5 (pass)
    - 3.5 → 2.25
    - 4.0 → 3.0 (good)
    - 4.5 → 4.0 (very good)
    - 5.0 → 5.0 (excellent)
    
    Args:
        grade: Polish university grade (2.0 - 5.0, can be decimal like 3.67)
        
    Returns:
        Malaysian GPA (0.0 - 5.0)
    """
    # Non-linear mapping for 2.0-4.0 range
    if grade <= 4.0:
        gpa = (grade - 2.0) * 1.5
    # Steeper mapping for 4.0-5.0 range (harder to achieve)
    else:
        gpa = 3.0 + (grade - 4.0) * 2.0
    
    # Clamp to valid range
    return max(0.0, min(5.0, gpa))


# Convenience functions for clearer usage in main.py
def adapt_ssc(polish_grade: float) -> float:
    """Adapt Polish primary school grade to Malaysian SSC format."""
    return polish_school_grade_to_gpa(polish_grade)


def adapt_hsc(polish_grade: float) -> float:
    """Adapt Polish high school grade to Malaysian HSC format."""
    return polish_school_grade_to_gpa(polish_grade)


def adapt_last_semester(polish_grade: float) -> float:
    """Adapt Polish last semester grade to Malaysian GPA format."""
    return polish_university_grade_to_gpa(polish_grade)


def adapt_overall_gpa(polish_grade: float) -> float:
    """Adapt Polish overall university grade to Malaysian GPA format."""
    return polish_university_grade_to_gpa(polish_grade)
