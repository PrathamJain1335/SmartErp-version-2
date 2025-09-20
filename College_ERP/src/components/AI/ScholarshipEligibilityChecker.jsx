import React, { useState, useEffect } from 'react';
import { GraduationCap, DollarSign, Users, Award, TrendingUp, CheckCircle, X, AlertTriangle, Lightbulb, FileText, Calendar } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';

const ScholarshipEligibilityChecker = () => {
  const [formData, setFormData] = useState({
    cgpa: 8.2,
    familyIncome: 500000,
    category: 'General',
    extracurriculars: [],
    achievements: [],
    sportsParticipation: false,
    researchPublication: false,
    culturalActivities: false,
    socialService: false,
    debateChampion: false
  });

  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Available scholarships database
  const scholarships = [
    {
      id: 'merit_based',
      name: '50% Merit Scholarship',
      description: 'For students with outstanding academic performance',
      amount: 87500,
      criteria: {
        minCgpa: 8.5,
        maxIncome: 1000000,
        category: ['General', 'OBC', 'SC', 'ST'],
        additionalRequirements: []
      },
      benefits: ['50% tuition fee waiver', 'Priority hostel allocation', 'Library access'],
      applicationDeadline: '2024-10-15',
      documentsRequired: ['Academic transcripts', 'Income certificate', 'Caste certificate (if applicable)']
    },
    {
      id: 'need_based',
      name: 'Need-Based Financial Aid',
      description: 'For economically disadvantaged students',
      amount: 50000,
      criteria: {
        minCgpa: 7.0,
        maxIncome: 300000,
        category: ['General', 'OBC', 'SC', 'ST'],
        additionalRequirements: []
      },
      benefits: ['₹50,000 annual aid', 'Free textbooks', 'Meal subsidies'],
      applicationDeadline: '2024-11-30',
      documentsRequired: ['Income certificate', 'Bank statements', 'Academic records']
    },
    {
      id: 'sports_excellence',
      name: 'Sports Excellence Scholarship',
      description: 'For students excelling in sports activities',
      amount: 35000,
      criteria: {
        minCgpa: 7.5,
        maxIncome: 800000,
        category: ['General', 'OBC', 'SC', 'ST'],
        additionalRequirements: ['sportsParticipation']
      },
      benefits: ['₹35,000 annual scholarship', 'Sports facility access', 'Coaching support'],
      applicationDeadline: '2024-09-30',
      documentsRequired: ['Sports certificates', 'Performance records', 'Coach recommendation']
    },
    {
      id: 'research_scholar',
      name: 'Research Scholar Award',
      description: 'For students involved in research activities',
      amount: 60000,
      criteria: {
        minCgpa: 8.0,
        maxIncome: 1200000,
        category: ['General', 'OBC', 'SC', 'ST'],
        additionalRequirements: ['researchPublication']
      },
      benefits: ['₹60,000 research grant', 'Lab access', 'Conference funding'],
      applicationDeadline: '2024-12-15',
      documentsRequired: ['Research papers', 'Faculty recommendation', 'Project details']
    },
    {
      id: 'cultural_talent',
      name: 'Cultural Talent Scholarship',
      description: 'For students with exceptional cultural talents',
      amount: 25000,
      criteria: {
        minCgpa: 7.0,
        maxIncome: 600000,
        category: ['General', 'OBC', 'SC', 'ST'],
        additionalRequirements: ['culturalActivities']
      },
      benefits: ['₹25,000 annual award', 'Performance opportunities', 'Equipment support'],
      applicationDeadline: '2024-10-30',
      documentsRequired: ['Performance certificates', 'Portfolio', 'Video submissions']
    }
  ];

  // Calculate eligibility
  const calculateEligibility = () => {
    const results = scholarships.map(scholarship => {
      let eligibilityScore = 0;
      const reasons = [];
      const improvements = [];

      // CGPA check
      if (formData.cgpa >= scholarship.criteria.minCgpa) {
        eligibilityScore += 30;
        reasons.push(`CGPA requirement met (${formData.cgpa} >= ${scholarship.criteria.minCgpa})`);
      } else {
        improvements.push(`Improve CGPA to ${scholarship.criteria.minCgpa} (currently ${formData.cgpa})`);
      }

      // Income check
      if (formData.familyIncome <= scholarship.criteria.maxIncome) {
        eligibilityScore += 25;
        reasons.push(`Income requirement met (₹${formData.familyIncome.toLocaleString()} <= ₹${scholarship.criteria.maxIncome.toLocaleString()})`);
      } else {
        improvements.push(`Family income should be below ₹${scholarship.criteria.maxIncome.toLocaleString()}`);
      }

      // Category check
      if (scholarship.criteria.category.includes(formData.category)) {
        eligibilityScore += 15;
        reasons.push(`Category requirement met (${formData.category})`);
      }

      // Additional requirements
      scholarship.criteria.additionalRequirements.forEach(req => {
        if (formData[req]) {
          eligibilityScore += 10;
          reasons.push(`Additional requirement met: ${req.replace(/([A-Z])/g, ' $1').trim()}`);
        } else {
          improvements.push(`Consider engaging in: ${req.replace(/([A-Z])/g, ' $1').trim()}`);
        }
      });

      // Bonus points for extra activities
      if (formData.debateChampion) eligibilityScore += 5;
      if (formData.socialService) eligibilityScore += 5;

      const eligible = eligibilityScore >= 70;
      const eligibilityPercentage = Math.min(eligibilityScore, 100);

      return {
        scholarship,
        eligible,
        eligibilityPercentage,
        reasons,
        improvements: improvements.slice(0, 3) // Top 3 improvements
      };
    });

    setEligibilityResults(results);
  };

  useEffect(() => {
    calculateEligibility();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getEligibilityColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEligibilityBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 border-green-200';
    if (percentage >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  // Chart data for eligibility visualization
  const eligibilityChartData = {
    labels: eligibilityResults?.map(result => result.scholarship.name) || [],
    datasets: [{
      label: 'Eligibility Percentage',
      data: eligibilityResults?.map(result => result.eligibilityPercentage) || [],
      backgroundColor: eligibilityResults?.map(result => 
        result.eligibilityPercentage >= 80 ? '#10B981' :
        result.eligibilityPercentage >= 60 ? '#F59E0B' : '#EF4444'
      ) || [],
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };

  const totalPotentialAid = eligibilityResults?.reduce((sum, result) => 
    result.eligible ? sum + result.scholarship.amount : sum, 0
  ) || 0;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scholarship Eligibility Checker</h1>
            <p className="text-gray-600">Check your scholarship chances instantly with AI-powered insights</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm font-medium">Eligible For</span>
            </div>
            <div className="text-3xl font-bold">
              {eligibilityResults?.filter(result => result.eligible).length || 0}
            </div>
            <div className="text-sm opacity-90 mt-2">scholarships</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm font-medium">Potential Aid</span>
            </div>
            <div className="text-2xl font-bold">₹{totalPotentialAid.toLocaleString()}</div>
            <div className="text-sm opacity-90 mt-2">per year</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-6 w-6" />
              <span className="text-sm font-medium">Your CGPA</span>
            </div>
            <div className="text-3xl font-bold">{formData.cgpa}</div>
            <div className="text-sm opacity-90 mt-2">out of 10</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Category</span>
            </div>
            <div className="text-2xl font-bold">{formData.category}</div>
            <div className="text-sm opacity-90 mt-2">qualification</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family Income (₹ per annum)
              </label>
              <input
                type="number"
                value={formData.familyIncome}
                onChange={(e) => handleInputChange('familyIncome', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Extracurricular Activities
              </label>
              <div className="space-y-3">
                {[
                  { key: 'sportsParticipation', label: 'Sports Participation' },
                  { key: 'researchPublication', label: 'Research Publication' },
                  { key: 'culturalActivities', label: 'Cultural Activities' },
                  { key: 'socialService', label: 'Social Service' },
                  { key: 'debateChampion', label: 'Debate Champion' }
                ].map(activity => (
                  <div key={activity.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={activity.key}
                      checked={formData[activity.key]}
                      onChange={() => handleCheckboxChange(activity.key)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={activity.key} className="ml-2 text-sm text-gray-700">
                      {activity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={calculateEligibility}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Check Eligibility
            </button>
          </div>
        </div>

        {/* Eligibility Results */}
        <div className="lg:col-span-2 space-y-6">
          {eligibilityResults && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Eligibility Overview</h2>
                <div className="h-64">
                  <Bar data={eligibilityChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </div>

              <div className="space-y-4">
                {eligibilityResults.map((result, index) => (
                  <div 
                    key={result.scholarship.id} 
                    className={`bg-white rounded-xl shadow-lg border-2 ${getEligibilityBgColor(result.eligibilityPercentage)} p-6 cursor-pointer hover:shadow-xl transition-all`}
                    onClick={() => setSelectedScholarship(result)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.scholarship.name}
                          </h3>
                          {result.eligible && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {result.scholarship.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ₹{result.scholarship.amount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {result.scholarship.applicationDeadline}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getEligibilityColor(result.eligibilityPercentage)}`}>
                          {result.eligibilityPercentage}%
                        </div>
                        <div className="text-sm text-gray-500">eligible</div>
                      </div>
                    </div>

                    {/* Eligibility reasons */}
                    {result.reasons.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-green-800 mb-2">✓ Why you qualify:</h4>
                        <ul className="space-y-1">
                          {result.reasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx} className="text-xs text-green-700 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvement suggestions */}
                    {result.improvements.length > 0 && !result.eligible && (
                      <div>
                        <h4 className="text-sm font-medium text-orange-800 mb-2">💡 How to improve:</h4>
                        <ul className="space-y-1">
                          {result.improvements.slice(0, 2).map((improvement, idx) => (
                            <li key={idx} className="text-xs text-orange-700 flex items-center gap-1">
                              <Lightbulb className="h-3 w-3 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detailed Scholarship Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedScholarship.scholarship.name}
                </h3>
                <button 
                  onClick={() => setSelectedScholarship(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${getEligibilityBgColor(selectedScholarship.eligibilityPercentage)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Your Eligibility Score</span>
                    <span className={`text-2xl font-bold ${getEligibilityColor(selectedScholarship.eligibilityPercentage)}`}>
                      {selectedScholarship.eligibilityPercentage}%
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-3`}>
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        selectedScholarship.eligibilityPercentage >= 80 ? 'bg-green-600' :
                        selectedScholarship.eligibilityPercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${selectedScholarship.eligibilityPercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Benefits & Amount</h4>
                  <div className="bg-blue-50 p-4 rounded-lg mb-3">
                    <div className="text-2xl font-bold text-blue-900 mb-2">
                      ₹{selectedScholarship.scholarship.amount.toLocaleString()}
                    </div>
                    <p className="text-sm text-blue-800">Annual scholarship amount</p>
                  </div>
                  <ul className="space-y-2">
                    {selectedScholarship.scholarship.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedScholarship.scholarship.documentsRequired.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Application Timeline</h4>
                  <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-900">Application Deadline</div>
                      <div className="text-sm text-orange-700">{selectedScholarship.scholarship.applicationDeadline}</div>
                    </div>
                  </div>
                </div>

                {selectedScholarship.eligible && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => setSelectedScholarship(null)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Save for Later
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipEligibilityChecker;