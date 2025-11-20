import React from "react";
import { Button } from "../ui/button";
import {
  ArrowRight,
  Sparkles,
  Rocket,
  Users,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
interface HeroModernProps {
  onStart?: (e: React.MouseEvent) => void;
}

export function HeroModern({ onStart }: HeroModernProps) {
  const handleStartClick = (e: React.MouseEvent) => {
    if (onStart) {
      onStart(e);
    }
  };
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      {/* Gradient background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-premium-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-deep-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-premium-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="text-center space-y-8">
          {/* Main headline */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-gray-900 max-w-5xl mx-auto leading-tight">
              Build Your Startup
              <br />
              <span className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From pitch decks to invoices, contracts to team feedback—all the
              essential tools you need to launch and scale your startup
            </p>
          </div>
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-[#252952] hover:bg-[#161930] cursor-pointer font-bold text-white px-8 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={handleStartClick}
            >
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className=" border-3 border-[#161930] cursor-pointer font-bold text-gray-700 hover:bg-[#161930] hover:text-white px-8 py-7 rounded-2xl transition-all duration-300"
            >
              View Demo
            </Button>
          </div>
          {/* Trust indicators */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left: Rocket */}
        <div className="absolute top-16 left-6 sm:left-40 lg:left-60 animate-float">
          <Rocket className="w-10 h-10 md:w-12 md:h-12 text-blue-200 opacity-70" />
        </div>

        {/* Mid-left: Users/Team */}
        <div className="absolute top-1/2 left-2 sm:left-30 lg:left-76 -translate-y-1/2">
          <div className="animate-float-delay-1">
            <Users className="w-11 h-11 md:w-14 md:h-14 text-gray-300 opacity-70 rotate-[-20deg]" />
          </div>
        </div>

        {/* Bottom-left: Trending Up */}
        <div className="absolute bottom-40 left-10 sm:left-50 lg:left-60 animate-float-delay-2">
          <TrendingUp className="w-10 h-10 text-blue-200 opacity-70" />
        </div>

        {/* Top-right: Target */}
        <div className="absolute top-40 right-6 sm:right-30 lg:right-64 animate-float-delay-1-5">
          <Target className="w-12 h-12 md:w-15 md:h-15 text-gray-300 opacity-70" />
        </div>

        {/* Mid-right: Zap/Lightning */}
        <div className="absolute top-1/2 right-2 sm:right-20 lg:right-76 -translate-y-1/2">
          <div className="animate-float-delay-0-5">
            <Zap className="w-8 h-8 md:w-10 md:h-10 text-blue-200 opacity-70" />
          </div>
        </div>

        {/* Bottom-right: Bar Chart */}
        <div className="absolute bottom-28 right-10 sm:right-40 lg:right-54 animate-float-delay-3">
          <BarChart3 className="w-8 h-8 md:w-14 md:h-14 text-gray-300 opacity-70 rotate-[-20deg]" />
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delay-0-5 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-float-delay-1 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-delay-1-5 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-delay-3 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
}
