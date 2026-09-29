"use client";
import React from 'react';
import { Satellite, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MOCK_SCENES = [
  { id: 'S2A_MSIL2A_20231015', sensor: 'SENTINEL_2', date: '2023-10-15', cloud_cover: 12.5, status: 'PROCESSED' },
  { id: 'LC08_L1TP_20230928', sensor: 'LANDSAT_8', date: '2023-09-28', cloud_cover: 5.2, status: 'PROCESSED' },
];

export default function SatellitePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Satellite Imagery</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" /> Start Ingestion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-4 text-lg border-b pb-2">New Ingestion Request</h3>
          <form className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Project Area</label>
               <select className="w-full border rounded-md p-2">
                 <option>Kaziranga Buffer Reforestation</option>
                 <option>Manas Community Forestry</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Sensor</label>
               <select className="w-full border rounded-md p-2">
                 <option>Sentinel-2 (Copernicus)</option>
                 <option>Landsat 8/9 (USGS)</option>
               </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                 <input type="date" className="w-full border rounded-md p-2" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                 <input type="date" className="w-full border rounded-md p-2" />
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Max Cloud Cover (%)</label>
               <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
             </div>
             <Button type="button" className="w-full mt-4">Fetch Scenes</Button>
          </form>
        </div>

        <div className="col-span-2 bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
             <h3 className="font-semibold text-gray-800"><Satellite className="inline w-4 h-4 mr-2"/>Ingested Scenes</h3>
             <span className="text-sm text-gray-500">Storage: 24.5 GB used</span>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scene ID</TableHead>
                  <TableHead>Sensor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cloud Cover</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SCENES.map((scene) => (
                  <TableRow key={scene.id}>
                    <TableCell className="font-medium text-xs">{scene.id}</TableCell>
                    <TableCell>{scene.sensor}</TableCell>
                    <TableCell>{scene.date}</TableCell>
                    <TableCell>{scene.cloud_cover}%</TableCell>
                    <TableCell><Badge variant="success">{scene.status}</Badge></TableCell>
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
