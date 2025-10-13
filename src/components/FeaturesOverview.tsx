import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Presentation, Wrench, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

export function FeaturesOverview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Two Powerful Products, One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to launch and grow your startup, seamlessly
            integrated
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pitch Dashboard */}
          <Card className="shadow-lg border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-br from-deep-blue-50 to-white p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-deep-blue text-white mb-4">
                <Presentation className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl mb-2">Pitch Dashboard</CardTitle>
              <CardDescription className="text-base">
                Create, manage, and share professional pitch presentations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block mb-4">
                  ✓ FREE FEATURES
                </div>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-deep-blue mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Generate beautiful landing pages from your pitch
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-deep-blue mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      One-click PDF downloads for easy sharing
                    </span>
                  </li>
                </ul>
                <div className="text-sm font-semibold text-premium-purple bg-premium-purple-50 px-3 py-1 rounded-full inline-block mb-4 mt-4">
                  ⭐ PREMIUM FEATURES
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      AI-assisted pitch deck building
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Track views and engagement analytics
                    </span>
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                className="w-full border-2 border-deep-blue text-deep-blue hover:bg-deep-blue hover:text-white rounded-xl"
              >
                Explore Pitch Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Premium Starter Pack */}
          <Card className="shadow-lg border-2 border-premium-purple rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
            <div className="absolute top-4 right-4 bg-premium-purple text-white px-3 py-1 rounded-full text-xs font-semibold">
              PREMIUM
            </div>
            <CardHeader className="bg-gradient-to-br from-premium-purple-50 to-white p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-premium-purple text-white mb-4">
                <Wrench className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl mb-2">
                Premium Starter Pack
              </CardTitle>
              <CardDescription className="text-base">
                Six essential tools to launch and scale your startup
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Invoice Generator - Professional PDF invoices
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Contract Templates - NDA, Founder Agreement & more
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Feedback Coach - AI-guided team feedback
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Founder Role Suggestions - Smart team mapping
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Investor Email Draft - Professional outreach templates
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-premium-purple mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Customer Interview Guide - Discovery templates
                  </span>
                </li>
              </ul>
              <Button className="w-full bg-premium-purple hover:bg-premium-purple-dark text-white rounded-xl">
                View All Tools
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
