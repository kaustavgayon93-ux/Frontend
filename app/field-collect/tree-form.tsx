"use client";
import React, { useState } from 'react';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TreeForm({ onBack, onFinish }: { onBack: () => void, onFinish: () => void }) {
  const [treeCount, setTreeCount] = useState(0);
  const [dbh, setDbh] = useState('');
  const [height, setHeight] = useState('');

  // AGB = 0.0673 * (density * dbh^2 * height)^0.976 (Chave et al)
  const calculateAGB = () => {
    const d = parseFloat(dbh);
    const h = parseFloat(height);
    if (!d || !h) return 0;
    const density = 0.65; // average tropical
    return 0.0673 * Math.pow((density * d * d * h), 0.976);
  };

  const handleSave = () => {
    setTreeCount(prev => prev + 1);
    setDbh('');
    setHeight('');
    // Focus first input (in real app)
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pt-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5"/></Button>
          <h2 className="text-xl font-bold">Add Tree</h2>
        </div>
        <div className="bg-forest-100 text-forest-800 px-3 py-1 rounded-full font-bold text-sm">
          {treeCount} Trees Added
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Number</label>
          <Input className="h-12 text-lg" placeholder="e.g. T-101" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
          <Input className="h-12 text-lg" placeholder="Common or scientific name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DBH (cm)</label>
            <Input 
              type="number" 
              className="h-12 text-lg" 
              value={dbh} 
              onChange={e => setDbh(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (m)</label>
            <Input 
              type="number" 
              className="h-12 text-lg" 
              value={height} 
              onChange={e => setHeight(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md text-sm flex justify-between items-center border">
           <span className="text-gray-500">Live Biomass Estimate:</span>
           <span className="font-bold text-emerald-600">{calculateAGB().toFixed(1)} kg</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <Button 
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-md"
          onClick={handleSave}
        >
          <Save className="w-5 h-5 mr-2" /> Save & Add Another
        </Button>
        <Button 
          variant="outline"
          className="w-full h-14 text-lg"
          onClick={onFinish}
        >
          <CheckCircle className="w-5 h-5 mr-2" /> Finish Plot
        </Button>
      </div>
    </div>
  );
}
