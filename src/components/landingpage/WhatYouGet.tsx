import { Card } from "../ui/card";
import {
  Presentation,
  FileText,
  FileCheck,
  MessageSquare,
  Mail,
  Download,
  Sparkles,
} from "lucide-react";

const features = [
  {
    id: "pitch",
    title: "Pitch Dashboard",
    description: "Create stunning pitch decks and landing pages",
    icon: Presentation,
    free: true,
    highlights: [
      "Landing page generator",
      "PDF downloads",
      "Professional templates",
    ],
  },
  {
    id: "invoice",
    title: "Invoice Generator",
    description: "Professional invoices in seconds",
    icon: FileText,
    free: false,
  },
  {
    id: "contracts",
    title: "Contract Templates",
    description: "NDAs, founder agreements, and more",
    icon: FileCheck,
    free: false,
  },
  {
    id: "feedback",
    title: "360° Team Feedback",
    description: "Comprehensive team feedback framework",
    icon: MessageSquare,
    free: false,
  },
  {
    id: "investor",
    title: "Investor Email Generator",
    description: "Professional outreach templates",
    icon: Mail,
    free: false,
  },
];

export function WhatYouGet() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-premium-purple-50 px-4 py-2 border border-premium-purple/20">
            <Sparkles className="h-4 w-4 text-premium-purple" />
            <span className="text-sm font-medium text-premium-purple-900">
              Complete Toolkit
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential tools designed specifically for founders. Start with our
            free pitch dashboard, upgrade when you're ready.
          </p>
        </div>

        {/* Featured - Pitch Dashboard */}
        <div className="mb-12">
          <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              <Download className="h-3 w-3" />
              FREE FOREVER
            </div>
            <div className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Presentation className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Pitch Dashboard
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Create stunning pitch decks and export basic landing pages
                    in minutes. Download as PDF—completely free, forever.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {features[0].highlights?.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-white border border-green-200 px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        <svg
                          className="h-4 w-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Premium Tools Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Premium Features
              <span className="ml-3 text-sm font-normal text-gray-500">
                Unlock everything for 10/month
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(1).map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className="group relative overflow-hidden border-2 border-gray-100 bg-white hover:border-premium-purple/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-premium-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center shadow-lg">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
