import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Users,
  Edit, Save, X, Plus, Trash2, Eye, Download, Upload, Camera,
  GraduationCap, Building, Globe, Linkedin, Twitter, Github,
  Star, TrendingUp, FileText, Clock, Briefcase, Medal,
  ChevronRight, ExternalLink, Heart, MessageCircle, Share2
} from 'lucide-react';

const FacultyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    personal: {
      name: 'Dr. Tokir Khan',
      title: 'Associate Professor',
      department: 'Computer Science',
      employeeId: 'JECRC001',
      email: 'tokir.khan@jecrc.edu',
      phone: '+91 98765 43210',
      alternatePhone: '+91 98765 43211',
      address: '123 Faculty Colony, Jaipur, Rajasthan 302017',
      dateOfBirth: '1985-03-15',
      joiningDate: '2015-08-01',
      profileImage: './image3.jpg',
      bloodGroup: 'A+',
      emergencyContact: {
        name: 'Naaz Khan',
        relation: 'Sister',
        phone: '+91 98765 43212'
      }
    },
    academic: {
      qualifications: [
        { degree: 'Ph.D. Computer Science', institution: 'IIT Delhi', year: '2014' },
        { degree: 'M.Tech Computer Science', institution: 'IIT Roorkee', year: '2011' },
        { degree: 'B.Tech Computer Science', institution: 'JECRC University', year: '2009' }
      ],
      experience: [
        { position: 'Associate Professor', institution: 'JECRC University', duration: '2020 - Present' },
        { position: 'Assistant Professor', institution: 'JECRC University', duration: '2015 - 2020' },
        { position: 'Research Associate', institution: 'IIT Delhi', duration: '2014 - 2015' }
      ],
      specialization: ['Machine Learning', 'Data Science', 'Artificial Intelligence', 'Deep Learning'],
      researchInterests: ['Natural Language Processing', 'Computer Vision', 'Robotics', 'IoT']
    },
    research: {
      publications: [
        {
          title: 'Advanced Machine Learning Techniques in Healthcare',
          journal: 'International Journal of AI',
          year: '2023',
          citations: 45,
          impact: 'High'
        },
        {
          title: 'Deep Learning for Medical Image Analysis',
          journal: 'IEEE Transactions on Medical Imaging',
          year: '2022',
          citations: 78,
          impact: 'High'
        },
        {
          title: 'IoT-based Smart Campus Solutions',
          journal: 'Journal of Educational Technology',
          year: '2021',
          citations: 32,
          impact: 'Medium'
        }
      ],
      projects: [
        {
          title: 'AI-Powered Student Performance Prediction',
          funding: '₹15,00,000',
          agency: 'DST-SERB',
          status: 'Ongoing',
          duration: '2023-2025'
        },
        {
          title: 'Smart Campus IoT Infrastructure',
          funding: '₹8,00,000',
          agency: 'UGC',
          status: 'Completed',
          duration: '2021-2023'
        }
      ],
      awards: [
        { title: 'Best Faculty Award', year: '2023', organization: 'JECRC University' },
        { title: 'Research Excellence Award', year: '2022', organization: 'IEEE' },
        { title: 'Young Scientist Award', year: '2021', organization: 'DST' }
      ]
    },
    teaching: {
      courses: [
        { code: 'CS301', name: 'Machine Learning', semester: 'VI', students: 45 },
        { code: 'CS401', name: 'Data Science', semester: 'VIII', students: 38 },
        { code: 'CS501', name: 'Advanced AI', semester: 'X', students: 22 }
      ],
      studentsFeedback: 4.7,
      totalStudentsTaught: 850,
      yearsTeaching: 8,
      mentorships: 15
    },
    social: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson',
      github: 'https://github.com/sarahjohnson',
      orcid: '0000-0002-1825-0097',
      googleScholar: 'https://scholar.google.com/citations?user=abc123'
    }
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const ProfileHeader = () => (
    <div className="faculty-card-red p-6 relative overflow-hidden" style={{ background: 'var(--gradient-red)' }}>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 text-white">
          <div className="relative">
            <img
              src={profileData.personal.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 shadow-lg">
                <Camera size={16} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{profileData.personal.name}</h1>
                <p className="text-xl opacity-90 mb-1">{profileData.personal.title}</p>
                <p className="text-lg opacity-80 mb-4">{profileData.personal.department} Department</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>ID: {profileData.personal.employeeId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Since {new Date(profileData.personal.joiningDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} />
                    <span>{profileData.teaching.studentsFeedback}/5 Rating</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                      <span>Edit Profile</span>
                    </button>
                    <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                      <Download size={16} />
                      <span>Export CV</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="faculty-card p-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'faculty-card-red text-white' 
          : 'hover:bg-opacity-10'
      }`}
      style={{
        backgroundColor: isActive ? 'var(--faculty-primary)' : 'transparent'
      }}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const PersonalInfoTab = () => (
    <div className="space-y-6">
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.personal.name}
                onChange={(e) => setTempData({
                  ...tempData,
                  personal: { ...tempData.personal, name: e.target.value }
                })}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
              />
            ) : (
              <p className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}>
                {profileData.personal.name}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="flex items-center gap-3">
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text)' }}>{profileData.personal.email}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Phone</label>
            <div className="flex items-center gap-3">
              <Phone size={18} style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text)' }}>{profileData.personal.phone}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Date of Birth</label>
            <div className="flex items-center gap-3">
              <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text)' }}>
                {new Date(profileData.personal.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Address</label>
            <div className="flex items-start gap-3">
              <MapPin size={18} style={{ color: 'var(--text-muted)' }} className="mt-1" />
              <p style={{ color: 'var(--text)' }}>{profileData.personal.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
            <p style={{ color: 'var(--text)' }}>{profileData.personal.emergencyContact.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Relation</label>
            <p style={{ color: 'var(--text)' }}>{profileData.personal.emergencyContact.relation}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Phone</label>
            <p style={{ color: 'var(--text)' }}>{profileData.personal.emergencyContact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AcademicTab = () => (
    <div className="space-y-6">
      {/* Qualifications */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Educational Qualifications</h3>
        <div className="space-y-4">
          {profileData.academic.qualifications.map((qual, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <GraduationCap size={24} style={{ color: 'var(--faculty-primary)' }} />
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{qual.degree}</h4>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{qual.institution} • {qual.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Work Experience</h3>
        <div className="space-y-4">
          {profileData.academic.experience.map((exp, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <Briefcase size={24} style={{ color: 'var(--faculty-primary)' }} />
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{exp.position}</h4>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{exp.institution} • {exp.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialization */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Areas of Specialization</h3>
        <div className="flex flex-wrap gap-3">
          {profileData.academic.specialization.map((spec, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: 'var(--faculty-primary)', 
                color: 'white' 
              }}
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const ResearchTab = () => (
    <div className="space-y-6">
      {/* Publications */}
      <div className="faculty-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Publications</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--faculty-primary)', color: 'white' }}>
            <Plus size={16} />
            Add Publication
          </button>
        </div>
        
        <div className="space-y-4">
          {profileData.research.publications.map((pub, index) => (
            <div key={index} className="p-4 rounded-lg border-l-4" style={{ 
              backgroundColor: 'var(--hover)', 
              borderLeftColor: pub.impact === 'High' ? '#22c55e' : pub.impact === 'Medium' ? '#f59e0b' : '#6b7280' 
            }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{pub.title}</h4>
              <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                {pub.journal} • {pub.year}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <TrendingUp size={14} />
                  {pub.citations} citations
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  pub.impact === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  pub.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {pub.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Projects */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Research Projects</h3>
        <div className="space-y-4">
          {profileData.research.projects.map((project, index) => (
            <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{project.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div>Funding: <span className="font-medium">{project.funding}</span></div>
                <div>Agency: <span className="font-medium">{project.agency}</span></div>
                <div>Duration: <span className="font-medium">{project.duration}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Awards & Recognition</h3>
        <div className="space-y-4">
          {profileData.research.awards.map((award, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <Medal size={24} style={{ color: '#fbbf24' }} />
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{award.title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{award.organization} • {award.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TeachingTab = () => (
    <div className="space-y-6">
      {/* Teaching Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Courses Teaching"
          value={profileData.teaching.courses.length}
          subtitle="This semester"
          color="var(--chart-red)"
        />
        <StatCard
          icon={Users}
          title="Students Taught"
          value={profileData.teaching.totalStudentsTaught}
          subtitle="Total students"
          color="var(--chart-secondary)"
        />
        <StatCard
          icon={Star}
          title="Student Rating"
          value={`${profileData.teaching.studentsFeedback}/5`}
          subtitle="Average rating"
          color="var(--chart-tertiary)"
        />
        <StatCard
          icon={Heart}
          title="Mentorships"
          value={profileData.teaching.mentorships}
          subtitle="Active mentees"
          color="var(--chart-quaternary)"
        />
      </div>

      {/* Current Courses */}
      <div className="faculty-card p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Current Courses</h3>
        <div className="space-y-4">
          {profileData.teaching.courses.map((course, index) => (
            <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{course.code} - {course.name}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Semester {course.semester}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: 'var(--faculty-primary)' }}>{course.students}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>students</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs rounded-md" style={{ backgroundColor: 'var(--faculty-primary)', color: 'white' }}>
                  View Details
                </button>
                <button className="px-3 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'research', label: 'Research', icon: BookOpen },
    { id: 'teaching', label: 'Teaching', icon: Users },
    { id: 'social', label: 'Social Links', icon: Globe }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfoTab />;
      case 'academic': return <AcademicTab />;
      case 'research': return <ResearchTab />;
      case 'teaching': return <TeachingTab />;
      case 'social': return (
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Social Media & Professional Links</h3>
          <div className="space-y-4">
            {Object.entries(profileData.social).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--faculty-primary)' }}>
                  {platform === 'linkedin' && <Linkedin size={20} color="white" />}
                  {platform === 'twitter' && <Twitter size={20} color="white" />}
                  {platform === 'github' && <Github size={20} color="white" />}
                  {(platform === 'orcid' || platform === 'googleScholar') && <Globe size={20} color="white" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{platform}</p>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--faculty-primary)' }}>
                    {url}
                  </a>
                </div>
                <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
      );
      default: return (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={BookOpen}
              title="Total Publications"
              value={profileData.research.publications.length}
              subtitle="Research papers"
              color="var(--chart-red)"
            />
            <StatCard
              icon={Award}
              title="Awards Received"
              value={profileData.research.awards.length}
              subtitle="Recognition"
              color="var(--chart-secondary)"
            />
            <StatCard
              icon={Users}
              title="Students Rating"
              value={`${profileData.teaching.studentsFeedback}/5`}
              subtitle="Average feedback"
              color="var(--chart-tertiary)"
            />
            <StatCard
              icon={Calendar}
              title="Experience"
              value={`${profileData.teaching.yearsTeaching}+`}
              subtitle="Years teaching"
              color="var(--chart-quaternary)"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="faculty-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Publications</h3>
              <div className="space-y-3">
                {profileData.research.publications.slice(0, 3).map((pub, index) => (
                  <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                    <h4 className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{pub.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pub.journal} • {pub.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="faculty-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Current Courses</h3>
              <div className="space-y-3">
                {profileData.teaching.courses.map((course, index) => (
                  <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                    <h4 className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{course.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{course.students} students • Semester {course.semester}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      <ProfileHeader />
      
      {/* Navigation Tabs */}
      <div className="faculty-card p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default FacultyProfile;