import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { PitchDashboard } from "./PitchDashboard";
import { InvoicesPage } from "./invoices/InvoicesPage";
import { FounderEssentialsPage } from "./FounderEssentialsPage";
import { useApp } from "../context/AppContext";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "../components/signIn/SignInModal";

export function DashboardMain() {
  const navigate = useNavigate();
  const { isPremium, pitches } = useApp();
  const { user, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setIsSignInModalOpen(true);
    }
  }, [user, loading]);

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  // Show loading if checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-premium-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign In Required</h2>
          <p className="text-gray-600">
            You need to be signed in to access the dashboard.
          </p>
        </div>

        {/* Sign In Modal */}
        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={() => {
            setIsSignInModalOpen(false);
            navigate("/");
          }}
          onSignInSuccess={handleSignInSuccess}
        />
      </div>
    );
  }

  return (
    <DashboardLayout
      onCreatePitch={() => navigate("/builder")}
      isPremium={isPremium}
    >
      <Routes>
        <Route index element={<Navigate to="/dashboard/pitches" replace />} />
        <Route
          path="pitches"
          element={
            <PitchDashboard
              initialPitch={pitches[0]}
              isPremium={isPremium}
              onUpgrade={() => navigate("/upgrade")}
            />
          }
        />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route
          path="essentials"
          element={
            <FounderEssentialsPage
              isPremium={isPremium}
              onUpgrade={() => navigate("/upgrade")}
            />
          }
        />
      </Routes>
    </DashboardLayout>
  );
}
