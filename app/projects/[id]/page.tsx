"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statusBadgeVariant } from '@/lib/utils';
import { Map, TreePine, Leaf, History, FileText } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  
  // Mock project data
  const project = {
    id: id as string,
    name: 'Kaziranga Buffer Reforestation',
    status: 'ACTIVE',
    methodology: 'VM0047',
    start_date: '2023-01-15',
    area_ha: 1500,
    description: 'A critical reforestation project aiming to expand the buffer zone around Kaziranga National Park to reduce human-wildlife conflict and sequester carbon.',
    plots: 45,
    trees: 12400,
    agb: 45000,
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <Badge variant={statusBadgeVariant(project.status)}>{project.status}</Badge>
          </div>
          <p className="text-gray-500 text-sm">Methodology: {project.methodology} | Started: {project.start_date}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border rounded-lg p-1 w-full justify-start h-auto flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700"><FileText className="w-4 h-4 mr-2"/> Overview</TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700"><Map className="w-4 h-4 mr-2"/> Map & Boundaries</TabsTrigger>
          <TabsTrigger value="field" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700"><TreePine className="w-4 h-4 mr-2"/> Field Data</TabsTrigger>
          <TabsTrigger value="carbon" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700"><Leaf className="w-4 h-4 mr-2"/> Carbon Stock</TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-forest-50 data-[state=active]:text-forest-700"><History className="w-4 h-4 mr-2"/> Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Area</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{project.area_ha} ha</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Sample Plots</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{project.plots}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Trees Measured</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{project.trees.toLocaleString()}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Est. Carbon (tCO2e)</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-emerald-600">{project.agb.toLocaleString()}</p></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent><p className="text-gray-700">{project.description}</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <Card className="h-[600px] flex items-center justify-center bg-gray-100">
             <p className="text-gray-500">MapView Component Placeholder</p>
          </Card>
        </TabsContent>
        
        {/* Implement other tabs similarly */}
        <TabsContent value="field" className="mt-6"><p>Field Data Placeholder</p></TabsContent>
        <TabsContent value="carbon" className="mt-6"><p>Carbon Data Placeholder</p></TabsContent>
        <TabsContent value="audit" className="mt-6"><p>Audit Data Placeholder</p></TabsContent>
      </Tabs>
    </div>
  );
}
