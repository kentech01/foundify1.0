import { createContext, useContext, useState, ReactNode } from "react";

export interface Pitch {
  id: string;
  name: string;
  createdAt: string;
  views: number;
  status: "draft" | "published";
  hasLanding: boolean;
  hasPDF: boolean;
}

export interface PitchData {
  startupName: string;
  problem: string;
  targetAudience: string;
  solution: string;
  uniqueValue: string;
  email: string;
}

interface AppContextType {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
  pitches: Pitch[];
  addPitch: (pitch: Pitch) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  progress: number;
  setProgress: (value: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const addPitch = (pitch: Pitch) => {
    setPitches((prev) => [pitch, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        isPremium,
        setIsPremium,
        pitches,
        addPitch,
        isGenerating,
        setIsGenerating,
        progress,
        setProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
