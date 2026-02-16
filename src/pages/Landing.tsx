import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "@/components/landingpage/Nav";
import { Hero } from "@/components/landingpage/Hero";
import { LogoMarquee } from "@/components/landingpage/LogoMarquee";
import { HowItWorks } from "@/components/landingpage/HowItWorks";
import { ToolsShowcase } from "@/components/landingpage/ToolsShowcase";
import { Pricing } from "@/components/landingpage/Pricing";
import { Footer } from "@/components/Footer";
import { AiWorkflows } from "@/components/landingpage/AiWorkflows";
import { WhyFoundify } from "@/components/landingpage/WhyFoundify";
import { UserAuth } from "@/context/AuthContext";
import SignInModal from "@/components/signIn/SignInModal";

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Handler for "Get Started" buttons - goes to builder if not logged in, dashboard if logged in
  useEffect(()=>{
    if(!loading){
      if (user) {
        navigate("/dashboard");
      }
     }
    
  }, [loading])
  const handleGetStarted = () => {
    
    if (user) {
      navigate("/dashboard");
    }else{
      navigate("/builder")
    }
  };

  // Handler for nav "Start Building" button - same behavior as other CTAs
  const handleDashboardClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/builder");
    }
  };

  return (
    ((!loading && !user) && <div className="min-h-screen bg-white font-sans selection:bg-indigo-50 selection:text-indigo-600">
    <Nav onDashboardClick={handleDashboardClick} onSignInClick={() => setIsSignInModalOpen(true)} />
    <main>
      <Hero onGetStarted={handleGetStarted} />
      {/* <LogoMarquee /> */}
      <HowItWorks />
      <AiWorkflows onGetStarted={handleGetStarted} />
      <Pricing onGetStarted={handleGetStarted} />
      <WhyFoundify onGetStarted={handleGetStarted} />
    </main>
    <Footer />
    <SignInModal
      isOpen={isSignInModalOpen}
      onClose={() => setIsSignInModalOpen(false)}
      onSignInSuccess={() => {
        setIsSignInModalOpen(false);
        navigate("/dashboard");
      }}
    />
  </div>)
  );
}
