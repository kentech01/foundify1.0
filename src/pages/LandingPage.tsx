import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroModern } from "../components/landingpage/HeroModern";
import { WhatYouGet } from "../components/landingpage/WhatYouGet";
import { BenefitsModern } from "../components/landingpage/BenefitsModern";
import { CTASection } from "../components/landingpage/CTASection";
import { Footer } from "../components/Footer";
import SignInModal from "../components/signIn/SignInModal";
import React from "react";
import { PricingModern } from "../components/landingpage/PricingModern";
import { LandingHeader } from "../components/landingpage/LandingHeader";
import { UserAuth } from "../context/AuthContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isHandlingStart, setIsHandlingStart] = useState(false);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleStartPitch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHandlingStart) return;
    setIsHandlingStart(true);
    setTimeout(() => setIsHandlingStart(false), 800);
    // Always navigate to builder - auth check happens there on submit
    navigate("/builder");
  };

  const handleUpgrade = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      // User is logged in, navigate to dashboard
      navigate("/dashboard");
    } else {
      // User is not logged in, open sign-in modal
      setIsSignInModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader
        onDashboardClick={() => navigate("/dashboard")}
        handleOpenSignInModal={() => setIsSignInModalOpen(true)}
      />
      <HeroModern onStart={handleStartPitch} />
      <WhatYouGet />
      <BenefitsModern />
      <PricingModern onStart={handleStartPitch} onUpgrade={handleUpgrade} />
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
