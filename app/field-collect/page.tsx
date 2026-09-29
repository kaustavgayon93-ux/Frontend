"use client";
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PlotForm from './plot-form';

export default function FieldCollectPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [pendingCount, setPendingCount] = useState(2); // mock

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showPlotForm) {
    return <PlotForm onBack={() => setShowPlotForm(false)} />;
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold">Field Collection</h2>
        <div className={`flex items-center gap-2 text-sm font-medium ${isOnline ? 'text-green-600' : 'text-amber-600'}`}>
          {isOnline ? <Wifi className="w-4 h-4"/> : <WifiOff className="w-4 h-4"/>}
          {isOnline ? 'Online' : 'Offline Mode'}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold">{pendingCount}</span>
        </div>
        <h3 className="font-semibold text-lg">Pending Submissions</h3>
        <p className="text-gray-500 text-sm mb-4">Plots recorded offline waiting to be synced.</p>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={!isOnline || pendingCount === 0}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Sync All Data
        </Button>
      </div>

      <Button 
        className="w-full h-16 text-lg bg-forest-600 hover:bg-forest-700 shadow-md"
        onClick={() => setShowPlotForm(true)}
      >
        <Plus className="w-6 h-6 mr-2" /> New Plot Survey
      </Button>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 px-2">Recent Offline Data</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Plot KAZ-{100+i}</h4>
                  <p className="text-xs text-gray-500">12 trees recorded</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Pending Sync</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
