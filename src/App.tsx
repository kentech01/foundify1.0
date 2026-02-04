import { Routes, Route } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import Landing from "./pages/Landing";
import { DashboardMain } from "./pages/DashboardMain";
import { UpgradePage } from "./pages/UpgradePage";
import { PitchBuilder } from "./components/PitchBuilder";
import { LoadingModal } from "./components/LoadingModal";
import { Toaster } from "./components/Toaster";
import { useApp } from "./context/AppContext";
import { useApiService } from "./services/api";
import { useEffect } from "react";
import { currentUserAtom, userLoadingAtom, userErrorAtom } from "./atoms";
import { UserAuth } from "./context/AuthContext";
import LandingPagePreview from "./pages/LandingPagePreview";
import React from "react";
import Terms from "./pages/Terms";
import { PublicDigitalCard } from "./pages/PublicDigitalCard";

export default function App() {
  const { isGenerating, progress } = useApp();
  const { user } = UserAuth();
  const apiService = useApiService();  

  // Recoil state for current user
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  const setUserLoading = useSetRecoilState(userLoadingAtom);
  const setUserError = useSetRecoilState(userErrorAtom);

  useEffect(() => {
    if (!user?.accessToken) return;
    const fetchUserProfile = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
        const userProfile = await apiService.getCurrentUserProfile();
        setCurrentUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserError(
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile"
        );
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.accessToken]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/builder" element={<PitchBuilder />} />
        <Route path="/dashboard/*" element={<DashboardMain username={user?.displayName ?? null} />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/card/:cardId" element={<PublicDigitalCard />} />
        <Route path="/:startupName" element={<LandingPagePreview />} />
        <Route path="/terms" element={<Terms />} />
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
