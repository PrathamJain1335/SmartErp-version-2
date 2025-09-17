from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
import os
from datetime import datetime

# Import our AI modules (using simple implementations)
from simple_ai_chatbot import SimpleAIChatbot
from simple_portfolio_generator import SimplePortfolioGenerator

app = FastAPI(title="College ERP AI Service", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI services (using simple implementations)
chatbot = SimpleAIChatbot()
portfolio_gen = SimplePortfolioGenerator()

# Pydantic models for request/response
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str

class StudentRecord(BaseModel):
    student_id: str
    name: str
    course: str
    semester: int
    grades: Dict[str, Any]
    projects: List[Dict[str, Any]] = []
    achievements: List[str] = []
    skills: List[str] = []
    extracurricular: List[Dict[str, Any]] = []

class PortfolioRequest(BaseModel):
    student_record: StudentRecord
    template_style: Optional[str] = "professional"

class PortfolioResponse(BaseModel):
    portfolio_html: str
    summary: str
    highlights: List[str]

@app.get("/")
async def root():
    return {"message": "College ERP AI Service is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "chatbot_ready": chatbot.is_ready(),
        "portfolio_generator_ready": portfolio_gen.is_ready(),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(chat_request: ChatMessage):
    """
    Chat with the AI assistant about college-related topics
    """
    try:
        response = await chatbot.generate_response(
            message=chat_request.message,
            user_id=chat_request.user_id,
            conversation_id=chat_request.conversation_id
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating chat response: {str(e)}")

@app.post("/generate-portfolio", response_model=PortfolioResponse)
async def generate_student_portfolio(portfolio_request: PortfolioRequest):
    """
    Generate an AI-powered portfolio for a student based on their records
    """
    try:
        portfolio = await portfolio_gen.generate_portfolio(
            student_record=portfolio_request.student_record,
            template_style=portfolio_request.template_style
        )
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating portfolio: {str(e)}")

@app.get("/chat/conversations/{user_id}")
async def get_user_conversations(user_id: str):
    """
    Get conversation history for a user
    """
    try:
        conversations = await chatbot.get_user_conversations(user_id)
        return {"conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversations: {str(e)}")

@app.delete("/chat/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete a specific conversation
    """
    try:
        success = await chatbot.delete_conversation(conversation_id)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")

@app.get("/portfolio/templates")
async def get_portfolio_templates():
    """
    Get available portfolio templates
    """
    return {
        "templates": [
            {"id": "professional", "name": "Professional", "description": "Clean, business-oriented layout"},
            {"id": "creative", "name": "Creative", "description": "Colorful, artistic design"},
            {"id": "academic", "name": "Academic", "description": "Scholarly, research-focused layout"},
            {"id": "modern", "name": "Modern", "description": "Contemporary, minimalist design"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)