import React, { useState, useEffect } from 'react';
import { Download, Eye, Palette, FileText, User, Award, Briefcase, Code, Bot, Sparkles, Zap } from 'lucide-react';
import AIGeneratedPortfolio from './components/AIGeneratedPortfolio';

const Portfolio = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [templates, setTemplates] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAIPortfolio, setShowAIPortfolio] = useState(false);
  const [aiPortfolioData, setAiPortfolioData] = useState(null);
  
  // Check if we have valid data
  const hasValidData = data?.profile?.name && data.profile.name !== 'Loading...';
  const studentData = hasValidData ? getStudentData() : null;
  
  // Log the data for debugging
  console.log('🎓 Portfolio data check:', { 
    hasValidData, 
    profileName: data?.profile?.name,
    studentData: studentData ? 'Generated' : 'Null'
  });

  // Fetch available templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8001/portfolio/templates');
        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Fallback templates
        setTemplates([
          { id: 'professional', name: 'Professional', description: 'Clean, business-oriented layout' },
          { id: 'creative', name: 'Creative', description: 'Colorful, artistic design' },
          { id: 'academic', name: 'Academic', description: 'Scholarly, research-focused layout' },
          { id: 'modern', name: 'Modern', description: 'Contemporary, minimalist design' }
        ]);
      }
    };

    fetchTemplates();
  }, []);

  // Get actual student data from props
  const getStudentData = () => {
    console.log('📊 Generating student data from:', data?.profile);
    
    const studentInfo = {
      student_id: data?.profile?.rollNumber || data?.profile?.id || "UNKNOWN",
      name: data?.profile?.name || data?.profile?.fullName || "Student",
      email: data?.profile?.email || "N/A",
      course: data?.profile?.department || "Computer Science",
      semester: data?.profile?.semester || data?.profile?.currentSemester || 1,
      enrollmentNo: data?.profile?.enrollmentNo || "N/A",
      section: data?.profile?.section || "A",
      cgpa: data?.profile?.cgpa || 0,
    grades: data?.results ? data.results.reduce((acc, result) => {
      acc[result.course] = result.grade;
      return acc;
    }, {}) : {
      "No grades available": "N/A"
    },
    projects: data?.assignments ? data.assignments.filter(a => a.status === 'completed' || a.submitted).map(assignment => ({
      title: assignment.title,
      description: `Assignment for ${assignment.course}`,
      technologies: ["Academic Project"],
      course: assignment.course,
      marks: assignment.marks
    })) : [
      {
        title: "Sample Project",
        description: "No projects available from your assignments yet. Complete some assignments to see them here!",
        technologies: ["Academic"]
      }
    ],
    achievements: [
      data?.profile?.cgpa >= 8.5 ? `High Academic Performance - CGPA: ${data.profile.cgpa}` : null,
      data?.profile?.cgpa >= 7.0 ? "Good Academic Standing" : null,
      data?.assignments?.filter(a => a.submitted).length > 5 ? "Assignment Completion Excellence" : null,
      data?.attendance?.filter(a => a.present).length / data?.attendance?.length > 0.85 ? "Regular Attendance Award" : null
    ].filter(Boolean).concat([
      "JECRC University Student",
      `${data?.profile?.department || 'Engineering'} Department`
    ]),
    skills: [
      "Academic Research", "Problem Solving", "Time Management",
      data?.profile?.department === 'Computer Science' ? "Programming" : null,
      data?.profile?.department === 'Electronics' ? "Circuit Design" : null, 
      data?.profile?.department === 'Mechanical' ? "CAD Design" : null,
      "Team Collaboration", "Project Management"
    ].filter(Boolean),
    extracurricular: [
      {
        activity: `${data?.profile?.department || 'Department'} Society`,
        role: "Member",
        duration: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`
      },
      {
        activity: "Academic Activities",
        role: "Active Participant", 
        duration: "Ongoing"
      }
    ]
  };
  
  console.log('\ud83d\udcbc Generated student info:', studentInfo);
  return studentInfo;
};

  const generatePortfolio = async () => {
    setLoading(true);
    try {
      const studentData = getStudentData();
      const token = localStorage.getItem('token');
      
      // Use the correct backend API endpoint
      const response = await fetch(`http://localhost:5000/api/portfolio/generate/${studentData.student_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPortfolio({
            portfolio_html: result.data.portfolioHTML || '<h1>Portfolio Generated</h1>',
            summary: result.data.summary || 'AI-generated portfolio created successfully',
            highlights: result.data.highlights || [
              'Professional portfolio generated',
              'Based on academic performance',
              'Tailored to your department and skills'
            ]
          });
        } else {
          throw new Error(result.message || 'Failed to generate portfolio');
        }
      } else {
        throw new Error('Failed to generate portfolio');
      }
    } catch (error) {
      console.error('Error generating portfolio:', error);
      
      // Show fallback portfolio
      setPortfolio({
        portfolio_html: `
          <html>
            <head><title>${getStudentData().name} - Portfolio</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">${getStudentData().name}</h1>
                <h2 style="color: #666; margin-bottom: 20px;">${getStudentData().course} Student</h2>
                <p><strong>Student ID:</strong> ${getStudentData().student_id}</p>
                <p><strong>Semester:</strong> ${getStudentData().semester}</p>
                <div style="margin-top: 30px;">
                  <h3 style="color: #007bff;">Skills</h3>
                  <p>${getStudentData().skills.join(', ')}</p>
                </div>
                <div style="margin-top: 30px;">
                  <h3 style="color: #007bff;">Projects</h3>
                  ${getStudentData().projects.map(p => `<div style="margin-bottom: 15px;"><h4>${p.title}</h4><p>${p.description}</p></div>`).join('')}
                </div>
              </div>
            </body>
          </html>
        `,
        summary: 'Fallback portfolio generated using template',
        highlights: [
          'Basic portfolio information included',
          'Skills and projects listed',
          'Professional layout applied'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPortfolio = () => {
    if (!portfolio) return;
    
    const blob = new Blob([portfolio.portfolio_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getStudentData().name.replace(' ', '_')}_Portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewPortfolio = () => {
    if (!portfolio) return;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(portfolio.portfolio_html);
    newWindow.document.close();
  };

  const handleGenerateAIPortfolio = async () => {
    try {
      setLoading(true);
      console.log('🤖 Generating AI Portfolio...');
      
      // Fetch AI portfolio data using actual student data
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const studentData = getStudentData();
      
      if (!studentData.student_id || studentData.student_id === 'UNKNOWN') {
        throw new Error('Student ID not available');
      }

      console.log('🤖 Generating AI portfolio for:', studentData.name, '(' + studentData.student_id + ')');
      
      const response = await fetch(`http://localhost:5000/api/portfolio/generate/${studentData.student_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAiPortfolioData(result.data);
          setShowAIPortfolio(true);
        } else {
          throw new Error(result.message || 'Failed to generate AI portfolio');
        }
      } else {
        throw new Error('Failed to connect to AI portfolio service');
      }
    } catch (error) {
      console.error('Error generating AI portfolio:', error);
      // Still show the AI portfolio with default data
      setAiPortfolioData(null);
      setShowAIPortfolio(true);
    } finally {
      setLoading(false);
    }
  };

  const closeAIPortfolio = () => {
    setShowAIPortfolio(false);
    setAiPortfolioData(null);
  };

  // Show loading state if data is not ready
  if (!hasValidData) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-[var(--text)]">Loading student data...</p>
          <p className="text-sm text-[var(--muted)] mt-2">Please wait while we fetch your profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Portfolio Generator
        </h1>
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Create professional portfolios showcasing your academic achievements and projects for {studentData.name}
        </p>
      </div>

      {/* AI Portfolio Generation Hero Section */}
      <div className="mb-8 relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <Bot size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Sparkles size={28} />
                AI-Powered Portfolio Generator
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Create a stunning, personalized portfolio in seconds using advanced AI technology powered by Gemini AI. 
                Your academic data, projects, and achievements will be intelligently analyzed and beautifully presented.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleGenerateAIPortfolio}
                  disabled={loading}
                  className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-white/90 transition-all duration-200 hover:scale-105 flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                  ) : (
                    <Zap size={20} />
                  )}
                  {loading ? 'Generating...' : 'Generate AI Portfolio'}
                </button>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Bot size={16} />
                  <span>Powered by Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          Choose Template
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTemplate === template.id ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              }`}
              style={{ backgroundColor: selectedTemplate === template.id ? 'var(--accent-light)' : 'var(--card)' }}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {template.description}
              </p>
              {selectedTemplate === template.id && (
                <div className="mt-2 text-red-600 text-sm font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Student Information Preview */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          Portfolio Preview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {getStudentData().name}</p>
              <p><strong>Course:</strong> {getStudentData().course}</p>
              <p><strong>Semester:</strong> {getStudentData().semester}</p>
              <p><strong>Student ID:</strong> {getStudentData().student_id}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Skills ({getStudentData().skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {getStudentData().skills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {skill}
                </span>
              ))}
              {getStudentData().skills.length > 8 && (
                <span className="px-2 py-1 text-xs" style={{ color: 'var(--muted)' }}>
                  +{getStudentData().skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Achievements & Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Projects ({getStudentData().projects.length})</h4>
              <ul className="space-y-1">
                {getStudentData().projects.map((project, index) => (
                  <li key={index} className="text-sm" style={{ color: 'var(--muted)' }}>
                    • {project.title}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Achievements ({getStudentData().achievements.length})</h4>
              <ul className="space-y-1">
                {getStudentData().achievements.map((achievement, index) => (
                  <li key={index} className="text-sm" style={{ color: 'var(--muted)' }}>
                    • {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center mb-8">
        <button
          onClick={generatePortfolio}
          disabled={loading}
          className="px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating Portfolio...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Generate Portfolio
            </div>
          )}
        </button>
      </div>

      {/* Generated Portfolio Actions */}
      {portfolio && (
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--success)' }}>
            ✓ Portfolio Generated Successfully!
          </h2>
          
          <div className="mb-4">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {portfolio.summary}
            </p>
          </div>

          {portfolio.highlights && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Portfolio Highlights:</h3>
              <ul className="space-y-1">
                {portfolio.highlights.map((highlight, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={previewPortfolio}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            
            <button
              onClick={downloadPortfolio}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <Download className="w-4 h-4" />
              Download Portfolio
            </button>
          </div>
        </div>
      )}

      {/* AI Generated Portfolio Modal */}
      {showAIPortfolio && (
        <AIGeneratedPortfolio 
          onClose={closeAIPortfolio}
          studentData={{
            profile: getStudentData(),
            portfolio: {
              certifications: [],
              internships: [],
              academics: `CGPA 8.5, ${getStudentData().course}`,
              extracurricular: "Technical Club Member, Project Leader"
            },
            achievements: [
              "Dean's List Recognition",
              "Best Project Award 2024",
              "Coding Competition Winner",
              "Academic Excellence Award"
            ]
          }}
          aiGeneratedData={aiPortfolioData}
        />
      )}
    </div>
  );
};

export default Portfolio;
