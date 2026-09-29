"use client";
import React from 'react';
import { Plus, BarChart3, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_ASSESSMENTS = [
  { id: '1', project: 'Kaziranga Buffer', epoch: '2023-Q4', agb_mean: 125.4, total_tco2e: 45000, credits: 40500, status: 'VERIFIED' },
  { id: '2', project: 'Manas Forestry', epoch: '2023-Q4', agb_mean: 85.2, total_tco2e: 120000, credits: 0, status: 'DRAFT' },
];

export default function CarbonPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Carbon Assessments</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> New Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Total Validated tCO2e</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-600">165,000</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Net Credits Available</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-blue-600">40,500</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-gray-500">Pending Verification</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-amber-600">1</p></CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Epoch</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Mean AGBD (Mg/ha)</TableHead>
              <TableHead>Total tCO2e</TableHead>
              <TableHead>Net Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ASSESSMENTS.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-bold">{assessment.epoch}</TableCell>
                <TableCell>{assessment.project}</TableCell>
                <TableCell>{assessment.agb_mean}</TableCell>
                <TableCell>{assessment.total_tco2e.toLocaleString()}</TableCell>
                <TableCell>{assessment.credits.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={assessment.status === 'VERIFIED' ? 'success' : 'outline'}>
                    {assessment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1"/> Report</Button>
                  {assessment.status === 'DRAFT' && <Button size="sm"><CheckCircle className="w-4 h-4 mr-1"/> Verify</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
