import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Check,
  ArrowLeft,
  Lock,
  Sparkles,
  Calendar,
  Loader2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useSubscriptionService } from "../services/subscriptionsService";
import { initPaddle, openPaddleCheckout } from "../services/paddleService";
import { useSubscription } from "../hooks/useSubscription";
import { toast } from "sonner";
import React from "react";

export function UpgradePage() {
  const navigate = useNavigate();
  const { setIsPremium } = useApp();
  const { createSubscriptionCheckout } = useSubscriptionService();
  const { hasPremium, isLoading, refreshSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paddleReady, setPaddleReady] = useState(false);

  const monthlyPrice = 12;
  const annualPrice = 10;
  const annualTotal = annualPrice * 12;

  // Initialize Paddle on component mount
  useEffect(() => {
    const initializePaddle = async () => {
      try {
        const paddle = await initPaddle();
        if (paddle) {
          setPaddleReady(true);
          console.log("✅ Paddle initialized for checkout");
        } else {
          console.error("❌ Failed to initialize Paddle");
          toast.error("Payment system not available. Please try again later.");
        }
      } catch (error) {
        console.error("Error initializing Paddle:", error);
        toast.error("Failed to load payment system");
      }
    };

    initializePaddle();
  }, []);

  // Proactively refresh subscription status while user is on this page,
  // so that after checkout we detect the new premium plan quickly.
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSubscription();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshSubscription]);

  // When subscription becomes premium, mark global state and send user back.
  useEffect(() => {
    if (!isLoading && hasPremium) {
      setIsPremium(true);
      toast.success("You’re now on the Premium plan!");
      navigate("/dashboard/pitches");
    }
  }, [hasPremium, isLoading, navigate, setIsPremium]);

  const handleUpgrade = async () => {
    if (!paddleReady) {
      toast.error("Payment system not ready. Please wait a moment.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create checkout session on backend
      const response = await createSubscriptionCheckout(billingCycle);

      if (response.success && response.transaction_id) {
        // Open Paddle checkout overlay
        await openPaddleCheckout(response.transaction_id);
        
        // Note: Paddle will handle the checkout flow
        // The webhook will update the subscription status
        // User will be redirected back after successful payment
        toast.success("Opening checkout...");
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast.error(error.message || "Failed to start checkout process");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setIsPremium(true);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-purple-50 via-white to-deep-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Plan Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-premium-purple/10 to-deep-blue/10 px-4 py-2 border border-premium-purple/20 mb-4">
                <Sparkles className="h-4 w-4 text-premium-purple" />
                <span className="text-sm font-medium text-premium-purple-900">
                  Upgrade to Premium
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Unlock Your Full Potential
              </h1>
              <p className="text-lg text-gray-600">
                Get hosted landing pages, analytics, AI assistance, and all
                essential founder tools
              </p>
            </div>

            {/* Pricing Toggle */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Select billing cycle
                    </h3>
                    <p className="text-sm text-gray-600">
                      Save with annual billing
                    </p>
                  </div>
                  {billingCycle === "annually" && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      Save 33%
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      billingCycle === "monthly"
                        ? "border-premium-purple bg-premium-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">Monthly</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${monthlyPrice}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </button>

                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      billingCycle === "yearly"
                        ? "border-premium-purple bg-premium-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">Annually</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${annualPrice}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </button>
                </div>

                {billingCycle === "yearly" && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      💰 You'll be charged ${annualTotal} annually (saves you
                      $24/year)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-premium-purple" />
                  Everything included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Built-in analytics (page views, clicks)",
                  "Multiple premium templates",
                  "AI-assisted pitch building",
                  "Invoice Generator",
                  "Contract Templates (NDAs, agreements)",
                  "360° Team Feedback",
                  "Investor Email Generator",
                  'Remove "Made with Foundify" badge',
                  "Priority support",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>14-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="border-2 border-gray-200 shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-br from-premium-purple-50 to-white">
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review and complete your upgrade
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Premium Plan (
                        {billingCycle === "monthly" ? "Monthly" : "Annual"})
                      </span>
                      <span className="font-semibold text-gray-900">
                        $
                        {billingCycle === "monthly"
                          ? monthlyPrice
                          : annualTotal}
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Annual discount</span>
                        <span>-$24</span>
                      </div>
                    )}
                    <div className="h-px w-full bg-gray-200" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">
                        Total due today
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
                        $
                        {billingCycle === "monthly"
                          ? monthlyPrice
                          : annualTotal}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gray-200" />

                  {/* Payment Info */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-green-600" />
                      Secure payment via Paddle
                    </p>
                    <p>
                      You'll be redirected to a secure Paddle checkout to complete your purchase.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleUpgrade}
                    disabled={isProcessing || !paddleReady}
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : !paddleReady ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    By clicking "Proceed to Checkout", you agree to our Terms of
                    Service and Privacy Policy. Your subscription will
                    auto-renew{" "}
                    {billingCycle === "monthly" ? "monthly" : "annually"}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
