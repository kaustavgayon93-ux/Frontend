"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, FolderKanban, MapPin, Leaf, ArrowRight, TreePine, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ASSAM_DIVISIONS } from '@/lib/assam-data';

interface ProjectItem {
  id: string;
  name: string;
  division: string;
  district: string;
  status: 'ACTIVE' | 'MONITORING' | 'VERIFIED' | 'PLANNING';
  methodology: string;
  areaHa: number;
  startDate: string;
  carbonTco2e: number;
  samplePlots: number;
  description: string;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-kaziranga',
    name: 'Kaziranga Buffer Zone Agroforestry Restoration',
    division: 'Kaziranga Buffer Division',
    district: 'Golaghat & Nagaon',
    status: 'ACTIVE',
    methodology: 'Verra VM0047',
    areaHa: 4850,
    startDate: '2023-06-01',
    carbonTco2e: 485200,
    samplePlots: 24,
    description: 'Multi-species agroforestry and indigenous timber buffer belt along national park periphery to mitigate human-elephant conflict.'
  },
  {
    id: 'proj-manas',
    name: 'Manas Tiger Reserve Corridor Afforestation',
    division: 'Manas Buffer Division',
    district: 'Baksa & Chirang',
    status: 'ACTIVE',
    methodology: 'Verra VM0047',
    areaHa: 6200,
    startDate: '2022-11-15',
    carbonTco2e: 562100,
    samplePlots: 18,
    description: 'Reforestation of degraded buffer strips connecting Manas National Park with Royal Manas Bhutan.'
  },
  {
    id: 'proj-karbi',
    name: 'Karbi Anglong East Bamboo & Timber Plantation',
    division: 'Karbi Anglong East',
    district: 'Karbi Anglong',
    status: 'VERIFIED',
    methodology: 'Verra VM0047',
    areaHa: 8900,
    startDate: '2021-08-01',
    carbonTco2e: 890400,
    samplePlots: 32,
    description: 'Community-managed bamboo and sal agroforestry in hilly catchment slopes for high-rate carbon sequestration.'
  },
  {
    id: 'proj-kamrup',
    name: 'Kamrup Social Forestry Riverbank Stabilization',
    division: 'Kamrup Social Forestry',
    district: 'Kamrup & Metro',
    status: 'MONITORING',
    methodology: 'Verra VM0047',
    areaHa: 4100,
    startDate: '2024-02-10',
    carbonTco2e: 312800,
    samplePlots: 16,
    description: 'Brahmaputra tributary bank stabilization and hill slope compensatory afforestation.'
  },
  {
    id: 'proj-dimahasao',
    name: 'Dima Hasao Watershed Afforestation Project',
    division: 'Dima Hasao Division',
    district: 'Dima Hasao',
    status: 'MONITORING',
    methodology: 'Verra VM0047',
    areaHa: 7300,
    startDate: '2023-01-20',
    carbonTco2e: 724000,
    samplePlots: 20,
    description: 'Revegetation of abandoned shifting cultivation areas with native broadleaf species.'
  },
  {
    id: 'proj-jorhat',
    name: 'Jorhat Riverine Chapori Afforestation',
    division: 'Jorhat Riverine Division',
    district: 'Jorhat & Majuli',
    status: 'PLANNING',
    methodology: 'Verra VM0047',
    areaHa: 3600,
    startDate: '2025-05-01',
    carbonTco2e: 245000,
    samplePlots: 14,
    description: 'Sandbar stabilization using Simul, Khair, and Sissoo fast-growing flood-resilient species.'
  }
];

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  const filtered = PROJECTS_DATA.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.district.toLowerCase().includes(search.toLowerCase()) ||
    p.division.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
              ASSAC Registered Afforestation Projects
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Forest & Plantation MRV Projects</h2>
          <p className="text-xs text-gray-500">
            Registered pilot projects across Assam forest divisions under Ashtalakshmi for Viksit Bharat 2047
          </p>
        </div>

        <Link href="/field-collect">
          <Button className="bg-forest-700 hover:bg-forest-800 text-white font-bold h-10 shadow text-xs">
            <Plus className="w-4 h-4 mr-1.5" /> Record Ground Plot for Project
          </Button>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input 
              placeholder="Search by project name or district..." 
              className="pl-9 bg-white text-xs h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs font-semibold text-gray-500">{filtered.length} projects registered</span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 text-xs">
                <TableHead>Project Title</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Methodology</TableHead>
                <TableHead>Area (ha)</TableHead>
                <TableHead>Carbon (tCO2e)</TableHead>
                <TableHead>Plots</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filtered.map(proj => (
                <TableRow key={proj.id} className="hover:bg-gray-50">
                  <td className="font-bold text-gray-900">
                    <div>{proj.name}</div>
                    <span className="text-[10px] text-gray-400 font-normal">{proj.description.slice(0, 75)}...</span>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-800 block">{proj.district}</span>
                    <span className="text-[10px] text-gray-500">{proj.division}</span>
                  </td>
                  <td>
                    <Badge variant={
                      proj.status === 'VERIFIED' ? 'success' :
                      proj.status === 'ACTIVE' ? 'default' : 'outline'
                    }>
                      {proj.status}
                    </Badge>
                  </td>
                  <td className="font-medium text-gray-700">{proj.methodology}</td>
                  <td className="font-bold text-gray-900">{proj.areaHa.toLocaleString()} ha</td>
                  <td className="font-black text-forest-700">{proj.carbonTco2e.toLocaleString()}</td>
                  <td className="font-bold text-gray-800">{proj.samplePlots}</td>
                  <td className="text-right">
                    <Link href={`/projects/${proj.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs text-forest-700">
                        View MRV Dossier <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
