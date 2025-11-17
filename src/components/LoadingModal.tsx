import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Loader2, FileText, Globe, Sparkles } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
  type: "pdf" | "landing" | "generating";
  progress?: number;
}

export function LoadingModal({
  isOpen,
  type,
  progress = 0,
}: LoadingModalProps) {
  const getContent = () => {
    switch (type) {
      case "pdf":
        return {
          icon: FileText,
          title: "Generating Your PDF",
          description: "Creating a professional pitch deck...",
          steps: [
            "Analyzing your pitch content",
            "Designing slides",
            "Formatting document",
            "Finalizing PDF",
          ],
        };
      case "landing":
        return {
          icon: Globe,
          title: "Building Your Landing Page",
          description: "Creating a beautiful landing page...",
          steps: [
            "Processing your content",
            "Applying premium design",
            "Optimizing for performance",
            "Polishing final touches",
          ],
        };
      default:
        return {
          icon: Sparkles,
          title: "Generating Your Pitch",
          description: "Using AI to craft your perfect pitch...",
          steps: [
            "Understanding your startup",
            "Crafting compelling copy",
            "Structuring your story",
            "Polishing final touches",
          ],
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;
  const currentStepIndex = Math.floor((progress / 100) * content.steps.length);

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-lg border-0 shadow-2xl h-auto"
        hideClose
      >
        <div className=" flex flex-col items-center text-center space-y-12 py-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-full bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] flex items-center justify-center shadow-xl">
              <Icon className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {content.title}
            </h3>
            <p className="text-gray-600">{content.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>

          {/* Steps */}
          <div className="w-full space-y-3">
            {content.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                  index < currentStepIndex
                    ? "bg-green-50 border border-green-200"
                    : index === currentStepIndex
                    ? "bg-blue-50 border border-[#252952]"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                {index < currentStepIndex ? (
                  <svg
                    className="h-5 w-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : index === currentStepIndex ? (
                  <Loader2 className="h-5 w-5 text-blue-900 animate-spin flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    index <= currentStepIndex
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500">This usually takes a bit</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
