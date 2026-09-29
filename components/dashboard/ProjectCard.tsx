"use client";
import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { statusBadgeVariant, formatArea } from '@/lib/utils';
import { Leaf, Map, Activity } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  name: string;
  status: string;
  methodology: string;
  area: number;
  plots: number;
  carbon: number;
}

export function ProjectCard({ id, name, status, methodology, area, plots, carbon }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`} className="block">
      <div className="border rounded-lg p-5 bg-white hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-forest-800 line-clamp-1" title={name}>{name}</h3>
          <Badge variant={statusBadgeVariant(status)}>{status}</Badge>
        </div>
        
        <p className="text-xs text-gray-500 mb-4 bg-gray-100 inline-block px-2 py-1 rounded">
          {methodology}
        </p>
        
        <div className="grid grid-cols-3 gap-2 border-t pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center"><Map className="w-3 h-3 mr-1"/> Area</span>
            <span className="font-medium text-sm">{formatArea(area)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center"><Activity className="w-3 h-3 mr-1"/> Plots</span>
            <span className="font-medium text-sm">{plots}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center"><Leaf className="w-3 h-3 mr-1"/> Carbon</span>
            <span className="font-medium text-sm text-emerald-600">{carbon.toLocaleString()} t</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
