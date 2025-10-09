import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { HeroModern } from "../components/HeroModern";
import { WhatYouGet } from "../components/WhatYouGet";
import { BenefitsModern } from "../components/BenefitsModern";
import { PricingModern } from "../components/PricingModern";
import { SocialProofModern } from "../components/SocialProofModern";
import { CTASection } from "../components/CTASection";
import { FooterModern } from "../components/FooterModern";
import SignInModal from "../components/signIn/SignInModal";

export function LandingPage() {
  const navigate = useNavigate();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isHandlingStart, setIsHandlingStart] = useState(false);

  const handleStartPitch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHandlingStart) return;
    setIsHandlingStart(true);
    setTimeout(() => setIsHandlingStart(false), 800);
    // Always navigate to builder - auth check happens there on submit
    navigate("/builder");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onDashboardClick={() => navigate("/dashboard")}
        handleOpenSignInModal={() => setIsSignInModalOpen(true)}
      />
      <HeroModern onStart={handleStartPitch} />
      <WhatYouGet />
      <BenefitsModern />
      <PricingModern />
      <SocialProofModern />
      <CTASection onStart={handleStartPitch} />
      <FooterModern />

      {/* Sign In Modal - only for Header sign in button */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={() => {
          setIsSignInModalOpen(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
