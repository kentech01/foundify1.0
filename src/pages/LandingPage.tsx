import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { HeroModern } from "../components/HeroModern";
import { WhatYouGet } from "../components/WhatYouGet";
import { BenefitsModern } from "../components/BenefitsModern";
import { PricingModern } from "../components/PricingModern";
import { SocialProofModern } from "../components/SocialProofModern";
import { CTASection } from "../components/CTASection";
import { FooterModern } from "../components/FooterModern";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-white"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.textContent?.includes("Start Free") ||
          target.textContent?.includes("Start Free Today") ||
          target.closest("button")?.textContent?.includes("Start Free")
        ) {
          e.preventDefault();
          navigate("/builder");
        }
      }}
    >
      <Header onDashboardClick={() => navigate("/dashboard")} />
      <HeroModern />
      <WhatYouGet />
      <BenefitsModern />
      <PricingModern />
      <SocialProofModern />
      <CTASection />
      <FooterModern />
    </div>
  );
}
