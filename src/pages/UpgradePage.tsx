import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import {
  Check,
  ArrowLeft,
  CreditCard,
  Lock,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { useApp } from "../context/AppContext";
import React from "react";

export function UpgradePage() {
  const navigate = useNavigate();
  const { setIsPremium } = useApp();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const monthlyPrice = 15;
  const annualPrice = 10;
  const annualTotal = annualPrice * 12;

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgress(0);

    // Simulate payment processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
          }, 500);
          return 100;
        }
        return prev + 12;
      });
    }, 300);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
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
                      €{monthlyPrice}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </button>

                  <button
                    onClick={() => setBillingCycle("annually")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      billingCycle === "annually"
                        ? "border-premium-purple bg-premium-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">Annually</div>
                    <div className="text-2xl font-bold text-gray-900">
                      €{annualPrice}
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </button>
                </div>

                {billingCycle === "annually" && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      💰 You'll be charged €{annualTotal} annually (saves you
                      €60/year)
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

          {/* Right Column - Payment Form */}
          <div>
            <Card className="border-2 border-gray-200 shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-br from-premium-purple-50 to-white">
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Complete your upgrade to Premium
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUpgrade} className="space-y-6">
                  {/* Card Information */}
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="cardNumber"
                        className="text-sm font-medium mb-2 block"
                      >
                        Card Number
                      </Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="pl-10 border-2 border-gray-200 rounded-xl"
                          required
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="expiry"
                          className="text-sm font-medium mb-2 block"
                        >
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          className="border-2 border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="cvc"
                          className="text-sm font-medium mb-2 block"
                        >
                          CVC
                        </Label>
                        <Input
                          id="cvc"
                          type="text"
                          placeholder="123"
                          className="border-2 border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium mb-2 block"
                      >
                        Cardholder Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="border-2 border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Billing Address
                    </h3>
                    <div>
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium mb-2 block"
                      >
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="United States"
                        className="border-2 border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="zip"
                        className="text-sm font-medium mb-2 block"
                      >
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        type="text"
                        placeholder="12345"
                        className="border-2 border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  {/* <div className="space-y-3">
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
                    {billingCycle === "annually" && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Annual discount</span>
                        <span>-$60</span>
                      </div>
                    )}
                    <Separator />
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
                  </div> */}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Complete Upgrade
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    By confirming your purchase, you agree to our Terms of
                    Service and Privacy Policy. Your subscription will
                    auto-renew{" "}
                    {billingCycle === "monthly" ? "monthly" : "annually"}.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      <Dialog open={isProcessing}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl" hideClose>
          <div className="flex flex-col items-center text-center space-y-6 py-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-premium-purple to-deep-blue rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center shadow-xl">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                Processing Payment
              </h3>
              <p className="text-gray-600">
                Securely processing your payment...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-premium-purple to-deep-blue h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>

            <p className="text-xs text-gray-500">
              Please don't close this window
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6 py-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30"></div>
              <div className="relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-xl">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-gray-900">
                Welcome to Premium! 🎉
              </h3>
              <p className="text-lg text-gray-600">
                You now have access to all premium features
              </p>
            </div>

            {/* Features unlocked */}
            <div className="w-full bg-gradient-to-br from-premium-purple-50 to-white border-2 border-premium-purple/20 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                What's unlocked:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-purple" />
                  <span>AI Assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-purple" />
                  <span>Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-purple" />
                  <span>All Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-premium-purple" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSuccessClose}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white shadow-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
