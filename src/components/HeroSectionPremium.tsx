import React from "react";
import { Button } from "./ui/button";
import { Sparkles, Zap } from "lucide-react";

export function HeroSectionPremium() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-premium-purple-50 to-deep-blue-50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center space-y-8">
          {/* Headline */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-premium-purple-100 px-4 py-2 border border-premium-purple">
              <Sparkles className="mr-2 h-4 w-4 text-premium-purple" />
              <span className="text-sm text-premium-purple-900">
                Foundify Premium – Starter Pack
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 max-w-5xl mx-auto">
              Your Complete{" "}
              <span className="text-premium-purple">Founder Toolkit</span> in
              One Place
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Create professional pitches and access essential startup tools –
              all in one beautiful dashboard
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-premium-purple hover:bg-premium-purple-dark text-white px-10 py-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white px-10 py-6 rounded-xl transition-all duration-300"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
