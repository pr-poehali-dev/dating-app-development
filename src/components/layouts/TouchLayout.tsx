import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';

interface TouchLayoutProps {
  children: ReactNode;
}

export default function TouchLayout({ children }: TouchLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}