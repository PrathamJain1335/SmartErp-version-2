import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from pathlib import Path

class AIChatbot:
    def __init__(self):
        self.model_name = "microsoft/DialoGPT-medium"  # Lightweight conversational model
        self.tokenizer = None
        self.model = None
        self.generator = None
        self.conversations = {}  # In-memory storage for conversations
        self.is_initialized = False
        
        # College-specific context and knowledge base
        self.college_context = {
            "courses": ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"],
            "departments": ["CSE", "ECE", "ME", "CE", "EE"],
            "facilities": ["Library", "Labs", "Cafeteria", "Sports Complex", "Auditorium"],
            "services": ["Admission", "Examination", "Placement", "Library", "Transport"]
        }
        
        # Initialize the model asynchronously
        asyncio.create_task(self._initialize_model())
    
    async def _initialize_model(self):
        """Initialize the AI model in the background"""
        try:
            print("Initializing AI chatbot model...")
            
            # Use a lightweight model that doesn't require API keys
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
            
            # Add padding token if it doesn't exist
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Create text generation pipeline
            self.generator = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if torch.cuda.is_available() else -1,
                max_length=512,
                do_sample=True,
                temperature=0.7,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            self.is_initialized = True
            print("AI chatbot model initialized successfully!")
            
        except Exception as e:
            print(f"Error initializing model: {e}")
            # Fallback to simple rule-based responses
            self.is_initialized = False
    
    def is_ready(self) -> bool:
        """Check if the AI model is ready"""
        return self.is_initialized
    
    async def generate_response(self, message: str, user_id: Optional[str] = None, conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate AI response to user message"""
        
        # Create conversation ID if not provided
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
        
        # Initialize conversation if it doesn't exist
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = {
                "id": conversation_id,
                "user_id": user_id,
                "messages": [],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        
        # Add user message to conversation
        self.conversations[conversation_id]["messages"].append({
            "role": "user",
            "content": message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Generate response
        if self.is_initialized and self.generator:
            try:
                response_text = await self._generate_ai_response(message, conversation_id)
            except Exception as e:
                print(f"Error generating AI response: {e}")
                response_text = self._generate_fallback_response(message)
        else:
            response_text = self._generate_fallback_response(message)
        
        # Add AI response to conversation
        self.conversations[conversation_id]["messages"].append({
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.now().isoformat()
        })
        
        # Update conversation timestamp
        self.conversations[conversation_id]["updated_at"] = datetime.now().isoformat()
        
        return {
            "response": response_text,
            "conversation_id": conversation_id,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _generate_ai_response(self, message: str, conversation_id: str) -> str:
        """Generate response using the AI model"""
        try:
            # Get conversation context
            conversation = self.conversations.get(conversation_id, {})
            messages = conversation.get("messages", [])
            
            # Build context from recent messages
            context = ""
            recent_messages = messages[-6:]  # Last 6 messages for context
            for msg in recent_messages:
                if msg["role"] == "user":
                    context += f"User: {msg['content']}\n"
                else:
                    context += f"Assistant: {msg['content']}\n"
            
            # Add college-specific context
            enhanced_message = self._enhance_message_with_context(message)
            
            # Generate response using the model
            inputs = self.tokenizer.encode(context + f"User: {enhanced_message}\nAssistant:", return_tensors="pt")
            
            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_length=inputs.shape[1] + 100,
                    do_sample=True,
                    temperature=0.7,
                    pad_token_id=self.tokenizer.eos_token_id,
                    num_return_sequences=1
                )
            
            # Decode response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the assistant's response
            response_parts = response.split("Assistant:")
            if len(response_parts) > 1:
                ai_response = response_parts[-1].strip()
                # Clean up the response
                ai_response = ai_response.split("User:")[0].strip()
                return ai_response[:500]  # Limit response length
            else:
                return self._generate_fallback_response(message)
                
        except Exception as e:
            print(f"Error in AI generation: {e}")
            return self._generate_fallback_response(message)
    
    def _enhance_message_with_context(self, message: str) -> str:
        """Enhance message with college-specific context"""
        message_lower = message.lower()
        
        # Add relevant context based on message content
        context_additions = []
        
        if any(course.lower() in message_lower for course in self.college_context["courses"]):
            context_additions.append("This is about academic courses at our college.")
        
        if any(facility.lower() in message_lower for facility in self.college_context["facilities"]):
            context_additions.append("This relates to college facilities and services.")
        
        if "admission" in message_lower or "fee" in message_lower:
            context_additions.append("This is an admission or fee-related query.")
        
        if "exam" in message_lower or "grade" in message_lower or "result" in message_lower:
            context_additions.append("This is about examinations or academic performance.")
        
        enhanced_message = message
        if context_additions:
            enhanced_message = f"{' '.join(context_additions)} {message}"
        
        return enhanced_message
    
    def _generate_fallback_response(self, message: str) -> str:
        """Generate rule-based fallback response"""
        message_lower = message.lower()
        
        # College-specific responses
        if "admission" in message_lower:
            return "For admission inquiries, please visit the admission office or check our college website for the latest admission criteria, dates, and procedures. You can also contact the admission helpline for personalized assistance."
        
        elif "fee" in message_lower or "payment" in message_lower:
            return "For fee-related queries, please contact the accounts department. Fee structure varies by course and semester. Payment can be made online through our student portal or at the accounts office."
        
        elif "exam" in message_lower or "result" in message_lower:
            return "Examination schedules and results are available on the student portal. For any discrepancies or queries regarding results, please contact the examination department within the stipulated time frame."
        
        elif "library" in message_lower:
            return "Our library is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends. You can access digital resources, borrow books, and use study spaces. Please carry your student ID for entry."
        
        elif "placement" in message_lower or "job" in message_lower or "career" in message_lower:
            return "The placement cell actively works with industry partners to provide job opportunities. Regular training sessions, mock interviews, and career guidance are provided. Visit the placement office for registration and updates."
        
        elif "course" in message_lower or "subject" in message_lower:
            return "We offer various undergraduate and postgraduate courses across multiple departments. Course details, syllabus, and curriculum information are available in the academic section of our website."
        
        elif "hello" in message_lower or "hi" in message_lower or "hey" in message_lower:
            return "Hello! I'm your college AI assistant. I can help you with information about admissions, courses, facilities, examinations, and other college-related queries. How can I assist you today?"
        
        elif "help" in message_lower:
            return "I'm here to help! I can provide information about:\n• Admissions and fees\n• Courses and curriculum\n• Examinations and results\n• Library and facilities\n• Placement and careers\n• General college information\n\nWhat would you like to know?"
        
        else:
            return "I understand you're asking about college-related matters. While I try my best to help, for specific or detailed queries, please contact the relevant department directly. Is there anything else I can help you with?"
    
    async def get_user_conversations(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all conversations for a specific user"""
        user_conversations = []
        for conv_id, conv_data in self.conversations.items():
            if conv_data.get("user_id") == user_id:
                # Return conversation summary
                summary = {
                    "id": conv_id,
                    "created_at": conv_data["created_at"],
                    "updated_at": conv_data["updated_at"],
                    "message_count": len(conv_data["messages"]),
                    "preview": conv_data["messages"][0]["content"][:100] if conv_data["messages"] else ""
                }
                user_conversations.append(summary)
        
        return sorted(user_conversations, key=lambda x: x["updated_at"], reverse=True)
    
    async def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a specific conversation"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            return True
        return False