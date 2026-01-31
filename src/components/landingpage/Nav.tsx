import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import React from "react";

interface NavProps {
  onDashboardClick?: () => void;
  onSignInClick?: () => void;
}

export function Nav({ onDashboardClick, onSignInClick }: NavProps) {
const logo = new URL("../../assets/logo.svg", import.meta.url).href;
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    // If the user is logged in, treat the logo as a shortcut to the dashboard.
    // If not logged in, it goes to the public landing page.
    if (user) {
      if (onDashboardClick) {
        onDashboardClick();
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
  };

  const handleSignIn = () => {
    // If user is already logged in, treat this as a dashboard shortcut
    if (user) {
      if (onDashboardClick) {
        onDashboardClick();
      } else {
        navigate("/dashboard");
      }
      return;
    }

    if (onSignInClick) {
      onSignInClick();
    } else {
      navigate("/dashboard");
    }
  };

  const handleStartBuilding = () => {
    if (onDashboardClick) {
      onDashboardClick();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} onClick={handleLogoClick} alt="foundify logo" />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#tools" className="hover:text-indigo-600 transition-colors">Tools</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleStartBuilding}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 hidden sm:block"
              >
                Dashboard
              </button>
              <Button
                onClick={handleStartBuilding}
                className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-transparent font-bold"
              >
                Start Building
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignIn}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 hidden sm:block"
              >
                Sign In
              </button>
              <Button
                onClick={handleStartBuilding}
                className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-transparent font-bold"
              >
                Start Building
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
