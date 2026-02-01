from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from utils import extract_text_from_pdf, ask_ai, ask_ai_general

app = FastAPI()

def log_message(msg):
    with open("backend_logs.txt", "a", encoding="utf-8") as f:
        f.write(f"{msg}\n")
    print(msg)

# -------------------------------
# Allow requests from frontend
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

log_message("Backend initialized and logging started.")

# -------------------------------
# Ensure folders exist
# -------------------------------
Path("pdfs").mkdir(exist_ok=True)
Path("textbooks").mkdir(exist_ok=True)
Path("extracted").mkdir(exist_ok=True)

# -------------------------------
# Root route (testing)
# -------------------------------
@app.get("/")
def read_root():
    log_message("Root endpoint accessed.")
    return {"message": "Textbook Backend is running!"}

# -------------------------------
# Textbook Tab: Upload & Process PDF with Question + Marks
# -------------------------------
@app.post("/process_textbook/")
async def process_textbook(
    file: UploadFile = File(...),
    question: str = Form(...),
    marks: int = Form(None)  # optional
):
    try:
        # 1️⃣ Save uploaded PDF to textbooks folder
        pdf_path = f"textbooks/{file.filename}"
        with open(pdf_path, "wb") as f:
            f.write(await file.read())

        # 2️⃣ Extract text from PDF
        extracted_text = extract_text_from_pdf(pdf_path)
        log_message(f"DEBUG: Extracted {len(extracted_text)} characters from {file.filename}")
        
        if not extracted_text or len(extracted_text.strip()) < 50:
            log_message(f"DEBUG: Extraction failed or too short for {file.filename}")
            return {
                "status": "failure",
                "message": f"Could not extract sufficient text from PDF (only {len(extracted_text)} chars found). Scanned PDFs or images are not supported."
            }

        # 3️⃣ Save extracted text locally (optional, for debugging)
        extracted_path = f"extracted/{file.filename}.txt"
        with open(extracted_path, "w", encoding="utf-8") as f:
            f.write(extracted_text)

        # 4️⃣ Generate AI answer using question + extracted text + optional marks
        log_message(f"DEBUG: Generating AI answer for question: {question}")
        ai_answer = ask_ai(question, extracted_text, marks)

        if ai_answer == "AI processing failed.":
            log_message("DEBUG: AI generation returned failure string")
            return {
                "status": "failure",
                "message": "AI was unable to process the request. Please check your API key or try a different question."
            }

        # 5️⃣ Return structured response
        log_message("DEBUG: Successfully generated structured answer")
        return {
            "status": "success",
            "filename": file.filename,
            "question": question,
            "marks": marks,
            "answer": ai_answer
        }
    
    except Exception as e:
        log_message(f"DEBUG: Unexpected error in process_textbook: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

# -------------------------------
# AI Tab: Process AI Request (Mode 1 & Mode 2)
# -------------------------------
@app.post("/process_ai/")
async def process_ai(
    question: str = Form(...),
    ai_instruction: str = Form(...),
    mode: str = Form("question_only"),  # "question_only" or "enhance_answer"
    existing_answer: str = Form(None)  # Only for mode 2
):
    try:
        # Call the AI general function based on mode
        ai_answer = ask_ai_general(
            question=question,
            ai_instruction=ai_instruction,
            existing_answer=existing_answer if mode == "enhance_answer" else None
        )
        
        return {
            "status": "success",
            "ai_answer": ai_answer,
            "mode": mode
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }