"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, ChevronDown, ChevronRight, TreePine, MapPin, 
  Smartphone, Filter, Download, ShieldCheck, Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  INITIAL_SAMPLE_PLOTS, ASSAM_DIVISIONS, 
  SamplePlotRecord, TreeSpecies 
} from '@/lib/assam-data';

// Mock tree rosters for initial plots
const SAMPLE_TREES: Record<string, Array<{ tag: string; species: string; sci: string; dbh: number; h: number; agb: number; health: string }>> = {
  'plot-kaz-001': [
    { tag: 'T-01', species: 'Sal (শাল)', sci: 'Shorea robusta', dbh: 42.5, h: 22.0, agb: 825.4, health: 'HEALTHY' },
    { tag: 'T-02', species: 'Hollong (হোলং)', sci: 'Dipterocarpus macrocarpus', dbh: 48.0, h: 28.5, agb: 1280.2, health: 'HEALTHY' },
    { tag: 'T-03', species: 'Gamari (গমাৰী)', sci: 'Gmelina arborea', dbh: 34.0, h: 18.0, agb: 395.1, health: 'HEALTHY' },
    { tag: 'T-04', species: 'Teak / Segun (চেগুন)', sci: 'Tectona grandis', dbh: 31.5, h: 17.5, agb: 448.0, health: 'STRESSED' },
    { tag: 'T-05', species: 'Nahar (নাহৰ)', sci: 'Mesua ferrea', dbh: 26.0, h: 15.0, agb: 410.6, health: 'HEALTHY' },
  ],
  'plot-kaz-002': [
    { tag: 'T-11', species: 'Hollong (হোলং)', sci: 'Dipterocarpus macrocarpus', dbh: 39.0, h: 24.0, agb: 820.5, health: 'HEALTHY' },
    { tag: 'T-12', species: 'Sal (শাল)', sci: 'Shorea robusta', dbh: 36.5, h: 20.0, agb: 590.2, health: 'HEALTHY' },
    { tag: 'T-13', species: 'Simul (শিমলু)', sci: 'Bombax ceiba', dbh: 45.0, h: 26.0, agb: 460.0, health: 'HEALTHY' },
  ],
  'plot-man-001': [
    { tag: 'M-01', species: 'Gamari (গমাৰী)', sci: 'Gmelina arborea', dbh: 44.0, h: 23.0, agb: 740.0, health: 'HEALTHY' },
    { tag: 'M-02', species: 'Sal (শাল)', sci: 'Shorea robusta', dbh: 41.0, h: 22.5, agb: 770.8, health: 'HEALTHY' },
    { tag: 'M-03', species: 'Khair (খৈৰ)', sci: 'Senegalia catechu', dbh: 22.0, h: 12.0, agb: 210.5, health: 'HEALTHY' },
  ],
  'plot-kar-001': [
    { tag: 'K-01', species: 'Teak / Segun (চেগুন)', sci: 'Tectona grandis', dbh: 38.0, h: 21.0, agb: 720.0, health: 'HEALTHY' },
    { tag: 'K-02', species: 'Jati Bamboo (জাতি বাঁহ)', sci: 'Bambusa tulda', dbh: 12.0, h: 16.0, agb: 18.5, health: 'HEALTHY' },
    { tag: 'K-03', species: 'Bhaluka Bamboo (ভালুকা বাঁহ)', sci: 'Bambusa balcooa', dbh: 14.5, h: 18.0, agb: 24.2, health: 'HEALTHY' },
  ],
  'plot-kam-001': [
    { tag: 'R-01', species: 'Nahar (নাহৰ)', sci: 'Mesua ferrea', dbh: 29.0, h: 16.5, agb: 510.0, health: 'HEALTHY' },
    { tag: 'R-02', species: 'Sal (শাল)', sci: 'Shorea robusta', dbh: 31.0, h: 17.0, agb: 415.0, health: 'STRESSED' },
  ]
};

export default function FieldDataPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ 'plot-kaz-001': true });

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPlots = selectedDivision === 'ALL'
    ? INITIAL_SAMPLE_PLOTS
    : INITIAL_SAMPLE_PLOTS.filter(p => p.divisionId === selectedDivision);

  const totalTrees = filteredPlots.reduce((acc, p) => acc + p.treeCount, 0);
  const totalBiomassMg = (filteredPlots.reduce((acc, p) => acc + p.totalAgbKg, 0) / 1000).toFixed(1);
  const totalCarbonTco2e = filteredPlots.reduce((acc, p) => acc + p.totalTco2e, 0).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
              Ground-Truth Verification Registry
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Field Sample Plot Data</h2>
          <p className="text-xs text-gray-500">
            FSI standard circular sample plots (r = 15m) measured by forest staff for remote-sensing calibration
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/field-collect">
            <Button className="bg-forest-700 hover:bg-forest-800 text-white font-bold h-10 shadow flex items-center gap-1.5 text-xs">
              <Smartphone className="w-4 h-4" /> Open Field Data App
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border shadow-sm items-center">
        <div>
          <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1">Filter by Division</label>
          <select
            value={selectedDivision}
            onChange={e => setSelectedDivision(e.target.value)}
            className="w-full h-9 border rounded-md px-2 text-xs bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none font-medium"
          >
            <option value="ALL">All Assam Divisions ({INITIAL_SAMPLE_PLOTS.length} Plots)</option>
            {ASSAM_DIVISIONS.map(d => (
              <option key={d.id} value={d.id}>{d.name.split(' ')[0]}</option>
            ))}
          </select>
        </div>

        <div className="text-center sm:border-l">
          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Sample Plots</span>
          <span className="text-lg font-black text-gray-900">{filteredPlots.length}</span>
        </div>

        <div className="text-center sm:border-l">
          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Measured Trees</span>
          <span className="text-lg font-black text-forest-700">{totalTrees} stems</span>
        </div>

        <div className="text-center sm:border-l">
          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Carbon</span>
          <span className="text-lg font-black text-emerald-600">{totalCarbonTco2e} tCO2e</span>
        </div>
      </div>

      {/* Plots Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <TreePine className="w-4 h-4 text-forest-600" />
            Verified Sample Plots ({filteredPlots.length})
          </h3>
          <span className="text-xs text-gray-500">Click any row to view individual tree measurements</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 text-xs">
              <TableHead className="w-8"></TableHead>
              <TableHead>Plot Code</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Dominant Species</TableHead>
              <TableHead>Trees</TableHead>
              <TableHead>Total AGB (Mg)</TableHead>
              <TableHead>Carbon (tCO2e)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {filteredPlots.map((plot) => {
              const isExpanded = !!expandedRows[plot.id];
              const trees = SAMPLE_TREES[plot.id] || [];

              return (
                <React.Fragment key={plot.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleRow(plot.id)}
                  >
                    <TableCell className="p-2 text-gray-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-forest-700" /> : <ChevronRight className="w-4 h-4" />}
                    </TableCell>
                    <TableCell className="font-bold font-mono text-forest-900 text-sm">
                      {plot.plotCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{plot.divisionName}</div>
                      <span className="text-[10px] text-gray-500">{plot.range} ({plot.beat})</span>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-gray-600">
                      {plot.lat.toFixed(4)}°N, {plot.lng.toFixed(4)}°E (Elev: {plot.elevationM}m)
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {plot.dominantSpecies}
                    </TableCell>
                    <TableCell className="font-bold">{plot.treeCount}</TableCell>
                    <TableCell className="font-bold text-emerald-700">
                      {(plot.totalAgbKg / 1000).toFixed(1)}
                    </TableCell>
                    <TableCell className="font-black text-forest-700">
                      {plot.totalTco2e.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={plot.verificationStatus === 'VERIFIED' ? 'success' : 'outline'}>
                        {plot.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-forest-700">
                        {isExpanded ? 'Hide Trees' : 'View Trees'}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row: Tree-by-Tree Measurements */}
                  {isExpanded && (
                    <TableRow className="bg-emerald-50/30">
                      <TableCell colSpan={10} className="p-4">
                        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-inner space-y-3">
                          <div className="flex justify-between items-center border-b pb-2">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                <TreePine className="w-4 h-4 text-forest-600" />
                                Trees Measured in Plot {plot.plotCode} (r = {plot.radiusMeters}m)
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                Forest Type: {plot.forestType} • Canopy Cover: {plot.canopyDensityPercent}% • Surveyor: {plot.surveyorName}
                              </p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">
                              Date: {plot.surveyDate}
                            </span>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50 text-[11px]">
                                <TableHead>Tag</TableHead>
                                <TableHead>Common / Vernacular</TableHead>
                                <TableHead>Scientific Name</TableHead>
                                <TableHead>DBH (cm)</TableHead>
                                <TableHead>Height (m)</TableHead>
                                <TableHead>AGB (kg)</TableHead>
                                <TableHead>Health</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs">
                              {trees.map((t, idx) => (
                                <TableRow key={idx} className="hover:bg-gray-50">
                                  <td className="font-bold font-mono text-forest-800">{t.tag}</td>
                                  <td className="font-medium text-gray-900">{t.species}</td>
                                  <td className="italic text-gray-500">{t.sci}</td>
                                  <td className="font-bold">{t.dbh}</td>
                                  <td>{t.h}</td>
                                  <td className="font-bold text-emerald-700">{t.agb}</td>
                                  <td>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                      t.health === 'HEALTHY' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {t.health}
                                    </span>
                                  </td>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
