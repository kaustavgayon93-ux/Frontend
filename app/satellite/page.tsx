"use client";

import React, { useState } from 'react';
import { 
  Satellite, Play, RefreshCw, CheckCircle2, Download, 
  Layers, Eye, ShieldCheck, HardDrive, Sparkles, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SATELLITE_SCENES, ASSAM_DIVISIONS, SatelliteSceneRecord } from '@/lib/assam-data';

export default function SatellitePage() {
  const [scenes, setScenes] = useState<SatelliteSceneRecord[]>(SATELLITE_SCENES);
  const [selectedSensor, setSelectedSensor] = useState('SENTINEL_2');
  const [selectedDivision, setSelectedDivision] = useState(ASSAM_DIVISIONS[0].name);
  const [maxCloud, setMaxCloud] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleTriggerIngestion = () => {
    setIsProcessing(true);
    setStatusMessage('Querying Copernicus Data Space Ecosystem (CDSE) API...');

    setTimeout(() => {
      setStatusMessage('Ingesting Sentinel-2 tiles & computing NDVI, EVI, NDRE raster layers...');
      setTimeout(() => {
        const newScene: SatelliteSceneRecord = {
          id: `sc-0${scenes.length + 1}`,
          sceneId: `S2A_MSIL2A_${new Date().toISOString().slice(0,10).replace(/-/g,'')}T043701_N0511_R033`,
          sensor: selectedSensor === 'SENTINEL_2' ? 'Sentinel-2A' : 'Sentinel-1A (SAR)',
          acquisitionDate: new Date().toISOString().split('T')[0],
          cloudCoverPercent: selectedSensor === 'SENTINEL_1' ? 0.0 : Math.round(Math.random() * maxCloud * 10) / 10,
          divisionCovered: selectedDivision,
          resolutionM: 10,
          bandsAvailable: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR)'],
          status: 'READY_FOR_ANALYSIS',
          indicesCalculated: ['NDVI', 'EVI', 'NDRE', 'Canopy Height Model'],
          meanNdvi: Number((0.72 + (Math.random() * 0.06)).toFixed(2)),
          meanEvi: Number((0.54 + (Math.random() * 0.05)).toFixed(2)),
          thumbnailUrl: '',
          storageMb: 820
        };

        setScenes([newScene, ...scenes]);
        setIsProcessing(false);
        setStatusMessage(`Successfully processed new satellite scene for ${selectedDivision}! NDVI & Biomass layers generated.`);
      }, 1500);
    }, 1200);
  };

  const totalStorageGb = (scenes.reduce((acc, s) => acc + s.storageMb, 0) / 1024).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              ASSAC Space Applications
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Satellite Remote Sensing & Spatial Ingestion</h2>
          <p className="text-xs text-gray-500">Automated ingestion of Sentinel-2 MSI and Sentinel-1 SAR imagery for high-frequency forest monitoring</p>
        </div>

        <Button 
          onClick={handleTriggerIngestion}
          disabled={isProcessing}
          className="bg-forest-700 hover:bg-forest-800 text-white font-bold h-10 shadow"
        >
          <Play className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Ingesting Scene...' : 'Trigger Automated Ingestion'}
        </Button>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium flex-1">{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="font-bold text-emerald-800">×</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Available Scenes</CardTitle>
            <Satellite className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-gray-900">{scenes.length}</div>
            <p className="text-xs text-blue-600 mt-0.5">Assam Forest Divisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Revisit Frequency</CardTitle>
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-emerald-700">5 Days</div>
            <p className="text-xs text-gray-500 mt-0.5">Sentinel-2A/B Constellation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">SAR Cloud Penetration</CardTitle>
            <ShieldCheck className="w-4 h-4 text-forest-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-forest-800">100%</div>
            <p className="text-xs text-gray-500 mt-0.5">Sentinel-1 C-Band (Monsoons)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Archive Storage</CardTitle>
            <HardDrive className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-black text-gray-900">{totalStorageGb} GB</div>
            <p className="text-xs text-gray-500 mt-0.5">Analysis-Ready GeoTIFFs</p>
          </CardContent>
        </Card>
      </div>

      {/* Ingestion Configuration & Scene Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ingestion Request Form */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base border-b pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-600" /> Configure Ingestion Pipeline
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Target Forest Division
              </label>
              <select 
                value={selectedDivision} 
                onChange={e => setSelectedDivision(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md px-3 text-xs bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                {ASSAM_DIVISIONS.map(div => (
                  <option key={div.id} value={div.name}>{div.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Satellite Sensor Platform
              </label>
              <select 
                value={selectedSensor}
                onChange={e => setSelectedSensor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md px-3 text-xs bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="SENTINEL_2">Sentinel-2 MSI (Optical - 10m VNIR/SWIR)</option>
                <option value="SENTINEL_1">Sentinel-1 C-SAR (Radar - Cloud Penetrating)</option>
                <option value="LANDSAT_9">Landsat-9 OLI-2 (USGS 30m / 15m Pan)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-700 uppercase tracking-wider">Max Cloud Cover Filter:</span>
                <span className="text-forest-700 font-bold">{maxCloud}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={maxCloud} 
                onChange={e => setMaxCloud(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                During Assam monsoon (June-Sept), SAR is automatically prioritized if cloud cover exceeds threshold.
              </span>
            </div>

            <div className="pt-2 border-t">
              <span className="text-xs font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
                Automated Spectral Indices Pipeline
              </span>
              <div className="space-y-1.5 text-xs text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded accent-forest-600" />
                  <span>NDVI (Normalized Difference Vegetation Index)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded accent-forest-600" />
                  <span>EVI (Enhanced Vegetation Index for Dense Canopy)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded accent-forest-600" />
                  <span>NDRE (Red Edge Chlorophyll & Nitrogen Vigor)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded accent-forest-600" />
                  <span>Canopy Height Model (CHM - GEDI Calibration)</span>
                </label>
              </div>
            </div>

            <Button 
              onClick={handleTriggerIngestion}
              disabled={isProcessing}
              className="w-full h-11 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow mt-2"
            >
              {isProcessing ? 'Processing Imagery...' : 'Run Analysis Pipeline'}
            </Button>
          </div>
        </div>

        {/* Right: Ingested Scenes Archive Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Satellite className="w-4 h-4 text-emerald-600" /> Ingested Satellite Scenes Archive
              </h3>
              <p className="text-xs text-gray-500">Analysis-Ready Data (ARD) stored in ASSAC repository</p>
            </div>
            <span className="text-xs text-gray-500 font-mono">{scenes.length} cataloged</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 text-xs">
                  <TableHead>Scene Identifier</TableHead>
                  <TableHead>Sensor</TableHead>
                  <TableHead>Acquisition</TableHead>
                  <TableHead>Cloud Cover</TableHead>
                  <TableHead>Mean NDVI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {scenes.map(scene => (
                  <TableRow key={scene.id} className="hover:bg-gray-50">
                    <td className="font-mono text-[11px] font-semibold text-gray-900">
                      <div>{scene.sceneId.slice(0, 24)}...</div>
                      <span className="text-[10px] text-gray-500 font-normal">{scene.divisionCovered}</span>
                    </td>
                    <td className="font-medium text-gray-700">{scene.sensor}</td>
                    <td>{scene.acquisitionDate}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        scene.cloudCoverPercent === 0 ? 'bg-blue-100 text-blue-800' :
                        scene.cloudCoverPercent < 10 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {scene.cloudCoverPercent}%
                      </span>
                    </td>
                    <td className="font-bold text-emerald-700">{scene.meanNdvi}</td>
                    <td>
                      <Badge variant="success" className="text-[10px]">{scene.status}</Badge>
                    </td>
                    <td className="text-right">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-forest-700">
                        <Eye className="w-3 h-3 mr-1" /> Inspect
                      </Button>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
