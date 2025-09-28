# JECRC ERP - AI Portfolio System Setup Guide

This guide will help you set up and test the AI-powered portfolio generation system that has been integrated with Gemini AI.

## 🚀 Quick Start

### 1. Database Migration
First, run the database migration to add portfolio-related fields:

```bash
cd college-erp-backend
node scripts/run-portfolio-migration.js
```

### 2. Environment Configuration
Add your Gemini AI API key to the `.env` file:

```bash
# Add to college-erp-backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy it to your `.env` file

### 3. Test the System
Run the comprehensive test suite:

```bash
node scripts/test-complete-portfolio.js
```

### 4. Start the Backend Server
```bash
npm start
# Server will run on http://localhost:5001
```

## 📊 Database Schema Changes

The migration adds these fields to the `student` table:

### Portfolio Data Fields
- `skills` (JSON) - Technical and soft skills
- `projects` (JSON) - Student projects with descriptions
- `achievements` (JSON) - Awards and accomplishments  
- `certifications` (JSON) - Professional certifications
- `extracurricular` (JSON) - Activities and clubs
- `internships` (JSON) - Work experience

### Portfolio System Fields
- `portfolioData` (JSON) - Cached AI-generated portfolio
- `portfolioLastGenerated` (DATE) - Last generation timestamp
- `careerGoals` (TEXT) - Student career objectives
- `linkedinProfile` (STRING) - LinkedIn URL
- `githubProfile` (STRING) - GitHub URL
- `personalWebsite` (STRING) - Personal website URL

### Faculty Enhancement Fields
- `researchAreas` (JSON) - Faculty research interests
- `industryExperience` (JSON) - Previous industry work
- `mentorshipPreferences` (JSON) - Mentorship capabilities

## 🎯 API Endpoints

### Portfolio Generation
- `GET /api/portfolio/generate/:studentId` - Generate AI portfolio
- `POST /api/portfolio/resume/:studentId` - Generate resume
- `POST /api/portfolio/cover-letter/:studentId` - Generate cover letter
- `GET /api/portfolio/linkedin/:studentId` - Generate LinkedIn profile
- `POST /api/portfolio/analyze/:studentId` - Analyze portfolio strength
- `GET /api/portfolio/career-guidance/:studentId` - Get career guidance
- `GET /api/portfolio/service-status` - Check AI service status
- `POST /api/portfolio/download` - Log portfolio downloads

### Authentication
All endpoints require Bearer token authentication except:
- `career-guidance` (temporarily open for testing)
- `service-status` (requires authentication in production)

## 🤖 AI Integration

### Gemini AI Features
- **Smart Content Generation**: Analyzes student data to create personalized content
- **Career Path Analysis**: Provides placement probability and career recommendations
- **Skills Gap Analysis**: Identifies areas for improvement
- **Industry Insights**: Current market trends and demands

### Fallback System
- **Automatic Fallback**: If Gemini AI is unavailable, uses template-based generation
- **Error Handling**: Graceful degradation with meaningful error messages
- **Data Persistence**: Caches results to reduce API calls

## 🎨 Frontend Integration

### Portfolio Section Access
1. **Sidebar Navigation**: Click "Portfolio" in the student portal sidebar
2. **Career Section**: Access via "AI Portfolio Generation" in the Career tab
3. **Direct Generation**: Use "Generate AI Portfolio" button

### Features
- **Interactive Visualizations**: Charts showing skills, projects, and growth
- **Download Options**: Export as PNG or PDF
- **Real-time Generation**: Live progress indicators
- **Responsive Design**: Works on all device sizes

## 🧪 Testing Checklist

### Backend Testing
- [ ] Run database migration successfully
- [ ] Verify all portfolio fields exist in database
- [ ] Test AI portfolio generation with real student data
- [ ] Verify fallback mode works without API key
- [ ] Check career guidance endpoint functionality
- [ ] Test authentication on all endpoints

### Frontend Testing
- [ ] Login as a student user
- [ ] Navigate to Portfolio section from sidebar
- [ ] Click "Generate AI Portfolio" button
- [ ] Verify loading animation appears
- [ ] Check generated portfolio contains all sections
- [ ] Test portfolio download functionality
- [ ] Try Career section portfolio generation
- [ ] Test on different screen sizes

### Integration Testing
- [ ] Verify frontend API calls reach backend
- [ ] Check authentication tokens are passed correctly
- [ ] Ensure error handling works properly
- [ ] Test with missing/null student data
- [ ] Verify portfolio data is cached in database

## 🛠️ Troubleshooting

### Common Issues

#### "Portfolio fields not found in database"
```bash
# Run the migration
node scripts/run-portfolio-migration.js
```

#### "Gemini API key not configured"
```bash
# Add to .env file
GEMINI_API_KEY=your_key_here
```

#### "Student not found" error
```bash
# Check database has student records
# Ensure Student_ID parameter matches database
```

#### Frontend can't connect to backend
```bash
# Verify backend is running on port 5001
# Check CORS configuration
# Ensure API endpoints return proper responses
```

### Debug Mode
Enable detailed logging:
```bash
# Add to .env
NODE_ENV=development
DEBUG=true
```

## 📈 Performance Optimization

### Caching Strategy
- Portfolio data is cached in database after generation
- Cache invalidated on student data updates
- Reduces API calls and improves response times

### Rate Limiting
- AI API calls are rate-limited to prevent quota exhaustion
- Fallback mode activates automatically on rate limits
- User feedback provided for all limitations

### Error Recovery
- Graceful degradation on AI service failures
- Retry logic for temporary network issues
- Comprehensive error logging for debugging

## 🔐 Security Considerations

### Authentication
- All portfolio endpoints require valid JWT tokens
- Students can only access their own portfolios
- Faculty can access students in their sections
- Admins have full access

### Data Privacy
- Sensitive student data is excluded from AI processing
- Generated portfolios don't include private information
- Download logging for audit trails

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Run the test suite to identify problems
3. Check server logs for detailed error messages
4. Ensure all environment variables are configured

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ Database migration completed
- ✅ All portfolio API endpoints responding  
- ✅ AI portfolio generation working (or fallback active)
- ✅ Frontend portfolio section functional
- ✅ Download functionality working
- ✅ Career guidance providing recommendations

The system is now ready for production use!