import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';

interface WebLayoutProps {
  children: ReactNode;
}

export default function WebLayout({ children }: WebLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      <Navigation />
      
      {/* Main Content with top padding for desktop nav */}
      <main className="lg:pt-20 flex-1">
        {children}
      </main>
    </div>
  );
}