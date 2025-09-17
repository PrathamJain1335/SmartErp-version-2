import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const DashboardTest = () => {
  // Simple data for testing
  const pieData = [
    { name: 'Excellent', value: 35 },
    { name: 'Good', value: 40 },
    { name: 'Average', value: 20 },
    { name: 'Below Average', value: 5 }
  ];

  const attendanceData = [
    { name: 'Mon', attendance: 95, engagement: 88 },
    { name: 'Tue', attendance: 92, engagement: 85 },
    { name: 'Wed', attendance: 96, engagement: 90 },
    { name: 'Thu', attendance: 89, engagement: 82 },
    { name: 'Fri', attendance: 94, engagement: 87 },
    { name: 'Sat', attendance: 88, engagement: 84 }
  ];

  const engagementData = [
    { name: 'Participation', value: 85 },
    { name: 'Assignments', value: 78 },
    { name: 'Attendance', value: 92 },
    { name: 'Interaction', value: 88 },
    { name: 'Performance', value: 83 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Faculty Dashboard - Chart Test
        </h1>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Weekly Attendance & Engagement
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#dc2626"
                    fillOpacity={1}
                    fill="url(#attendanceGradient)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#engagementGradient)"
                    strokeWidth={3}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Student Performance Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-900">
            Student Engagement Analysis
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={engagementData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                />
                <Radar
                  name="Engagement"
                  dataKey="value"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827'
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <p className="text-yellow-700 text-sm">
            If you can see the charts above, then Recharts is working correctly.
            If not, check the browser console for any JavaScript errors.
          </p>
          <div className="mt-2 text-xs text-yellow-600">
            <p>React version: {React.version}</p>
            <p>Recharts imported successfully: {PieChart ? '✅' : '❌'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTest;