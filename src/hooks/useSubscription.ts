import { useState, useEffect, useCallback } from "react";
import { useApiService } from "../services/api";
import { useCurrentUser } from "./useCurrentUser";

export interface SubscriptionData {
  status: "inactive" | "active" | "cancelled" | string;
  plan_type: "free" | "premium";
  isLoading: boolean;
  hasPremium: boolean;
}

export function useSubscription() {
  const { user } = useCurrentUser();
  const { getSubscriptionStatus } = useApiService();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    status: "inactive",
    plan_type: "free",
    isLoading: true,
    hasPremium: false,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscription({
        status: "inactive",
        plan_type: "free",
        isLoading: false,
        hasPremium: false,
      });
      return;
    }

    try {
      setSubscription((prev) => ({ ...prev, isLoading: true }));
      const response = await getSubscriptionStatus();

      if (response.success && response.subscription) {
        const hasPremium =
          response.subscription.status === "active" &&
          response.subscription.plan_type === "premium";

        setSubscription({
          status: response.subscription.status,
          plan_type: response.subscription.plan_type,
          isLoading: false,
          hasPremium,
        });
      } else {
        setSubscription({
          status: "inactive",
          plan_type: "free",
          isLoading: false,
          hasPremium: false,
        });
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription((prev) => ({
        ...prev,
        isLoading: false,
        hasPremium: false,
      }));
    }
  }, [user, getSubscriptionStatus]);

  // Check subscription when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Poll subscription status every 30 seconds when user is logged in
  // This helps catch webhook updates
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...subscription,
    refreshSubscription: checkSubscription,
  };
}

