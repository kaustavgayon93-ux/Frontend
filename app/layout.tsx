import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { Bell, UserCircle } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ashtalakshmi MRV',
  description: 'Measurement, Reporting, and Verification platform for forest monitoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
              <h1 className="text-xl font-semibold text-gray-800">MRV Platform</h1>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <UserCircle className="w-6 h-6" />
                </button>
              </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
