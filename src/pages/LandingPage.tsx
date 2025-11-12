import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { HeroModern } from "../components/landingpage/HeroModern";
import { WhatYouGet } from "../components/landingpage/WhatYouGet";
import { BenefitsModern } from "../components/landingpage/BenefitsModern";
import { CTASection } from "../components/landingpage/CTASection";
import { Footer } from "../components/Footer";
import SignInModal from "../components/signIn/SignInModal";
import React from "react";
import { PricingModern } from "../components/landingpage/PricingModern";

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
      <HeroModern
        onStart={handleStartPitch}
      />
      <WhatYouGet />
      <BenefitsModern />
      <PricingModern />
      <CTASection onStart={handleStartPitch} />
      <Footer />
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
