const GeminiAIService = require('./GeminiAIService');
const MockAIService = require('./MockAIService');

class HybridAIService {
  constructor(apiKey) {
    this.geminiService = new GeminiAIService(apiKey);
    this.mockService = new MockAIService(apiKey);
    this.useRealAI = false; // Start with mock until Gemini is verified
    this.lastGeminiTest = null;
    
    if (apiKey) {
      // Test Gemini API availability asynchronously without blocking startup
      this.testGeminiAvailability().catch(error => {
        console.log('⚠️ Initial Gemini test failed during startup:', error.message);
      });
    }
    
    console.log('🤖 Hybrid AI Service initialized (Gemini + Mock fallback)');
  }

  async testGeminiAvailability() {
    try {
      // Simple test call to Gemini
      const testResponse = await this.geminiService.getChatbotResponse('Hello', {
        userId: 'test-user',
        role: 'student',
        context: 'test'
      });
      
      if (testResponse && !testResponse.includes('AI features are currently disabled') && !testResponse.includes('temporarily unavailable')) {
        this.useRealAI = true;
        this.lastGeminiTest = new Date();
        console.log('✅ Gemini AI is available and will be used for AI features');
      } else {
        console.log('⚠️ Gemini API responded but with fallback content - using mock responses');
        this.useRealAI = false;
      }
    } catch (error) {
      this.useRealAI = false;
      console.log('⚠️ Gemini API not available, using enhanced mock responses');
      if (error.message?.includes('API key')) {
        console.log('🔑 To enable real Gemini features, check your API key configuration');
      }
    }
  }

  // Check if AI service is enabled
  isEnabled() {
    return true; // Always enabled (either real or mock)
  }

  // Get service status for debugging
  getStatus() {
    return {
      enabled: true,
      useRealAI: this.useRealAI,
      provider: this.useRealAI ? 'Gemini AI' : 'Mock (Enhanced)',
      lastGeminiTest: this.lastGeminiTest
    };
  }

  // Retry Gemini if it failed before
  async retryGemini() {
    if (!this.useRealAI) {
      console.log('🔄 Retrying Gemini API availability...');
      await this.testGeminiAvailability();
    }
    return this.useRealAI;
  }

  // Main chatbot response method
  async getChatbotResponse(message, userContext = {}) {
    // Try Gemini first if available, otherwise use mock
    if (this.useRealAI) {
      try {
        const response = await this.geminiService.getChatbotResponse(message, userContext);
        // If Gemini response contains error indicators, fall back to mock
        if (response.includes('Authentication failed') || response.includes('quota exceeded')) {
          console.log('⚠️ Gemini API issue detected, falling back to mock service');
          this.useRealAI = false;
          return this.mockService.getChatbotResponse(message, userContext);
        }
        return response;
      } catch (error) {
        console.error('Gemini API failed, falling back to mock:', error.message);
        this.useRealAI = false;
        return this.mockService.getChatbotResponse(message, userContext);
      }
    }
    
    // Use mock service with enhanced responses
    const mockResponse = await this.mockService.getChatbotResponse(message, userContext);
    
    // Add indicator that this is using mock data
    const footer = "\n\n*🤖 AI Response (Demo Mode - Connect Gemini for real-time analysis)*";
    return mockResponse + footer;
  }

  // All other methods delegate to the appropriate service
  async analyzeAttendancePatterns(studentId) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.analyzeAttendancePatterns(studentId);
      } catch (error) {
        console.error('Gemini attendance analysis failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.analyzeAttendancePatterns(studentId);
  }

  async predictAcademicPerformance(studentId) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.predictAcademicPerformance(studentId);
      } catch (error) {
        console.error('Gemini academic prediction failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.predictAcademicPerformance(studentId);
  }

  async analyzePlacementProbability(studentData) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.analyzePlacementProbability(studentData);
      } catch (error) {
        console.error('Gemini placement analysis failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.analyzePlacementProbability(studentData);
  }

  async analyzeBehaviorPattern(disciplinaryData) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.analyzeBehaviorPattern(disciplinaryData);
      } catch (error) {
        console.error('Gemini behavior analysis failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.analyzeBehaviorPattern(disciplinaryData);
  }

  async generateReportSummary(reportData, reportType) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.generateReportSummary(reportData, reportType);
      } catch (error) {
        console.error('Gemini report summary failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.generateReportSummary(reportData, reportType);
  }

  async generatePersonalizedRecommendations(userRole, userData, context) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.generatePersonalizedRecommendations(userRole, userData, context);
      } catch (error) {
        console.error('Gemini recommendations failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.generatePersonalizedRecommendations(userRole, userData, context);
  }

  async isERPRelated(query) {
    if (this.useRealAI) {
      try {
        return await this.geminiService.isERPRelated(query);
      } catch (error) {
        console.error('Gemini ERP relevance check failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.isERPRelated(query);
  }

  // Method to manually switch to Gemini (useful when API key is fixed)
  async switchToGemini() {
    console.log('🔄 Attempting to switch to Gemini AI...');
    await this.testGeminiAvailability();
    if (this.useRealAI) {
      console.log('✅ Successfully switched to Gemini AI');
      return true;
    } else {
      console.log('❌ Gemini still not available, staying with mock service');
      return false;
    }
  }

  // Method to manually switch to mock (useful for testing)
  switchToMock() {
    console.log('🔄 Switching to mock AI service');
    this.useRealAI = false;
  }
}

module.exports = HybridAIService;