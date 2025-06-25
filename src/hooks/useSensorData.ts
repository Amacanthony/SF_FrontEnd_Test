
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface SensorData {
  timestamp: number;
  node_id: number;
  values: (number | null)[];
  distance: number | null;
  in_geofence: string | null;
}

export interface GreenhouseData {
  temperature: number;
  humidity: number;
  timestamp: number;
}

export interface SensorStats {
  totalNodes: number;
  avgWaterLevel: number;
  greenhouseTemperature: number;
  greenhouseHumidity: number;
}

// Configuration - UPDATE THESE SETTINGS TO MATCH YOUR FLASK SERVER
const API_CONFIG = {
  BASE_URL: 'https://smart-farm-test.onrender.com', // Change this to your Flask server IP address
  API_KEY: 'supersecure123', // Your Flask API key - change this to match your server
  ENDPOINTS: {
    SENSOR_DATA: '/api/sensor-data', // Using the new endpoint that returns all data
    INSTRUCTIONS: '/action/instructions'
  }
};

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [greenhouseData, setGreenhouseData] = useState<GreenhouseData | null>(null);

  // Fetch sensor data from your Flask API
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['sensorData'],
    queryFn: async () => {
      console.log('Fetching data from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SENSOR_DATA}`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SENSOR_DATA}?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.API_KEY // Using header authentication as per your Flask server
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch sensor data: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      return result;
    },
    refetchInterval: 2000, // Refetch every 10 seconds
    retry: 3,
    retryDelay: 5000
  });

  useEffect(() => {
    if (apiData && apiData.status === 'success' && apiData.data) {
      console.log('Processing sensor data:', apiData.data);
      
      // Process the received data
      const processedData: SensorData[] = Array.isArray(apiData.data) ? apiData.data : [apiData.data];
      setSensorData(processedData);

      // Extract greenhouse temperature and humidity from the most recent data
      // Temperature and humidity are greenhouse-wide, not per node
      const latestData = processedData[processedData.length - 1]; // Get most recent entry
      if (latestData && latestData.values && latestData.values.length >= 3) {
        setGreenhouseData({
          temperature: latestData.values[1] || 0, // val2 in your Flask API (index 1)
          humidity: latestData.values[2] || 0,    // val3 in your Flask API (index 2)
          timestamp: latestData.timestamp
        });
        console.log('Greenhouse data updated:', {
          temperature: latestData.values[1],
          humidity: latestData.values[2]
        });
      }
    }
  }, [apiData]);

  const getLatestByNode = (nodeId: number): SensorData | undefined => {
    // Get the most recent data for a specific node
    const nodeData = sensorData.filter(d => d.node_id === nodeId);
    return nodeData.length > 0 ? nodeData[nodeData.length - 1] : undefined;
  };

  const getWaterLevelByNode = (nodeId: number): number => {
    const nodeData = getLatestByNode(nodeId);
    return nodeData?.values[0] || 0; // val1 is water level (index 0)
  };

  const getStats = (): SensorStats => {
    if (sensorData.length === 0) {
      return { 
        totalNodes: 6, 
        avgWaterLevel: 0, 
        greenhouseTemperature: 0, 
        greenhouseHumidity: 0 
      };
    }

    // Calculate average water level across all nodes
    const waterLevels = [1, 2, 3, 4, 5, 6]
      .map(nodeId => getWaterLevelByNode(nodeId))
      .filter(level => level > 0);

    const avgWaterLevel = waterLevels.length > 0 
      ? waterLevels.reduce((sum, level) => sum + level, 0) / waterLevels.length 
      : 0;

    return {
      totalNodes: 6,
      avgWaterLevel: Math.round(avgWaterLevel),
      greenhouseTemperature: greenhouseData?.temperature || 0,
      greenhouseHumidity: greenhouseData?.humidity || 0
    };
  };

  return {
    sensorData,
    greenhouseData,
    getLatestByNode,
    getWaterLevelByNode,
    getStats,
    isLoading,
    error: error as Error | null
  };
};
