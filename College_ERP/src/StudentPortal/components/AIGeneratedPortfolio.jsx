import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  Download, User, Mail, Phone, MapPin, Github, Linkedin, Globe, 
  Trophy, GraduationCap, Briefcase, Code, Star, ArrowRight, 
  BarChart3, PieChart, TrendingUp, Calendar, Award, Target,
  Brain, Zap, CheckCircle, ExternalLink, FileText, Eye,
  ChevronRight, Sparkles, Bot, Rocket, Activity, Users,
  Heart, Coffee, BookOpen, Lightbulb
} from 'lucide-react';
import { 
  Line, Bar, Radar, Doughnut, Scatter, PolarArea 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AIGeneratedPortfolio = ({ onClose, studentData, aiGeneratedData = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [animateCharts, setAnimateCharts] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const portfolioRef = useRef();

  // Load AI-generated data or simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (aiGeneratedData) {
        setPortfolioData(aiGeneratedData);
        console.log('🎆 Using AI-generated portfolio data:', aiGeneratedData);
      } else {
        setPortfolioData(getDefaultPortfolioData());
        console.log('🔄 Using default portfolio data');
      }
      setIsLoading(false);
      setAnimateCharts(true);
    }, aiGeneratedData ? 1500 : 2500); // Shorter loading if data is available
    return () => clearTimeout(timer);
  }, [aiGeneratedData]);

  // Function to get default portfolio data
  const getDefaultPortfolioData = () => ({
    personalInfo: {
      name: "Pratham Jain",
      title: "Full Stack Developer & AI Enthusiast",
      email: "pratham.jain@jecrcu.edu.in",
      phone: "+91-9876543210",
      location: "Jaipur, Rajasthan",
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
      profileImage: "./pratham.jpg",
    },

    summary: "Passionate Computer Science Engineering student with expertise in modern web technologies, machine learning, and software architecture. Demonstrated ability to lead cross-functional teams and deliver innovative solutions. Seeking opportunities to contribute to cutting-edge technology projects.",

    education: [
      {
        degree: "B.Tech Computer Science Engineering",
        institution: "JECRC University",
        year: "2021-2025",
        cgpa: "8.7",
        achievements: ["Dean's List", "Top 5% of Class", "Research Scholar"]
      }
    ],

    experience: [
      {
        title: "Software Development Intern",
        company: "TechCorp India",
        duration: "Jun 2024 - Aug 2024",
        description: "Developed scalable web applications using React.js and Node.js, improving system performance by 40%",
        technologies: ["React", "Node.js", "MongoDB", "AWS"]
      },
      {
        title: "Frontend Developer",
        company: "StartupX",
        duration: "Jan 2024 - May 2024",
        description: "Built responsive user interfaces and implemented modern design systems",
        technologies: ["Vue.js", "TypeScript", "Tailwind CSS"]
      }
    ],

    skills: {
      technical: [
        { name: "JavaScript", level: 90, category: "Frontend" },
        { name: "React.js", level: 85, category: "Frontend" },
        { name: "Node.js", level: 80, category: "Backend" },
        { name: "Python", level: 88, category: "Programming" },
        { name: "Machine Learning", level: 75, category: "AI/ML" },
        { name: "AWS", level: 70, category: "Cloud" },
        { name: "Docker", level: 65, category: "DevOps" },
        { name: "MongoDB", level: 78, category: "Database" }
      ],
      soft: [
        { name: "Leadership", level: 92 },
        { name: "Communication", level: 88 },
        { name: "Problem Solving", level: 95 },
        { name: "Teamwork", level: 90 },
        { name: "Adaptability", level: 85 }
      ]
    },

    projects: [
      {
        title: "AI-Powered Learning Platform",
        description: "Full-stack educational platform with personalized AI recommendations",
        technologies: ["React", "Node.js", "TensorFlow", "MongoDB"],
        github: "github.com/johndoe/ai-learning-platform",
        demo: "ai-learning.vercel.app",
        impact: "Used by 1000+ students"
      },
      {
        title: "Smart Campus Management System",
        description: "Comprehensive campus management solution with real-time analytics",
        technologies: ["Vue.js", "Express.js", "PostgreSQL", "Socket.io"],
        github: "github.com/johndoe/smart-campus",
        demo: "smart-campus.herokuapp.com",
        impact: "Reduced administrative workload by 60%"
      }
    ],

    achievements: [
      { title: "Winner - National Coding Championship 2024", category: "Competition" },
      { title: "Best Innovation Award - Hackathon 2024", category: "Innovation" },
      { title: "Google Cloud Certified Professional", category: "Certification" },
      { title: "AWS Solutions Architect Associate", category: "Certification" }
    ],

    certifications: [
      "Google Cloud Professional Developer",
      "AWS Solutions Architect",
      "Microsoft Azure Fundamentals",
      "MongoDB Certified Developer"
    ],

    languages: [
      { name: "English", level: "Native" },
      { name: "Hindi", level: "Native" },
      { name: "Spanish", level: "Intermediate" }
    ]
  });

  // Dynamic Chart Data (only render when portfolioData is available)
  const skillsRadarData = portfolioData ? {
    labels: (portfolioData.skills?.technical || []).slice(0, 6).map(s => s.name),
    datasets: [{
      label: 'Technical Skills',
      data: (portfolioData.skills?.technical || []).slice(0, 6).map(s => s.level),
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(99, 102, 241)',
    }]
  } : null;

  const experienceTimelineData = {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      label: 'Skill Growth',
      data: [20, 40, 60, 85, 95],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const projectImpactData = portfolioData ? {
    labels: (portfolioData.projects || []).map(p => p.title),
    datasets: [{
      data: (portfolioData.projects || []).map((_, index) => 85 - (index * 5)), // Generate dynamic data
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderWidth: 0,
    }]
  } : null;

  const skillCategoryData = {
    labels: ['Frontend', 'Backend', 'AI/ML', 'Cloud', 'DevOps'],
    datasets: [{
      data: [90, 80, 75, 70, 65],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text)',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'var(--card)',
        titleColor: 'var(--text)',
        bodyColor: 'var(--text)',
        borderColor: 'var(--border)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: 'var(--border)' },
        ticks: { color: 'var(--muted)' }
      },
      x: {
        grid: { color: 'var(--border)' },
        ticks: { color: 'var(--muted)' }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text)',
          font: { size: 12 }
        }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'var(--border)' },
        grid: { color: 'var(--border)' },
        pointLabels: { color: 'var(--text)' },
        ticks: { color: 'var(--muted)' }
      }
    }
  };

  const sections = [
    "Personal Info",
    "Skills Analysis",
    "Experience Timeline",
    "Projects Portfolio",
    "Achievements"
  ];

  const handleDownload = async () => {
    try {
      console.log('💾 Starting portfolio download...');
      
      // Show loading state
      const downloadBtn = document.querySelector('[data-download-btn]');
      if (downloadBtn) {
        downloadBtn.textContent = 'Generating PDF...';
        downloadBtn.disabled = true;
      }
      
      const element = portfolioRef.current;
      
      // Configure html2canvas for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Generate filename with student info
      const studentName = portfolioData?.personalInfo?.name || 'Student';
      const studentId = portfolioData?.personalInfo?.rollNumber || 'Portfolio';
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_${studentId}_AI_Portfolio_${timestamp}.png`;
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = imgData;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Portfolio downloaded successfully:', filename);
      
      // Call backend API to log download
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5001/api/portfolio/download', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            portfolioData: portfolioData,
            format: 'png',
            filename: filename
          })
        });
      } catch (apiError) {
        console.warn('⚠️ Failed to log download to API:', apiError);
      }
      
    } catch (error) {
      console.error('💥 Error downloading portfolio:', error);
      alert('Failed to download portfolio. Please try again.');
    } finally {
      // Reset button state
      const downloadBtn = document.querySelector('[data-download-btn]');
      if (downloadBtn) {
        downloadBtn.textContent = 'Download';
        downloadBtn.disabled = false;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center" style={{ color: 'var(--text)' }}>
          <div className="relative">
            <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse text-blue-500" />
            <div className="absolute inset-0 w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">AI Generating Your Portfolio...</h2>
          <p style={{ color: 'var(--muted)' }}>Analyzing your profile and creating personalized content</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-light)' }}>
                <Sparkles className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>AI-Generated Portfolio</h1>
                <p style={{ color: 'var(--muted)' }}>Powered by Advanced AI Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                data-download-btn
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:scale-110 transition-all duration-200"
                style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between text-sm" style={{ color: 'var(--muted)' }}>
              {sections.map((section, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${index <= currentSection ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <span className="ml-2">{section}</span>
                  {index < sections.length - 1 && (
                    <ChevronRight size={16} className="ml-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div ref={portfolioRef} className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative p-12 text-white">
                <div className="flex items-center gap-8">
                  <img
                    src={portfolioData.personalInfo.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white/30 object-cover"
                  />
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">{portfolioData.personalInfo.name}</h1>
                    <p className="text-xl text-white/90 mb-4">{portfolioData.personalInfo.title}</p>
                    <p className="text-white/80 max-w-2xl leading-relaxed">{portfolioData.summary}</p>
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span className="text-sm">{portfolioData.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm">{portfolioData.personalInfo.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Analysis Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Activity size={20} />
                  Technical Skills Radar
                </h3>
                <div className="h-80">
                  <Radar data={skillsRadarData} options={radarOptions} />
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <PieChart size={20} />
                  Skill Categories
                </h3>
                <div className="h-80">
                  <Doughnut data={skillCategoryData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <TrendingUp size={20} />
                Growth Timeline
              </h3>
              <div className="h-64 mb-6">
                <Line data={experienceTimelineData} options={chartOptions} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.experience.map((exp, index) => (
                  <div key={index} className="p-4 rounded-lg border-l-4 border-blue-500" style={{ backgroundColor: 'var(--hover)' }}>
                    <h4 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{exp.title}</h4>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{exp.duration}</p>
                    <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Showcase */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Rocket size={20} />
                Featured Projects
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div className="h-64">
                  <Bar 
                    data={{
                      labels: portfolioData.projects.map(p => p.title.split(' ').slice(0, 2).join(' ')),
                      datasets: [{
                        label: 'Project Impact Score',
                        data: [95, 88, 92, 85],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      }]
                    }} 
                    options={chartOptions} 
                  />
                </div>
                
                <div className="space-y-4">
                  {portfolioData.projects.slice(0, 2).map((project, index) => (
                    <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--text)' }}>{project.title}</h4>
                      <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{project.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1" style={{ color: 'var(--info)' }}>
                          <Github size={14} />
                          <span>Code</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                          <Users size={14} />
                          <span>{project.impact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Trophy size={20} />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {portfolioData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                      <Award className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text)' }}>{achievement.title}</p>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>{achievement.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <CheckCircle size={20} />
                  Certifications
                </h3>
                <div className="space-y-3">
                  {portfolioData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
                      <span style={{ color: 'var(--text)' }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Skills Breakdown */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Code size={20} />
                Technical Proficiency
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioData.skills.technical.map((skill, index) => (
                  <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{skill.name}</span>
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>{skill.level}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--border)' }}>
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: animateCharts ? `${skill.level}%` : '0%',
                          backgroundColor: 'var(--accent)'
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{skill.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Links */}
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Let's Connect</h3>
              <div className="flex justify-center gap-6">
                {[
                  { icon: Mail, label: 'Email', value: portfolioData.personalInfo.email },
                  { icon: Github, label: 'GitHub', value: portfolioData.personalInfo.github },
                  { icon: Linkedin, label: 'LinkedIn', value: portfolioData.personalInfo.linkedin },
                  { icon: Globe, label: 'Website', value: portfolioData.personalInfo.website },
                ].map((contact, index) => (
                  <div key={index} className="p-4 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200" style={{ backgroundColor: 'var(--hover)' }}>
                    <contact.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--info)' }} />
                    <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{contact.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Generation Footer */}
            <div className="text-center py-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bot className="w-5 h-5" style={{ color: 'var(--info)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  Generated by JECRC AI Portfolio Engine
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                This portfolio was intelligently crafted based on your academic and professional profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratedPortfolio;