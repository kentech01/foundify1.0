import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { PitchDashboard } from './PitchDashboard';
import { InvoicesPage } from './InvoicesPage';
import { FounderEssentialsPage } from './FounderEssentialsPage';

interface Pitch {
  id: string;
  name: string;
  createdAt: string;
  views: number;
  status: 'draft' | 'published';
  hasLanding: boolean;
  hasPDF: boolean;
}

interface DashboardMainProps {
  onCreateNew: () => void;
  onUpgrade: () => void;
  onBackToLanding?: () => void;
  initialPitch?: Pitch;
  isPremium: boolean;
}

export function DashboardMain({ 
  onCreateNew, 
  onUpgrade, 
  onBackToLanding,
  initialPitch, 
  isPremium 
}: DashboardMainProps) {
  const [currentView, setCurrentView] = useState<'pitches' | 'invoices' | 'essentials'>('pitches');

  return (
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onCreatePitch={onCreateNew}
      onBackToLanding={onBackToLanding}
      isPremium={isPremium}
    >
      {currentView === 'pitches' && (
        <PitchDashboard 
          initialPitch={initialPitch}
          isPremium={isPremium}
          onUpgrade={onUpgrade}
        />
      )}
      
      {currentView === 'invoices' && (
        <InvoicesPage />
      )}
      
      {currentView === 'essentials' && (
        <FounderEssentialsPage 
          isPremium={isPremium}
          onUpgrade={onUpgrade}
        />
      )}
    </DashboardLayout>
  );
}