# HelloCeylon

Hello Ceylon – An interactive chatbot serving as your personal Sri Lanka tourist guide.

🛠 Tech Stack

Frontend: React.js (useState, Axios)

Backend: Node.js + Express

Python Microservice: FastAPI + Google Generative AI (Gemini)

Communication: Axios HTTP requests

CORS: Enabled to allow frontend-backend communication

⚡ Features

Chatbot answers questions about Sri Lanka tourism.

Short, friendly, paragraph-style responses.

Frontend displays chatbot replies in real-time.

Backend acts as a bridge between React frontend and Python AI service.

Special commands:

"quit" → chatbot responds with goodbye message.

Empty input → prompts user to type a message.

📦 Project data flow Structure

React frontend (App.jsx)
|
| POST /api/chat { message }
v
Node.js server (server.js)
|
| POST /chat { message }
v
Python chatbot (chatbot.py)
|
| { answer: "Hi there!" }
v
Node.js server -> React frontend

Run in terminal

    cd python-service
    uvicorn chatbot:app --reload --port 8000

    cd frontend
    npm start

    cd backend
    npm start
