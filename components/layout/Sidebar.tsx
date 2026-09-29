"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, TreePine, Satellite, BarChart3, Shield, Smartphone, Menu, X, Leaf } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Field Data', href: '/field', icon: TreePine },
  { name: 'Satellite', href: '/satellite', icon: Satellite },
  { name: 'Carbon', href: '/carbon', icon: BarChart3 },
  { name: 'Audit Trail', href: '/audit', icon: Shield },
  { name: 'Field Collect', href: '/field-collect', icon: Smartphone },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        className="md:hidden fixed z-50 bottom-4 right-4 p-3 bg-forest-700 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-gray-900 text-gray-100 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center space-x-3 px-6 h-16 bg-gray-950 shrink-0">
          <Leaf className="w-8 h-8 text-forest-500" />
          <span className="text-xl font-bold tracking-tight">MRV Platform</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center px-3 py-2.5 rounded-md transition-colors group
                  ${isActive ? 'bg-forest-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 bg-gray-950 text-xs text-gray-500">
          <p>Ashtalakshmi Initiative</p>
          <p>Govt. of Assam</p>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
