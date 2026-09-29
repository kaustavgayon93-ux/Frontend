"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, RefreshCw, Wifi, WifiOff, TreePine, MapPin, 
  CheckCircle2, Clock, Trash2, Eye, ShieldCheck, Download, ChevronRight, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PlotForm from './plot-form';
import { 
  getStoredPlots, getPendingPlots, syncAllPending, deletePlotLocally, 
  LocalPlot, resetDemoData 
} from '@/lib/offline-store';

export default function FieldCollectPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [selectedPlotToEdit, setSelectedPlotToEdit] = useState<LocalPlot | undefined>(undefined);
  const [inspectPlot, setInspectPlot] = useState<LocalPlot | null>(null);
  
  const [plots, setPlots] = useState<LocalPlot[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const refreshData = () => {
    const stored = getStoredPlots();
    setPlots(stored);
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    refreshData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pendingCount = plots.filter(p => !p.synced).length;
  const totalTreesLogged = plots.reduce((acc, p) => acc + (p.trees?.length || 0), 0);
  const totalBiomassMg = plots.reduce((acc, p) => {
    const plotAgb = (p.trees || []).reduce((tAcc, t) => tAcc + (t.agbKg || 0), 0);
    return acc + plotAgb;
  }, 0) / 1000;

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncAllPending();
      setSyncMessage(result.message);
      refreshData();
    } catch (err: any) {
      setSyncMessage(`Sync warning: ${err?.message || 'Server unreachable, cached locally.'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = (plotId: string, plotCode: string) => {
    if (confirm(`Are you sure you want to delete plot survey ${plotCode}?`)) {
      deletePlotLocally(plotId);
      refreshData();
      if (inspectPlot?.id === plotId) setInspectPlot(null);
    }
  };

  if (showPlotForm) {
    return (
      <PlotForm 
        initialData={selectedPlotToEdit}
        onBack={() => {
          setShowPlotForm(false);
          setSelectedPlotToEdit(undefined);
          refreshData();
        }} 
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-3 pb-24 px-3 sm:px-0">
      {/* Top Banner & Network Liveness */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TreePine className="w-5 h-5 text-forest-700" />
            Field Data Collection (MRV)
          </h2>
          <p className="text-xs text-gray-500">Offline-first mobile application for Assam forest enumerators</p>
        </div>

        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800 animate-pulse'
        }`}>
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isOnline ? 'Cloud Online' : 'Offline Buffer Mode'}
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs flex items-start gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Sync Notification</p>
            <p>{syncMessage}</p>
          </div>
          <button onClick={() => setSyncMessage(null)} className="text-emerald-700 font-bold hover:text-emerald-900">×</button>
        </div>
      )}

      {/* Quick Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
          <span className="text-[11px] text-gray-500 uppercase font-semibold block">Pending Sync</span>
          <span className={`text-2xl font-black ${pendingCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
            {pendingCount}
          </span>
          <span className="text-[10px] text-gray-400 block">plot surveys</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
          <span className="text-[11px] text-gray-500 uppercase font-semibold block">Trees Enumerated</span>
          <span className="text-2xl font-black text-gray-900">{totalTreesLogged}</span>
          <span className="text-[10px] text-gray-400 block">individual trees</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border shadow-sm text-center">
          <span className="text-[11px] text-gray-500 uppercase font-semibold block">Logged Biomass</span>
          <span className="text-2xl font-black text-forest-700">{totalBiomassMg.toFixed(2)}</span>
          <span className="text-[10px] text-gray-400 block">Mg (tonnes) AGB</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          className="h-16 text-base bg-forest-700 hover:bg-forest-800 text-white font-bold shadow-md rounded-xl flex items-center justify-center gap-2"
          onClick={() => {
            setSelectedPlotToEdit(undefined);
            setShowPlotForm(true);
          }}
        >
          <Plus className="w-6 h-6" /> Start New Plot Survey
        </Button>

        <Button 
          className={`h-16 text-base font-bold shadow-md rounded-xl flex items-center justify-center gap-2 ${
            pendingCount === 0
              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={pendingCount === 0 || isSyncing}
          onClick={handleSyncAll}
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronizing Data...' : `Sync All to ASSAC Cloud (${pendingCount})`}
        </Button>
      </div>

      {/* Saved / Cached Offline Plots List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-gray-900 text-base">
            Local Survey Queue ({plots.length})
          </h3>
          <button 
            type="button" 
            onClick={() => {
              if (confirm('Reset to standard Assam demo survey plots?')) {
                resetDemoData();
                refreshData();
              }
            }} 
            className="text-xs text-forest-700 hover:underline"
          >
            Reset Demo Records
          </button>
        </div>

        {plots.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
            <TreePine className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold">No survey records cached locally.</p>
            <p className="text-xs text-gray-400 mt-1">Tap "Start New Plot Survey" above to record ground-truth data.</p>
          </div>
        ) : (
          plots.map((plot) => {
            const plotAgb = (plot.trees || []).reduce((acc, t) => acc + (t.agbKg || 0), 0);
            const plotCarbon = (plot.trees || []).reduce((acc, t) => acc + (t.carbonKg || 0), 0);
            const plotTco2e = (plotCarbon * (44 / 12)) / 1000;

            return (
              <Card key={plot.id} className="hover:shadow-md transition overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-gray-900">{plot.plotCode}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          plot.synced 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {plot.synced ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {plot.synced ? 'Synced to Cloud' : 'Pending Upload'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {plot.divisionName} • {plot.range} ({plot.beat})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-forest-700 block">
                        {plotTco2e.toFixed(2)} tCO2e
                      </span>
                      <span className="text-[10px] text-gray-400">Est. Carbon</span>
                    </div>
                  </div>

                  {/* Badges / Metrics Strip */}
                  <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2.5 rounded-lg text-[11px] text-gray-700">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Trees</span>
                      <span className="font-bold text-gray-900">{plot.trees?.length || 0} stems</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">AGB</span>
                      <span className="font-bold text-gray-900">{(plotAgb / 1000).toFixed(2)} Mg</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">GPS Fix</span>
                      <span className="font-mono text-gray-900">±{plot.accuracyM || 3}m</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Canopy</span>
                      <span className="font-bold text-gray-900">{plot.canopyDensityPercent || 70}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-1 border-t text-xs">
                    <span className="text-gray-400 text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {plot.lat?.toFixed(4)}°N, {plot.lng?.toFixed(4)}°E
                    </span>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs"
                        onClick={() => setInspectPlot(plot)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Trees
                      </Button>

                      <button
                        type="button"
                        onClick={() => handleDelete(plot.id, plot.plotCode)}
                        className="text-gray-400 hover:text-red-600 p-1.5 transition"
                        title="Delete Plot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Inspect Trees Modal Dialog */}
      {inspectPlot && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Plot {inspectPlot.plotCode} - Tree Registry
                </h3>
                <p className="text-xs text-gray-500">{inspectPlot.divisionName} • {inspectPlot.surveyDate}</p>
              </div>
              <button 
                onClick={() => setInspectPlot(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl px-2"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs flex justify-between">
                <div>
                  <span className="text-gray-500 block">Plot Location:</span>
                  <span className="font-mono font-medium">{inspectPlot.lat.toFixed(5)}°N, {inspectPlot.lng.toFixed(5)}°E (±{inspectPlot.accuracyM}m)</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Surveyor:</span>
                  <span className="font-medium">{inspectPlot.surveyorName}</span>
                </div>
              </div>

              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-600">
                Individual Stem Measurements ({inspectPlot.trees?.length || 0})
              </h4>

              <div className="space-y-2">
                {inspectPlot.trees?.map((t, idx) => (
                  <div key={t.id || idx} className="p-3 bg-gray-50 rounded-lg border text-xs flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-forest-800">{t.tagNumber}</span>
                        <span className="font-medium text-gray-900">{t.speciesVernacular}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 italic">{t.speciesScientific}</span>
                      <div className="flex gap-3 text-[11px] text-gray-600 mt-1">
                        <span>DBH: <b>{t.dbhCm} cm</b></span>
                        <span>Height: <b>{t.heightM} m</b></span>
                        <span>Density: <b>{t.woodDensity} g/cm³</b></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-forest-700 block">{t.agbKg} kg AGB</span>
                      <span className="text-[10px] text-emerald-600 font-medium">{(t.carbonKg || 0)} kg C</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold inline-block mt-0.5 ${
                        t.healthStatus === 'HEALTHY' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.healthStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <Button onClick={() => setInspectPlot(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
