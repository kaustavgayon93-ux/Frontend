"use client";
import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function LayerControls() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md border w-64 z-10">
      <div 
        className="flex justify-between items-center p-3 border-b cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold flex items-center"><Layers className="w-4 h-4 mr-2"/> Layers</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            {['Satellite Base', 'Project Boundaries', 'Sample Plots', 'NDVI Index', 'Biomass Map', 'Alerts'].map(layer => (
              <label key={layer} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" defaultChecked={layer === 'Project Boundaries' || layer === 'Satellite Base'} className="rounded text-forest-600 focus:ring-forest-500" />
                <span>{layer}</span>
              </label>
            ))}
          </div>
          <div className="pt-2 border-t">
            <label className="text-xs text-gray-500 block mb-1">Opacity</label>
            <input type="range" min="0" max="100" defaultValue="80" className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
