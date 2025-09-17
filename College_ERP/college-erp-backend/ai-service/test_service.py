#!/usr/bin/env python3
"""
Test script for College ERP AI Service
"""

import asyncio
import json
from simple_ai_chatbot import SimpleAIChatbot
from simple_portfolio_generator import SimplePortfolioGenerator

async def test_chatbot():
    """Test the AI chatbot functionality"""
    print("=" * 50)
    print("Testing AI Chatbot")
    print("=" * 50)
    
    chatbot = SimpleAIChatbot()
    
    test_messages = [
        "Hello!",
        "What are the library timings?",
        "How can I apply for admission?",
        "Tell me about the courses available",
        "What are the fees for Computer Science?",
        "Help me with placement information"
    ]
    
    for message in test_messages:
        print(f"\nUser: {message}")
        response = await chatbot.generate_response(message, user_id="test_user")
        print(f"AI: {response['response'][:200]}...")
    
    print("\n✓ Chatbot tests completed successfully!")

async def test_portfolio_generator():
    """Test the portfolio generator functionality"""
    print("\n" + "=" * 50)
    print("Testing Portfolio Generator")
    print("=" * 50)
    
    portfolio_gen = SimplePortfolioGenerator()
    
    # Create a mock student record
    class MockStudentRecord:
        def __init__(self):
            self.student_id = "CS2021001"
            self.name = "John Doe"
            self.course = "Computer Science"
            self.semester = 6
            self.grades = {
                "Data Structures": "A",
                "Database Systems": "A-",
                "Web Development": "A+",
                "Machine Learning": "B+"
            }
            self.projects = [
                {
                    "title": "E-commerce Website",
                    "description": "Full-stack web application using React and Node.js",
                    "technologies": ["React", "Node.js", "MongoDB", "Express"]
                },
                {
                    "title": "Machine Learning Classifier",
                    "description": "Image classification using CNN",
                    "technologies": ["Python", "TensorFlow", "OpenCV"]
                }
            ]
            self.achievements = [
                "Dean's List - Fall 2023",
                "Best Project Award - Web Development Course",
                "Hackathon Winner - TechFest 2023"
            ]
            self.skills = [
                "JavaScript", "Python", "React", "Node.js", 
                "MongoDB", "Machine Learning", "Git", "AWS"
            ]
            self.extracurricular = [
                {
                    "activity": "Computer Science Society",
                    "role": "Vice President",
                    "duration": "2023-2024"
                }
            ]
    
    mock_student = MockStudentRecord()
    
    # Test different templates
    templates = ["professional", "creative", "academic", "modern"]
    
    for template in templates:
        print(f"\nGenerating {template} template...")
        portfolio = await portfolio_gen.generate_portfolio(mock_student, template)
        
        print(f"Summary: {portfolio['summary'][:150]}...")
        print(f"Highlights: {len(portfolio['highlights'])} items")
        print(f"HTML Length: {len(portfolio['portfolio_html'])} characters")
        
        # Save a sample portfolio
        if template == "professional":
            with open(f"sample_portfolio_{template}.html", "w", encoding="utf-8") as f:
                f.write(portfolio['portfolio_html'])
            print(f"✓ Sample portfolio saved as sample_portfolio_{template}.html")
    
    print("\n✓ Portfolio generator tests completed successfully!")

async def main():
    """Main test function"""
    print("College ERP AI Service - Testing Suite")
    print("=" * 60)
    
    try:
        await test_chatbot()
        await test_portfolio_generator()
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed successfully!")
        print("The AI service is ready for integration.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)