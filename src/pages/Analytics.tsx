
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { useSensorData } from '@/hooks/useSensorData';

const Analytics = () => {
  const { sensorData, greenhouseData, getStats, isLoading, error } = useSensorData();

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-2">Farm Analytics</h2>
          <p className="text-green-100">Comprehensive data analysis and insights from your smart farm</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <span className="text-red-700">Error loading analytics data: {error.message}</span>
        </div>
      </div>
    );
  }

  if (isLoading || sensorData.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-2">Farm Analytics</h2>
          <p className="text-green-100">Comprehensive data analysis and insights from your smart farm</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <span className="text-blue-700">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  const stats = getStats();

  // Prepare data for different charts
  const recentData = sensorData.slice(0, 24).reverse();
  const dailyTrends = recentData.map((d, index) => ({
    time: new Date(d.timestamp * 1000).getHours() + ':00',
    temperature: greenhouseData?.temperature || 0,
    humidity: greenhouseData?.humidity || 0,
    waterLevel: d.values[0] || 0
  }));

  const nodeComparison = [1, 2, 3, 4, 5, 6].map(nodeId => {
    const nodeData = sensorData.find(d => d.node_id === nodeId);
    return {
      node: `Node ${nodeId}`,
      waterLevel: nodeData?.values[0] || 0,
      status: (nodeData?.values[0] || 0) > 70 ? 'Good' : (nodeData?.values[0] || 0) > 30 ? 'Warning' : 'Critical'
    };
  });

  const statusDistribution = [
    { 
      name: 'Optimal', 
      value: nodeComparison.filter(n => n.waterLevel > 70).length,
      color: '#22c55e' 
    },
    { 
      name: 'Warning', 
      value: nodeComparison.filter(n => n.waterLevel > 30 && n.waterLevel <= 70).length,
      color: '#eab308' 
    },
    { 
      name: 'Critical', 
      value: nodeComparison.filter(n => n.waterLevel <= 30).length,
      color: '#ef4444' 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-2">Farm Analytics</h2>
        <p className="text-green-100">Comprehensive data analysis and insights from your smart farm</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-farm-medium-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <TrendingUp className="h-4 w-4 text-farm-medium-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{stats.totalNodes}</div>
            <p className="text-xs text-green-600">Active sensor nodes</p>
          </CardContent>
        </Card>

        <Card className="border-farm-medium-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Water Level</CardTitle>
            <BarChart3 className="h-4 w-4 text-farm-medium-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{Math.round(stats.avgWaterLevel)}%</div>
            <p className="text-xs text-green-600">Across all nodes</p>
          </CardContent>
        </Card>

        <Card className="border-farm-medium-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Activity className="h-4 w-4 text-farm-medium-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{Math.round(stats.greenhouseTemperature)}°C</div>
            <p className="text-xs text-green-600">Greenhouse</p>
          </CardContent>
        </Card>

        <Card className="border-farm-medium-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <PieChartIcon className="h-4 w-4 text-farm-medium-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{Math.round(stats.greenhouseHumidity)}%</div>
            <p className="text-xs text-green-600">Current level</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <Card className="border-farm-medium-green/20">
          <CardHeader>
            <CardTitle className="text-farm-dark-green">Environmental Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#fee2e2"
                  name="Temperature (°C)"
                />
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  stackId="2"
                  stroke="#3b82f6" 
                  fill="#dbeafe"
                  name="Humidity (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Node Comparison */}
        <Card className="border-farm-medium-green/20">
          <CardHeader>
            <CardTitle className="text-farm-dark-green">Water Level by Node</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nodeComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="node" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="waterLevel" fill="#1E7E34" name="Water Level (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-farm-medium-green/20">
          <CardHeader>
            <CardTitle className="text-farm-dark-green">Node Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature History */}
        <Card className="border-farm-medium-green/20">
          <CardHeader>
            <CardTitle className="text-farm-dark-green">Temperature History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card className="border-farm-medium-green/20">
        <CardHeader>
          <CardTitle className="text-farm-dark-green">Current System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Active Nodes</h4>
              <p className="text-sm text-green-700">
                {stats.totalNodes} sensor nodes are currently active and reporting data.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Climate Control</h4>
              <p className="text-sm text-blue-700">
                Greenhouse temperature: {Math.round(stats.greenhouseTemperature)}°C, 
                Humidity: {Math.round(stats.greenhouseHumidity)}%
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Water Management</h4>
              <p className="text-sm text-yellow-700">
                Average water level across all nodes: {Math.round(stats.avgWaterLevel)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
