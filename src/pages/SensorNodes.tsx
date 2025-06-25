
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Thermometer, Gauge, Wifi, AlertTriangle, MapPin } from "lucide-react";
import { useSensorData } from '@/hooks/useSensorData';

const SensorNodes = () => {
  const { sensorData, greenhouseData, getLatestByNode, getWaterLevelByNode, isLoading, error } = useSensorData();

  const getWaterStatusColor = (value: number) => {
    if (value > 70) return 'bg-green-500';
    if (value > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getWaterStatusText = (value: number) => {
    if (value > 70) return 'Optimal';
    if (value > 30) return 'Low';
    return 'Critical';
  };

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-2">Sensor Node Monitoring</h2>
          <p className="text-green-100">Real-time status of all 6 water level detection nodes</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">Failed to connect to sensor API: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-2">Sensor Node Monitoring</h2>
        <p className="text-green-100">Real-time status of all 6 water level detection nodes</p>
        {isLoading && <p className="text-green-200 text-sm">Loading sensor data...</p>}
      </div>

      {/* Greenhouse Climate Summary */}
      {greenhouseData && (
        <Card className="border-farm-medium-green/20">
          <CardHeader>
            <CardTitle className="text-xl text-farm-dark-green flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Greenhouse Climate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <Thermometer className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-farm-dark-green">
                    {Math.round(greenhouseData.temperature)}°C
                  </div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-farm-dark-green">
                    {Math.round(greenhouseData.humidity)}%
                  </div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(greenhouseData.timestamp * 1000).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Water Level Sensor Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map(nodeId => {
          const nodeData = getLatestByNode(nodeId);
          const waterLevel = getWaterLevelByNode(nodeId);
          const distance = nodeData?.distance || 0;
          const inGeofence = nodeData?.in_geofence === 'true';
          const lastUpdate = nodeData ? new Date(nodeData.timestamp * 1000).toLocaleTimeString() : 'No data';

          return (
            <Card key={nodeId} className="border-farm-medium-green/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-farm-dark-green flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Water Sensor Node {nodeId}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${inGeofence ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}`}
                  >
                    {inGeofence ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Last update: {lastUpdate}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Water Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Water Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-farm-dark-green">{Math.round(waterLevel)}%</span>
                      <Badge className={`${getWaterStatusColor(waterLevel)} text-white`}>
                        {getWaterStatusText(waterLevel)}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${getWaterStatusColor(waterLevel)}`}
                      style={{ width: `${waterLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Distance */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Distance to water surface</span>
                  </div>
                  <span className="font-medium text-farm-dark-green">{Math.round(distance)}cm</span>
                </div>

                {/* Alerts */}
                {waterLevel < 30 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      Critical water level detected. Immediate attention required.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SensorNodes;
