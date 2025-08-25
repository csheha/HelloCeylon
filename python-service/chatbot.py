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

# Store chat history in memory (per session/ can use DB later)
conversation_history = []

print("🤖 Chatbot service started on http://localhost:8000")

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    if not user_input:
        return {"answer": "Please type a message."}
    if user_input.lower() == "quit":
        conversation_history.clear()
        return {"answer": "Goodbye! Have a great day!"}

    # Add user message to conversation
    conversation_history.append({"role": "user", "parts": [{"text": user_input}]})

    # Generate response with full history
    response = model.generate_content(conversation_history)

    # Add model reply to history
    reply_text = response.text
    conversation_history.append({"role": "model", "parts": [{"text": reply_text}]})

    # Parse JSON if needed, otherwise return plain text
    try:
        reply_json = json.loads(reply_text)
        answer = reply_json.get("answer", reply_text)
    except json.JSONDecodeError:
        answer = reply_text

    return {"answer": answer}
