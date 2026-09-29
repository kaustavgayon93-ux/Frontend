import React from 'react';

interface CarbonSummaryProps {
  gross: number;
  uncertainty: number;
  buffer: number;
  net: number;
}

export function CarbonSummary({ gross, uncertainty, buffer, net }: CarbonSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Net Creditable GHG Removals</h3>
      <div className="text-4xl font-bold text-emerald-600 mb-6">
        {net.toLocaleString()} <span className="text-lg text-gray-500 font-normal">tCO2e</span>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-gray-600">Gross GHG Removals</span>
          <span className="font-medium text-green-700">+{gross.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-gray-600">Uncertainty Deduction (15%)</span>
          <span className="font-medium text-red-600">-{uncertainty.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-gray-600">Buffer Pool Allocation (20%)</span>
          <span className="font-medium text-red-600">-{buffer.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-2 font-semibold text-base">
          <span>Net VCU Equivalent</span>
          <span className="text-emerald-700">{net.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
