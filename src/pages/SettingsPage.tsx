import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useSubscription } from "../hooks/useSubscription";
import { useApiService } from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Loader2, CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionStatusResponse {
  success: boolean;
  subscription?: {
    status: string;
    plan_type: string;
    // May include additional fields returned by the API, including:
    // - paddleData: live Paddle subscription object
    // - any future metadata columns from the subscriptions table
    [key: string]: unknown;
  };
}

export function SettingsPage() {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { currentUser } = useCurrentUser();
  const { refreshSubscription } = useSubscription();
  const { getSubscriptionStatus } = useApiService();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [statusResponse, setStatusResponse] = useState<SubscriptionStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Single source of truth: fetch subscription status when Settings loads so UI matches API
  const subscription = statusResponse?.subscription;
  const status = subscription?.status ?? "inactive";
  const plan_type = subscription?.plan_type ?? "free";
  const paddleData = (subscription?.paddleData ||
    // In case the API ever returns snake_case
    (subscription as any)?.paddle_data) as any | undefined;

  const scheduledChange =
    paddleData?.scheduled_change || paddleData?.scheduledChange;
  const isCancellationScheduled =
    scheduledChange?.action === "cancel" ||
    scheduledChange?.action === "cancellation";
  const cancellationEffectiveAt: string | undefined =
    scheduledChange?.effective_at || scheduledChange?.effectiveAt;

  const isPremiumActive = plan_type === "premium" && status === "active";

  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        setStatusLoading(true);
        const response = await getSubscriptionStatus();
        if (!cancelled) setStatusResponse(response);
      } catch {
        if (!cancelled) setStatusResponse(null);
      } finally {
        if (!cancelled) setStatusLoading(false);
      }
    };
    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [getSubscriptionStatus]);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      const res = await axiosInstance.post<{ success: boolean; message?: string }>(
        "/subscriptions/cancel"
      );
      const response = res.data;

      if (response.success) {
        setCancelModalOpen(false);
        toast.success("Subscription cancellation scheduled", {
          description:
            "Your subscription will remain active until the end of the current billing period.",
        });
        await refreshSubscription();
        const fresh = await getSubscriptionStatus();
        setStatusResponse(fresh);
      } else {
        throw new Error(response.message || "Failed to cancel subscription");
      }
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to cancel subscription. Please try again.";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account details and subscription.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account card */}
        <Card className="border-2 border-gray-100">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">
                {currentUser?.displayName || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {currentUser?.email || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    plan_type === "premium"
                      ? "bg-gradient-to-r from-premium-purple to-deep-blue text-white"
                      : "bg-gray-200 text-gray-800"
                  }
                >
                  {plan_type === "premium" ? "Premium" : "Free"}
                </Badge>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {isPremiumActive && isCancellationScheduled && cancellationEffectiveAt
                    ? `ACTIVE – CANCELS ${formatDate(cancellationEffectiveAt)}`
                    : status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription card */}
        <Card className="border-2 border-gray-100">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading subscription…</span>
              </div>
            ) : isPremiumActive && isCancellationScheduled ? (
              <>
                <Alert className="border-yellow-200 bg-yellow-50">
                  <XCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">
                    Subscription cancellation scheduled
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700 text-sm">
                    You&apos;ve cancelled your Premium subscription. You&apos;ll
                    keep full Premium access until{" "}
                    {cancellationEffectiveAt
                      ? formatDate(cancellationEffectiveAt)
                      : "the end of the current billing period"}
                    . After that, you won&apos;t be charged again and will move to
                    the free plan.
                  </AlertDescription>
                </Alert>
              </>
            ) : isPremiumActive ? (
              <>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">
                    Premium is active
                  </AlertTitle>
                  <AlertDescription className="text-green-700 text-sm">
                    Your Premium subscription renews automatically each billing
                    period. You can cancel anytime, and you&apos;ll keep access
                    until the end of the current period.
                  </AlertDescription>
                </Alert>

                <AlertDialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => setCancelModalOpen(true)}
                    disabled={isCancelling}
                  >
                    Cancel subscription
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your subscription will stay active until the end of the
                        current billing period. After that, you&apos;ll no longer
                        be charged and will move to the free plan. You can
                        upgrade again anytime.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleCancelSubscription();
                        }}
                        disabled={isCancelling}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling…
                          </>
                        ) : (
                          "Yes, cancel subscription"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">
                    No active subscription
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 text-sm">
                    You are currently on the free plan. Upgrade to unlock all
                    Premium features.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => navigate("/upgrade")}
                  className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white"
                >
                  Upgrade Now
                </Button>
              </>
            )}

            {status === "cancelled" && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <XCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">
                  Subscription cancelled
                </AlertTitle>
                <AlertDescription className="text-yellow-700 text-sm">
                  Your subscription has been cancelled. You won&apos;t be
                  charged again. You can re-upgrade from the dashboard anytime.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

