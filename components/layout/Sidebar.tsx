"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, FolderKanban, TreePine, Satellite, 
  BarChart3, Shield, Smartphone, Menu, X, Leaf, Sparkles 
} from 'lucide-react';
import { getPendingCount } from '@/lib/offline-store';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Field Collect (PWA)', href: '/field-collect', icon: Smartphone, hasBadge: true },
  { name: 'Field Ground Truth', href: '/field', icon: TreePine },
  { name: 'Spatial & Satellite', href: '/satellite', icon: Satellite },
  { name: 'Carbon Assessment', href: '/carbon', icon: BarChart3 },
  { name: 'Audit Trail', href: '/audit', icon: Shield },
  { name: 'Forest Projects', href: '/projects', icon: FolderKanban },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setPendingCount(getPendingCount());
    };
    updateCount();
    const interval = setInterval(updateCount, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        className="md:hidden fixed z-50 bottom-4 right-4 p-3 bg-forest-700 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">
                ASSAC MRV
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                NESFIC-D-15 Platform
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition group text-xs font-semibold
                  ${isActive 
                    ? 'bg-forest-700 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className={`w-4 h-4 mr-3 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  }`} />
                  <span>{item.name}</span>
                </div>

                {item.hasBadge && pendingCount > 0 && (
                  <span className="bg-amber-500 text-black font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-200">Ashtalakshmi MRV System</p>
          <p className="text-[10px]">Viksit Bharat 2047 • Govt. of Assam</p>
          <div className="pt-1 text-[9px] text-emerald-500 font-mono">
            Node: assac-stream1-d15
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
