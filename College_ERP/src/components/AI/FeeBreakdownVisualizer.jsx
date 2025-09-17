import React, { useState, useRef } from 'react';
import { PieChart, BarChart3, TrendingUp, Download, Filter, Eye, DollarSign, Calendar, AlertCircle, Clock } from 'lucide-react';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const FeeBreakdownVisualizer = () => {
  const chartRef = useRef();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFeeType, setSelectedFeeType] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('current');
  
  // Mock fee data
  const feeData = {
    totalFees: 175000,
    components: [
      { 
        id: 'tuition', 
        name: 'Tuition Fee', 
        amount: 125000, 
        percentage: 71.4, 
        color: '#3B82F6',
        description: 'Academic fees for courses and instruction',
        breakdown: [
          { item: 'Course Fee', amount: 85000 },
          { item: 'Lab Fee', amount: 25000 },
          { item: 'Practical Fee', amount: 15000 }
        ]
      },
      { 
        id: 'hostel', 
        name: 'Hostel Fee', 
        amount: 35000, 
        percentage: 20.0, 
        color: '#10B981',
        description: 'Accommodation and dining charges',
        breakdown: [
          { item: 'Room Rent', amount: 20000 },
          { item: 'Mess Fee', amount: 15000 }
        ]
      },
      { 
        id: 'transport', 
        name: 'Transport Fee', 
        amount: 8000, 
        percentage: 4.6, 
        color: '#F59E0B',
        description: 'Bus and transportation services',
        breakdown: [
          { item: 'Bus Fee', amount: 8000 }
        ]
      },
      { 
        id: 'library', 
        name: 'Library Fee', 
        amount: 4000, 
        percentage: 2.3, 
        color: '#8B5CF6',
        description: 'Library access and resources',
        breakdown: [
          { item: 'Library Access', amount: 2500 },
          { item: 'Digital Resources', amount: 1500 }
        ]
      },
      { 
        id: 'sports', 
        name: 'Sports Fee', 
        amount: 2000, 
        percentage: 1.1, 
        color: '#EF4444',
        description: 'Sports facilities and equipment',
        breakdown: [
          { item: 'Gym Access', amount: 1200 },
          { item: 'Sports Equipment', amount: 800 }
        ]
      },
      { 
        id: 'other', 
        name: 'Other Charges', 
        amount: 1000, 
        percentage: 0.6, 
        color: '#6B7280',
        description: 'Miscellaneous charges',
        breakdown: [
          { item: 'Identity Card', amount: 300 },
          { item: 'Exam Form', amount: 500 },
          { item: 'Medical Check-up', amount: 200 }
        ]
      }
    ],
    paymentStatus: {
      paid: 125000,
      pending: 50000,
      overdue: 0
    },
    semesterHistory: [
      { semester: 'Sem 1', total: 175000, paid: 175000 },
      { semester: 'Sem 2', total: 175000, paid: 175000 },
      { semester: 'Sem 3', total: 175000, paid: 125000 },
      { semester: 'Sem 4', total: 175000, paid: 0 }
    ]
  };

  // Chart configurations
  const pieChartData = {
    labels: feeData.components.map(comp => comp.name),
    datasets: [{
      data: feeData.components.map(comp => comp.amount),
      backgroundColor: feeData.components.map(comp => comp.color),
      borderColor: feeData.components.map(comp => comp.color),
      borderWidth: 2,
      hoverBorderWidth: 3
    }]
  };

  const doughnutChartData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      data: [feeData.paymentStatus.paid, feeData.paymentStatus.pending, feeData.paymentStatus.overdue],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const barChartData = {
    labels: feeData.components.map(comp => comp.name),
    datasets: [{
      label: 'Amount (₹)',
      data: feeData.components.map(comp => comp.amount),
      backgroundColor: feeData.components.map(comp => comp.color + '80'),
      borderColor: feeData.components.map(comp => comp.color),
      borderWidth: 2
    }]
  };

  const semesterTrendData = {
    labels: feeData.semesterHistory.map(sem => sem.semester),
    datasets: [
      {
        label: 'Total Fees',
        data: feeData.semesterHistory.map(sem => sem.total),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'Paid Amount',
        data: feeData.semesterHistory.map(sem => sem.paid),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            return `${label}: ₹${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  // Export functionality
  const exportChart = () => {
    const canvas = chartRef.current?.canvas;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'fee-breakdown-chart.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fee Breakdown Visualizer</h1>
              <p className="text-gray-600">Understand your fees clearly with interactive charts</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="current">Current Semester</option>
              <option value="all">All Semesters</option>
              <option value="sem1">Semester 1</option>
              <option value="sem2">Semester 2</option>
            </select>
            
            <button
              onClick={exportChart}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Chart
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'breakdown', label: 'Detailed Breakdown', icon: BarChart3 },
            { id: 'trends', label: 'Payment Trends', icon: TrendingUp },
            { id: 'analysis', label: 'Analysis', icon: AlertCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Fee Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total Fees</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹{feeData.totalFees.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">For current semester</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Download className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Amount Paid</span>
              </div>
              <div className="text-2xl font-bold text-green-600">₹{feeData.paymentStatus.paid.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">{((feeData.paymentStatus.paid / feeData.totalFees) * 100).toFixed(1)}% completed</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Pending Amount</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">₹{feeData.paymentStatus.pending.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Due by Oct 15, 2024</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Components</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{feeData.components.length}</div>
              <div className="text-sm text-gray-500 mt-1">Fee categories</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Fee Distribution</h3>
              <div className="h-80">
                <Pie ref={chartRef} data={pieChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Status</h3>
              <div className="h-80">
                <Doughnut data={doughnutChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Breakdown Tab */}
      {activeTab === 'breakdown' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Component-wise Breakdown</h3>
              <div className="h-96">
                <Bar data={barChartData} options={barOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Fee Components</h3>
              <div className="space-y-4">
                {feeData.components.map((component) => (
                  <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: component.color }}
                        ></div>
                        <span className="font-medium text-gray-900">{component.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{component.percentage}%</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      ₹{component.amount.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                    
                    {/* Sub-breakdown */}
                    <div className="space-y-2">
                      {component.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">• {item.item}</span>
                          <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Semester-wise Payment Trends</h3>
            <div className="h-96">
              <Line data={semesterTrendData} options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '₹' + (value / 1000) + 'K';
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Timeline</h3>
              <div className="space-y-4">
                {[
                  { date: '2024-07-15', amount: 87500, type: 'Tuition Fee (Partial)', status: 'completed' },
                  { date: '2024-08-20', amount: 37500, type: 'Remaining Tuition + Hostel', status: 'completed' },
                  { date: '2024-09-30', amount: 50000, type: 'Pending Amount', status: 'upcoming' }
                ].map((payment, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    payment.status === 'completed' ? 'border-green-500 bg-green-50' :
                    payment.status === 'upcoming' ? 'border-yellow-500 bg-yellow-50' :
                    'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{payment.type}</div>
                        <div className="text-sm text-gray-600">{payment.date}</div>
                      </div>
                      <div className={`text-lg font-semibold ${
                        payment.status === 'completed' ? 'text-green-600' :
                        payment.status === 'upcoming' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        ₹{payment.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods Used</h3>
              <div className="space-y-4">
                {[
                  { method: 'Online Banking', percentage: 60, amount: 105000 },
                  { method: 'UPI', percentage: 25, amount: 43750 },
                  { method: 'Credit Card', percentage: 10, amount: 17500 },
                  { method: 'Cash', percentage: 5, amount: 8750 }
                ].map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{method.method}</span>
                      <span className="text-sm text-gray-600">₹{method.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900 mb-2">Payment Behavior Analysis</div>
                  <p className="text-sm text-blue-800">
                    You typically pay 71.4% of fees early in the semester. Consider setting up auto-pay for better cash flow management.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900 mb-2">Cost Optimization</div>
                  <p className="text-sm text-green-800">
                    Transport fee represents 4.6% of total fees. You could save ₹4,000 annually by using public transport twice a week.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-yellow-900 mb-2">Upcoming Recommendations</div>
                  <p className="text-sm text-yellow-800">
                    Based on your payment history, consider splitting the remaining ₹50,000 into 2 installments for better budget management.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Fee Comparison</h3>
              <div className="space-y-4">
                {[
                  { category: 'Tuition Fee', current: 125000, average: 130000, comparison: 'below' },
                  { category: 'Hostel Fee', current: 35000, average: 32000, comparison: 'above' },
                  { category: 'Transport Fee', current: 8000, average: 7500, comparison: 'above' },
                  { category: 'Other Fees', current: 7000, average: 8000, comparison: 'below' }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">₹{item.current.toLocaleString()}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.comparison === 'below' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.comparison === 'below' ? '↓' : '↑'} vs avg
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.comparison === 'below' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${(item.current / item.average) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Smart Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-green-900">Save Money</span>
                </div>
                <p className="text-sm text-gray-600">
                  Switch to annual payment plan to save ₹5,000 on processing fees and get 2% early payment discount.
                </p>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-900">Plan Better</span>
                </div>
                <p className="text-sm text-gray-600">
                  Set up automatic reminders 7 days before due dates to avoid late fees and maintain good payment history.
                </p>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-900">Optimize</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment pattern shows potential for scholarship eligibility. Consider applying for merit-based aid.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeBreakdownVisualizer;