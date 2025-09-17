import React, { useState, useEffect } from 'react';
import { Download, Eye, Palette, FileText, User, Award, Briefcase, Code } from 'lucide-react';

const Portfolio = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [templates, setTemplates] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

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

  // Mock student data - in real app, this would come from props or API
  const getStudentData = () => ({
    student_id: data?.profile?.rollNumber || "21CSE001",
    name: data?.profile?.name || "John Doe",
    course: "Computer Science",
    semester: 6,
    grades: {
      "Data Structures": "A",
      "Database Systems": "A-",
      "Web Development": "A+",
      "Machine Learning": "B+",
      "Software Engineering": "A",
      "Computer Networks": "B+"
    },
    projects: [
      {
        title: "E-commerce Website",
        description: "Full-stack web application using React and Node.js with payment gateway integration",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe API"]
      },
      {
        title: "Machine Learning Classifier",
        description: "Image classification system using Convolutional Neural Networks",
        technologies: ["Python", "TensorFlow", "OpenCV", "Keras"]
      },
      {
        title: "College Management System",
        description: "Complete ERP solution for educational institutions",
        technologies: ["React", "FastAPI", "PostgreSQL", "Docker"]
      }
    ],
    achievements: [
      "Dean's List - Fall 2023",
      "Best Project Award - Web Development Course",
      "Hackathon Winner - TechFest 2023",
      "Academic Excellence Award - 2022"
    ],
    skills: [
      "JavaScript", "Python", "React", "Node.js", 
      "MongoDB", "Machine Learning", "Git", "AWS",
      "Docker", "PostgreSQL", "FastAPI", "TensorFlow"
    ],
    extracurricular: [
      {
        activity: "Computer Science Society",
        role: "Vice President",
        duration: "2023-2024"
      },
      {
        activity: "Technical Blog Writing",
        role: "Contributor",
        duration: "2022-Present"
      }
    ]
  });

  const generatePortfolio = async () => {
    setLoading(true);
    try {
      const studentData = getStudentData();
      
      const response = await fetch('http://localhost:8001/generate-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_record: studentData,
          template_style: selectedTemplate
        })
      });

      if (response.ok) {
        const portfolioData = await response.json();
        setPortfolio(portfolioData);
      } else {
        throw new Error('Failed to generate portfolio');
      }
    } catch (error) {
      console.error('Error generating portfolio:', error);
      alert('Failed to generate portfolio. Please try again.');
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

  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Generate Portfolio
        </h1>
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Create a professional portfolio showcasing your academic achievements and projects
        </p>
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
    </div>
  );
};

export default Portfolio;