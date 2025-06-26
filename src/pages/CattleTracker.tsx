
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock } from "lucide-react";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CattleData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: 'grazing' | 'resting' | 'moving';
  lastUpdate: string;
  health: 'good' | 'fair' | 'alert';
}

const CattleTracker = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Mock cattle data - in real implementation, this would come from your API
 const cattleData: CattleData[] = [
  { id: 1, name: "Bessie", lat: 8.97507, lng: 7.37631, status: "grazing", lastUpdate: "2 min ago", health: "good" },
  { id: 2, name: "Daisy", lat: 8.97530, lng: 7.37660, status: "resting", lastUpdate: "5 min ago", health: "good" },
  { id: 3, name: "Moobert", lat: 8.97480, lng: 7.37600, status: "moving", lastUpdate: "1 min ago", health: "fair" },
  { id: 4, name: "Clarabelle", lat: 8.97550, lng: 7.37700, status: "grazing", lastUpdate: "3 min ago", health: "good" },
  { id: 5, name: "Ferdinand", lat: 8.97470, lng: 7.37580, status: "resting", lastUpdate: "7 min ago", health: "alert" },
];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([8.97507, 7.37631], 16);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create custom icons for different statuses
    const createIcon = (status: string) => {
      const color = status === 'grazing' ? '#22c55e' : status === 'moving' ? '#f59e0b' : '#ef4444';
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    };

    // Add cattle markers
    cattleData.forEach(cattle => {
      const marker = L.marker([cattle.lat, cattle.lng], {
        icon: createIcon(cattle.status)
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">${cattle.name}</h3>
          <p class="text-sm text-gray-600">Status: ${cattle.status}</p>
          <p class="text-sm text-gray-600">Health: ${cattle.health}</p>
          <p class="text-sm text-gray-600">Last seen: ${cattle.lastUpdate}</p>
        </div>
      `);
    });

    // Add farm boundary (example polygon)
 const farmBoundary = [
    [8.9760, 7.3750],
    [8.9760, 7.3775],
    [8.9740, 7.3775],
    [8.9740, 7.3750]
  ];

    L.polygon(farmBoundary as L.LatLngExpression[], {
      color: '#1E7E34',
      fillColor: '#E8F5E8',
      fillOpacity: 0.3,
      weight: 2
    }).addTo(map).bindPopup('Farm Boundary');

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'grazing': return 'bg-green-100 text-green-800 border-green-200';
      case 'moving': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resting': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'bg-green-500';
      case 'fair': return 'bg-yellow-500';
      case 'alert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-farm-dark-green to-farm-forest-green p-6 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-2">Cattle Tracking</h2>
        <p className="text-green-100">Real-time location monitoring of 5 cattle using GPS tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="border-farm-medium-green/20 h-[600px]">
            <CardHeader>
              <CardTitle className="text-farm-dark-green flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Live Location Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapRef} className="w-full h-[520px] rounded-b-lg"></div>
            </CardContent>
          </Card>
        </div>

        {/* Cattle List */}
        <div className="space-y-4">
          <Card className="border-farm-medium-green/20">
            <CardHeader>
              <CardTitle className="text-farm-dark-green">Cattle Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cattleData.map(cattle => (
                <div key={cattle.id} className="p-4 border border-gray-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-farm-dark-green">{cattle.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${getHealthColor(cattle.health)}`}></div>
                  </div>
                  
                  <Badge className={getStatusColor(cattle.status)}>
                    {cattle.status}
                  </Badge>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>{cattle.lat.toFixed(4)}, {cattle.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{cattle.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="border-farm-medium-green/20">
            <CardHeader>
              <CardTitle className="text-farm-dark-green">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cattle:</span>
                <span className="font-bold text-farm-dark-green">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Grazing:</span>
                <span className="font-bold text-green-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resting:</span>
                <span className="font-bold text-blue-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moving:</span>
                <span className="font-bold text-yellow-600">1</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Health Alerts:</span>
                <span className="font-bold text-red-600">1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CattleTracker;
