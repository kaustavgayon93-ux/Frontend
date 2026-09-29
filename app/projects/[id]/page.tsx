"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Map, TreePine, Leaf, History, FileText, 
  Smartphone, ShieldCheck, ArrowLeft, Download, CheckCircle2 
} from 'lucide-react';
import MapView from '@/components/map/MapView';
import { ASSAM_DIVISIONS, INITIAL_SAMPLE_PLOTS } from '@/lib/assam-data';

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id as string;

  // Find division based on id or default to Kaziranga
  let division = ASSAM_DIVISIONS.find(d => id.includes(d.id.replace('div-', ''))) || ASSAM_DIVISIONS[0];
  if (id === 'proj-kaziranga') division = ASSAM_DIVISIONS[0];
  else if (id === 'proj-manas') division = ASSAM_DIVISIONS[1];
  else if (id === 'proj-karbi') division = ASSAM_DIVISIONS[2];
  else if (id === 'proj-kamrup') division = ASSAM_DIVISIONS[3];
  else if (id === 'proj-dimahasao') division = ASSAM_DIVISIONS[4];
  else if (id === 'proj-jorhat') division = ASSAM_DIVISIONS[5];

  const projectPlots = INITIAL_SAMPLE_PLOTS.filter(p => p.divisionId === division.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Title Card */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <Link href="/projects" className="inline-flex items-center text-xs font-semibold text-forest-700 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects Directory
        </Link>

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                {division.name}
              </span>
              <Badge variant="success">ACTIVE VERIFIED</Badge>
            </div>
            <h1 className="text-2xl font-black text-gray-900">{division.name} Afforestation MRV</h1>
            <p className="text-xs text-gray-500 mt-1">
              District: {division.district} (HQ: {division.hq}) • Methodology: Verra VM0047 • DFO: {division.dfoName}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/field-collect">
              <Button className="bg-forest-700 hover:bg-forest-800 text-white font-bold h-10 shadow text-xs">
                <Smartphone className="w-4 h-4 mr-1.5" /> Record Ground Plot
              </Button>
            </Link>
            <Link href="/carbon">
              <Button variant="outline" className="h-10 text-xs">
                <FileText className="w-4 h-4 mr-1.5" /> View MRV Dossier
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border rounded-xl p-1.5 w-full justify-start h-auto flex-wrap gap-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 mr-1.5"/> Overview & KPIs
          </TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700 text-xs font-semibold">
            <Map className="w-3.5 h-3.5 mr-1.5"/> GIS Spatial Layers
          </TabsTrigger>
          <TabsTrigger value="field" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700 text-xs font-semibold">
            <TreePine className="w-3.5 h-3.5 mr-1.5"/> Ground Truth Plots ({projectPlots.length})
          </TabsTrigger>
          <TabsTrigger value="carbon" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 mr-1.5"/> Carbon Accounting
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="py-3 px-4 pb-1">
                <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Plantation Area</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-2xl font-black text-gray-900">{division.plantationAreaHa.toLocaleString()} ha</div>
                <p className="text-xs text-gray-500 mt-0.5">Total: {division.totalAreaHa.toLocaleString()} ha</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 pb-1">
                <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Carbon Stock</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-2xl font-black text-emerald-700">{division.carbonStockTco2e.toLocaleString()}</div>
                <p className="text-xs text-emerald-600 mt-0.5">tCO2e sequestered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 pb-1">
                <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Ground Plots</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-2xl font-black text-forest-800">{division.samplePlotsCount}</div>
                <p className="text-xs text-gray-500 mt-0.5">Verified sample points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4 pb-1">
                <CardTitle className="text-xs font-semibold text-gray-500 uppercase">Attention Alerts</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="text-2xl font-black text-amber-600">{division.activeAlertsCount}</div>
                <p className="text-xs text-amber-700 mt-0.5">Under field verification</p>
              </CardContent>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-bold text-gray-900 text-base mb-2">Project Description & Ecological Objectives</h3>
            <p className="text-xs text-gray-700 leading-relaxed">{division.description}</p>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-gray-500 block text-[10px]">Headquarters:</span>
                <span className="font-semibold text-gray-800">{division.hq}, Assam</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Divisional Forest Officer:</span>
                <span className="font-semibold text-gray-800">{division.dfoName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Centroid Coordinates:</span>
                <span className="font-mono text-gray-800">{division.center[1]}°N, {division.center[0]}°E</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* GIS Map Tab */}
        <TabsContent value="map" className="mt-4 space-y-3">
          <MapView 
            selectedDivisionId={division.id} 
            height="550px" 
          />
        </TabsContent>
        
        {/* Field Plots Tab */}
        <TabsContent value="field" className="mt-4">
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Ground Truth Sample Plots in {division.name}</h3>
            {projectPlots.length === 0 ? (
              <p className="text-xs text-gray-500">No plots logged specifically for this division yet.</p>
            ) : (
              <div className="space-y-2">
                {projectPlots.map(p => (
                  <div key={p.id} className="p-3 bg-gray-50 rounded-lg border text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold font-mono text-forest-800">{p.plotCode}</span> - {p.range} ({p.beat})
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {p.lat.toFixed(4)}°N, {p.lng.toFixed(4)}°E • Dominant: {p.dominantSpecies}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-forest-700 block">{p.totalTco2e} tCO2e</span>
                      <span className="text-[10px] text-gray-500">{p.treeCount} trees measured</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Carbon Accounting Tab */}
        <TabsContent value="carbon" className="mt-4">
          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-gray-900 text-base">Verra VM0047 Carbon Stock Summary</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <span className="text-gray-500 block text-[10px]">Gross Removals</span>
                <span className="text-lg font-bold text-gray-900">{division.carbonStockTco2e.toLocaleString()} tCO2e</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-blue-800 block text-[10px]">18% Buffer Reserve</span>
                <span className="text-lg font-bold text-blue-900">{Math.round(division.carbonStockTco2e * 0.18).toLocaleString()} tCO2e</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 block text-[10px]">Net Credits</span>
                <span className="text-lg font-bold text-forest-700">{Math.round(division.carbonStockTco2e * 0.77).toLocaleString()} VCUs</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
