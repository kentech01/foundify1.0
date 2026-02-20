import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { PitchDashboard } from "./PitchDashboard";
import { InvoicesPage } from "./invoices/InvoicesPage";
// import { FounderEssentialsPage } from "./FounderEssentialsPage";
import { useApp } from "../context/AppContext";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "../components/signIn/SignInModal";
import { ContractsListPage } from "./ContractsListPage";
import React from "react";
import { EmailTemplatesPage } from "./EmailTemplatesPage";
import { AIHiringAssistant } from "./AIHiringAssistant";
import { QRVisitCardPage } from "./QRVisitCardPage";
import { TeamInsightsPage } from "./TeamInsightsPage";
import { useSubscriptionService } from "../services/subscriptionsService";
import { toast } from "sonner";
import { useSubscription } from "../hooks/useSubscription";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { SettingsPage } from "./SettingsPage";

interface DashboardMainProps{
  username: string | null,
}
export function DashboardMain({
  username
}: DashboardMainProps)  {
  const navigate = useNavigate();
  const { isPremium, pitches, setIsPremium } = useApp();
  const { user, loading } = UserAuth();
  const { currentUser } = useCurrentUser();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { createSubscriptionCheckout } = useSubscriptionService();
  const { hasPremium } = useSubscription();
  // Function to close all open modals/popups
  const closeAllModals = () => {
    // Close all dialog overlays
    const allOverlays = document.querySelectorAll('[data-slot="dialog-overlay"]');
    allOverlays.forEach((overlay) => {
      const dialog = overlay.querySelector('[role="dialog"]');
      if (dialog) {
        // Find and click the close button
        const closeButton =
          dialog.querySelector('[data-slot="dialog-close"]') ||
          dialog.querySelector('button[aria-label="Close"]') ||
          dialog.querySelector('[data-state]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      }
    });

    // Also try to close any modals by setting their open state
    // This handles modals that might be controlled by state
    const allModals = document.querySelectorAll('[role="dialog"]');
    allModals.forEach((modal) => {
      const closeBtn = modal.querySelector('button[aria-label="Close"]') ||
                      modal.querySelector('[data-slot="dialog-close"]');
      if (closeBtn) {
        (closeBtn as HTMLElement).click();
      }
    });
  };

  // Handle upgrade - close all modals and open checkout in new tab
  const handleUpgrade = async () => {
    try {
      // Close all open modals first
      closeAllModals();

      // Create checkout session (default to monthly)
      const response = await createSubscriptionCheckout(
        "monthly",
        user?.email || undefined,
        user?.displayName || undefined
      );

      if (response.success && response.checkout_url) {
        // Redirect to Lemon Squeezy checkout
        window.location.href = response.checkout_url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast.error(error.message || "Failed to start checkout process");
    }
  };

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setIsSignInModalOpen(true);
    }
  }, [user, loading]);

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  // Reset premium state when the logged-in user changes (logout or switch account).
  // Prevents a new account from inheriting the previous account's isPremium flag.
  const prevUidRef = useRef<string | null>(null);
  useEffect(() => {
    const uid = user?.uid ?? null;
    if (prevUidRef.current !== uid) {
      prevUidRef.current = uid;
      setIsPremium(false);
    }
  }, [user?.uid, setIsPremium]);

  // Check premium status from multiple sources:
  // 1. Subscription status (hasPremium)
  // 2. User profile plan field
  // 3. Global isPremium state
  const profileIsPremium = currentUser?.plan === "premium";
  const effectiveIsPremium = isPremium || hasPremium || profileIsPremium;

  // Keep global isPremium in sync with subscription status and profile
  useEffect(() => {
    if ((hasPremium || profileIsPremium) && !isPremium) {
      setIsPremium(true);
    }
  }, [hasPremium, profileIsPremium, isPremium, setIsPremium]);

  // Debug logging
  useEffect(() => {
    console.log("Premium Status Check:", {
      isPremium,
      hasPremium,
      profileIsPremium,
      currentUserPlan: currentUser?.plan,
      effectiveIsPremium,
    });
  }, [isPremium, hasPremium, profileIsPremium, currentUser?.plan, effectiveIsPremium]);

  // Show loading if checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <div className="w-16 h-16 rounded-full bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] flex items-center justify-center mx-auto">
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
    <DashboardLayout isPremium={effectiveIsPremium}>
      <Routes>
        <Route index element={<Navigate to="/dashboard/pitches" replace />} />
        <Route
          path="pitches"
          element={
            <PitchDashboard
            userName={username}
              initialPitch={pitches[0]}
              onCreatePitch={() => navigate("/builder")}
              isPremium={effectiveIsPremium}
              onUpgrade={handleUpgrade}
            />
          }
        />
        {/* <Route
          path="essentials"
          element={
            <FounderEssentialsPage
              isPremium={isPremium}
              onUpgrade={() => navigate("/upgrade")}
            />
          }
        /> */}
        <Route
          path="invoices"
          element={<InvoicesPage isPremium={effectiveIsPremium} />}
        />
        <Route
          path="contracts"
          element={<ContractsListPage isPremium={effectiveIsPremium} />}
        />
        <Route
          path="feedbackCoach"
          element={<TeamInsightsPage isPremium={effectiveIsPremium} />}
        />
        <Route
          path="investor-email-draft"
          element={<EmailTemplatesPage isPremium={effectiveIsPremium} />}
        />
        <Route
          path="ai-hiring-assistant"
          element={<AIHiringAssistant isPremium={effectiveIsPremium} />}
        />
        <Route
          path="qr-card"
          element={<QRVisitCardPage isPremium={effectiveIsPremium} />}
        />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
