from PyPDF2 import PdfReader
import google.generativeai as genai
import os

# -------------------------------
# Configure Gemini API
# -------------------------------
GEMINI_API_KEY = "AIzaSyB6dLi5-3fiSEANv63WA2-RtyAw_dL_pJI"

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Set it as an environment variable.")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-flash-latest")

# -------------------------------
# Extract text from PDF
# -------------------------------
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print("PDF extraction error:", e)
    return text

# -------------------------------
# AI call function (Gemini)
# -------------------------------
def ask_ai(question, extracted_text, marks=None):
    prompt = f"""You are an AI assistant that writes exam answers exactly like a student would write after reading the textbook.

⚠️ CRITICAL ANTI-HALLUCINATION RULES (HIGHEST PRIORITY):
1. Use ONLY information explicitly stated in the TEXTBOOK CONTENT below
2. NEVER add information from your own knowledge base or external sources
3. If the textbook doesn't contain the answer, write: "This information is not available in the provided textbook content"
4. If the textbook has partial information, answer only what's available and state what's missing
5. Do NOT make assumptions or inferences beyond what the textbook explicitly states
6. Quote or paraphrase ONLY from the textbook content provided

FORMATTING RULES:
1. Write a STRUCTURED answer with clear sections and points
2. Use proper exam answer format with headings, subheadings, and numbered/bulleted points
3. Match the answer length to what the question EXPECTS - not too long, not too short
4. Make it visually attractive and well-organized

ANSWER STRUCTURE (adapt based on question type):
• Start with a brief definition/introduction if needed
• Use clear headings for main points (## Heading)
• Use bullet points (•) or numbers (1., 2., 3.) for sub-points
• Include examples only if the question demands it AND examples exist in textbook
• End with conclusion/summary only for "explain" or "discuss" type questions

ANSWER LENGTH INTELLIGENCE:
Analyze the question to determine appropriate length:
• "What is...?" or "Define..." → Brief (definition + 2-3 key points)
• "List..." or "State..." → Concise list with minimal explanation
• "Explain..." or "Describe..." → Moderate (introduction + 3-4 detailed points + conclusion)
• "Discuss..." or "Compare..." → Detailed (multiple sections with analysis)
• "Analyze..." or question with "in detail" → Comprehensive coverage

FORMATTING STYLE:
• Use ## for main headings
• Use ### for subheadings
• Use bullet points (•) for lists
• Use **bold** for key terms
• Leave blank lines between sections for spacing
• Write in clear, confident exam language

QUESTION:
{question}

TEXTBOOK CONTENT:
{extracted_text}

Generate a well-structured exam answer using ONLY the textbook content above. Match exactly what this question expects."""

    if marks:
        prompt += f"""

MARKS WEIGHTAGE OVERRIDE:
This is a {marks}-mark question. Adjust your answer accordingly:
{f'- Keep it concise: definition + 2-3 clear points (about ½ page)' if marks <= 2 else ''}
{f'- Moderate detail: 2-3 headings + sub-points + 1 example + brief conclusion (1-1.5 pages)' if marks == 5 else ''}
{f'- Comprehensive: 4-5 headings + detailed points + multiple examples + thorough conclusion (2-3 pages)' if marks >= 10 else ''}
"""


    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"AI ERROR during generation: {str(e)}")
        return "AI processing failed."

# -------------------------------
# AI General Function (for AI Tab)
# -------------------------------
def ask_ai_general(question, ai_instruction, existing_answer=None):
    """
    Handle AI requests for both modes:
    - Mode 1 (question_only): Answer question with AI knowledge
    - Mode 2 (enhance_answer): Enhance/explain existing answer
    """
    
    if existing_answer:
        # Mode 2: Enhance/explain existing answer
        prompt = f"""You are a helpful AI tutor assisting students with understanding their exam answers.

TASK: {ai_instruction}

STUDENT'S QUESTION:
{question}

EXISTING ANSWER:
{existing_answer}

INSTRUCTIONS:
1. {ai_instruction}
2. Keep the enhanced answer well-structured and easy to understand
3. Use proper formatting with headings (##), bullet points (•), and **bold** text
4. Make it visually attractive with proper spacing
5. Focus on making it helpful for exam preparation

FORMAT YOUR RESPONSE WITH:
• ## for main headings
• ### for subheadings  
• Bullet points (•) for lists
• **bold** for key terms
• Numbered lists (1., 2., 3.) for steps
• Leave blank lines between sections

Generate a helpful response that {ai_instruction.lower()}."""

    else:
        # Mode 1: Answer question directly with AI knowledge
        prompt = f"""You are a helpful AI tutor helping students prepare for exams.

STUDENT'S QUESTION:
{question}

INSTRUCTION: {ai_instruction}

TASK:
Provide a clear, well-structured answer that helps the student understand this topic and prepare for their exam.

FORMATTING REQUIREMENTS:
• Use ## for main headings
• Use ### for subheadings
• Use bullet points (•) for lists
• Use **bold** for key terms
• Use numbered lists (1., 2., 3.) for sequential steps
• Leave blank lines between sections for readability
• Make it visually attractive and easy to scan

{f"NOTE: {ai_instruction}" if ai_instruction else ""}

Generate a helpful, exam-focused answer that is well-structured and easy to understand."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("AI general error:", e)
        return "AI processing failed."