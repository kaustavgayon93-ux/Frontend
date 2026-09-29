"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, CheckCircle, TreePine, Sparkles, Trash2, ShieldCheck, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ASSAM_TREE_SPECIES, computeTreeCarbonMetrics, TreeSpecies } from '@/lib/assam-data';
import { LocalPlot, LocalTree, savePlotLocally } from '@/lib/offline-store';

interface TreeFormProps {
  plotData: Partial<LocalPlot>;
  onBack: () => void;
  onFinish: () => void;
}

export default function TreeForm({ plotData, onBack, onFinish }: TreeFormProps) {
  const [trees, setTrees] = useState<LocalTree[]>(plotData.trees || []);
  
  // Current tree state
  const [tagNumber, setTagNumber] = useState(`T-${String((trees.length + 1)).padStart(2, '0')}`);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(ASSAM_TREE_SPECIES[0].id);
  const [dbh, setDbh] = useState<string>('28.5');
  const [height, setHeight] = useState<string>('16.0');
  const [crownDiameter, setCrownDiameter] = useState<string>('5.5');
  const [healthStatus, setHealthStatus] = useState<'HEALTHY' | 'STRESSED' | 'DAMAGED' | 'DEAD'>('HEALTHY');

  const currentSpecies: TreeSpecies = ASSAM_TREE_SPECIES.find(s => s.id === selectedSpeciesId) || ASSAM_TREE_SPECIES[0];
  const woodDensity = currentSpecies.woodDensity;

  // Live calculation
  const metrics = computeTreeCarbonMetrics(parseFloat(dbh) || 0, parseFloat(height) || 0, woodDensity);

  const handleAddTree = () => {
    const d = parseFloat(dbh);
    const h = parseFloat(height);
    if (!d || d <= 0 || !h || h <= 0) {
      alert('Please enter valid DBH and Height values');
      return;
    }

    const newTree: LocalTree = {
      id: `tree-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tagNumber: tagNumber || `T-${trees.length + 1}`,
      speciesVernacular: currentSpecies.vernacular,
      speciesScientific: currentSpecies.scientific,
      dbhCm: d,
      heightM: h,
      crownDiameterM: parseFloat(crownDiameter) || undefined,
      woodDensity: woodDensity,
      healthStatus: healthStatus,
      agbKg: metrics.agbKg,
      bgbKg: metrics.bgbKg,
      carbonKg: metrics.carbonKg,
      tco2eKg: Number((metrics.tco2e * 1000).toFixed(2)), // in kg
      measuredAt: new Date().toISOString()
    };

    const updatedTrees = [...trees, newTree];
    setTrees(updatedTrees);

    // Save state into current plot
    const updatedPlot: LocalPlot = {
      ...(plotData as LocalPlot),
      trees: updatedTrees,
      synced: false
    };
    savePlotLocally(updatedPlot);

    // Reset for next tree
    setTagNumber(`T-${String(updatedTrees.length + 1).padStart(2, '0')}`);
    setDbh('');
    setHeight('');
  };

  const handleDeleteTree = (treeId: string) => {
    const updatedTrees = trees.filter(t => t.id !== treeId);
    setTrees(updatedTrees);
    const updatedPlot: LocalPlot = {
      ...(plotData as LocalPlot),
      trees: updatedTrees,
      synced: false
    };
    savePlotLocally(updatedPlot);
  };

  const handleCompletePlot = () => {
    if (trees.length === 0) {
      if (!confirm('No trees added yet. Do you want to finish and save this plot without trees?')) {
        return;
      }
    }
    const finalPlot: LocalPlot = {
      ...(plotData as LocalPlot),
      trees: trees,
      synced: false
    };
    savePlotLocally(finalPlot);
    onFinish();
  };

  // Cumulative metrics for plot
  const plotTotalAgb = trees.reduce((acc, t) => acc + t.agbKg, 0);
  const plotTotalCarbon = trees.reduce((acc, t) => acc + t.carbonKg, 0);
  const plotTotalTco2e = (plotTotalCarbon * (44 / 12)) / 1000;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-3 pb-24 px-3 sm:px-0">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-forest-600" />
              Plot {plotData.plotCode || 'Survey'} Trees
            </h2>
            <p className="text-xs text-gray-500">{plotData.divisionName || 'Assam Division'} • R: {plotData.radiusMeters || 15}m</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block bg-forest-100 text-forest-800 px-3 py-1 rounded-full font-bold text-sm">
            {trees.length} Trees Logged
          </span>
        </div>
      </div>

      {/* Plot Live Summary Bar */}
      <div className="grid grid-cols-3 gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
        <div>
          <span className="text-xs text-emerald-700 block">Total AGB</span>
          <span className="text-base font-bold text-emerald-950">{(plotTotalAgb / 1000).toFixed(2)} Mg</span>
        </div>
        <div>
          <span className="text-xs text-emerald-700 block">Carbon Stock</span>
          <span className="text-base font-bold text-emerald-950">{(plotTotalCarbon / 1000).toFixed(2)} tC</span>
        </div>
        <div>
          <span className="text-xs text-emerald-700 block">CO2 Equivalent</span>
          <span className="text-base font-bold text-forest-700">{plotTotalTco2e.toFixed(3)} tCO2e</span>
        </div>
      </div>

      {/* Tree Entry Form Card */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Tree Measurement #{trees.length + 1}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">FSI / Chave Allometric</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Tree Tag / Identifier
            </label>
            <Input 
              value={tagNumber} 
              onChange={e => setTagNumber(e.target.value)}
              className="h-11 font-mono text-base"
              placeholder="e.g. T-01"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Species (Assam Flora)
            </label>
            <select
              value={selectedSpeciesId}
              onChange={e => setSelectedSpeciesId(e.target.value)}
              className="w-full h-11 border border-gray-300 rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              {ASSAM_TREE_SPECIES.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.vernacular} ({sp.scientific}) - {sp.woodDensity} g/cm³
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DBH & Height Inputs with Real-time Biomass Feedback */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              DBH (cm) *
            </label>
            <Input
              type="number"
              step="0.1"
              value={dbh}
              onChange={e => setDbh(e.target.value)}
              className="h-11 text-base font-semibold text-gray-900"
              placeholder="25.0"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">At 1.37m breast ht</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Height (m) *
            </label>
            <Input
              type="number"
              step="0.5"
              value={height}
              onChange={e => setHeight(e.target.value)}
              className="h-11 text-base font-semibold text-gray-900"
              placeholder="15.0"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">Total tree height</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Crown Dia (m)
            </label>
            <Input
              type="number"
              step="0.5"
              value={crownDiameter}
              onChange={e => setCrownDiameter(e.target.value)}
              className="h-11 text-base"
              placeholder="5.0"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">Avg crown spread</span>
          </div>
        </div>

        {/* Tree Health Status Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Condition & Health
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'HEALTHY', label: 'Healthy', color: 'border-green-500 bg-green-50 text-green-800' },
              { id: 'STRESSED', label: 'Stressed', color: 'border-amber-500 bg-amber-50 text-amber-800' },
              { id: 'DAMAGED', label: 'Damaged', color: 'border-orange-500 bg-orange-50 text-orange-800' },
              { id: 'DEAD', label: 'Dead / Snag', color: 'border-red-500 bg-red-50 text-red-800' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setHealthStatus(item.id as any)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                  healthStatus === item.id ? `${item.color} ring-2 ring-forest-500` : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live On-Field Allometric Biomass Computation Display */}
        <div className="bg-gradient-to-r from-forest-50 to-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between items-center text-xs text-forest-800 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              Live Allometric Output ({currentSpecies.scientific})
            </span>
            <span className="font-mono text-emerald-700">ρ = {woodDensity} g/cm³</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="bg-white/80 rounded-lg p-2 border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">AGB</span>
              <span className="text-sm font-bold text-gray-900">{metrics.agbKg} kg</span>
            </div>
            <div className="bg-white/80 rounded-lg p-2 border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">BGB (Roots)</span>
              <span className="text-sm font-bold text-gray-900">{metrics.bgbKg} kg</span>
            </div>
            <div className="bg-white/80 rounded-lg p-2 border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">Carbon</span>
              <span className="text-sm font-bold text-emerald-600">{metrics.carbonKg} kg</span>
            </div>
            <div className="bg-white/80 rounded-lg p-2 border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">CO2e</span>
              <span className="text-sm font-bold text-forest-700">{(metrics.tco2e * 1000).toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        {/* Add Tree Button */}
        <Button 
          type="button" 
          onClick={handleAddTree} 
          className="w-full h-12 bg-forest-700 hover:bg-forest-800 text-white font-semibold text-base shadow-sm"
        >
          <Save className="w-5 h-5 mr-2" /> Add Tree to Plot #{plotData.plotCode}
        </Button>
      </div>

      {/* Logged Trees Table in Current Plot */}
      {trees.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-3.5 bg-gray-50 border-b flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 text-sm">
              Trees Recorded in this Plot ({trees.length})
            </h4>
            <span className="text-xs text-gray-500">Auto-saved to local offline storage</span>
          </div>

          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Tag</th>
                  <th className="p-2.5">Species</th>
                  <th className="p-2.5">DBH (cm)</th>
                  <th className="p-2.5">Height (m)</th>
                  <th className="p-2.5">AGB (kg)</th>
                  <th className="p-2.5">Health</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {trees.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-2.5 font-bold font-mono">{t.tagNumber}</td>
                    <td className="p-2.5 font-medium">{t.speciesVernacular}</td>
                    <td className="p-2.5">{t.dbhCm}</td>
                    <td className="p-2.5">{t.heightM}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{t.agbKg}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        t.healthStatus === 'HEALTHY' ? 'bg-green-100 text-green-800' :
                        t.healthStatus === 'STRESSED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {t.healthStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteTree(t.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete tree"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Completion Buttons */}
      <div className="space-y-2 pt-2">
        <Button 
          type="button" 
          onClick={handleCompletePlot}
          className="w-full h-13 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Complete Plot Survey ({trees.length} Trees)
        </Button>
        <p className="text-center text-xs text-gray-500">
          Plot will be saved offline and queued for synchronization to ASSAC Cloud.
        </p>
      </div>
    </div>
  );
}
