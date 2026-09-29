"use client";
import React from 'react';
import { Shield, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MOCK_LEDGER = [
  { id: '1', timestamp: '2023-11-01T10:23:45Z', type: 'PROJECT', action: 'CREATE', hash: '0x8f4a...2b1c', prev_hash: '0x0000...0000' },
  { id: '2', timestamp: '2023-11-02T14:15:22Z', type: 'FIELD_DATA', action: 'UPLOAD', hash: '0x4c21...9a3f', prev_hash: '0x8f4a...2b1c' },
  { id: '3', timestamp: '2023-11-05T09:11:05Z', type: 'CARBON_ASSESSMENT', action: 'CALCULATE', hash: '0x1a9e...7d82', prev_hash: '0x4c21...9a3f' },
];

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Audit Trail Ledger</h2>
        <div className="space-x-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export JSON</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Shield className="w-4 h-4 mr-2" /> Verify Chain Integrity
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start gap-3">
        <Lock className="w-5 h-5 mt-0.5" />
        <div>
          <h4 className="font-semibold">Immutable Record</h4>
          <p className="text-sm">All MRV actions are cryptographically hashed and chained to ensure data integrity and prevent tampering, compliant with ISO 14064-2.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Payload Hash</TableHead>
              <TableHead>Ledger Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LEDGER.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-sm">{new Date(entry.timestamp).toLocaleString()}</TableCell>
                <TableCell>{entry.type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${entry.action === 'CREATE' ? 'bg-green-100 text-green-800' : ''}
                    ${entry.action === 'UPLOAD' ? 'bg-blue-100 text-blue-800' : ''}
                    ${entry.action === 'CALCULATE' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {entry.action}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-500">{entry.hash}</TableCell>
                <TableCell className="font-mono text-xs text-gray-500">{entry.prev_hash}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
