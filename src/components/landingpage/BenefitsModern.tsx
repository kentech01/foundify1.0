import { Clock, Award, Rocket, Zap } from "lucide-react";
import React from "react";

const benefits = [
  {
    id: 1,
    title: "Launch Faster",
    description:
      "Stop wasting time on administrative tasks. Focus on building your product and talking to customers.",
    icon: Rocket,
    stat: "10x",
    statLabel: "Faster setup",
  },
  {
    id: 2,
    title: "Look Professional",
    description:
      "Impress investors, partners, and customers with polished materials—no design skills required.",
    icon: Award,
    stat: "100%",
    statLabel: "Professional",
  },
  {
    id: 3,
    title: "Save Money",
    description:
      "Replace expensive consultants, lawyers, and designers with affordable, ready-to-use tools.",
    icon: Clock,
    stat: "$5k+",
    statLabel: "Saved on avg",
  },
  {
    id: 4,
    title: "Stay Organized",
    description:
      "Everything in one place. No more scattered docs, templates, and tools across multiple platforms.",
    icon: Zap,
    stat: "7",
    statLabel: "Tools unified",
  },
];

export function BenefitsModern() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-premium-purple rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-deep-blue rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Why Founders{" "}
            <span className="bg-blue-800  bg-clip-text text-transparent">
              Love Us
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of founders who are building smarter, not harder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group-hover:border-blue-100">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Stat */}
                  <div className="mb-4">
                    <div className="text-4xl font-bold bg-blue-800  bg-clip-text text-transparent">
                      {benefit.stat}
                    </div>
                    <div className="text-sm text-gray-500">
                      {benefit.statLabel}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
