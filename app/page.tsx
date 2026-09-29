"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderKanban, Map as MapIcon, Leaf, AlertTriangle, Plus, 
  Satellite, Smartphone, Shield, ArrowUpRight, TrendingUp, 
  TreePine, Sparkles, Filter, CheckCircle2, ChevronRight, FileDown, Navigation, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MapView from '@/components/map/MapView';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area 
} from 'recharts';
import { 
  ASSAM_DIVISIONS, REMOTE_SENSING_ALERTS, EXPANSION_OPPORTUNITIES, 
  INITIAL_SAMPLE_PLOTS, PLANTATION_GROWTH_SERIES, ForestDivision 
} from '@/lib/assam-data';

export default function Dashboard() {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('all');
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'CRITICAL' | 'EXPANSION'>('ALL');

  // Filter calculations
  const isAll = selectedDivisionId === 'all';
  const currentDiv = ASSAM_DIVISIONS.find(d => d.id === selectedDivisionId);

  const displayArea = isAll 
    ? ASSAM_DIVISIONS.reduce((acc, d) => acc + d.totalAreaHa, 0)
    : (currentDiv?.totalAreaHa || 0);

  const displayPlantation = isAll 
    ? ASSAM_DIVISIONS.reduce((acc, d) => acc + d.plantationAreaHa, 0)
    : (currentDiv?.plantationAreaHa || 0);

  const displayCarbon = isAll 
    ? ASSAM_DIVISIONS.reduce((acc, d) => acc + d.carbonStockTco2e, 0)
    : (currentDiv?.carbonStockTco2e || 0);

  const displayAlertsCount = isAll 
    ? REMOTE_SENSING_ALERTS.length 
    : REMOTE_SENSING_ALERTS.filter(a => a.divisionId === selectedDivisionId).length;

  const displayPlots = isAll 
    ? INITIAL_SAMPLE_PLOTS 
    : INITIAL_SAMPLE_PLOTS.filter(p => p.divisionId === selectedDivisionId);

  const filteredAlerts = REMOTE_SENSING_ALERTS.filter(a => {
    if (!isAll && a.divisionId !== selectedDivisionId) return false;
    if (alertFilter === 'CRITICAL') return a.severity === 'CRITICAL';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Departmental Header */}
      <div className="bg-gradient-to-r from-slate-900 via-forest-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-forest-800/40 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Assam State Space Applications Centre (ASSAC)
            </span>
            <span className="text-slate-400 text-xs">• NESFIC-D-15 MRV Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Forest & Plantation Monitoring and Biomass Assessment
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
            Automated Sentinel-2 & SAR satellite time-series monitoring, ground-truth field verification, and Verra VM0047 carbon assessment across Assam forest divisions.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/field-collect">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 shadow-lg flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Open Field Data App
            </Button>
          </Link>
          <a href="/ASSAC-MRV-Field-Collect.apk" download="ASSAC-MRV-Field-Collect.apk">
            <Button variant="outline" className="bg-emerald-900/60 border-emerald-600/80 text-emerald-200 hover:bg-emerald-800 text-xs h-10 flex items-center gap-1.5 font-bold">
              <Download className="w-4 h-4 text-emerald-300" /> Download APK (1.19 MB)
            </Button>
          </a>
          <Link href="/satellite">
            <Button variant="outline" className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 text-xs h-10">
              <Satellite className="w-4 h-4 mr-1.5 text-blue-400" /> Satellite Ingestion
            </Button>
          </Link>
          <Link href="/carbon">
            <Button variant="outline" className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 text-xs h-10">
              <FileDown className="w-4 h-4 mr-1.5 text-emerald-400" /> Carbon Dossier
            </Button>
          </Link>
        </div>
      </div>

      {/* Division Selector Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2.5 rounded-xl border shadow-sm">
        <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 pl-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-forest-600" /> Division:
        </span>
        <button
          onClick={() => setSelectedDivisionId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
            selectedDivisionId === 'all' 
              ? 'bg-forest-700 text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Assam Divisions (6 Pilots)
        </button>
        {ASSAM_DIVISIONS.map(div => (
          <button
            key={div.id}
            onClick={() => setSelectedDivisionId(div.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              selectedDivisionId === div.id 
                ? 'bg-forest-700 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {div.name.split(' ')[0]} ({div.district.split('&')[0].trim()})
          </button>
        ))}
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition border-l-4 border-l-blue-500">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Monitored Area
            </CardTitle>
            <MapIcon className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-gray-900">
              {displayArea.toLocaleString()} <span className="text-xs font-normal text-gray-500">ha</span>
            </div>
            <p className="text-xs text-blue-700 font-medium mt-1">
              {displayPlantation.toLocaleString()} ha plantation blocks
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition border-l-4 border-l-emerald-500">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Carbon Stock (tCO2e)
            </CardTitle>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-emerald-700">
              {displayCarbon.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4.8% annual sequestration
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition border-l-4 border-l-forest-500">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Net Verra Credits (VCUs)
            </CardTitle>
            <Shield className="w-4 h-4 text-forest-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-forest-800">
              {Math.round(displayCarbon * 0.8).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              VM0047 (after 20% risk buffer pool)
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition border-l-4 border-l-amber-500">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Attention Alerts
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-amber-600">
              {displayAlertsCount}
            </div>
            <p className="text-xs text-amber-700 font-medium mt-1">
              {REMOTE_SENSING_ALERTS.filter(a => a.severity === 'CRITICAL').length} critical canopy loss items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive GIS Spatial Map Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Satellite className="w-5 h-5 text-emerald-600" />
              Assam Forest GIS & Spatial Monitoring Layers
            </h2>
            <p className="text-xs text-gray-500">
              Repeatable spatial layers: Sentinel-2 NDVI heatmap, Forest Divisions, Sample Plots, and Active Alerts
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Cadence: 5-Day Optical / 6-Day SAR
          </span>
        </div>

        <MapView 
          selectedDivisionId={selectedDivisionId === 'all' ? undefined : selectedDivisionId}
          onSelectDivision={(id) => setSelectedDivisionId(id)}
          height="540px"
        />
      </div>

      {/* Multi-Temporal Plantation Growth & Condition Tracker */}
      {/* (Directly answers: "Track change/growth and relevant indicators over time") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-forest-600" />
                Plantation Growth & Biomass Accumulation Trajectory
              </h3>
              <p className="text-xs text-gray-500">
                Time-series comparison of Expected vs Observed DBH (cm) and Mean AGB (Mg/ha) over plantation life
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-1 rounded border border-emerald-200">
              Chave / FSI Calibrated
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLANTATION_GROWTH_SERIES} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActualDbh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBiomass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#15803d" fontSize={11} tickLine={false} tickFormatter={(val) => `${val} cm`} />
                <YAxis yAxisId="right" orientation="right" stroke="#0284c7" fontSize={11} tickLine={false} tickFormatter={(val) => `${val} Mg`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="actualDbh" name="Observed DBH (cm)" stroke="#15803d" fillOpacity={1} fill="url(#colorActualDbh)" strokeWidth={2.5} />
                <Line yAxisId="left" type="monotone" dataKey="expectedDbh" name="Target DBH (cm)" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="biomassTonsPerHa" name="Biomass (Mg/ha)" stroke="#0284c7" fillOpacity={0.4} fill="url(#colorBiomass)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t text-center text-xs">
            <div className="bg-gray-50 p-2 rounded-lg">
              <span className="text-[10px] text-gray-500 uppercase block">5-Yr Survival Rate</span>
              <span className="font-bold text-gray-900">89.4%</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <span className="text-[10px] text-gray-500 uppercase block">Annual MAI (Vol)</span>
              <span className="font-bold text-emerald-700">14.2 m³/ha/yr</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <span className="text-[10px] text-gray-500 uppercase block">Mean Canopy Density</span>
              <span className="font-bold text-gray-900">76.5%</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <span className="text-[10px] text-gray-500 uppercase block">Sequestration Rate</span>
              <span className="font-bold text-forest-700">9.2 tCO2e/ha/yr</span>
            </div>
          </div>
        </div>

        {/* Division Performance & Quick Carbon Share */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Division Carbon Stock Breakdown
            </h3>
            <p className="text-xs text-gray-500 mb-3">Total tCO2e distribution across Assam pilot divisions</p>

            <div className="space-y-3">
              {ASSAM_DIVISIONS.map(div => {
                const totalStateCarbon = ASSAM_DIVISIONS.reduce((acc, d) => acc + d.carbonStockTco2e, 0);
                const percent = Math.round((div.carbonStockTco2e / totalStateCarbon) * 100);
                return (
                  <div key={div.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-800">{div.name.split(' ')[0]}</span>
                      <span className="text-emerald-700">{div.carbonStockTco2e.toLocaleString()} tCO2e ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-forest-600 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-900 block mb-0.5">FSI Allometric Calibrations</span>
            <p className="text-emerald-700 text-[11px]">
              Assam-specific wood density coefficients calibrated for Sal (0.82), Teak (0.65), Hollong (0.72), and Gamari (0.51).
            </p>
          </div>
        </div>
      </div>

      {/* Areas Requiring Attention & Expansion Recommendations */}
      {/* (Directly answers: "Identification of areas requiring attention or expansion") */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Change Detection & Degradation Alerts */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Areas Requiring Attention (Change Alerts)
              </h3>
              <p className="text-xs text-gray-500">Automated remote sensing anomaly detection</p>
            </div>
            <div className="flex gap-1 text-[11px]">
              <button 
                onClick={() => setAlertFilter('ALL')}
                className={`px-2 py-1 rounded ${alertFilter === 'ALL' ? 'bg-gray-800 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All ({REMOTE_SENSING_ALERTS.length})
              </button>
              <button 
                onClick={() => setAlertFilter('CRITICAL')}
                className={`px-2 py-1 rounded ${alertFilter === 'CRITICAL' ? 'bg-red-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Critical
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-amber-400 hover:shadow-sm transition bg-white space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">{alert.type.replace(/_/g, ' ')}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {alert.divisionName} • {alert.range} ({alert.beat})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-red-600 block">{alert.areaHa} ha</span>
                    <span className="text-[10px] text-gray-400">{alert.sensor}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                  {alert.description}
                </p>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-gray-500 font-mono text-[10px]">
                    Lat: {alert.lat}°N, Lng: {alert.lng}°E
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                    Status: {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Identified Expansion & Enrichment Opportunities */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Plantation Expansion & Enrichment Opportunities
              </h3>
              <p className="text-xs text-gray-500">AI-detected canopy gaps suitable for compensatory afforestation</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
              865 ha Identified
            </span>
          </div>

          <div className="space-y-3">
            {EXPANSION_OPPORTUNITIES.map(exp => (
              <div 
                key={exp.id}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:shadow-sm transition space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Score: {exp.priorityScore}/100
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">{exp.locationName}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {exp.divisionName} • {exp.currentLandUse}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-forest-800 block">{exp.availableAreaHa} ha</span>
                    <span className="text-[10px] text-gray-500">Available</span>
                  </div>
                </div>

                <div className="text-xs text-gray-700 space-y-1">
                  <p>Recommended Mix: <b>{exp.recommendedSpecies.join(', ')}</b></p>
                  <p>Density: <b>{exp.plantingDensityStemsPerHa} stems/ha</b></p>
                  <p className="text-[11px] text-emerald-900 italic">{exp.suitabilityReason}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-emerald-200/80 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px] block">10-Yr Sequestration Potential</span>
                    <span className="font-bold text-emerald-800 font-mono">+{exp.est10YrSequestrationTco2e.toLocaleString()} tCO2e</span>
                  </div>
                  <Button size="sm" className="h-8 bg-forest-700 hover:bg-forest-800 text-white text-xs">
                    Draft Afforestation Plan <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ground-Truth Evidence Registry & Recent Sample Plots */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <TreePine className="w-4 h-4 text-forest-600" />
              Recent Field Ground-Truth Submissions (Verifiable Evidence)
            </h3>
            <p className="text-xs text-gray-500">
              Field enumerations conducted by beat officers with GPS geotags and allometric biomass data
            </p>
          </div>
          <Link href="/field-collect">
            <Button size="sm" variant="outline" className="text-xs">
              Open Field Collection App <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="p-3">Plot Code</th>
                <th className="p-3">Division & Range</th>
                <th className="p-3">Dominant Species</th>
                <th className="p-3">Stems</th>
                <th className="p-3">Total AGB (Mg)</th>
                <th className="p-3">Carbon (tCO2e)</th>
                <th className="p-3">GPS Location</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {displayPlots.map(plot => (
                <tr key={plot.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold font-mono text-forest-800">{plot.plotCode}</td>
                  <td className="p-3">
                    <span className="font-medium text-gray-900 block">{plot.divisionName}</span>
                    <span className="text-[10px] text-gray-500">{plot.range} ({plot.beat})</span>
                  </td>
                  <td className="p-3 font-medium">{plot.dominantSpecies}</td>
                  <td className="p-3 font-bold">{plot.treeCount}</td>
                  <td className="p-3 font-bold text-emerald-700">{(plot.totalAgbKg / 1000).toFixed(1)}</td>
                  <td className="p-3 font-bold text-forest-800">{plot.totalTco2e.toFixed(2)}</td>
                  <td className="p-3 font-mono text-[10px] text-gray-500">
                    {plot.lat.toFixed(4)}°N, {plot.lng.toFixed(4)}°E
                  </td>
                  <td className="p-3">
                    <Badge variant={plot.verificationStatus === 'VERIFIED' ? 'success' : 'outline'}>
                      {plot.verificationStatus}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Link href="/field">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-forest-700">
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
