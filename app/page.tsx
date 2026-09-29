"use client";
import React, { useState, useEffect } from 'react';
import { FolderKanban, Map as MapIcon, Leaf, AlertTriangle, Plus, Play, FileText } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState<boolean>(true);
  
  useEffect(() => {
    setIsAuth(isLoggedIn());
  }, []);

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to MRV</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dashboard.</p>
          <Button onClick={() => setIsAuth(true)} className="w-full">Mock Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="space-x-2">
          <Link href="/projects">
            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Projects" 
          value="12" 
          icon={<FolderKanban className="w-5 h-5 text-blue-600" />} 
          trend="+2 this month"
        />
        <StatCard 
          title="Area Monitored (ha)" 
          value="45,230" 
          icon={<MapIcon className="w-5 h-5 text-green-600" />} 
        />
        <StatCard 
          title="Carbon Stock (tCO2e)" 
          value="1,240,500" 
          icon={<Leaf className="w-5 h-5 text-emerald-600" />} 
          trend="+5.2%"
        />
        <StatCard 
          title="Active Alerts" 
          value="3" 
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Projects</h3>
          <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
             <div className="p-4 border rounded hover:shadow-md transition">
                <div className="flex justify-between">
                   <h4 className="font-semibold text-forest-700">Kaziranga Extension</h4>
                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">ACTIVE</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Area: 1,200 ha | Carbon: 45,000 tCO2e</p>
             </div>
             <div className="p-4 border rounded hover:shadow-md transition">
                <div className="flex justify-between">
                   <h4 className="font-semibold text-forest-700">Manas Reforestation</h4>
                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">MONITORING</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Area: 3,400 ha | Carbon: 120,000 tCO2e</p>
             </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col gap-3">
            <Link href="/satellite" className="w-full">
              <Button variant="outline" className="w-full justify-start"><Play className="w-4 h-4 mr-2 text-blue-500" /> Start Ingestion</Button>
            </Link>
            <Link href="/carbon" className="w-full">
              <Button variant="outline" className="w-full justify-start"><FileText className="w-4 h-4 mr-2 text-green-500" /> View Reports</Button>
            </Link>
            <Link href="/audit" className="w-full">
               <Button variant="outline" className="w-full justify-start"><Shield className="w-4 h-4 mr-2 text-purple-500" /> Audit Ledger</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
