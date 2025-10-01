import { Header } from "../components/Header";
import { HeroModern } from "../components/HeroModern";
import { WhatYouGet } from "../components/WhatYouGet";
import { BenefitsModern } from "../components/BenefitsModern";
import { PricingModern } from "../components/PricingModern";
import { SocialProofModern } from "../components/SocialProofModern";
import { CTASection } from "../components/CTASection";
import { FooterModern } from "../components/FooterModern";

interface LandingPageProps {
  onDashboardClick?: () => void;
}

export function LandingPage({ onDashboardClick }: LandingPageProps = {}) {
  return (
    <div className="min-h-screen bg-white">
      <Header onDashboardClick={onDashboardClick} />
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