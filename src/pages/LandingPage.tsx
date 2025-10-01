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
import { UserAuth } from "../context/AuthContext";
import SignInModal from "../components/signIn/SignInModal";

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isHandlingStart, setIsHandlingStart] = useState(false);

  const handleStartPitch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHandlingStart) return;
    setIsHandlingStart(true);
    setTimeout(() => setIsHandlingStart(false), 800);
    if (user) {
      navigate("/builder");
    } else {
      setIsSignInModalOpen(true);
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
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

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />
    </div>
  );
}
