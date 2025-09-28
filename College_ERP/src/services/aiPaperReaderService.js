// AI Paper Reader Service for Attendance Management
// This service simulates AI-powered reading of paper attendance sheets

class AIPaperReaderService {
  constructor() {
    this.processingDelay = 2000; // 2 seconds simulation delay
  }

  // Simulate OCR processing of uploaded paper attendance image
  async processAttendanceSheet(imageFile, classId, date, prompt = '') {
    console.log('🤖 AI Processing attendance sheet:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      classId,
      date,
      prompt
    });

    // Simulate processing delay
    await this.simulateProcessing();

    // Mock extracted data based on class and prompt
    const mockResults = await this.generateMockResults(classId, prompt);

    return {
      success: true,
      processingTime: this.processingDelay,
      extractedData: mockResults,
      confidence: 0.92,
      metadata: {
        imageSize: imageFile.size,
        fileName: imageFile.name,
        processedAt: new Date().toISOString(),
        aiModel: 'OCR-v3.2.1',
        prompt: prompt
      }
    };
  }

  // Generate mock attendance results
  async generateMockResults(classId, prompt) {
    const mockStudents = [
      { rollNo: 'CSE001', name: 'Aarav Sharma', id: 'JECRC-CSE-21-001' },
      { rollNo: 'CSE002', name: 'Priya Patel', id: 'JECRC-CSE-21-002' },
      { rollNo: 'CSE003', name: 'Rohit Kumar', id: 'JECRC-CSE-21-003' },
      { rollNo: 'CSE004', name: 'Sneha Gupta', id: 'JECRC-CSE-21-004' },
      { rollNo: 'CSE005', name: 'Arjun Singh', id: 'JECRC-CSE-21-005' },
      { rollNo: 'CSE006', name: 'Ananya Das', id: 'JECRC-CSE-21-006' },
      { rollNo: 'CSE007', name: 'Vikram Thakur', id: 'JECRC-CSE-21-007' },
      { rollNo: 'CSE008', name: 'Kavya Mehta', id: 'JECRC-CSE-21-008' },
      { rollNo: 'CSE009', name: 'Ravi Agarwal', id: 'JECRC-CSE-21-009' },
      { rollNo: 'CSE010', name: 'Pooja Jain', id: 'JECRC-CSE-21-010' }
    ];

    // Simulate AI reading with some randomness
    const detectedStudents = mockStudents.map(student => {
      let status = 'present';
      let confidence = 0.95;

      // Simulate some detection variations based on prompt
      if (prompt.toLowerCase().includes('absent')) {
        status = Math.random() > 0.8 ? 'absent' : 'present';
      } else if (prompt.toLowerCase().includes('late')) {
        status = Math.random() > 0.9 ? 'late' : 'present';
      } else {
        // Random attendance pattern
        status = Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late');
      }

      // Simulate confidence variations
      if (status === 'present') {
        confidence = 0.92 + Math.random() * 0.07;
      } else {
        confidence = 0.85 + Math.random() * 0.10;
      }

      return {
        ...student,
        status,
        confidence: parseFloat(confidence.toFixed(3)),
        detectionBox: {
          x: Math.floor(Math.random() * 800),
          y: Math.floor(Math.random() * 600),
          width: 60 + Math.random() * 40,
          height: 20 + Math.random() * 10
        }
      };
    });

    return {
      totalStudents: detectedStudents.length,
      present: detectedStudents.filter(s => s.status === 'present').length,
      absent: detectedStudents.filter(s => s.status === 'absent').length,
      late: detectedStudents.filter(s => s.status === 'late').length,
      students: detectedStudents,
      extractedText: this.generateExtractedText(detectedStudents),
      processingNotes: [
        'Successfully detected student roll numbers',
        'Applied attendance status based on AI analysis',
        prompt ? `Custom prompt applied: "${prompt}"` : 'Default processing applied',
        `Detection confidence: ${Math.round(detectedStudents.reduce((acc, s) => acc + s.confidence, 0) / detectedStudents.length * 100)}%`
      ]
    };
  }

  // Generate mock extracted text from the paper
  generateExtractedText(students) {
    let text = 'ATTENDANCE SHEET\n';
    text += '================\n';
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `Class: Computer Science Engineering\n\n`;
    text += 'ROLL NO. | NAME | STATUS\n';
    text += '---------|------|-------\n';
    
    students.forEach(student => {
      text += `${student.rollNo} | ${student.name} | ${student.status.toUpperCase()}\n`;
    });
    
    return text;
  }

  // Simulate processing with progress updates
  async simulateProcessing() {
    return new Promise((resolve) => {
      setTimeout(resolve, this.processingDelay);
    });
  }

  // Get processing progress (for UI progress bars)
  getProcessingProgress(startTime) {
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / this.processingDelay) * 100, 100);
    
    let stage = 'Initializing...';
    if (progress > 20) stage = 'Reading image...';
    if (progress > 40) stage = 'Detecting text...';
    if (progress > 60) stage = 'Identifying roll numbers...';
    if (progress > 80) stage = 'Applying attendance rules...';
    if (progress >= 100) stage = 'Complete!';

    return {
      progress: Math.round(progress),
      stage,
      estimated: Math.max(0, this.processingDelay - elapsed)
    };
  }

  // Batch process multiple attendance sheets
  async processBatchAttendance(imageFiles, classId, date) {
    const results = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      console.log(`🔄 Processing batch ${i + 1}/${imageFiles.length}`);
      const result = await this.processAttendanceSheet(imageFiles[i], classId, date);
      results.push({
        fileIndex: i,
        fileName: imageFiles[i].name,
        ...result
      });
    }

    return {
      success: true,
      totalFiles: imageFiles.length,
      processedFiles: results.length,
      results,
      summary: {
        totalStudentsProcessed: results.reduce((acc, r) => acc + r.extractedData.totalStudents, 0),
        avgConfidence: results.reduce((acc, r) => acc + r.confidence, 0) / results.length
      }
    };
  }

  // Validate attendance data before saving
  validateAttendanceData(extractedData) {
    const issues = [];
    
    // Check for duplicate roll numbers
    const rollNos = extractedData.students.map(s => s.rollNo);
    const duplicates = rollNos.filter((rollNo, index) => rollNos.indexOf(rollNo) !== index);
    if (duplicates.length > 0) {
      issues.push(`Duplicate roll numbers detected: ${duplicates.join(', ')}`);
    }

    // Check confidence levels
    const lowConfidenceStudents = extractedData.students.filter(s => s.confidence < 0.8);
    if (lowConfidenceStudents.length > 0) {
      issues.push(`${lowConfidenceStudents.length} students have low detection confidence`);
    }

    // Check for unusual patterns
    if (extractedData.absent / extractedData.totalStudents > 0.5) {
      issues.push('High absence rate detected - please verify');
    }

    return {
      isValid: issues.length === 0,
      issues,
      confidence: extractedData.students.reduce((acc, s) => acc + s.confidence, 0) / extractedData.students.length
    };
  }

  // Process results sheet (exam/test results)
  async processResultsSheet(imageFile, classId, examType, prompt = '') {
    console.log('🤖 AI Processing results sheet:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      classId,
      examType,
      prompt
    });

    // Simulate processing delay
    await this.simulateProcessing();

    // Mock extracted results data
    const mockResults = await this.generateMockExamResults(classId, examType, prompt);

    return {
      success: true,
      processingTime: this.processingDelay,
      extractedData: mockResults,
      confidence: 0.94,
      metadata: {
        imageSize: imageFile.size,
        fileName: imageFile.name,
        processedAt: new Date().toISOString(),
        aiModel: 'OCR-Results-v2.1.0',
        examType: examType,
        prompt: prompt
      }
    };
  }

  // Generate mock exam results
  async generateMockExamResults(classId, examType, prompt) {
    const mockStudents = [
      { rollNo: 'CSE001', name: 'Aarav Sharma' },
      { rollNo: 'CSE002', name: 'Priya Patel' },
      { rollNo: 'CSE003', name: 'Rohit Kumar' },
      { rollNo: 'CSE004', name: 'Sneha Gupta' },
      { rollNo: 'CSE005', name: 'Arjun Singh' },
      { rollNo: 'CSE006', name: 'Ananya Das' },
      { rollNo: 'CSE007', name: 'Vikram Thakur' },
      { rollNo: 'CSE008', name: 'Kavya Mehta' },
      { rollNo: 'CSE009', name: 'Ravi Agarwal' },
      { rollNo: 'CSE010', name: 'Pooja Jain' }
    ];

    // Determine max marks based on exam type
    const maxMarks = examType === 'midterm' ? 50 : 
                     examType === 'final' ? 100 :
                     examType === 'assignment' ? 100 : 
                     examType === 'project' ? 100 : 100;

    // Generate realistic results
    const detectedResults = mockStudents.map(student => {
      // Generate marks with some realistic distribution
      let baseScore = 65 + Math.random() * 30; // Base score between 65-95
      let marks = Math.round(baseScore * maxMarks / 100);
      
      // Add some prompt-based variations
      if (prompt.toLowerCase().includes('difficult')) {
        marks = Math.max(20, marks - 10 - Math.random() * 15);
      } else if (prompt.toLowerCase().includes('easy')) {
        marks = Math.min(maxMarks, marks + 5 + Math.random() * 10);
      }

      const percentage = Math.round((marks / maxMarks) * 100);
      const grade = this.calculateGrade(percentage);
      const confidence = 0.88 + Math.random() * 0.10;

      return {
        ...student,
        marks: Math.max(0, Math.min(maxMarks, marks)),
        maxMarks,
        percentage,
        grade,
        confidence: parseFloat(confidence.toFixed(3))
      };
    });

    const totalMarks = detectedResults.reduce((acc, s) => acc + s.marks, 0);
    const averageScore = Math.round(totalMarks / detectedResults.length);
    const highestScore = Math.max(...detectedResults.map(s => s.marks));
    const lowestScore = Math.min(...detectedResults.map(s => s.marks));

    return {
      totalStudents: detectedResults.length,
      averageScore,
      highestScore,
      lowestScore,
      students: detectedResults,
      examType,
      maxMarks,
      processingNotes: [
        'Successfully detected student roll numbers and marks',
        'Applied grade calculation based on percentage',
        prompt ? `Custom prompt applied: "${prompt}"` : 'Default results processing applied',
        `Detection confidence: ${Math.round(detectedResults.reduce((acc, s) => acc + s.confidence, 0) / detectedResults.length * 100)}%`
      ]
    };
  }

  // Calculate grade based on percentage
  calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  // Get supported file formats
  getSupportedFormats() {
    return {
      images: ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'],
      documents: ['.pdf'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      recommendations: [
        'Use high-resolution images for better accuracy',
        'Ensure good lighting and minimal shadows',
        'Keep the paper flat and avoid skewed angles',
        'Include clear roll numbers, names, and marks'
      ]
    };
  }
}

// Export singleton instance
export const aiPaperReaderService = new AIPaperReaderService();
export default aiPaperReaderService;