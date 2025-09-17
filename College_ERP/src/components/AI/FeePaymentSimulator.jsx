import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Calendar, CreditCard, PieChart, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeePaymentSimulator = () => {
  const [feeData, setFeeData] = useState({
    totalFees: 175000,
    tuitionFee: 125000,
    hostelFee: 35000,
    otherFees: 15000
  });

  const [paymentPlan, setPaymentPlan] = useState('monthly');
  const [downPayment, setDownPayment] = useState(25000);
  const [interestRate, setInterestRate] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);

  const calculatePaymentPlan = () => {
    const remainingAmount = feeData.totalFees - downPayment;
    let numberOfPayments;
    
    switch (paymentPlan) {
      case 'monthly':
        numberOfPayments = 10; // 10 months
        break;
      case 'quarterly':
        numberOfPayments = 4; // 4 quarters
        break;
      case 'semester':
        numberOfPayments = 2; // 2 semesters
        break;
      default:
        numberOfPayments = 1;
    }

    const monthlyInterest = interestRate / 100 / 12;
    const installmentAmount = interestRate > 0 
      ? (remainingAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterest, numberOfPayments) - 1)
      : remainingAmount / numberOfPayments;

    const paymentSchedule = [];
    let remainingBalance = remainingAmount;
    
    for (let i = 0; i < numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterest;
      const principalPayment = installmentAmount - interestPayment;
      remainingBalance -= principalPayment;
      
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + (i + 1) * (paymentPlan === 'quarterly' ? 3 : paymentPlan === 'semester' ? 6 : 1));
      
      paymentSchedule.push({
        paymentNumber: i + 1,
        date: paymentDate.toDateString(),
        installmentAmount: Math.round(installmentAmount),
        interestPayment: Math.round(interestPayment),
        principalPayment: Math.round(principalPayment),
        remainingBalance: Math.max(0, Math.round(remainingBalance))
      });
    }

    setSimulationResults({
      installmentAmount: Math.round(installmentAmount),
      totalInterest: Math.round((installmentAmount * numberOfPayments) - remainingAmount),
      totalAmount: Math.round(downPayment + (installmentAmount * numberOfPayments)),
      paymentSchedule,
      savingsComparison: {
        lumpSum: feeData.totalFees,
        withPlan: Math.round(downPayment + (installmentAmount * numberOfPayments)),
        savings: Math.round(feeData.totalFees - (downPayment + (installmentAmount * numberOfPayments)))
      }
    });
  };

  useEffect(() => {
    calculatePaymentPlan();
  }, [paymentPlan, downPayment, interestRate, feeData]);

  // Chart data for payment visualization
  const paymentChartData = {
    labels: simulationResults?.paymentSchedule.map(p => p.date.slice(4, 10)) || [],
    datasets: [
      {
        label: 'Installment Amount',
        data: simulationResults?.paymentSchedule.map(p => p.installmentAmount) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
      {
        label: 'Remaining Balance',
        data: simulationResults?.paymentSchedule.map(p => p.remainingBalance) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
      }
    ]
  };

  const feeBreakdownData = {
    labels: ['Tuition Fee', 'Hostel Fee', 'Other Fees'],
    datasets: [{
      data: [feeData.tuitionFee, feeData.hostelFee, feeData.otherFees],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
      borderColor: ['#1E40AF', '#047857', '#D97706'],
      borderWidth: 2,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fee Payment Simulator</h1>
            <p className="text-gray-600">Plan your payments smartly with AI-powered insights</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fee Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Fees (₹)
                  </label>
                  <input
                    type="number"
                    value={feeData.totalFees}
                    onChange={(e) => setFeeData({...feeData, totalFees: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment (₹)
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Plan
                  </label>
                  <select
                    value={paymentPlan}
                    onChange={(e) => setPaymentPlan(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly (10 payments)</option>
                    <option value="quarterly">Quarterly (4 payments)</option>
                    <option value="semester">Semester (2 payments)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Fee Breakdown
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 h-64">
              <Pie data={feeBreakdownData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {simulationResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Payment Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Installment Amount:</span>
                <span className="font-semibold">₹{simulationResults.installmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold text-red-600">₹{simulationResults.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-800 font-medium">Total Amount:</span>
                <span className="font-bold text-xl">₹{simulationResults.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Smart Insights</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Recommendation:</strong> {paymentPlan === 'monthly' ? 'Good choice for better cash flow management' : 
                  paymentPlan === 'quarterly' ? 'Balanced approach with moderate payments' : 'Lowest total cost option'}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> Consider increasing down payment to reduce total interest by up to ₹{Math.round(simulationResults.totalInterest * 0.3).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Savings Analysis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Lump Sum:</span>
                <span>₹{simulationResults.savingsComparison.lumpSum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">With Plan:</span>
                <span>₹{simulationResults.savingsComparison.withPlan.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-800 font-medium">
                  {simulationResults.savingsComparison.savings >= 0 ? 'Savings:' : 'Additional Cost:'}
                </span>
                <span className={`font-bold ${simulationResults.savingsComparison.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(simulationResults.savingsComparison.savings).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Schedule */}
      {simulationResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment Schedule
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {simulationResults.paymentSchedule.map((payment, index) => (
                    <tr 
                      key={index}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedInstallment === index ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedInstallment(selectedInstallment === index ? null : index)}
                    >
                      <td className="px-4 py-3">{payment.paymentNumber}</td>
                      <td className="px-4 py-3">{payment.date}</td>
                      <td className="px-4 py-3 font-semibold">₹{payment.installmentAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">₹{payment.remainingBalance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Visualization</h3>
            <div className="h-64">
              <Line data={paymentChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '₹' + value.toLocaleString();
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePaymentSimulator;