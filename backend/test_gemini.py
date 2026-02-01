import google.generativeai as genai
import os

GEMINI_API_KEY = "AIzaSyB6dLi5-3fiSEANv63WA2-RtyAw_dL_pJI"
genai.configure(api_key=GEMINI_API_KEY)

try:
    model = genai.GenerativeModel("models/gemini-flash-latest")
    response = model.generate_content("Hello, how are you?")
    print("SUCCESS: Gemini API (Flash Latest) is working!")
    print("Response:", response.text)
except Exception as e:
    print("FAILURE: Gemini API error:")
    print(str(e))
