import { useEffect, useState } from "react";
import { PremiumUpgradeModal } from "./PremiumUpgradeModal";
import { useSubscription } from "../hooks/useSubscription";
import { Loader2 } from "lucide-react";

interface PremiumGuardProps {
  children: React.ReactNode;
  featureName: string;
}

export function PremiumGuard({ children, featureName }: PremiumGuardProps) {
  const { hasPremium, isLoading, refreshSubscription } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal if user is not premium and not loading
    if (!isLoading && !hasPremium) {
      setShowModal(true);
    } else if (hasPremium) {
      // Close modal if user becomes premium
      setShowModal(false);
    }
  }, [hasPremium, isLoading]);

  // Refresh subscription status periodically to catch webhook updates
  useEffect(() => {
    if (!isLoading && !hasPremium) {
      const interval = setInterval(() => {
        refreshSubscription();
      }, 5000); // Check every 5 seconds when modal is open

      return () => clearInterval(interval);
    }
  }, [isLoading, hasPremium, refreshSubscription]);

  // Show loading state while checking subscription
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is premium, show the content
  if (hasPremium) {
    return <>{children}</>;
  }

  // If user is not premium, show modal and empty content
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-blue-600"
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
          <h2 className="text-2xl font-bold text-gray-900">Premium Required</h2>
          <p className="text-gray-600">
            This feature is available for Premium users only. Upgrade to access{" "}
            {featureName}.
          </p>
        </div>
      </div>
      <PremiumUpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        featureName={featureName}
      />
    </>
  );
}

