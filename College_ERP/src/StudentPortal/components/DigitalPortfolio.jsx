import React, { useState, useRef } from 'react';
import { 
  Download, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Briefcase, 
  Code, 
  Star,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  FileText,
  Palette,
  Settings
} from 'lucide-react';
import html2canvas from 'html2canvas';

const DigitalPortfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: "Pratham Jain",
      title: "Computer Science Engineering Student",
      email: "pratham.jain@jecrcu.edu.in",
      phone: "+91-9876543210",
      location: "Jaipur, Rajasthan",
      rollNumber: "21CSE001",
      semester: "6th Semester",
      profileImage: "./pratham.jpg"
    },
    summary: "Passionate and dedicated Computer Science Engineering student with a strong foundation in programming, software development, and emerging technologies. Committed to continuous learning and applying theoretical knowledge to real-world problems.",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "React.js", level: 80 },
      { name: "Node.js", level: 75 },
      { name: "Database Management", level: 85 },
      { name: "Machine Learning", level: 70 },
      { name: "Git/GitHub", level: 90 },
      { name: "Problem Solving", level: 95 }
    ],
    projects: [
      {
        title: "E-Commerce Website",
        description: "Full-stack web application with user authentication, payment gateway integration, and admin dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        duration: "3 months",
        status: "Completed"
      },
      {
        title: "Student Management System",
        description: "Desktop application for managing student records, attendance, and grades",
        technologies: ["Java", "MySQL", "JavaFX"],
        duration: "2 months", 
        status: "Completed"
      },
      {
        title: "AI Chatbot",
        description: "Intelligent chatbot using natural language processing for customer support",
        technologies: ["Python", "TensorFlow", "Flask", "NLP"],
        duration: "4 months",
        status: "In Progress"
      }
    ],
    achievements: [
      "Dean's List - Fall 2023",
      "Best Project Award - Web Development Course",
      "Hackathon Winner - TechFest 2024",
      "Academic Excellence Scholarship Recipient",
      "Coding Competition - 2nd Place Regional"
    ],
    certifications: [
      "AWS Cloud Practitioner Essentials",
      "Google Analytics Certified",
      "Microsoft Azure Fundamentals",
      "Oracle Java SE 11 Developer"
    ],
    education: {
      degree: "Bachelor of Technology in Computer Science Engineering",
      institution: "JECRC University",
      duration: "2021 - 2025",
      cgpa: "8.7/10.0",
      relevantCourses: ["Data Structures", "Algorithms", "Database Systems", "Web Development", "Machine Learning", "Software Engineering"]
    },
    extracurricular: [
      {
        activity: "Technical Club President",
        organization: "JECRC University",
        duration: "2023-2024",
        description: "Led technical workshops and coding competitions"
      },
      {
        activity: "Volunteer Coordinator",
        organization: "NSS",
        duration: "2022-2023",
        description: "Organized community service activities and social awareness programs"
      }
    ]
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const portfolioRef = useRef();

  // Template options
  const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-r from-blue-600 to-purple-600' },
    { id: 'professional', name: 'Professional', color: 'bg-gradient-to-r from-gray-700 to-gray-900' },
    { id: 'creative', name: 'Creative', color: 'bg-gradient-to-r from-pink-500 to-orange-500' },
    { id: 'minimal', name: 'Minimal', color: 'bg-gradient-to-r from-green-600 to-blue-600' }
  ];

  // Handle data updates
  const updateField = (section, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayField = (section, index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, newItem) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Download portfolio
  const downloadPortfolio = async () => {
    if (portfolioRef.current) {
      try {
        const canvas = await html2canvas(portfolioRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const link = document.createElement('a');
        link.download = `${portfolioData.personalInfo.name.replace(/\s+/g, '_')}_Digital_Portfolio.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error generating portfolio:', error);
        alert('Failed to download portfolio. Please try again.');
      }
    }
  };

  // Template styles
  const getTemplateStyles = (template) => {
    const styles = {
      modern: {
        headerBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
        cardBg: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'text-blue-600',
        borderColor: 'border-blue-200'
      },
      professional: {
        headerBg: 'bg-gradient-to-r from-gray-700 to-gray-900',
        cardBg: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'text-gray-700',
        borderColor: 'border-gray-300'
      },
      creative: {
        headerBg: 'bg-gradient-to-r from-pink-500 to-orange-500',
        cardBg: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'text-pink-600',
        borderColor: 'border-pink-200'
      },
      minimal: {
        headerBg: 'bg-gradient-to-r from-green-600 to-blue-600',
        cardBg: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'text-green-600',
        borderColor: 'border-green-200'
      }
    };
    return styles[template] || styles.modern;
  };

  const templateStyles = getTemplateStyles(selectedTemplate);

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText size={32} style={{ color: 'var(--accent)' }} />
            Digital Portfolio Builder
          </h1>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>
            Create and customize your professional digital portfolio
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
            {isEditing ? 'Save' : 'Edit'}
          </button>
          
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200"
          >
            <Eye size={16} />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          
          <button
            onClick={downloadPortfolio}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      {/* Template Selector */}
      {!previewMode && (
        <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette size={20} />
            Choose Template
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`h-12 w-full rounded mb-3 ${template.color}`}></div>
                <p className="font-medium">{template.name}</p>
                {selectedTemplate === template.id && (
                  <div className="text-blue-600 text-sm mt-1">✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Preview */}
      <div className={`transition-all duration-300 ${previewMode ? 'fixed inset-0 z-50 bg-white overflow-auto p-8' : ''}`}>
        {previewMode && (
          <button
            onClick={() => setPreviewMode(false)}
            className="fixed top-4 right-4 z-60 p-3 bg-black text-white rounded-full hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        )}
        
        <div 
          ref={portfolioRef}
          className={`bg-white shadow-2xl rounded-2xl overflow-hidden ${previewMode ? 'max-w-4xl mx-auto' : ''}`}
        >
          {/* Header Section */}
          <div className={`${templateStyles.headerBg} text-white p-8 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <img
                src={portfolioData.personalInfo.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white/30 object-cover shadow-lg"
              />
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2">{portfolioData.personalInfo.name}</h1>
                <h2 className="text-xl mb-4 text-white/90">{portfolioData.personalInfo.title}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <span>{portfolioData.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span>{portfolioData.personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{portfolioData.personalInfo.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {/* Summary */}
            <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
              <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                <User size={20} />
                Professional Summary
              </h3>
              <p className={`${templateStyles.textColor} leading-relaxed`}>{portfolioData.summary}</p>
            </section>

            {/* Education */}
            <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
              <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                <BookOpen size={20} />
                Education
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className={`text-lg font-semibold ${templateStyles.textColor}`}>{portfolioData.education.degree}</h4>
                  <p className={`${templateStyles.accentColor} font-medium`}>{portfolioData.education.institution}</p>
                  <p className={`text-sm ${templateStyles.textColor} opacity-75`}>{portfolioData.education.duration}</p>
                  <p className={`text-sm ${templateStyles.textColor} mt-2`}>CGPA: <strong>{portfolioData.education.cgpa}</strong></p>
                </div>
                <div>
                  <h5 className={`font-medium ${templateStyles.textColor} mb-2`}>Relevant Coursework:</h5>
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.education.relevantCourses.map((course, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 ${templateStyles.accentColor} bg-opacity-10 rounded-full text-sm font-medium`}
                        style={{ backgroundColor: 'var(--accent-light)' }}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
              <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                <Code size={20} />
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioData.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${templateStyles.textColor}`}>{skill.name}</span>
                      <span className={`text-sm ${templateStyles.accentColor} font-semibold`}>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          selectedTemplate === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          selectedTemplate === 'professional' ? 'bg-gray-600' :
                          selectedTemplate === 'creative' ? 'bg-gradient-to-r from-pink-500 to-orange-500' :
                          'bg-gradient-to-r from-green-500 to-blue-500'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
              <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                <Briefcase size={20} />
                Projects
              </h3>
              <div className="grid gap-6">
                {portfolioData.projects.map((project, index) => (
                  <div key={index} className={`p-4 border ${templateStyles.borderColor} rounded-lg hover:shadow-md transition-shadow`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`text-lg font-semibold ${templateStyles.textColor}`}>{project.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className={`${templateStyles.textColor} mb-3`}>{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className={`text-sm ${templateStyles.accentColor} font-medium`}>Duration: {project.duration}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
                <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                  <Award size={20} />
                  Achievements
                </h3>
                <ul className="space-y-3">
                  {portfolioData.achievements.map((achievement, index) => (
                    <li key={index} className={`flex items-start gap-2 ${templateStyles.textColor}`}>
                      <Star size={14} className={`${templateStyles.accentColor} mt-1 flex-shrink-0`} />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
                <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                  <Award size={20} />
                  Certifications
                </h3>
                <ul className="space-y-3">
                  {portfolioData.certifications.map((cert, index) => (
                    <li key={index} className={`flex items-start gap-2 ${templateStyles.textColor}`}>
                      <Award size={14} className={`${templateStyles.accentColor} mt-1 flex-shrink-0`} />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Extracurricular Activities */}
            <section className={`${templateStyles.cardBg} p-6 rounded-lg shadow-sm border ${templateStyles.borderColor}`}>
              <h3 className={`text-2xl font-bold mb-4 ${templateStyles.accentColor} flex items-center gap-2`}>
                <Star size={20} />
                Extracurricular Activities
              </h3>
              <div className="space-y-4">
                {portfolioData.extracurricular.map((activity, index) => (
                  <div key={index} className={`p-4 border ${templateStyles.borderColor} rounded-lg`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-semibold ${templateStyles.textColor}`}>{activity.activity}</h4>
                      <span className={`text-sm ${templateStyles.accentColor}`}>{activity.duration}</span>
                    </div>
                    <p className={`${templateStyles.accentColor} font-medium mb-2`}>{activity.organization}</p>
                    <p className={`text-sm ${templateStyles.textColor}`}>{activity.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalPortfolio;