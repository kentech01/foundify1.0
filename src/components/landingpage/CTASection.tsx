import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
const favicon = new URL("../../assets/Group 2.png", import.meta.url).href;

interface CTASectionProps {
  onStart?: (e: React.MouseEvent) => void;
}

export function CTASection({ onStart }: CTASectionProps) {
  const handleStartClick = (e: React.MouseEvent) => {
    if (onStart) {
      onStart(e);
    }
  };
  return (
    <section className="relative w-full overflow-hidden bg-white pt-16 mt-20">
      <div className="bg-[#252952] flex justify-content-between items-stretch px-6 lg:px-36 py-12 md:py-0">
        <div className="md:flex-1 flex items-center">
          <div className="flex flex-col justify-content-center items-center md:block w-100">
            <h4 className="text-lg font-semibold figtree text-white text-[25px] font-bold mb-3">
              From Idea to Compact
            </h4>
            <p className="figtree text-[#E8E8E8] text-[18px] font-normal text-center md:text-start">
              Turn your ideas into action with AI-powered tools for pitching,
              analytics, and investor outreach.
            </p>
            <button className="px-20 py-4 figtree rounded-xl bg-[#70BBF9] text-white text-lg font-medium shadow-lg hover:bg-[#161930] transition mt-6 " onClick={handleStartClick}>
              Start free today
            </button>
          </div>
        </div>
        <div className="relative flex-1 h-100 hidden md:block">
        <div className="absolute inset-0 -z-10 rounded-full
              bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0.4)_30%,_rgba(255,255,255,0)_70%)] z-10">
  </div>
          <img
            src={favicon}
            className="absolute bottom-0 h-[115%] left-0 z-20 hidden md:block"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
