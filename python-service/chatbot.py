import google.generativeai as genai
import os
import dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json

# Load environment variables
dotenv.load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("API_KEY"))

app = FastAPI()

# Allow MERN frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure model
model = genai.GenerativeModel(
    "gemini-2.0-flash",
    system_instruction=(
        "You are a friendly Sri Lankan tourism expert. "
        "Always provide short, clear answers in a paragraph. "
    ),
)

print("🤖 Chatbot service started on http://localhost:8000")

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    if not user_input:
        return {"answer": "Please type a message."}
    if user_input.lower() == "quit":
        return {"answer": "Goodbye! Have a great day!"}

    # Generate response
    response = model.generate_content(user_input)

    # Parse JSON returned by the model
    try:
        reply_json = json.loads(response.text)
        answer = reply_json.get("answer", "Sorry, I could not generate a response.")
    except json.JSONDecodeError:
        answer = response.text  

    return {"answer": answer} 