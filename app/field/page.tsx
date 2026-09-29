"use client";
import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data
const MOCK_PLOTS = [
  { id: '1', project: 'Kaziranga Buffer', plot_code: 'KAZ-001', lat: 26.58, lon: 93.15, elevation: 85, trees: 42, carbon: 12.5 },
  { id: '2', project: 'Kaziranga Buffer', plot_code: 'KAZ-002', lat: 26.59, lon: 93.16, elevation: 88, trees: 38, carbon: 10.2 },
];

export default function FieldDataPage() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Field Data</h2>
        <Button className="bg-forest-600 hover:bg-forest-700">
          <Plus className="w-4 h-4 mr-2" /> Add Plot
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Plot Code</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Trees</TableHead>
              <TableHead>Total Carbon (tCO2e)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PLOTS.map((plot) => (
              <React.Fragment key={plot.id}>
                <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRow(plot.id)}>
                  <TableCell>
                    {expandedRows[plot.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </TableCell>
                  <TableCell className="font-medium">{plot.plot_code}</TableCell>
                  <TableCell>{plot.project}</TableCell>
                  <TableCell>{plot.lat.toFixed(4)}, {plot.lon.toFixed(4)}</TableCell>
                  <TableCell>{plot.trees}</TableCell>
                  <TableCell>{plot.carbon.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>Edit</Button>
                  </TableCell>
                </TableRow>
                {expandedRows[plot.id] && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={7} className="p-4">
                       <div className="border rounded bg-white p-4">
                         <div className="flex justify-between items-center mb-4">
                           <h4 className="font-semibold text-gray-700 flex items-center"><TreePine className="w-4 h-4 mr-2 text-forest-600"/> Trees in Plot {plot.plot_code}</h4>
                           <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1"/> Add Tree</Button>
                         </div>
                         <Table>
                           <TableHeader>
                             <TableRow className="bg-gray-50">
                               <TableHead>Tag</TableHead>
                               <TableHead>Species</TableHead>
                               <TableHead>DBH (cm)</TableHead>
                               <TableHead>Height (m)</TableHead>
                               <TableHead>AGB (kg)</TableHead>
                             </TableRow>
                           </TableHeader>
                           <TableBody>
                              <TableRow>
                                <TableCell>T-101</TableCell>
                                <TableCell>Shorea robusta</TableCell>
                                <TableCell>45.2</TableCell>
                                <TableCell>22.5</TableCell>
                                <TableCell>850.4</TableCell>
                              </TableRow>
                           </TableBody>
                         </Table>
                       </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
