import React from "react";
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
    icon: Presentation
,
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
    description: "Professional invoices",
    icon: <svg width="22" height="27" viewBox="0 0 22 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.4958 1V6.54512C13.4958 6.91278 13.6418 7.26539 13.9018 7.52537C14.1618 7.78534 14.5144 7.9314 14.8821 7.9314H20.4272" stroke="#252952" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.4271 13.4765V23.1805C20.4926 23.7036 20.3889 24.2341 20.131 24.694C19.8732 25.1539 19.4748 25.5191 18.9942 25.7361C18.5137 25.9531 17.9763 26.0105 17.4608 25.8999C16.9453 25.7892 16.4787 25.5164 16.1296 25.1213C15.9157 24.8476 15.6422 24.6262 15.3299 24.4739C15.0177 24.3217 14.6748 24.2425 14.3274 24.2425C13.98 24.2425 13.6372 24.3217 13.3249 24.4739C13.0127 24.6262 12.7392 24.8476 12.5253 25.1213C12.3113 25.395 12.0379 25.6164 11.7256 25.7686C11.4133 25.9209 11.0705 26 10.7231 26C10.3757 26 10.0329 25.9209 9.72061 25.7686C9.40835 25.6164 9.13488 25.395 8.92094 25.1213C8.707 24.8476 8.43353 24.6262 8.12127 24.4739C7.80901 24.3217 7.46618 24.2425 7.11878 24.2425C6.77138 24.2425 6.42854 24.3217 6.11628 24.4739C5.80403 24.6262 5.53055 24.8476 5.31661 25.1213C4.96746 25.5164 4.50094 25.7892 3.98542 25.8999C3.4699 26.0105 2.93249 25.9531 2.45196 25.7361C1.97143 25.5191 1.57304 25.1539 1.3152 24.694C1.05735 24.2341 0.953596 23.7036 1.01915 23.1805V3.77256C1.01915 3.03723 1.31125 2.33202 1.83121 1.81206C2.35117 1.29211 3.05638 1 3.79171 1H13.4957L20.4271 7.9314V13.8231" stroke="#252952" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>,
    free: false,
  },
  {
    id: "contracts",
    title: "Contract Templates",
    description: "NDAs, founder agreements, and more",
    icon: <svg width="23" height="27" viewBox="0 0 23 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.09695 12.8571H15.2909V15.4286H5.09695V12.8571ZM7.64543 23.1429H2.54848V2.57143H11.4681V9H17.8393V12.9857L20.3878 10.4143V7.71429L12.7424 0H2.54848C1.87258 0 1.22436 0.270917 0.746431 0.753154C0.268499 1.23539 0 1.88944 0 2.57143V23.1429C0 23.8248 0.268499 24.4789 0.746431 24.9611C1.22436 25.4434 1.87258 25.7143 2.54848 25.7143H7.64543V23.1429ZM5.09695 20.5714H10.3213L11.4681 19.4143V18H5.09695V20.5714ZM20.6427 14.1429C20.7701 14.1429 21.0249 14.2714 21.1524 14.4L22.8089 16.0714C23.0637 16.3286 23.0637 16.8429 22.8089 17.1L21.5346 18.3857L18.8587 15.6857L20.133 14.4C20.2604 14.2714 20.3878 14.1429 20.6427 14.1429ZM20.6427 19.1571L12.8698 27H10.1939V24.3L17.9668 16.4571L20.6427 19.1571Z" fill="#252952"/>
    </svg>
    ,
    free: false,
  },
  {
    id: "feedback",
    title: "360° Team Feedback",
    description: "Comprehensive team feedback framework",
    icon: <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.3 0H2.7C1.21095 0 0 1.22522 0 2.73183V19.1228C0 20.6294 1.21095 21.8546 2.7 21.8546H6.75V27L15.224 21.8546H24.3C25.7891 21.8546 27 20.6294 27 19.1228V2.73183C27 1.22522 25.7891 0 24.3 0ZM24.3 19.1228H14.476L9.45 22.1729V19.1228H2.7V2.73183H24.3V19.1228Z" fill="#252952"/>
    </svg>
    ,
    free: false,
  },
  {
    id: "investor",
    title: "Investor Email Generator",
    description: "Professional outreach templates",
    icon: <svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31 3.125C31 1.40625 29.605 0 27.9 0H3.1C1.395 0 0 1.40625 0 3.125V21.875C0 23.5938 1.395 25 3.1 25H27.9C29.605 25 31 23.5938 31 21.875V3.125ZM27.9 3.125L15.5 10.9375L3.1 3.125H27.9ZM27.9 21.875H3.1V6.25L15.5 14.0625L27.9 6.25V21.875Z" fill="#252952"/>
    </svg>
    ,
    free: false,
  },
];
interface WhatYouGetProps {
  onStart?: (e: React.MouseEvent) => void;
}
export function WhatYouGet({ onStart }: WhatYouGetProps) {
  const handleStartClick = (e: React.MouseEvent) => {
    if (onStart) {
      onStart(e);
    }
  };
  return (
    <section className="py-30 px-4 sm:px-6 lg:px-36">
      <div className="">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Everything You Need to{" "}
            <span className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] bg-clip-text text-transparent">
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
        <div className="w-full pt-16 bg-white">
          <div className="mx-auto px-6 text-center space-y-16">
            {/* Section badge */}
            <div className="inline-flex mb-3 items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 text-[#252952] text-sm font-medium">
              What is Foundify?
            </div>

            {/* Section heading */}
            <p className="max-w-4xl mx-auto text-[18px] sm:text-[25px] font-normal text-gray-800 leading-relaxed">
              Foundify is an{" "}
              <span className="font-semibold">AI-powered toolkit</span> that
              helps founders build their{" "}
              <span className="font-semibold">startup essentials</span> like
              pitch decks and landing pages quickly and professionally.
            </p>

            {/* Feature pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
              {features.slice(1).map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="relative bg-blue-50 rounded-3xl px-8 pt-14 pb-8 text-center"
                  >
                    {/* Floating icon */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      {feature.icon}
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-10 space-y-3">
              <button className="px-20 py-4 rounded-xl bg-[#252952] text-white text-lg font-medium shadow-lg hover:bg-[#161930] transition" onClick={handleStartClick}>
                Get Started
              </button>
              <p className="text-sm text-gray-500 figtree">
                Unlock everything for 10$ / month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
