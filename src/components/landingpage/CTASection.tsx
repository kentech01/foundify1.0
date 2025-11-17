import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  onStart?: (e: React.MouseEvent) => void;
}

export function CTASection({ onStart }: CTASectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl p-1">
          {/* Animated border effect */}
          <div className="absolute inset-0 opacity-75 blur-xl"></div>

          <div className="relative bg-white rounded-3xl p-12 sm:p-16 lg:p-20">
            <div className="text-center space-y-8">
              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
                Take Your Startup from
                <br />
                <span className="bg-gradient-to-r from-[#1f1147] via-[#3b82f6] to-[#a5f3fc]  bg-clip-text text-transparent">
                  Idea to Impact
                </span>
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Turn your ideas into action with AI-powered tools for pitching,
                analytics, and investor outreach.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  size="lg"
                  className="bg-[#252952]  hover:bg-[#161930] font-bold  text-white px-10 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                  onClick={onStart}
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
