import useAxios from "../hooks/useAxios";

// Subscription types
export interface CreateSubscriptionCheckoutResponse {
  success: boolean;
  checkout_url?: string; // URL for redirect (legacy)
  transaction_id?: string; // Paddle transaction ID for overlay checkout
  checkout_id?: string | number; // Legacy field
}

export interface SubscriptionRecord {
  id?: string;
  user_id?: string;
  paddle_subscription_id?: string | null;
  lemonsqueezy_subscription_id?: string | null; // Legacy field
  status: "inactive" | "active" | "cancelled" | "trialing" | "past_due" | "paused" | string;
  plan_type: "free" | "premium";
  provider?: "paddle" | "lemonsqueezy";
  created_at?: string;
  updated_at?: string;
  email?: string;
  paddleData?: unknown;
  lemonSqueezeData?: unknown; // Legacy field
}

export interface GetSubscriptionStatusResponse {
  success: boolean;
  subscription: SubscriptionRecord;
}

export const useSubscriptionService = () => {
  const axiosInstance = useAxios();

  const createSubscriptionCheckout = async (
    billingPeriod: "monthly" | "yearly",
    email?: string,
    name?: string
  ): Promise<CreateSubscriptionCheckoutResponse> => {
    console.log("Sending checkout request with billingPeriod:", billingPeriod);
    const response =
      await axiosInstance.post<CreateSubscriptionCheckoutResponse>(
        "/subscriptions/create",
        { billingPeriod, email, name }
      );
    return response.data;
  };

  const getSubscriptionStatus =
    async (): Promise<GetSubscriptionStatusResponse> => {
      const response = await axiosInstance.get<GetSubscriptionStatusResponse>(
        "/subscriptions/status"
      );
      return response.data;
    };

  return {
    createSubscriptionCheckout,
    getSubscriptionStatus,
  };
};

// Non-hook version for use outside React components
export const subscriptionsService = {
  async createSubscriptionCheckout(
    billingPeriod: "monthly" | "yearly" = "monthly",
    email?: string,
    name?: string
  ): Promise<CreateSubscriptionCheckoutResponse> {
    const { apiFetch } = await import("./api");
    const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";
    const response = await apiFetch(`${API_BASE_URL}subscriptions/create`, {
      method: "POST",
      body: JSON.stringify({ billingPeriod, email, name }),
    });

    console.log("response subscriptionCreate", response);
    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }
    return response.json();
  },

  async getSubscriptionStatus(): Promise<GetSubscriptionStatusResponse> {
    const { apiFetch } = await import("./api");
    const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";
    const response = await apiFetch(`${API_BASE_URL}subscriptions/status`);
    if (!response.ok) {
      throw new Error("Failed to get subscription status");
    }
    return response.json();
  },
};
