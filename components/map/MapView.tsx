"use client";

import React, { useState } from 'react';
import { 
  Layers, MapPin, AlertTriangle, Eye, ZoomIn, 
  Satellite, ShieldAlert, Sparkles, X, ChevronRight, Compass
} from 'lucide-react';
import { 
  ASSAM_DIVISIONS, INITIAL_SAMPLE_PLOTS, REMOTE_SENSING_ALERTS, 
  ForestDivision, SamplePlotRecord, RemoteSensingAlert 
} from '@/lib/assam-data';

interface MapViewProps {
  selectedDivisionId?: string;
  onSelectDivision?: (divisionId: string) => void;
  height?: string;
}

export default function MapView({ 
  selectedDivisionId, 
  onSelectDivision, 
  height = '560px' 
}: MapViewProps) {
  // Map display settings
  const [baseMap, setBaseMap] = useState<'satellite' | 'street'>('satellite');
  const [showDivisions, setShowDivisions] = useState(true);
  const [showNdviOverlay, setShowNdviOverlay] = useState(true);
  const [showSamplePlots, setShowSamplePlots] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);

  // Selected item modal / popup
  const [activePlot, setActivePlot] = useState<SamplePlotRecord | null>(null);
  const [activeAlert, setActiveAlert] = useState<RemoteSensingAlert | null>(null);
  const [activeDivision, setActiveDivision] = useState<ForestDivision | null>(null);

  // Zoom / Focus division
  const currentDivision = ASSAM_DIVISIONS.find(d => d.id === selectedDivisionId);

  // Map viewport dimensions (Assam bounds: Longitude 89.8 to 96.0, Latitude 24.1 to 28.2)
  // Normalized SVG projection coordinates
  const minLng = 89.8, maxLng = 95.8;
  const minLat = 24.4, maxLat = 28.2;

  const projectToMap = (lng: number, lat: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y for SVG coordinates
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleDivisionClick = (div: ForestDivision) => {
    setActiveDivision(div);
    setActivePlot(null);
    setActiveAlert(null);
    if (onSelectDivision) onSelectDivision(div.id);
  };

  const handlePlotClick = (plot: SamplePlotRecord) => {
    setActivePlot(plot);
    setActiveAlert(null);
    setActiveDivision(null);
  };

  const handleAlertClick = (alert: RemoteSensingAlert) => {
    setActiveAlert(alert);
    setActivePlot(null);
    setActiveDivision(null);
  };

  return (
    <div 
      style={{ height }} 
      className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-slate-900 select-none"
    >
      {/* Base Map Canvas / SVG Layer */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        baseMap === 'satellite' 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-900 to-black' 
          : 'bg-slate-100'
      }`}>
        {/* Synthetic Satellite Texture or Grid */}
        <div className={`w-full h-full opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]`} />

        {/* Brahmaputra River Vector Curve */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* River Brahmaputra course across Assam */}
          <path
            d="M 92,28 Q 75,34 60,42 T 35,46 T 15,55"
            fill="none"
            stroke={baseMap === 'satellite' ? '#38bdf8' : '#60a5fa'}
            strokeWidth="1.2"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 90,29 Q 74,35 61,43 T 36,47 T 16,56"
            fill="none"
            stroke={baseMap === 'satellite' ? '#0284c7' : '#93c5fd'}
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />
          
          {/* NDVI Green Heatmap Shading */}
          {showNdviOverlay && (
            <>
              {/* Kaziranga Forest Buffer green halo */}
              <circle cx="56" cy="42" r="9" fill="#10b981" fillOpacity="0.3" filter="blur(8px)" />
              {/* Manas Tiger Reserve green halo */}
              <circle cx="21" cy="38" r="8" fill="#059669" fillOpacity="0.35" filter="blur(8px)" />
              {/* Karbi Anglong dense canopy halo */}
              <circle cx="61" cy="56" r="11" fill="#047857" fillOpacity="0.32" filter="blur(9px)" />
              {/* Dima Hasao hill canopy */}
              <circle cx="53" cy="74" r="10" fill="#065f46" fillOpacity="0.35" filter="blur(9px)" />
              {/* Kamrup forest canopy */}
              <circle cx="34" cy="54" r="7" fill="#10b981" fillOpacity="0.28" filter="blur(7px)" />
            </>
          )}

          {/* Division Polygons */}
          {showDivisions && ASSAM_DIVISIONS.map(div => {
            const center = projectToMap(div.center[0], div.center[1]);
            const isSelected = selectedDivisionId === div.id;
            return (
              <g key={div.id} className="cursor-pointer">
                {/* Approximate polygon zone */}
                <ellipse
                  cx={center.x}
                  cy={center.y}
                  rx="7"
                  ry="5.5"
                  fill={isSelected ? '#22c55e' : (baseMap === 'satellite' ? '#166534' : '#bbf7d0')}
                  fillOpacity={isSelected ? 0.45 : (baseMap === 'satellite' ? 0.25 : 0.4)}
                  stroke={isSelected ? '#4ade80' : (baseMap === 'satellite' ? '#22c55e' : '#15803d')}
                  strokeWidth={isSelected ? '1.5' : '0.8'}
                  strokeDasharray={isSelected ? 'none' : '2,1'}
                />
              </g>
            );
          })}
        </svg>

        {/* Division Center Labels */}
        {showDivisions && ASSAM_DIVISIONS.map(div => {
          const pt = projectToMap(div.center[0], div.center[1]);
          const isSelected = selectedDivisionId === div.id;
          return (
            <div
              key={div.id}
              onClick={() => handleDivisionClick(div)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm ${
                isSelected 
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110 z-20' 
                  : (baseMap === 'satellite' ? 'bg-slate-900/80 text-emerald-300 border border-emerald-700/60 hover:bg-slate-800' : 'bg-white/90 text-forest-900 border border-forest-300 hover:bg-white')
              }`}
            >
              <span>{div.name.split(' ')[0]}</span>
              <span className="text-[9px] opacity-80">({(div.plantationAreaHa / 1000).toFixed(1)}k ha)</span>
            </div>
          );
        })}

        {/* Ground-Truth Sample Plots Markers */}
        {showSamplePlots && INITIAL_SAMPLE_PLOTS.map(plot => {
          const pt = projectToMap(plot.lng, plot.lat);
          return (
            <div
              key={plot.id}
              onClick={() => handlePlotClick(plot)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              title={`Plot ${plot.plotCode}: ${plot.totalTco2e} tCO2e`}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-60"></span>
                <div className="relative w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-125 transition-transform">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              </div>
              <span className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                {plot.plotCode} ({plot.treeCount} trees)
              </span>
            </div>
          );
        })}

        {/* Remote Sensing Alerts Markers */}
        {showAlerts && REMOTE_SENSING_ALERTS.map(alert => {
          const pt = projectToMap(alert.lng, alert.lat);
          const isCritical = alert.severity === 'CRITICAL';
          return (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 group"
            >
              <div className="relative flex items-center justify-center">
                <span className={`animate-ping absolute inline-flex h-5 w-5 rounded-full opacity-75 ${
                  isCritical ? 'bg-red-500' : 'bg-amber-400'
                }`}></span>
                <div className={`relative w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-125 transition ${
                  isCritical ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                </div>
              </div>
              <span className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-950 text-red-200 border border-red-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                {alert.severity}: {alert.type.replace(/_/g, ' ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top Left: Title & Quick Division Fly-to Bar */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 max-w-sm sm:max-w-md">
        <div className="bg-slate-900/90 text-white p-3 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              ASSAC Spatial Monitoring GIS
            </h3>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Sentinel-2 Optical & Sentinel-1 SAR Multi-Temporal Monitoring (Assam)
          </p>
        </div>

        {/* Division Quick Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/80 backdrop-blur-sm">
          {ASSAM_DIVISIONS.map(div => (
            <button
              key={div.id}
              onClick={() => handleDivisionClick(div)}
              className={`text-[10px] font-semibold px-2 py-1 rounded-md transition ${
                selectedDivisionId === div.id
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {div.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Top Right: Layer Switcher & Toggles */}
      <div className="absolute top-4 right-4 z-30 bg-slate-900/90 text-white p-3 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md space-y-2 text-xs w-48">
        <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Map Layers
          </span>
          <span className="text-[10px] text-emerald-400 uppercase">Live</span>
        </div>

        {/* Basemap toggle */}
        <div className="grid grid-cols-2 gap-1 bg-slate-800 p-1 rounded-lg text-[10px] font-semibold">
          <button
            onClick={() => setBaseMap('satellite')}
            className={`py-1 rounded text-center transition ${
              baseMap === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setBaseMap('street')}
            className={`py-1 rounded text-center transition ${
              baseMap === 'street' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terrain/OSM
          </button>
        </div>

        {/* Layer Checkboxes */}
        <div className="space-y-1.5 pt-1 text-[11px]">
          <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-300">
            <input 
              type="checkbox" 
              checked={showNdviOverlay} 
              onChange={e => setShowNdviOverlay(e.target.checked)} 
              className="rounded accent-emerald-500" 
            />
            <span>Sentinel-2 NDVI Heatmap</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-300">
            <input 
              type="checkbox" 
              checked={showDivisions} 
              onChange={e => setShowDivisions(e.target.checked)} 
              className="rounded accent-emerald-500" 
            />
            <span>Forest Divisions</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-300">
            <input 
              type="checkbox" 
              checked={showSamplePlots} 
              onChange={e => setShowSamplePlots(e.target.checked)} 
              className="rounded accent-emerald-500" 
            />
            <span>Ground Truth Plots ({INITIAL_SAMPLE_PLOTS.length})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-300">
            <input 
              type="checkbox" 
              checked={showAlerts} 
              onChange={e => setShowAlerts(e.target.checked)} 
              className="rounded accent-emerald-500" 
            />
            <span>Remote Sensing Alerts ({REMOTE_SENSING_ALERTS.length})</span>
          </label>
        </div>
      </div>

      {/* Bottom Center / Legend Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-30 flex flex-wrap justify-between items-center bg-slate-900/85 text-white px-4 py-2 rounded-xl border border-slate-700/80 backdrop-blur-md text-[11px]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-400">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" /> Sample Plot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white" /> Critical Canopy Loss
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" /> Encroachment / Fire
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 bg-sky-400 rounded-sm" /> River Brahmaputra
          </span>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1 sm:mt-0 font-mono">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>WGS84 / EPSG:4326 • ASSAC MRV Node</span>
        </div>
      </div>

      {/* Interactive Detail Popup Modal when Plot clicked */}
      {activePlot && (
        <div className="absolute bottom-14 left-4 max-w-sm z-40 bg-slate-950 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-2xl backdrop-blur-lg">
          <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Sample Plot Record</span>
              <h4 className="font-bold text-base text-white">{activePlot.plotCode}</h4>
              <p className="text-xs text-slate-400">{activePlot.divisionName} • {activePlot.range}</p>
            </div>
            <button onClick={() => setActivePlot(null)} className="text-slate-400 hover:text-white p-1 text-lg">×</button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/90 p-2 rounded-lg border border-slate-800 mb-3">
            <div>
              <span className="text-[9px] text-slate-400 uppercase block">Trees</span>
              <span className="font-bold text-sm text-white">{activePlot.treeCount}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase block">Total AGB</span>
              <span className="font-bold text-sm text-emerald-400">{(activePlot.totalAgbKg / 1000).toFixed(1)} Mg</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase block">Carbon</span>
              <span className="font-bold text-sm text-emerald-300">{activePlot.totalTco2e.toFixed(1)} tCO2e</span>
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <p>Dominant Flora: <b className="text-white">{activePlot.dominantSpecies}</b></p>
            <p>Canopy Density: <b className="text-white">{activePlot.canopyDensityPercent}%</b></p>
            <p>Surveyor: <span className="text-slate-400">{activePlot.surveyorName}</span></p>
            <p className="font-mono text-[10px] text-slate-400">GPS: {activePlot.lat.toFixed(4)}°N, {activePlot.lng.toFixed(4)}°E (Elev: {activePlot.elevationM}m)</p>
          </div>
        </div>
      )}

      {/* Interactive Detail Popup Modal when Alert clicked */}
      {activeAlert && (
        <div className="absolute bottom-14 left-4 max-w-sm z-40 bg-slate-950 text-white p-4 rounded-2xl border border-red-500/50 shadow-2xl backdrop-blur-lg">
          <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                {activeAlert.severity} Remote Sensing Alert
              </span>
              <h4 className="font-bold text-base text-white">{activeAlert.type.replace(/_/g, ' ')}</h4>
              <p className="text-xs text-slate-400">{activeAlert.divisionName} • {activeAlert.range}</p>
            </div>
            <button onClick={() => setActiveAlert(null)} className="text-slate-400 hover:text-white p-1 text-lg">×</button>
          </div>

          <div className="bg-red-950/40 border border-red-800/60 p-2.5 rounded-lg text-xs space-y-1.5 mb-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Affected Area:</span>
              <span className="font-bold text-red-300">{activeAlert.areaHa} Hectares</span>
            </div>
            {activeAlert.ndviDropPercent && (
              <div className="flex justify-between">
                <span className="text-slate-400">NDVI Drop:</span>
                <span className="font-bold text-red-400">-{activeAlert.ndviDropPercent}% ({activeAlert.baselineNdvi} → {activeAlert.currentNdvi})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Sensor:</span>
              <span className="text-slate-300">{activeAlert.sensor} ({activeAlert.detectedDate})</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-2">{activeAlert.description}</p>
          
          <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-amber-300">
            <b>Action:</b> {activeAlert.recommendedAction}
          </div>
        </div>
      )}

      {/* Interactive Detail Popup Modal when Division clicked */}
      {activeDivision && !activePlot && !activeAlert && (
        <div className="absolute bottom-14 left-4 max-w-sm z-40 bg-slate-950 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-2xl backdrop-blur-lg">
          <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Forest Division</span>
              <h4 className="font-bold text-base text-white">{activeDivision.name}</h4>
              <p className="text-xs text-slate-400">District: {activeDivision.district} (HQ: {activeDivision.hq})</p>
            </div>
            <button onClick={() => setActiveDivision(null)} className="text-slate-400 hover:text-white p-1 text-lg">×</button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Plantation Area</span>
              <span className="font-bold text-emerald-400">{activeDivision.plantationAreaHa.toLocaleString()} ha</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Carbon Stock</span>
              <span className="font-bold text-white">{activeDivision.carbonStockTco2e.toLocaleString()} tCO2e</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-2">{activeDivision.description}</p>
          <div className="text-[11px] text-slate-400">
            DFO: <b className="text-white">{activeDivision.dfoName}</b>
          </div>
        </div>
      )}
    </div>
  );
}
