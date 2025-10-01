import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { DashboardMain } from "./pages/DashboardMain";
import { UpgradePage } from "./pages/UpgradePage";
import { PitchBuilder } from "./components/PitchBuilder";
import { LoadingModal } from "./components/LoadingModal";
import { Toaster } from "./components/Toaster";
import { useApp } from "./context/AppContext";

export default function App() {
  const { isGenerating, progress } = useApp();

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<PitchBuilder />} />
        <Route path="/dashboard/*" element={<DashboardMain />} />
        <Route path="/upgrade" element={<UpgradePage />} />
      </Routes>

      <LoadingModal
        isOpen={isGenerating}
        type="generating"
        progress={progress}
      />
      <Toaster />
    </>
  );
}
