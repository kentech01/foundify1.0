import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import React from "react";

const plans = [
  {
    id: "free",
    name: "Free Plan",
    priceMonthly: "€0",
    priceAnnually: "€0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Pitch landing page generator",
      "One-click PDF pitch deck downloads",
      "Basic pitch deck creation",
      "Share your pitch online",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium Plan",
    priceMonthly: "€15",
    priceAnnually: "€10",
    savingsText: "Save €24/year",
    period: "per month",
    description: "Everything you need to scale",
    features: [
      "Everything in Free Plan",
      "AI-assisted pitch deck building",
      "Analytics & engagement tracking",
      "All 6 Starter Pack Tools:",
      "  • Invoice Generator",
      "  • Contract Templates",
      "  • Feedback Coach",
      "  • Founder Role Suggestions",
      "  • Investor Email Draft",
      "  • Customer Interview Guide",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
];

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free, upgrade when you're ready. No hidden fees, cancel
            anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-premium-purple text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "annually"
                  ? "bg-premium-purple text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annually
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const displayPrice =
              billingCycle === "monthly"
                ? plan.priceMonthly
                : plan.priceAnnually;
            const billedAmount =
              billingCycle === "annually" && plan.id === "premium"
                ? "Billed as €120/year"
                : null;

            return (
              <Card
                key={plan.id}
                className={`shadow-lg rounded-2xl overflow-hidden ${
                  plan.highlighted
                    ? "border-2 border-premium-purple transform lg:scale-105"
                    : "border-2 border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-premium-purple text-white text-center py-2 px-4">
                    <div className="flex items-center justify-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span className="text-sm font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  </div>
                )}

                <CardHeader
                  className={`p-8 ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-premium-purple-50 to-white"
                      : "bg-white"
                  }`}
                >
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      {displayPrice}
                    </span>
                    <span className="ml-2 text-gray-600">/ {plan.period}</span>
                  </div>
                  {billedAmount && (
                    <p className="text-sm text-gray-500 mt-2">{billedAmount}</p>
                  )}
                </CardHeader>

                <CardContent className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check
                          className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                            plan.highlighted
                              ? "text-premium-purple"
                              : "text-deep-blue"
                          }`}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                      plan.highlighted
                        ? "bg-premium-purple hover:bg-premium-purple-dark text-white"
                        : "bg-deep-blue hover:bg-deep-blue-dark text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-gray-600 mt-12">
          All plans include 14-day money-back guarantee. No credit card required
          for free plan.
        </p>
      </div>
    </section>
  );
}
