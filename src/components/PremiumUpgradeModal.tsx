import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "./ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Loader2, Sparkles, Zap, XIcon } from "lucide-react";
import { useSubscriptionService } from "../services/subscriptionsService";
import { toast } from "sonner";
import { UserAuth } from "../context/AuthContext";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function PremiumUpgradeModal({
  isOpen,
  onClose,
  featureName = "this feature",
}: PremiumUpgradeModalProps) {
  const { createSubscriptionCheckout } = useSubscriptionService();
  const { user } = UserAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPrice = 10;
  const yearlyPrice = 100;

  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const priceLabel = isYearly ? "/ year" : "/ month";
  const savings = isYearly
    ? `Save $${monthlyPrice * 12 - yearlyPrice} per year`
    : null;

  // Close all other modals when this opens
  useEffect(() => {
    if (isOpen) {
      // Close any other open dialogs/modals by finding and closing them
      const closeOtherModals = () => {
        // Find all dialog overlays
        const allOverlays = document.querySelectorAll(
          '[data-slot="dialog-overlay"]'
        );
        allOverlays.forEach((overlay) => {
          const dialog = overlay.querySelector('[role="dialog"]');
          if (dialog && !dialog.hasAttribute("data-premium-modal")) {
            // Find and click the close button
            const closeButton =
              dialog.querySelector('[data-slot="dialog-close"]') ||
              dialog.querySelector('button[aria-label="Close"]');
            if (closeButton) {
              (closeButton as HTMLElement).click();
            }
          }
        });
      };

      // Small delay to ensure this modal is rendered first
      setTimeout(closeOtherModals, 150);
    }
  }, [isOpen]);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const billingPeriod = isYearly ? "yearly" : "monthly";
      console.log("Creating checkout with billing period:", billingPeriod);
      const response = await createSubscriptionCheckout(
        billingPeriod,
        user?.email || undefined,
        user?.displayName || undefined
      );

      if (response.success && response.checkout_url) {
        // Redirect to Lemon Squeezy checkout
        window.location.href = response.checkout_url;
      } else {
        toast.error("Failed to create checkout session");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast.error(error.message || "Failed to start checkout process");
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only allow closing if not loading (user can close manually)
        if (!open && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogPortal data-slot="dialog-portal">
        <DialogPrimitive.Overlay
          data-slot="dialog-overlay"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
        />
        <DialogPrimitive.Content
          data-premium-modal="true"
          data-slot="dialog-content"
          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[101] grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 w-[95vw] sm:w-[90vw] md:w-[85vw] lg:max-w-6xl max-h-[95vh] overflow-y-auto p-0 mx-2 sm:mx-4"
          onPointerDownOutside={(e) => {
            // Prevent closing by clicking outside - encourage upgrade
            if (!isLoading) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Allow ESC to close when not loading
            if (!isLoading) {
              onClose();
            } else {
              e.preventDefault();
            }
          }}
        >
          <DialogPrimitive.Close className="cursor-pointer ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-10">
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Simple,{" "}
                <span className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] bg-clip-text text-transparent">
                  Honest Pricing
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
                Start free, upgrade when you need more. No hidden fees, no
                surprises.
              </p>
            </div>

            {/* Billing Period Toggle - Centered above cards */}
            <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
              <span
                className={`text-sm font-medium transition-colors ${
                  !isYearly ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => !isLoading && setIsYearly(!isYearly)}
                disabled={isLoading}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                    isYearly ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors ${
                  isYearly ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Yearly
              </span>
              {savings && (
                <span className="ml-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold animate-in slide-in-from-right">
                  <Sparkles className="h-3 w-3" />
                  Save ${monthlyPrice * 12 - yearlyPrice}
                </span>
              )}
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
              {/* Free Plan Card */}
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                      Free
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-700 px-2 py-1 text-xs">
                      <Zap className="h-3 w-3 mr-1 inline" />
                      Forever
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      $0
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">
                      / month
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                    Perfect for experimenting
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Pitch landing page generator
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      One-click PDF downloads
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Professional templates
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Professional hosted landing page
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 sm:mt-6 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base py-2 sm:py-2"
                    onClick={onClose}
                  >
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan Card */}
              <Card className="border-2 border-blue-200 shadow-lg relative">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] text-white px-3 sm:px-4 py-1 text-xs font-semibold">
                    <Sparkles className="h-3 w-3 mr-1 inline" />
                    MOST POPULAR
                  </Badge>
                </div>
                <CardHeader className="bg-gradient-to-br from-blue-50 to-white pb-3 sm:pb-4 pt-5 sm:pt-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                    Premium
                  </CardTitle>

                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        ${currentPrice}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">
                        {priceLabel}
                      </span>
                    </div>
                    {savings && (
                      <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs mt-1">
                        {savings}
                      </Badge>
                    )}
                    {!isYearly && (
                      <p className="text-xs text-gray-500 mt-1">
                        ${(yearlyPrice / 12).toFixed(2)}/month when billed
                        yearly
                      </p>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                    Everything you need to scale
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Everything in Free, plus:
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Built-in analytics (page views, clicks)
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Multiple premium templates
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      AI-assisted pitch building
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Invoice Generator
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Contract Templates (NDAs, agreements)
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      360° Team Feedback
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Investor Email Generator
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      AI Hiring Assistant
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Remove "Made with Foundify" badge
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Priority support
                    </span>
                  </div>

                  <Button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full mt-4 sm:mt-6 bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110 py-4 sm:py-6 text-base sm:text-lg font-semibold"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                        <span className="text-sm sm:text-base">
                          Processing...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base">
                          Upgrade to Premium
                        </span>
                      </>
                    )}
                  </Button>

                  <p className="text-xs sm:text-xs text-center text-gray-500 mt-3 sm:mt-4 px-2">
                    Secure payment • Cancel anytime • 14-day money-back
                    guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
