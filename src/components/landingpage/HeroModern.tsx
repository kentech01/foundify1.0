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
const favicon = new URL("../../assets/50 1.png", import.meta.url).href
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
    <section className="relative overflow-hidden h-100vh">
      {/* Gradient background effects */}

      <div className="relative min-h-screen w-full bg-[radial-gradient(circle,_#FFFFFF_0%,_#C5DAFF_100%)] overflow-hidden">
  <div className="mx-auto px-6 lg:px-36 pr-0 lg:pr-0 pt-28">
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
      
      {/* LEFT CONTENT */}
      <div className="space-y-10">
        <div className="space-y-6">
          <h1 className="text-[56px] sm:text-[64px] lg:text-[72px] xl:text-[80px] font-bold leading-[1.05] tracking-tight text-gray-900">
            Build your 
            <br />
            <span className=" bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_70%,#a5f3fc_100%)] bg-clip-text text-transparent">
              {" "}Startup{" "}
            </span>
            like a Pro
          </h1>

          <p className="max-w-xl text-xl text-gray-600 leading-relaxed">
            All the tools you need to launch and scale your startup.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleStartClick}
          className="inline-flex items-center justify-center rounded-xl bg-[#252952] px-14 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#161930] hover:shadow-xl hover:scale-[1.03]"
        >
          Get Started
        </button>

        {/* TRUST BADGES */}
        <div className="flex flex-col gap-4 pt-6 text-gray-600">
          {[
            "No credit card required",
            "Free forever plan",
            "Cancel anytime",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <svg
                className="h-6 w-6 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT IMAGES */}
      <div className="relative hidden lg:block">
        {/* Main dashboard */}
        <img
          src={favicon}
          alt="Dashboard"
          className="relative z-10 w-full rounded-2xl"
        />
      </div>
    </div>
  </div>
</div>

      {/* Decorative floating icons */}

      <style>{`
      .indexi{
        z-index:10;
      }
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
