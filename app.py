
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama2-uncensored:7b"


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "It's running!"}


@app.post("/chat")
def chat(request: ChatRequest):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            "stream": False
        },
        timeout=120
    )

    response.raise_for_status()

    result = response.json()

    return {
        "reply": result["message"]["content"]
    }
