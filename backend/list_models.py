import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyB6dLi5-3fiSEANv63WA2-RtyAw_dL_pJI"
genai.configure(api_key=GEMINI_API_KEY)

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Model: {m.name}")
except Exception as e:
    print(f"Error: {e}")
