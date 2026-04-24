import io
import pytesseract
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
from PIL import Image

def robust_pdf_parser(pdf_path, tesseract_lang='eng'):
    """
    Parse text from PDF robustly:
    - First tries PyPDF2 extraction.
    - Falls back to Tesseract OCR for image-based or hard-to-extract text.
    
    Args:
        pdf_path (str): Path to the PDF file.
        tesseract_lang (str): Language code for OCR (default 'eng').
    
    Returns:
        str: Extracted text from the PDF.
    """
    full_text = []

    try:
        reader = PdfReader(pdf_path)
        for page_num, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            # If extracted text is too small, assume it's not useful
            if len(text.strip()) < 20:
                # Convert that specific page to image for OCR
                images = convert_from_path(pdf_path, first_page=page_num+1, last_page=page_num+1)
                page_text = ""
                for img in images:
                    try:
                        page_text += pytesseract.image_to_string(img, lang=tesseract_lang)
                    except:
                        print("Tesseract not installed!")
                full_text.append(page_text.strip())
            else:
                full_text.append(text.strip())
    except Exception as e:
        print(f"[ERROR] PyPDF2 parsing failed entirely, switching to full OCR: {e}")
        # Full fallback: OCR all pages
        images = convert_from_path(pdf_path)
        for img in images:
            full_text.append(pytesseract.image_to_string(img, lang=tesseract_lang).strip())

    return "\n".join(full_text)
