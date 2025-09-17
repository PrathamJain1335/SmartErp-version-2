const XAIService = require('./XAIService');
const MockAIService = require('./MockAIService');

class HybridAIService {
  constructor(apiKey) {
    this.xaiService = new XAIService(apiKey);
    this.mockService = new MockAIService(apiKey);
    this.useRealAI = false; // Start with mock until xAI is verified
    this.lastXAITest = null;
    
    if (apiKey) {
      // Test xAI API availability
      this.testXAIAvailability();
    }
    
    console.log('🤖 Hybrid AI Service initialized (xAI Grok + Mock fallback)');
  }

  async testXAIAvailability() {
    try {
      // Simple test call to xAI
      const testResponse = await this.xaiService.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok." },
          { role: "user", content: "Test" }
        ],
        max_tokens: 5
      });
      
      if (testResponse && testResponse.choices) {
        this.useRealAI = true;
        this.lastXAITest = new Date();
        console.log('✅ xAI Grok is available and will be used for AI features');
      }
    } catch (error) {
      console.log('⚠️ xAI API not available (likely no credits), using enhanced mock responses');
      if (error.response?.status === 403) {
        console.log('💳 To enable real xAI features, add credits at: https://console.x.ai/');
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
      provider: this.useRealAI ? 'xAI Grok' : 'Mock (Enhanced)',
      lastXAITest: this.lastXAITest
    };
  }

  // Retry xAI if it failed before
  async retryXAI() {
    if (!this.useRealAI) {
      console.log('🔄 Retrying xAI API availability...');
      await this.testXAIAvailability();
    }
    return this.useRealAI;
  }

  // Main chatbot response method
  async getChatbotResponse(message, userContext = {}) {
    // Try xAI first if available, otherwise use mock
    if (this.useRealAI) {
      try {
        const response = await this.xaiService.getChatbotResponse(message, userContext);
        // If xAI response contains error indicators, fall back to mock
        if (response.includes('Authentication failed') || response.includes('rate limit exceeded')) {
          console.log('⚠️ xAI API issue detected, falling back to mock service');
          this.useRealAI = false;
          return this.mockService.getChatbotResponse(message, userContext);
        }
        return response;
      } catch (error) {
        console.error('xAI API failed, falling back to mock:', error.message);
        this.useRealAI = false;
        return this.mockService.getChatbotResponse(message, userContext);
      }
    }
    
    // Use mock service with enhanced responses
    const mockResponse = await this.mockService.getChatbotResponse(message, userContext);
    
    // Add indicator that this is using mock data
    const footer = "\n\n*🤖 AI Response (Demo Mode - Add xAI credits for real-time analysis)*";
    return mockResponse + footer;
  }

  // All other methods delegate to the appropriate service
  async analyzeAttendancePatterns(studentId) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.analyzeAttendancePatterns(studentId);
      } catch (error) {
        console.error('xAI attendance analysis failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.analyzeAttendancePatterns(studentId);
  }

  async predictAcademicPerformance(studentId) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.predictAcademicPerformance(studentId);
      } catch (error) {
        console.error('xAI academic prediction failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.predictAcademicPerformance(studentId);
  }

  async analyzePlacementProbability(studentData) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.analyzePlacementProbability(studentData);
      } catch (error) {
        console.error('xAI placement analysis failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.analyzePlacementProbability(studentData);
  }

  async analyzeBehaviorPattern(disciplinaryData) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.analyzeBehaviorPattern(disciplinaryData);
      } catch (error) {
        console.error('xAI behavior analysis failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.analyzeBehaviorPattern(disciplinaryData);
  }

  async generateReportSummary(reportData, reportType) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.generateReportSummary(reportData, reportType);
      } catch (error) {
        console.error('xAI report summary failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.generateReportSummary(reportData, reportType);
  }

  async generatePersonalizedRecommendations(userRole, userData, context) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.generatePersonalizedRecommendations(userRole, userData, context);
      } catch (error) {
        console.error('xAI recommendations failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.generatePersonalizedRecommendations(userRole, userData, context);
  }

  async isERPRelated(query) {
    if (this.useRealAI) {
      try {
        return await this.xaiService.isERPRelated(query);
      } catch (error) {
        console.error('xAI ERP relevance check failed:', error.message);
        this.useRealAI = false;
      }
    }
    return this.mockService.isERPRelated(query);
  }

  // Method to manually switch to xAI (useful when credits are added)
  async switchToXAI() {
    console.log('🔄 Attempting to switch to xAI Grok...');
    await this.testXAIAvailability();
    if (this.useRealAI) {
      console.log('✅ Successfully switched to xAI Grok');
      return true;
    } else {
      console.log('❌ xAI still not available, staying with mock service');
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