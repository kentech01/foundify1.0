import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";
import { ArrowRight, Sparkles, Target, Users, Lightbulb } from "lucide-react";
import React from "react";

const LAPTOP_IMAGE_URL =
  "https://images.unsplash.com/photo-1590097520505-416422f07ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBwaXRjaCUyMGRlY2slMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU1MjQxMDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface HeroSectionProps {
  onTryNowClick: () => void;
}

export function HeroSection({ onTryNowClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-deep-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-deep-blue-100 px-4 py-2 text-sm text-deep-blue-900">
                <Sparkles className="mr-2 h-4 w-4" />
                AI-Powered Pitch Generation
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Create Your Perfect{" "}
                <span className="text-deep-blue">Startup Pitch</span> in Minutes
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Transform your startup idea into a compelling pitch deck with
                our AI-powered platform. No design skills required — just your
                vision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onTryNowClick}
                size="lg"
                className="bg-deep-blue hover:bg-deep-blue-dark text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Try it Now — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white px-8 py-4 rounded-xl transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-deep-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Targeted Messaging
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI-crafted content for your audience
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-deep-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Investor Ready
                  </h3>
                  <p className="text-sm text-gray-600">
                    Professional pitch deck format
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-8 w-8 text-deep-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Smart Insights
                  </h3>
                  <p className="text-sm text-gray-600">
                    Data-driven recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src={LAPTOP_IMAGE_URL}
                alt="Laptop displaying pitch deck presentation"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-deep-blue/20 to-transparent"></div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg animate-bounce">
              <Sparkles className="h-6 w-6 text-deep-blue" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-deep-blue text-white rounded-full p-4 shadow-lg">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
