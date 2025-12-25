import { Clock, Award, Rocket, Zap } from "lucide-react";
import React from "react";

const benefits = [
  {
    id: 1,
    title: "10x Launch Faster",
    description:
      "Stop wasting time on administrative tasks. Focus on building your product and talking to customers.",
    icon: Rocket,
    stat: "10x",
    statLabel: "Faster setup",
  },
  {
    id: 2,
    title: "100% Look Professional",
    description:
      "Impress investors, partners, and customers with polished materials—no design skills required.",
    icon: Award,
    stat: "100%",
    statLabel: "Professional",
  },
  {
    id: 3,
    title: "$5k+ Save Money",
    description:
      "Replace expensive consultants, lawyers, and designers with affordable, ready-to-use tools.",
    icon: Clock,
    stat: "$5k+",
    statLabel: "Saved on avg",
  },
  {
    id: 4,
    title: "7 Tools unified",
    description:
      "Everything in one place. No more scattered docs, templates, and tools across multiple platforms.",
    icon: Zap,
    stat: "7",
    statLabel: "Tools unified",
  },
];
interface BenefitsModernProps {
  onStart?: (e: React.MouseEvent) => void;
}
export function BenefitsModern({ onStart }: BenefitsModernProps) {
  
    const handleStartClick = (e: React.MouseEvent) => {
      if (onStart) {
        onStart(e);
      }
    };
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-36 bg-[#EDF6FF] relative overflow-hidden">
      <div className="flex-col flex items-center justify-content-center md:flex-row">
        <div className="mb-20 space-y-4 flex-1">
          <h2 className="text-4xl figtree sm:text-5xl lg:text-6xl font-bold text-[#252952]">
            Why Founders Love Us
          </h2>
          <p className="text-xl text-[#777777] figtree">
            Join thousands of founders who are building <br /> smarter, not
            harder
          </p>
          <button className="px-20 py-4 rounded-xl bg-[#252952] text-white text-lg font-medium shadow-lg hover:bg-[#161930] transition mt-7" onClick={handleStartClick}>
            Join Now
          </button>
        </div>
        <div className="flex-1">
          {benefits.map((benefit) => (
            <div className="flex md:gap-8 gap-3 mb-7 items-center">
              <div className="group inline-block">
  <svg className="w-10 h-10 md:w-16 md:h-16" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">

    <circle cx="48" cy="48" r="48" fill="white" className="group-hover:fill-[#252952] transition-colors duration-300"/>
    <path d="M41.2054 58.9252L65.5822 34.4357C65.8518 34.1648 66.1694 34.0201 66.5349 34.0016C66.9005 33.983 67.2356 34.1277 67.5403 34.4357C67.8449 34.7436 67.9981 35.0747 68 35.429C68.0018 35.7834 67.8495 36.1136 67.543 36.4197L42.7729 61.3238C42.3243 61.7746 41.8018 62 41.2054 62C40.609 62 40.0865 61.7746 39.6379 61.3238L28.4215 50.0543C28.152 49.7835 28.0117 49.4617 28.0006 49.0888C27.9895 48.7159 28.1354 48.3764 28.4382 48.0704C28.741 47.7643 29.0705 47.6112 29.4269 47.6112C29.7832 47.6112 30.1128 47.7643 30.4156 48.0704L41.2054 58.9252Z" fill="#252952" className="group-hover:fill-white transition-colors duration-300"/>
  </svg>
</div>

              <div>
                <h2 className="text-[25px] font-normal text-[#252952] figtree mb-1">
                  {benefit.title}
                </h2>
                <p className="figtree font-normal text-[16px] text-[#777777]">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
