import React, { useState } from 'react';
import { getUserAvatar } from '../utils/helpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const ShopDashboardOverview = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('7d');

  // Function to get chart data based on time range
  const getChartDataByTimeRange = (range) => {
    const dataRanges = {
      '24h': {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
        salesData: [200, 400, 600, 800, 1200, 900, 300],
        ordersData: [5, 8, 12, 15, 20, 18, 8],
      },
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        salesData: [1200, 1900, 1700, 2100, 2300, 2800, 2400],
        ordersData: [20, 32, 28, 35, 38, 45, 40],
      },
      '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        salesData: [8400, 9200, 8800, 10200],
        ordersData: [140, 155, 148, 172],
      },
      '90d': {
        labels: ['Month 1', 'Month 2', 'Month 3'],
        salesData: [28600, 32400, 35200],
        ordersData: [485, 547, 593],
      }
    };
    return dataRanges[range] || dataRanges['7d'];
  };

  const currentChartData = getChartDataByTimeRange(timeRange);
  
  const metrics = [
    { label: 'Total Revenue', value: '$12,345', change: '+12%', trend: 'up' },
    { label: 'Orders', value: '156', change: '+8%', trend: 'up' },
    { label: 'Products Sold', value: '432', change: '+15%', trend: 'up' },
    { label: 'Customer Rating', value: '4.8', change: '+0.2', trend: 'up' }
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: '$45.99', status: 'delivered', time: '2 hours ago' },
    { id: '#12346', customer: 'Jane Smith', amount: '$23.50', status: 'processing', time: '4 hours ago' },
    { id: '#12347', customer: 'Mike Johnson', amount: '$67.20', status: 'shipped', time: '6 hours ago' }
  ];

  const topProducts = [
    { name: 'Organic Apples', sold: 45, revenue: '$225.00' },
    { name: 'Fresh Bananas', sold: 38, revenue: '$95.00' },
    { name: 'Green Spinach', sold: 32, revenue: '$128.00' }
  ];

  // Sales Trend Chart Data
  const salesTrendData = {
    labels: currentChartData.labels,
    datasets: [
      {
        label: 'Sales ($)',
        data: currentChartData.salesData,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Orders',
        data: currentChartData.ordersData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      }
    ],
  };

  const salesTrendOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Category Performance Chart Data
  const categoryPerformanceData = {
    labels: ['Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Fresh Fish', 'Others'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 2800, 2100, 1800, 1400, 900],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(34, 197, 94, 0.8)',   // Green  
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(245, 158, 11, 0.8)',  // Yellow
          'rgba(139, 69, 19, 0.8)',   // Brown
          'rgba(107, 114, 128, 0.8)', // Gray
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 69, 19, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const categoryPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': $' + context.parsed.toLocaleString();
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Weekly comparison data for bar chart
  const weeklyComparisonData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'This Month',
        data: [8400, 9200, 8800, 10200],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Last Month',
        data: [7200, 8100, 7800, 8900],
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
      },
    ],
  };

  const weeklyComparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 font-display text-slate-800 min-h-screen">
      <div className="flex min-h-screen w-full flex-col">
        {/* Header */}
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-600">Welcome back! Here's what's happening with your store.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 3 months</option>
                </select>
                <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                  Export Data
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <div key={index} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="text-sm">
                        {metric.trend === 'up' ? '📈' : '📉'}
                      </span>
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                    <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                      View all
                    </a>
                  </div>
                  
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-slate-600 text-xl">🧾</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{order.id}</p>
                            <p className="text-sm text-slate-600">{order.customer}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-slate-900">{order.amount}</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-xs text-slate-500">{order.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Top Products</h2>
                    <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                      View all
                    </a>
                  </div>
                  
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-600">{product.sold} sold</p>
                          </div>
                        </div>
                        <p className="font-medium text-slate-900">{product.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Sales Trend Chart */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Sales Trend</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-600">📈</span>
                    <span>+12% vs last week</span>
                  </div>
                </div>
                <div className="h-64">
                  <Line data={salesTrendData} options={salesTrendOptions} />
                </div>
              </div>
              
              {/* Category Performance Chart */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Category Performance</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-blue-600">📊</span>
                    <span>Revenue by category</span>
                  </div>
                </div>
                <div className="h-64">
                  <Doughnut data={categoryPerformanceData} options={categoryPerformanceOptions} />
                </div>
              </div>
            </div>

            {/* Additional Charts Row */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Weekly Comparison */}
              <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Weekly Comparison</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-purple-600">📈</span>
                    <span>This month vs last month</span>
                  </div>
                </div>
                <div className="h-64">
                  <Bar data={weeklyComparisonData} options={weeklyComparisonOptions} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-slate-900">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-lg">🎯</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Conversion Rate</p>
                        <p className="text-sm text-slate-600">+2.4% from last week</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-green-600">23.5%</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-lg">👥</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">New Customers</p>
                        <p className="text-sm text-slate-600">This week</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-blue-600">47</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-lg">🛒</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Avg Order Value</p>
                        <p className="text-sm text-slate-600">+$5.20 increase</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-purple-600">$79.15</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 text-lg">⭐</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Customer Satisfaction</p>
                        <p className="text-sm text-slate-600">Based on reviews</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-orange-600">4.8/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopDashboardOverview;