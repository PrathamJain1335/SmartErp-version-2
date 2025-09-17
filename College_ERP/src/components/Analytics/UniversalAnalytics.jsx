import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, GraduationCap, BookOpen, DollarSign, Calendar, Activity, Target, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { getChartThemeColors, getPieChartOptions, getLineChartOptions, getBarChartOptions } from '../../utils/chartTheme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UniversalAnalytics = ({ portal = 'student', userRole = 'Student' }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('monthly');
  const [activeMetric, setActiveMetric] = useState('overview');

  // Generate demo data based on portal
  const generateDemoData = () => {
    const colors = getChartThemeColors();
    if (portal === 'student') {
      return {
        overview: {
          title: 'Academic Overview',
          metrics: [
            { label: 'Current CGPA', value: '8.45', change: '+0.12', trend: 'up', icon: GraduationCap, color: 'bg-blue-500' },
            { label: 'Attendance Rate', value: '87.2%', change: '+2.1%', trend: 'up', icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Courses Enrolled', value: '6', change: '0', trend: 'stable', icon: BookOpen, color: 'bg-purple-500' },
            { label: 'Assignments Due', value: '3', change: '-2', trend: 'down', icon: AlertCircle, color: 'bg-orange-500' }
          ]
        },
        charts: {
          performance: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
            datasets: [{
              label: 'CGPA Trend',
              data: [7.8, 8.1, 8.3, 8.2, 8.4, 8.45],
              borderColor: colors.chartColors[0],
              backgroundColor: colors.chartColors[0] + '20',
              fill: true,
              tension: 0.4
            }]
          },
          subjects: {
            labels: ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Electronics', 'English'],
            datasets: [{
              label: 'Marks',
              data: [85, 78, 92, 95, 88, 82],
              backgroundColor: colors.chartColors.slice(0, 6),
              borderWidth: 2
            }]
          },
          attendance: {
            labels: ['Present', 'Absent', 'Leave'],
            datasets: [{
              data: [142, 18, 7],
              backgroundColor: [colors.success, colors.danger, colors.warning],
              borderWidth: 0
            }]
          }
        },
        insights: [
          { type: 'success', message: 'Your CGPA improved by 0.12 points this semester!' },
          { type: 'warning', message: 'Physics attendance is below 85%. Consider attending more classes.' },
          { type: 'info', message: 'You have 3 assignments due this week. Plan accordingly.' }
        ]
      };
    } else if (portal === 'faculty') {
      return {
        overview: {
          title: 'Teaching Overview',
          metrics: [
            { label: 'Total Students', value: '127', change: '+5', trend: 'up', icon: Users, color: 'bg-blue-500' },
            { label: 'Classes This Week', value: '12', change: '+2', trend: 'up', icon: Calendar, color: 'bg-green-500' },
            { label: 'Avg Attendance', value: '89.4%', change: '+1.2%', trend: 'up', icon: Activity, color: 'bg-purple-500' },
            { label: 'Assignments Graded', value: '95', change: '+23', trend: 'up', icon: CheckCircle, color: 'bg-orange-500' }
          ]
        },
        charts: {
          studentPerformance: {
            labels: ['Below 60%', '60-70%', '70-80%', '80-90%', 'Above 90%'],
            datasets: [{
              label: 'Number of Students',
              data: [8, 15, 35, 45, 24],
              backgroundColor: colors.chartColors.slice(0, 5),
              borderWidth: 2
            }]
          },
          attendanceTrend: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
              label: 'Class 1 Attendance %',
              data: [87, 89, 85, 91, 88, 90],
              borderColor: colors.chartColors[0],
              backgroundColor: colors.chartColors[0] + '20',
              fill: true
            }, {
              label: 'Class 2 Attendance %',
              data: [85, 87, 89, 88, 92, 89],
              borderColor: colors.chartColors[1],
              backgroundColor: colors.chartColors[1] + '20',
              fill: true
            }]
          },
          subjectDistribution: {
            labels: ['Data Structures', 'Algorithms', 'DBMS', 'Networks'],
            datasets: [{
              data: [30, 35, 32, 30],
              backgroundColor: colors.chartColors.slice(0, 4),
              borderWidth: 0
            }]
          }
        },
        insights: [
          { type: 'success', message: 'Class attendance improved by 1.2% this week!' },
          { type: 'info', message: '23 assignments submitted for grading.' },
          { type: 'warning', message: '8 students are performing below 60%. Consider additional support.' }
        ]
      };
    } else {
      return {
        overview: {
          title: 'System Overview',
          metrics: [
            { label: 'Total Students', value: '2,456', change: '+45', trend: 'up', icon: Users, color: 'bg-blue-500' },
            { label: 'Active Faculty', value: '145', change: '+3', trend: 'up', icon: GraduationCap, color: 'bg-green-500' },
            { label: 'System Uptime', value: '99.8%', change: '+0.1%', trend: 'up', icon: Activity, color: 'bg-purple-500' },
            { label: 'Fee Collection', value: '94.2%', change: '+2.1%', trend: 'up', icon: DollarSign, color: 'bg-orange-500' }
          ]
        },
        charts: {
          studentEnrollment: {
            labels: ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE'],
            datasets: [{
              label: 'Enrolled Students',
              data: [890, 654, 520, 386, 298, 245],
              backgroundColor: colors.chartColors.slice(0, 6),
              borderWidth: 2
            }]
          },
          monthlyTrends: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'New Admissions',
              data: [45, 52, 38, 61, 49, 55],
              borderColor: colors.chartColors[0],
              backgroundColor: colors.chartColors[0] + '20',
              fill: true
            }, {
              label: 'Graduations',
              data: [0, 0, 0, 145, 0, 0],
              borderColor: colors.chartColors[1],
              backgroundColor: colors.chartColors[1] + '20',
              fill: true
            }]
          },
          feeCollection: {
            labels: ['Collected', 'Pending', 'Overdue'],
            datasets: [{
              data: [94.2, 4.8, 1.0],
              backgroundColor: [colors.success, colors.warning, colors.danger],
              borderWidth: 0
            }]
          }
        },
        insights: [
          { type: 'success', message: 'Fee collection rate improved to 94.2% this month!' },
          { type: 'info', message: '45 new student admissions processed this month.' },
          { type: 'warning', message: '23 students have overdue fees requiring attention.' }
        ]
      };
    }
  };

  const [data, setData] = useState(generateDemoData());

  useEffect(() => {
    setData(generateDemoData());
  }, [portal]);

  const getChartOptions = (type = 'default') => {
    switch (type) {
      case 'pie':
        return getPieChartOptions();
      case 'line':
        return getLineChartOptions();
      case 'bar':
        return getBarChartOptions();
      default:
        return getPieChartOptions();
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--muted)' }}>Comprehensive insights and metrics for {userRole.toLowerCase()} portal</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {['weekly', 'monthly', 'semester', 'yearly'].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
            style={selectedTimeRange === range ? 
              { backgroundColor: 'var(--accent)', color: 'white' } :
              { backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }
            }
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.overview.metrics.map((metric, index) => (
          <div key={index} className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${metric.color}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{metric.value}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {portal === 'student' && (
          <>
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>CGPA Trend</h3>
              <div className="h-64">
                <Line data={data.charts.performance} options={getChartOptions('line')} />
              </div>
            </div>
            
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Subject Performance</h3>
              <div className="h-64">
                <Bar data={data.charts.subjects} options={getChartOptions('bar')} />
              </div>
            </div>
            
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Attendance Distribution</h3>
              <div className="h-64">
                <Doughnut data={data.charts.attendance} options={getChartOptions('pie')} />
              </div>
            </div>
          </>
        )}

        {portal === 'faculty' && (
          <>
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Student Performance Distribution</h3>
              <div className="h-64">
                <Bar data={data.charts.studentPerformance} options={getChartOptions('bar')} />
              </div>
            </div>
            
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Class Attendance Trends</h3>
              <div className="h-64">
                <Line data={data.charts.attendanceTrend} options={getChartOptions('line')} />
              </div>
            </div>
            
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Subject Distribution</h3>
              <div className="h-64">
                <Pie data={data.charts.subjectDistribution} options={getChartOptions('pie')} />
              </div>
            </div>
          </>
        )}

        {portal === 'admin' && (
          <>
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Department-wise Enrollment</h3>
              <div className="h-64">
                <Bar data={data.charts.studentEnrollment} options={getChartOptions('bar')} />
              </div>
            </div>
            
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Monthly Trends</h3>
              <div className="h-64">
                <Line data={data.charts.monthlyTrends} options={getChartOptions('line')} />
              </div>
            </div>
            
            <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Fee Collection Status</h3>
              <div className="h-64">
                <Doughnut data={data.charts.feeCollection} options={getChartOptions('pie')} />
              </div>
            </div>
          </>
        )}

        {/* Additional Analytics Card */}
        <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Key Insights</h3>
          <div className="space-y-4">
            {data.insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border-l-4" style={{
                borderLeftColor: insight.type === 'success' ? 'var(--success)' :
                  insight.type === 'warning' ? 'var(--warning)' : 'var(--info)',
                backgroundColor: 'var(--soft)'
              }}>
                <div className="flex items-start gap-3">
                  {insight.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : insight.type === 'warning' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  )}
                  <p className="text-sm" style={{ color: 'var(--text)' }}>
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary Table */}
      {portal === 'student' && (
        <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)' }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text)' }}>Semester Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ backgroundColor: 'var(--hover)' }}>
                  <th className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>Semester</th>
                  <th className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>SGPA</th>
                  <th className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>CGPA</th>
                  <th className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>Credits</th>
                  <th className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {[
                  { sem: 'Semester 1', sgpa: '7.8', cgpa: '7.8', credits: '24', rank: '25th' },
                  { sem: 'Semester 2', sgpa: '8.3', cgpa: '8.05', credits: '26', rank: '18th' },
                  { sem: 'Semester 3', sgpa: '8.5', cgpa: '8.2', credits: '25', rank: '15th' },
                  { sem: 'Semester 4', sgpa: '8.1', cgpa: '8.17', credits: '24', rank: '16th' },
                  { sem: 'Semester 5', sgpa: '8.7', cgpa: '8.28', credits: '26', rank: '12th' },
                  { sem: 'Semester 6', sgpa: '8.9', cgpa: '8.45', credits: '25', rank: '8th' }
                ].map((row, index) => (
                  <tr key={index} className="hover:opacity-80">
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text)' }}>{row.sem}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text)' }}>{row.sgpa}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--accent)' }}>{row.cgpa}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text)' }}>{row.credits}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text)' }}>{row.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portal === 'student' && [
          { label: 'Download Transcript', icon: GraduationCap, color: 'bg-blue-600' },
          { label: 'View Timetable', icon: Calendar, color: 'bg-green-600' },
          { label: 'Check Assignments', icon: BookOpen, color: 'bg-purple-600' },
          { label: 'Library Status', icon: Activity, color: 'bg-orange-600' }
        ].map((action, index) => (
          <button key={index} className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3`}>
            <action.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}

        {portal === 'faculty' && [
          { label: 'Grade Students', icon: Award, color: 'bg-blue-600' },
          { label: 'Mark Attendance', icon: CheckCircle, color: 'bg-green-600' },
          { label: 'Schedule Class', icon: Calendar, color: 'bg-purple-600' },
          { label: 'Generate Report', icon: BarChart3, color: 'bg-orange-600' }
        ].map((action, index) => (
          <button key={index} className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3`}>
            <action.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}

        {portal === 'admin' && [
          { label: 'System Reports', icon: BarChart3, color: 'bg-blue-600' },
          { label: 'Manage Users', icon: Users, color: 'bg-green-600' },
          { label: 'Fee Management', icon: DollarSign, color: 'bg-purple-600' },
          { label: 'System Settings', icon: Activity, color: 'bg-orange-600' }
        ].map((action, index) => (
          <button key={index} className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3`}>
            <action.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UniversalAnalytics;