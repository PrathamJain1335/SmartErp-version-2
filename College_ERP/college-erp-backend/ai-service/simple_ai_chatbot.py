import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
import re

class SimpleAIChatbot:
    def __init__(self):
        self.conversations = {}  # In-memory storage for conversations
        self.is_initialized = True  # Always ready since we're using rule-based responses
        
        # College-specific context and knowledge base
        self.college_context = {
            "courses": ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"],
            "departments": ["CSE", "ECE", "ME", "CE", "EE"],
            "facilities": ["Library", "Labs", "Cafeteria", "Sports Complex", "Auditorium"],
            "services": ["Admission", "Examination", "Placement", "Library", "Transport"],
            "timings": {
                "library": "8 AM to 8 PM on weekdays, 9 AM to 5 PM on weekends",
                "office": "9 AM to 5 PM on weekdays",
                "labs": "9 AM to 6 PM on weekdays",
                "cafeteria": "7 AM to 9 PM daily"
            },
            "contact": {
                "admission": "+91-XXXX-XXXXXX",
                "examination": "+91-XXXX-XXXXXX",
                "placement": "+91-XXXX-XXXXXX",
                "main": "+91-XXXX-XXXXXX"
            }
        }
        
        # Enhanced response patterns
        self.response_patterns = self._initialize_response_patterns()
        
        print("Simple AI chatbot initialized successfully!")
    
    def _initialize_response_patterns(self) -> Dict[str, List[str]]:
        """Initialize comprehensive response patterns"""
        return {
            "greeting": [
                "Hello! I'm your college AI assistant. I can help you with information about admissions, courses, facilities, examinations, and other college-related queries. How can I assist you today?",
                "Hi there! Welcome to our college AI assistant. I'm here to help you with any questions about our institution. What would you like to know?",
                "Greetings! I'm here to provide information about our college. Feel free to ask me about courses, admissions, facilities, or any other college-related topics."
            ],
            "admission": [
                "For admission inquiries, please visit our admission office or check our college website for the latest admission criteria, dates, and procedures. You can also contact our admission helpline at {} for personalized assistance.",
                "Admission process typically involves application submission, entrance examination (if applicable), and document verification. Visit our admission office for detailed information and current deadlines.",
                "Our admission team is available to guide you through the entire process. Please bring your academic transcripts and required documents when visiting the admission office."
            ],
            "fees": [
                "For fee-related queries, please contact the accounts department. Fee structure varies by course and semester. Payment can be made online through our student portal or at the accounts office.",
                "Fee details are course-specific. Our accounts office provides detailed fee structure, scholarship information, and payment options. They're open from 9 AM to 5 PM on weekdays.",
                "We offer various payment plans and scholarship opportunities. Contact the accounts department for personalized fee information and available financial assistance."
            ],
            "library": [
                "Our library is open from {} and offers extensive digital and physical resources. Please carry your student ID for entry.",
                "The library features study spaces, digital resources, research databases, and borrowing facilities. Quiet study areas and group discussion rooms are available.",
                "Library services include book borrowing, digital access, printing facilities, and research assistance. Our librarians are available to help with research queries."
            ],
            "examination": [
                "Examination schedules and results are available on the student portal. For any discrepancies or queries regarding results, please contact the examination department within the stipulated time frame.",
                "The examination office handles all assessment-related matters including timetables, hall tickets, result processing, and transcript issuance.",
                "For examination queries, visit the examination office with your student ID. They assist with result clarifications, re-evaluation requests, and transcript requests."
            ],
            "placement": [
                "The placement cell actively works with industry partners to provide job opportunities. Regular training sessions, mock interviews, and career guidance are provided.",
                "Our placement team conducts workshops on resume building, interview skills, and industry trends. Visit the placement office for registration and current opportunities.",
                "Placement activities include campus recruitment drives, internship coordination, and career counseling. Students are encouraged to register early and participate in skill development programs."
            ],
            "courses": [
                "We offer various undergraduate and postgraduate courses across multiple departments including {}. Course details, syllabus, and curriculum information are available in the academic section of our website.",
                "Our academic departments provide comprehensive programs with modern curriculum and practical exposure. Each course is designed to meet industry requirements.",
                "Course selection guidance is available through academic counselors. They help students choose suitable specializations based on their interests and career goals."
            ],
            "facilities": [
                "Our campus features modern facilities including {}, well-equipped classrooms, and recreational areas.",
                "Campus facilities are designed to support academic excellence and student well-being. All facilities are accessible and regularly maintained.",
                "We provide state-of-the-art infrastructure including technology-enabled classrooms, research labs, and student amenities."
            ],
            "help": [
                "I'm here to help! I can provide information about:\\n• Admissions and fees\\n• Courses and curriculum\\n• Examinations and results\\n• Library and facilities\\n• Placement and careers\\n• General college information\\n\\nWhat would you like to know?",
                "I can assist you with various college-related topics. Ask me about admissions, courses, facilities, examination schedules, placement opportunities, or any other college information.",
                "My knowledge covers all aspects of college life including academics, facilities, student services, and administrative procedures. Feel free to ask specific questions!"
            ],
            "default": [
                "I understand you're asking about college-related matters. While I try my best to help, for specific or detailed queries, please contact the relevant department directly. Is there anything else I can help you with?",
                "For detailed information on this topic, I recommend contacting the appropriate department directly. They can provide the most up-to-date and specific information you need.",
                "I'd be happy to help with general information. For detailed or specific queries, please reach out to the concerned department for accurate assistance."
            ]
        }
    
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
        
        # Generate response using enhanced pattern matching
        response_text = self._generate_enhanced_response(message, conversation_id)
        
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
    
    def _generate_enhanced_response(self, message: str, conversation_id: str) -> str:
        """Generate enhanced response using improved pattern matching"""
        message_lower = message.lower()
        
        # Analyze message context
        context = self._analyze_message_context(message_lower)
        
        # Check for greetings
        if any(greeting in message_lower for greeting in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]):
            return self._get_random_response("greeting")
        
        # Check for help requests
        if any(help_word in message_lower for help_word in ["help", "assist", "support", "guide"]):
            return self._get_random_response("help")
        
        # Context-based responses
        if context["admission"]:
            response = self._get_random_response("admission")
            if "{}" in response:
                return response.format(self.college_context["contact"]["admission"])
            return response
        
        if context["fees"]:
            return self._get_random_response("fees")
        
        if context["library"]:
            response = self._get_random_response("library")
            if "{}" in response:
                return response.format(self.college_context["timings"]["library"])
            return response
        
        if context["examination"]:
            return self._get_random_response("examination")
        
        if context["placement"]:
            return self._get_random_response("placement")
        
        if context["courses"]:
            response = self._get_random_response("courses")
            if "{}" in response:
                return response.format(", ".join(self.college_context["courses"]))
            return response
        
        if context["facilities"]:
            response = self._get_random_response("facilities")
            if "{}" in response:
                return response.format(", ".join(self.college_context["facilities"]))
            return response
        
        # Handle specific queries about timings
        if "timing" in message_lower or "time" in message_lower or "open" in message_lower or "close" in message_lower:
            return self._handle_timing_query(message_lower)
        
        # Handle contact information queries
        if "contact" in message_lower or "phone" in message_lower or "number" in message_lower:
            return self._handle_contact_query(message_lower)
        
        # Default response with some personalization
        return self._get_personalized_default_response(message, conversation_id)
    
    def _analyze_message_context(self, message: str) -> Dict[str, bool]:
        """Analyze message to determine context"""
        return {
            "admission": any(word in message for word in ["admission", "admit", "apply", "application", "join", "enroll"]),
            "fees": any(word in message for word in ["fee", "fees", "payment", "cost", "amount", "money", "pay"]),
            "library": any(word in message for word in ["library", "book", "books", "study", "reading"]),
            "examination": any(word in message for word in ["exam", "examination", "result", "grade", "marks", "test", "assessment"]),
            "placement": any(word in message for word in ["placement", "job", "career", "interview", "company", "recruit"]),
            "courses": any(word in message for word in ["course", "courses", "subject", "curriculum", "program", "degree"]),
            "facilities": any(word in message for word in ["facility", "facilities", "campus", "infrastructure", "amenities"])
        }
    
    def _handle_timing_query(self, message: str) -> str:
        """Handle specific timing queries"""
        if "library" in message:
            return f"The library is open {self.college_context['timings']['library']}. Please carry your student ID for entry."
        elif "office" in message:
            return f"Office hours are {self.college_context['timings']['office']}. Please visit during these hours for administrative work."
        elif "lab" in message:
            return f"Laboratory access is available {self.college_context['timings']['labs']}. Specific lab timings may vary by department."
        elif "cafeteria" in message:
            return f"Our cafeteria operates {self.college_context['timings']['cafeteria']}, offering various meal options throughout the day."
        else:
            return "Our main facilities operate from 9 AM to 5 PM on weekdays. Specific timings may vary for different services. Please ask about a particular facility for exact timings."
    
    def _handle_contact_query(self, message: str) -> str:
        """Handle contact information queries"""
        if "admission" in message:
            return f"For admission queries, contact our admission office at {self.college_context['contact']['admission']} or visit during office hours."
        elif "examination" in message or "result" in message:
            return f"For examination-related queries, contact the examination office at {self.college_context['contact']['examination']}."
        elif "placement" in message or "job" in message:
            return f"For placement and career guidance, reach out to our placement cell at {self.college_context['contact']['placement']}."
        else:
            return f"For general inquiries, you can contact our main office at {self.college_context['contact']['main']} or visit the information desk on campus."
    
    def _get_random_response(self, category: str) -> str:
        """Get a random response from the specified category"""
        import random
        responses = self.response_patterns.get(category, self.response_patterns["default"])
        return random.choice(responses)
    
    def _get_personalized_default_response(self, message: str, conversation_id: str) -> str:
        """Generate a personalized default response"""
        conversation = self.conversations.get(conversation_id, {})
        message_count = len(conversation.get("messages", []))
        
        if message_count > 4:  # Longer conversation
            return "I appreciate your continued questions! While I aim to be helpful, for detailed or technical queries, please consider contacting the specific department directly. They can provide the most accurate and up-to-date information. Is there anything else I can help you with today?"
        else:
            return self._get_random_response("default")
    
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