# AI Portfolio Service Setup Guide

## Overview
The AI Portfolio Service uses Google Gemini API to generate personalized student portfolios. It includes robust fallback mechanisms to ensure the system works even when AI services are unavailable.

## Setup Instructions

### 1. Get Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
Add to your `.env` file in `college-erp-backend/`:

```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Other required variables
PORT=5001
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=erp_data
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

### 3. Test the AI Service
Run the test script to verify everything works:

```bash
cd college-erp-backend
node test-ai-portfolio.js
```

Expected output:
```
🧪 Testing AI Portfolio Service...

1️⃣ Service Status:
   - AI Enabled: ✅ Yes
   - API Key Present: ✅ Yes

2️⃣ Testing Fallback Portfolio:
   ✅ Fallback portfolio generated successfully
   - Name: Student
   - Department: Computer Science Engineering
   - Skills Count: 5
   - Projects Count: 2

3️⃣ Testing AI Content Generation:
   ✅ AI content generated successfully
   - Personal Summary: Motivated Computer Science student with strong...
   - Technical Skills: 5
   - Projects: 3

4️⃣ Testing Full Portfolio Generation:
   ✅ Portfolio generation completed
   - Success: true
   - AI Generated: Yes
   - Fallback: No
   - Generated At: 2024-01-15T10:30:00.000Z
   - Student Name: Student
   - Skills: 5 technical
   - Projects: 3

🏁 Test completed!
```

## Features

### AI-Powered Portfolio Generation
- **Personal Summary**: Professional, compelling descriptions
- **Technical Skills**: Department-specific skills with proficiency levels
- **Project Suggestions**: Realistic projects based on academic level
- **Career Objectives**: Aligned with department and interests
- **Achievements**: Academic and extracurricular accomplishments
- **Certifications**: Industry-relevant recommendations

### Fallback System
- **Graceful Degradation**: Works without AI when API is unavailable
- **Default Content**: Professional fallback data for all portfolio sections
- **Error Handling**: Comprehensive error catching and logging
- **Timeout Protection**: 30-second timeout for AI requests

### Data Integration
- **Real Student Data**: Uses actual academic records from database
- **Dynamic Content**: Adapts to student's department, semester, and performance
- **Contextual Generation**: Considers CGPA, attendance, and academic year

## API Endpoints

### Generate Portfolio
```
GET /api/portfolio/generate/:studentId
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "personalInfo": { ... },
    "summary": "...",
    "skills": { ... },
    "projects": [ ... ],
    "achievements": [ ... ],
    "certifications": [ ... ],
    "careerObjective": "...",
    "analytics": { ... }
  },
  "aiGenerated": true,
  "fallback": false,
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Service Status
```
GET /api/portfolio/service-status
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "provider": "Gemini (AIPortfolioService)",
    "features": {
      "portfolioGeneration": true,
      "resumeCreation": true,
      "coverLetterGeneration": true,
      "linkedinOptimization": true,
      "portfolioAnalysis": true,
      "careerGuidance": true
    },
    "fallbackMode": false,
    "lastChecked": "2024-01-15T10:30:00.000Z"
  }
}
```

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Ensure the API key is correctly set in `.env`
   - Restart the server after adding the key

2. **"AI generation timeout"**
   - Check internet connection
   - Verify API key is valid and has quota remaining
   - System will automatically use fallback data

3. **"No valid JSON found in AI response"**
   - AI service may be experiencing issues
   - System will automatically use fallback data
   - Check Google AI Studio status

4. **Portfolio shows fallback data**
   - This is normal when AI is unavailable
   - Fallback data is still professional and useful
   - Check console logs for specific error messages

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

This will show detailed error messages and API responses.

## Performance Notes

- **AI Generation Time**: 2-5 seconds for full portfolio
- **Fallback Time**: <1 second
- **Timeout**: 30 seconds maximum
- **Caching**: Consider implementing response caching for production

## Security Considerations

- **API Key Protection**: Never commit API keys to version control
- **Rate Limiting**: Implement rate limiting for portfolio generation
- **Input Validation**: All student data is validated before AI processing
- **Error Handling**: No sensitive data is exposed in error messages
