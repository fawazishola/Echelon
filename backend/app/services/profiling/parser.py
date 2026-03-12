from typing import Dict, Any

def parse_document(file_content: bytes, filename: str) -> Dict[str, Any]:
    """
    Stub for document parsing.
    In a real app, this would send the file to an LLM or OCR service
    to extract GPA, major, extracurriculars, etc.
    """
    return {
        "status": "parsed",
        "extracted_data": {}
    }
