"use client";
import React, { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TreeForm from './tree-form';

export default function PlotForm({ onBack }: { onBack: () => void }) {
  const [showTreeForm, setShowTreeForm] = useState(false);
  const [location, setLocation] = useState<{lat: number, lon: number, acc: number} | null>(null);

  const getGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy });
      });
    }
  };

  if (showTreeForm) {
    return <TreeForm onBack={() => setShowTreeForm(false)} onFinish={onBack} />;
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pt-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5"/></Button>
        <h2 className="text-xl font-bold">New Plot Details</h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <select className="w-full h-12 border rounded-md px-3 text-lg">
            <option>Kaziranga Buffer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plot Code</label>
          <Input className="h-12 text-lg" placeholder="e.g. KAZ-005" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
          <Input type="number" className="h-12 text-lg" defaultValue="15" />
        </div>

        <div className="pt-2 border-t mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">GPS Location</label>
          {location ? (
            <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm mb-3">
              Lat: {location.lat.toFixed(6)} <br/>
              Lon: {location.lon.toFixed(6)} <br/>
              Accuracy: ±{location.acc.toFixed(1)}m
            </div>
          ) : (
             <Button variant="outline" className="w-full h-12 mb-3" onClick={getGPS}>
               <MapPin className="w-5 h-5 mr-2" /> Capture Current GPS
             </Button>
          )}
        </div>
      </div>

      <Button 
        className="w-full h-14 text-lg bg-forest-600 hover:bg-forest-700 shadow-md mt-6"
        onClick={() => setShowTreeForm(true)}
      >
        Save & Add Trees
      </Button>
    </div>
  );
}
