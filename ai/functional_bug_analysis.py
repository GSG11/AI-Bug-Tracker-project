# bug_analyzer.py

# Functional bug keywords
FUNCTIONAL_KEYWORDS = [
    "fail", "not working", "does not", "unable", "crash", "hang", "issue", "problem",
    "freeze", "login error", "not responding", "stuck", "submit error"
]

# Bug type classification keywords
BUG_TYPES = {
    "UI": ["button", "alignment", "color", "layout", "font", "screen", "icon", "design", "text"],
    "API": ["endpoint", "api", "json", "request", "response", "token", "authorization", "server"],
    "Security": ["unauthorized", "access", "csrf", "xss", "injection", "security", "vulnerability", "breach"]
}

# Severity classification rules
SEVERITY_KEYWORDS = {
    "Critical": ["crash", "data loss", "unauthorized", "breach", "freeze", "not working at all"],
    "High": ["error", "wrong result", "fail", "broken", "stuck", "hang"],
    "Medium": ["slow", "lag", "glitch", "delay"]
}

def is_functional_bug(text: str) -> bool:
    text = text.lower()
    return any(keyword in text for keyword in FUNCTIONAL_KEYWORDS)

def classify_bug_type(text: str) -> str:
    text = text.lower()
    for bug_type, keywords in BUG_TYPES.items():
        if any(keyword in text for keyword in keywords):
            return bug_type
    return "Other"

def assign_severity_level(text: str) -> str:
    text = text.lower()
    for level, keywords in SEVERITY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return level
    return "Low"

def analyze_bug(title: str, description: str) -> dict:
    combined_text = f"{title} {description}"

    return {
        "is_functional": is_functional_bug(combined_text),
        "bug_type": classify_bug_type(combined_text),
        "severity": assign_severity_level(combined_text)
    }
