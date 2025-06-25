
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Thermometer, Droplets, Wifi, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSensorData } from '@/hooks/useSensorData';

const Dashboard = () => {
  const { sensorData, greenhouseData, getWaterLevelByNode, getStats, isLoading, error } = useSensorData();
  const stats = getStats();

  // Prepare temperature data for chart
  const temperatureData = sensorData
    .filter(d => d.values[1] !== null && d.values[2] !== null)
    .slice(0, 24)
    .map(d => ({
      time: new Date(d.timestamp * 1000).toLocaleTimeString(),
      temperature: d.values[1],
      humidity: d.values[2]
    }))
    .reverse();

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            Failed to connect to sensor API: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-2">Farm Overview</h2>
        <p className="text-green-100">Real-time monitoring of 6 sensor nodes and 5 cattle</p>
        {isLoading && <p className="text-green-200 text-sm">Loading sensor data...</p>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-farm-medium-green/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Nodes</CardTitle>
            <Wifi className="h-4 w-4 text-farm-medium-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{stats.totalNodes}</div>
            <p className="text-xs text-green-600">Water level sensors</p>
          </CardContent>
        </Card>

        <Card className="border-farm-medium-green/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Greenhouse Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{Math.round(stats.greenhouseHumidity)}%</div>
            <p className="text-xs text-green-600">Overall greenhouse</p>
          </CardContent>
        </Card>

        <Card className="border-farm-medium-green/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Water Level</CardTitle>
            <Droplets className="h-4 w-4 text-farm-medium-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{stats.avgWaterLevel}%</div>
            <p className="text-xs text-green-600">Across all nodes</p>
          </CardContent>
        </Card>

        <Card className="border-farm-medium-green/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Greenhouse Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-dark-green">{Math.round(stats.greenhouseTemperature)}°C</div>
            <p className="text-xs text-green-600">Overall greenhouse</p>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Nodes Grid - Water Level Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(nodeId => {
          const waterLevel = getWaterLevelByNode(nodeId);

          return (
            <Card key={nodeId} className="border-farm-medium-green/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-farm-dark-green">Water Sensor Node {nodeId}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Water Level</span>
                  <span className="font-bold text-farm-medium-green">{Math.round(waterLevel)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-farm-medium-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${waterLevel}%` }}
                  ></div>
                </div>
                {waterLevel < 30 && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Low water level detected
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Greenhouse Temperature & Humidity Chart */}
      <Card className="border-farm-medium-green/20">
        <CardHeader>
          <CardTitle className="text-farm-dark-green">Greenhouse Climate Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {temperatureData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
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
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              {isLoading ? 'Loading climate data...' : 'No climate data available'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
