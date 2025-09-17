#!/usr/bin/env python3
"""
College ERP AI Service Startup Script
"""

import uvicorn
import sys
import os
import subprocess

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import transformers
        import torch
        print("✓ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def main():
    """Main startup function"""
    print("=" * 50)
    print("College ERP AI Service")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print("Starting AI Service...")
    print("API will be available at: http://localhost:8001")
    print("API Documentation: http://localhost:8001/docs")
    print("Press Ctrl+C to stop the service")
    print("-" * 50)
    
    # Start the FastAPI server
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8001,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nAI Service stopped.")
    except Exception as e:
        print(f"Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()