import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { DashboardMain } from './pages/DashboardMain';
import { UpgradePage } from './pages/UpgradePage';
import { PitchBuilder } from './components/PitchBuilder';
import { LoadingModal } from './components/LoadingModal';
import { Toaster } from './components/Toaster';

type View = 'landing' | 'builder' | 'dashboard' | 'upgrade';

interface PitchData {
  startupName: string;
  problem: string;
  targetAudience: string;
  solution: string;
  uniqueValue: string;
  email: string;
}

interface Pitch {
  id: string;
  name: string;
  createdAt: string;
  views: number;
  status: 'draft' | 'published';
  hasLanding: boolean;
  hasPDF: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdPitch, setCreatedPitch] = useState<Pitch | undefined>();
  const [isPremium, setIsPremium] = useState(false);

  const handleStartPitch = () => {
    setCurrentView('builder');
  };

  const handleUpgrade = () => {
    setCurrentView('upgrade');
  };

  const handleUpgradeSuccess = () => {
    setIsPremium(true);
    setCurrentView('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handlePitchComplete = async (data: PitchData) => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate AI generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            // Create new pitch
            const newPitch: Pitch = {
              id: Date.now().toString(),
              name: data.startupName,
              createdAt: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              views: 0,
              status: 'draft',
              hasLanding: false,
              hasPDF: false,
            };
            setCreatedPitch(newPitch);
            setCurrentView('dashboard');
          }, 500);
          return 100;
        }
        return prev + 8;
      });
    }, 400);
  };

  const handleCreateNew = () => {
    setCurrentView('builder');
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  // Update Hero and CTA buttons to trigger pitch builder
  if (currentView === 'landing') {
    return (
      <div onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.textContent?.includes('Start Free') || 
          target.textContent?.includes('Start Free Today') ||
          target.closest('button')?.textContent?.includes('Start Free')
        ) {
          e.preventDefault();
          handleStartPitch();
        }
      }}>
        <LandingPage onDashboardClick={handleGoToDashboard} />
      </div>
    );
  }

  if (currentView === 'builder') {
    return (
      <>
        <PitchBuilder onComplete={handlePitchComplete} />
        <LoadingModal 
          isOpen={isGenerating} 
          type="generating"
          progress={progress}
        />
      </>
    );
  }

  if (currentView === 'upgrade') {
    return (
      <UpgradePage 
        onBack={handleBackToDashboard}
        onSuccess={handleUpgradeSuccess}
      />
    );
  }

  return (
    <>
      <DashboardMain 
        onCreateNew={handleCreateNew}
        onUpgrade={handleUpgrade}
        onBackToLanding={handleBackToLanding}
        initialPitch={createdPitch}
        isPremium={isPremium}
      />
      <Toaster />
    </>
  );
}