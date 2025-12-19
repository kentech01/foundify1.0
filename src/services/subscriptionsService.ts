import useAxios from "../hooks/useAxios";

// Subscription types
export interface CreateSubscriptionCheckoutResponse {
  success: boolean;
  checkout_url: string;
  checkout_id: string | number;
}

export interface SubscriptionRecord {
  id?: string;
  user_id?: string;
  lemonsqueezy_subscription_id?: string | null;
  status: "inactive" | "active" | "cancelled" | string;
  plan_type: "free" | "premium";
  created_at?: string;
  updated_at?: string;
  email?: string;
  lemonSqueezeData?: unknown;
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
