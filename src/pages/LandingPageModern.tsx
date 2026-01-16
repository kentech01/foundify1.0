/**
 * FOUNDIFY LANDING PAGE
 * Premium, conversion-focused design
 *
 * CTA Navigation Pattern:
 * - All "Get Started" buttons → handleGetStarted()
 *   - If user authenticated → /dashboard
 *   - If user not authenticated → /auth/signup
 * - "Sign In" button → /auth/login
 *
 * Visual Philosophy:
 * - Confident, clean, intelligent
 * - Animations are intentional, not decorative
 * - Premium feel, worth paying for
 * - Dashboard preview, not separate site
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "../components/signIn/SignInModal";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Mail,
  Users,
  LayoutDashboard,
  FileCheck,
  QrCode,
  DollarSign,
  Menu,
  X,
  Clock,
  Shield,
  Rocket,
  Zap,
  Receipt,
  MessageSquare,
  CircuitBoard,
  Database,
  GitBranch,
  Boxes,
  Workflow,
  FileSignature,
  UserCheck,
  Check,
  Send,
  UserPlus,
  Play,
  Brain,
} from "lucide-react";

/**
 * Loading Placeholder - Vertical Carousel Animation
 * Pill-shaped skeleton items that cycle vertically with glassmorphism styling
 */
export function LoadingPlaceholder() {
  // More items to create seamless infinite loop with items below visible area
  const items = [
    { id: 0, width: "w-64" },
    { id: 1, width: "w-56" },
    { id: 2, width: "w-60" },
    { id: 3, width: "w-52" },
    { id: 4, width: "w-58" },
    { id: 5, width: "w-62" },
    { id: 6, width: "w-54" },
    { id: 7, width: "w-60" },
  ];

  const itemSpacing = 44; // Vertical spacing between items
  const cycleDuration = 3; // Duration for one complete cycle
  const visibleItems = 4; // Number of items visible at once

  return (
    <div className="relative h-40 w-72 mx-auto overflow-hidden">
      {/* Glassmorphism container */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-lg" />

      {/* Animated items container */}
      <div className="relative h-full flex flex-col justify-center items-center px-6">
        {items.map((item, index) => {
          // Calculate Y positions for seamless infinite loop
          // Items start below visible area and cycle upward continuously
          const baseOffset = itemSpacing * 2;
          const startY = baseOffset + index * itemSpacing;
          const endY = startY - itemSpacing * items.length;

          // Calculate opacity and scale based on distance from center (y=0)
          // Items fade and scale down as they move away from center
          const centerY = 0;
          const getOpacity = (y: number) => {
            const distance = Math.abs(y - centerY);
            const maxDistance = itemSpacing * 2.5;
            return Math.max(0.15, 1 - distance / maxDistance);
          };

          const getScale = (y: number) => {
            const distance = Math.abs(y - centerY);
            const maxDistance = itemSpacing * 2.5;
            return Math.max(0.75, 1 - (distance / maxDistance) * 0.25);
          };

          const startOpacity = getOpacity(startY);
          const endOpacity = getOpacity(endY);
          const startScale = getScale(startY);
          const endScale = getScale(endY);

          return (
            <motion.div
              key={item.id}
              className={`h-8 ${item.width} rounded-full bg-gradient-to-r from-gray-200/60 via-gray-300/40 to-gray-200/60 backdrop-blur-sm border border-white/30 shadow-sm`}
              initial={{ y: startY, opacity: startOpacity, scale: startScale }}
              animate={{
                y: [startY, endY],
                opacity: [startOpacity, endOpacity],
                scale: [startScale, endScale],
              }}
              transition={{
                duration: cycleDuration,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1], // Smooth easing
                delay: (index % visibleItems) * 0.15, // Stagger for smoother effect
              }}
              style={{
                position: "absolute",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function LandingPageModern() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [scrollY, setScrollY] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [activeToolView, setActiveToolView] = useState<
    "invoices" | "contracts" | "hiring" | "pitch"
  >("invoices");
  const [pricingToggle, setPricingToggle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [toolViewProgress, setToolViewProgress] = useState(0);
  const [isToolCycling, setIsToolCycling] = useState(false);

  // Verbs for hero cycling animation (synced with AI activity messages)
  const verbs = [
    {
      id: 0,
      verb: "Analyzes",
      activityMessage: "Analyzing your pitch, team, and operations…",
      icon: Brain,
    },
    {
      id: 1,
      verb: "Drafts",
      activityMessage: "Drafting invoices, contracts, emails, and pitches…",
      icon: FileText,
    },
    {
      id: 2,
      verb: "Assists",
      activityMessage: "Assisting hiring and team decisions…",
      icon: UserCheck,
    },
    {
      id: 3,
      verb: "Organizes",
      activityMessage: "Organizing everything into one company brain…",
      icon: Database,
    },
  ];

  // Parallax scroll
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Navigation handlers
  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/builder");
      }
    }, 150);
  };

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cycle through verbs every 2500ms (synced with activity messages)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveServiceIndex((prev) => (prev + 1) % verbs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through tool views every 4 seconds with smooth progress animation - only when cycling is active
  useEffect(() => {
    if (!isToolCycling) return;

    const toolViews: Array<"invoices" | "contracts" | "hiring" | "pitch"> = [
      "invoices",
      "contracts",
      "hiring",
      "pitch",
    ];
    let currentIndex = toolViews.indexOf(activeToolView);

    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setToolViewProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 40); // Update every 40ms for smooth animation (4000ms / 100 = 40ms per %)

    // Change view every 4 seconds
    const viewInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % toolViews.length;
      setActiveToolView(toolViews[currentIndex]);
      setToolViewProgress(0);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(viewInterval);
    };
  }, [isToolCycling, activeToolView]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation - Centered with Rounded Container */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 py-4 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
              scrollY > 50
                ? "bg-white/90 backdrop-blur-xl shadow-lg"
                : "bg-white/60 backdrop-blur-md"
            }`}
          >
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={new URL("../assets/FOUNDIFY-LOGO.svg", import.meta.url).href}
                alt="Foundify"
                className="h-6 w-auto"
              />
            </div>

            {/* Desktop Nav - Center Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-[#252952] transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-[#252952] transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="#resources"
                className="text-gray-700 hover:text-[#252952] transition-colors font-medium"
              >
                Resources
              </a>
            </div>

            {/* Sign In Button or Dashboard Link */}
            <div className="hidden md:flex items-center">
              {user ? (
                <Button
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px] px-6 py-2 font-medium transition-all"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px] px-6 py-2 font-medium transition-all"
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-[#252952]"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg mx-6 p-6"
          >
            <div className="space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-[#252952] font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-gray-700 hover:text-[#252952] font-medium"
              >
                Pricing
              </a>
              <a
                href="#resources"
                className="block text-gray-700 hover:text-[#252952] font-medium"
              >
                Resources
              </a>
              {user ? (
                <Button
                  className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* 1️⃣ HERO SECTION - Pixel-Accurate Replication */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background - Soft Gradient from purplish-blue to pinkish-orange */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e8e5f5] via-[#f5f4fa] to-[#ffe5e5]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Headline with Animated Verb */}
            <h1 className="text-5xl lg:text-6xl font-bold text-[#2d3142] mb-6 leading-tight">
              The only platform that
              <br />
              <span className="relative inline-block min-h-[1.2em]">
                <motion.span
                  key={activeServiceIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-[#252952] to-[#4A90E2] bg-clip-text text-transparent inline-block"
                >
                  {verbs[activeServiceIndex]?.verb || "Analyzes"}
                </motion.span>
              </span>
              <br />
              your company.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              From invoices and contracts to hiring, team insights, pitches, and smart digital cards — Foundify works in the background while you decide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[12px] h-14 px-8 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <button className="text-[#252952] hover:text-[#4A90E2] text-base font-medium flex items-center justify-center gap-2 transition-colors">
                Book a Demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* AI Activity Bar - Glass-style, visually secondary */}
            <motion.div
              key={activeServiceIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/60 backdrop-blur-md rounded-full px-6 py-3 shadow-sm border border-gray-200/50 flex items-center gap-3">
                {/* Dynamic Icon */}
                {(() => {
                  const ActivityIcon =
                    verbs[activeServiceIndex]?.icon || Brain;
                  return (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#4A90E2]/10">
                      <ActivityIcon className="w-5 h-5 text-[#4A90E2]" />
                    </div>
                  );
                })()}

                {/* Dynamic Text */}
                <span className="text-sm text-gray-600 flex-1">
                  {verbs[activeServiceIndex]?.activityMessage || "Analyzing your pitch, team, and operations…"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2️⃣ HOW FOUNDIFY WORKS - Interactive Two-Column Layout */}
      <section id="how" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* <Badge className="bg-[#eef0ff] text-[#252952] border-0 mb-6 px-4 py-2">
              <Workflow className="w-4 h-4 mr-2" />
              How it works
            </Badge> */}
            <h2 className="text-5xl lg:text-6xl font-bold text-[#252952] mb-6">
              All your founder tools in one place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build your company profile once, unlock everything
            </p>
          </motion.div>

          {/* Two-Column Interactive Layout - Inspired by Modern AI Builders */}
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left: Simple Vertical Feature List with Continuous Progress Bar */}
            <div className="relative">
              {/* Continuous Vertical Progress Bar Background */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gray-200 rounded-full" />

              {/* Animated Progress Fill */}
              <motion.div
                className="absolute left-0 top-0 w-[3px] bg-gradient-to-b from-[#4A90E2] via-[#7DD3FC] to-[#4A90E2] rounded-full"
                style={{
                  height: `${
                    activeToolView === "invoices"
                      ? toolViewProgress / 4
                      : activeToolView === "contracts"
                      ? 25 + toolViewProgress / 4
                      : activeToolView === "hiring"
                      ? 50 + toolViewProgress / 4
                      : 75 + toolViewProgress / 4
                  }%`,
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />

              <div className="space-y-8">
                {/* Invoices */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  animate={{
                    x: activeToolView === "invoices" ? 8 : 0,
                  }}
                  onClick={() => {
                    setActiveToolView("invoices");
                    setIsToolCycling(true);
                    setToolViewProgress(0);
                  }}
                  className={`cursor-pointer transition-all duration-500 pl-8 relative ${
                    activeToolView === "invoices" ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-[#252952] mb-2">
                    Invoices
                  </h3>
                  <p
                    className={`text-base text-gray-600 leading-relaxed transition-all duration-500 ${
                      activeToolView === "invoices"
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    Create and send invoices instantly using your company data.
                  </p>
                </motion.div>

                {/* Contracts */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  animate={{
                    x: activeToolView === "contracts" ? 8 : 0,
                  }}
                  onClick={() => {
                    setActiveToolView("contracts");
                    setIsToolCycling(true);
                    setToolViewProgress(0);
                  }}
                  className={`cursor-pointer transition-all duration-500 pl-8 relative ${
                    activeToolView === "contracts"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-[#252952] mb-2">
                    Contracts
                  </h3>
                  <p
                    className={`text-base text-gray-600 leading-relaxed transition-all duration-500 ${
                      activeToolView === "contracts"
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    Generate legal-ready contracts powered by your company
                    profile.
                  </p>
                </motion.div>

                {/* Team Insights */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  animate={{
                    x: activeToolView === "hiring" ? 8 : 0,
                  }}
                  onClick={() => {
                    setActiveToolView("hiring");
                    setIsToolCycling(true);
                    setToolViewProgress(0);
                  }}
                  className={`cursor-pointer transition-all duration-500 pl-8 relative ${
                    activeToolView === "hiring" ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-[#252952] mb-2">
                    Team Insights
                  </h3>
                  <p
                    className={`text-base text-gray-600 leading-relaxed transition-all duration-500 ${
                      activeToolView === "hiring"
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    Understand your team, roles, and hiring needs at a glance.
                  </p>
                </motion.div>

                {/* Pitch & Digital Card */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  animate={{
                    x: activeToolView === "pitch" ? 8 : 0,
                  }}
                  onClick={() => {
                    setActiveToolView("pitch");
                    setIsToolCycling(true);
                    setToolViewProgress(0);
                  }}
                  className={`cursor-pointer transition-all duration-500 pl-8 relative ${
                    activeToolView === "pitch" ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-[#252952] mb-2">
                    Pitch & Digital Card
                  </h3>
                  <p
                    className={`text-base text-gray-600 leading-relaxed transition-all duration-500 ${
                      activeToolView === "pitch"
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    Turn your company data into pitches and a smart digital
                    card.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right: Large Dashboard Preview with Gradient Border */}
            <div className="relative lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Gradient Border Container */}
                <div className="p-[2px] bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 rounded-[26px]">
                  {/* Dashboard Container with Soft Shadow */}
                  <Card className="border-0 rounded-[24px] overflow-hidden shadow-xl bg-white">
                    {/* Browser Chrome - Minimal */}
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          app.foundify.io
                        </div>
                        <div className="w-12" /> {/* Spacer */}
                      </div>
                    </div>

                    {/* Dynamic Content with Smooth Transitions */}
                    <div className="p-8 min-h-[550px] bg-gradient-to-br from-white to-gray-50">
                      {/* Invoices View */}
                      {activeToolView === "invoices" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                              <Receipt className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-[#252952]">
                                Invoice Generator
                              </h3>
                              <p className="text-sm text-gray-600">
                                Auto-filled from your profile
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                              <div className="text-xs text-gray-500 mb-1">
                                From
                              </div>
                              <div className="font-bold text-[#252952]">
                                TechFlow AI
                              </div>
                              <div className="text-sm text-gray-600">
                                San Francisco, CA
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">
                                  Invoice #
                                </div>
                                <div className="font-bold text-[#4A90E2]">
                                  INV-2026-001
                                </div>
                              </div>
                              <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">
                                  Amount
                                </div>
                                <div className="font-bold text-[#252952]">
                                  $5,000
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 rounded-[16px] p-4 border border-green-200">
                              <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                Auto-filled from company profile
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Contracts View */}
                      {activeToolView === "contracts" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                              <FileSignature className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-[#252952]">
                                Contract Templates
                              </h3>
                              <p className="text-sm text-gray-600">
                                Legal-ready agreements
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {[
                              "NDA (Non-Disclosure)",
                              "Founder Agreement",
                              "Employment Contract",
                              "Consultant Agreement",
                            ].map((contract, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[16px] p-4 border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#4A90E2] hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <FileCheck className="w-5 h-5 text-[#4A90E2]" />
                                  <div>
                                    <div className="font-semibold text-[#252952]">
                                      {contract}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      Ready to customize
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Team Insights View */}
                      {activeToolView === "hiring" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                              <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-[#252952]">
                                Team Insights
                              </h3>
                              <p className="text-sm text-gray-600">
                                AI-powered hiring guidance
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                              <div className="text-xs text-gray-500 mb-2">
                                Next Role to Hire
                              </div>
                              <div className="font-bold text-[#252952] mb-2">
                                Senior Frontend Engineer
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-[#4A90E2] text-white border-0 text-xs">
                                  AI/ML Industry
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                                  Senior Level
                                </Badge>
                              </div>
                            </div>

                            <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                              <div className="text-xs font-semibold text-gray-500 mb-3">
                                Interview Questions (6)
                              </div>
                              <div className="space-y-2">
                                {[
                                  "Technical architecture design",
                                  "React & TypeScript expertise",
                                  "Team collaboration approach",
                                ].map((q, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-700"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]" />
                                    {q}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-200">
                              <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
                                <Sparkles className="w-4 h-4" />
                                Generated by AI
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Pitch & Digital Card View */}
                      {activeToolView === "pitch" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-[#252952]">
                                Pitch & Digital Card
                              </h3>
                              <p className="text-sm text-gray-600">
                                Your company story, ready to share
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                              <div className="text-xs text-gray-500 mb-2">
                                Company Pitch
                              </div>
                              <div className="font-bold text-[#252952] mb-2">
                                TechFlow AI
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                AI-powered workflow automation that saves teams
                                10+ hours per week
                              </p>
                            </div>

                            <div className="bg-white rounded-[16px] p-5 border border-gray-200 shadow-sm">
                              <div className="text-xs font-semibold text-gray-500 mb-3">
                                Digital Business Card
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <QrCode className="w-8 h-8 text-[#4A90E2]" />
                                  <div>
                                    <div className="text-sm font-semibold text-[#252952]">
                                      Shareable QR Code
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      Instant contact exchange
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gradient-to-br from-[#eef0ff] to-white rounded-[16px] p-4 border border-gray-200">
                                <LayoutDashboard className="w-5 h-5 text-[#4A90E2] mb-2" />
                                <div className="text-xs font-semibold text-[#252952]">
                                  Pitch Deck
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-[#eef0ff] to-white rounded-[16px] p-4 border border-gray-200">
                                <Mail className="w-5 h-5 text-[#4A90E2] mb-2" />
                                <div className="text-xs font-semibold text-[#252952]">
                                  Email Intro
                                </div>
                              </div>
                            </div>

                            <div className="bg-purple-50 rounded-[16px] p-4 border border-purple-200">
                              <div className="flex items-center gap-2 text-purple-700 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                Built from your profile
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Subtle Floating Glow */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] rounded-full blur-3xl opacity-20" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ SAVE MONEY, SAVE TIME, SAVE HEADACHES - Bold Value Statements */}
      <section className="py-32 bg-gradient-to-br from-[#fafbff] to-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#4A90E2]/10 to-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Center Content - Cards First, Then Headlines */}
          <div className="flex items-center justify-center min-h-[700px] relative">
            {/* Floating Cards - Positioned Further Away from Center */}
            {/* Card 1 - Top Left */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-8 left-0 lg:left-8 xl:left-4 z-10"
            >
              <Card
                className="bg-white border-2 border-gray-200 rounded-[24px] p-6 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all w-[280px]"
                style={{ transform: "rotate(-5deg)" }}
              >
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg mb-4">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#252952] mb-2">
                  $5,000+ Saved
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Replace expensive consultants and lawyers with affordable
                  tools
                </p>
              </Card>
            </motion.div>

            {/* Card 2 - Top Right */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-8 right-0 lg:right-8 xl:right-4 z-10"
            >
              <Card
                className="bg-white border-2 border-gray-200 rounded-[24px] p-6 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all w-[280px]"
                style={{ transform: "rotate(5deg)" }}
              >
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#4A90E2] to-purple-500 flex items-center justify-center shadow-lg mb-4">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#252952] mb-2">
                  10x Faster
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Auto-filled documents and templates save hours every week
                </p>
              </Card>
            </motion.div>

            {/* Card 3 - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bottom-8 left-0 lg:left-8 xl:left-4 z-10"
            >
              <Card
                className="bg-white border-2 border-gray-200 rounded-[24px] p-6 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all w-[280px]"
                style={{ transform: "rotate(3deg)" }}
              >
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg mb-4">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#252952] mb-2">
                  Legal Ready
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Professional contracts and NDAs without the legal fees
                </p>
              </Card>
            </motion.div>

            {/* Card 4 - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-8 right-0 lg:right-8 xl:right-4 z-10"
            >
              <Card
                className="bg-white border-2 border-gray-200 rounded-[24px] p-6 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all w-[280px]"
                style={{ transform: "rotate(-3deg)" }}
              >
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#252952] mb-2">
                  AI Powered
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Smart templates that adapt to your specific business needs
                </p>
              </Card>
            </motion.div>

            {/* Bold Stacked Headlines - Centered and More Visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4 z-20 relative"
            >
              <h2 className="text-7xl lg:text-8xl font-black text-[#252952] leading-[0.9] tracking-tight">
                SAVE MONEY
              </h2>
              <h2 className="text-7xl lg:text-8xl font-black text-[#252952] leading-[0.9] tracking-tight">
                SAVE TIME
              </h2>
              <h2 className="text-7xl lg:text-8xl font-black text-[#252952] leading-[0.9] tracking-tight">
                SAVE HEADACHES
              </h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3️⃣ MORE FEATURES - Three Column Product Feature Cards */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <h2 className="text-5xl font-bold text-gray-900 mb-16">
            Company Dashboard & Tools
          </h2>

          {/* 3-Column Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 1: Brand Colors */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Choose your brand colors
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Customize your dashboard and pitch materials with your own brand
                palette.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Pick colors that match your identity and see them applied
                instantly across all tools.
              </p>

              {/* UI Preview - Color Picker */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[16px] border border-gray-200 p-6 space-y-4">
                {/* Color Swatches Grid */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Brand Colors
                  </span>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#252952] border-2 border-gray-300 shadow-sm"></div>
                    <div className="w-8 h-8 rounded-lg bg-[#4A90E2] border-2 border-gray-300 shadow-sm"></div>
                    <div className="w-8 h-8 rounded-lg bg-[#7DD3FC] border-2 border-gray-300 shadow-sm"></div>
                  </div>
                </div>

                {/* Color Picker Input */}
                <div className="bg-white rounded-[12px] border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] shadow-md"></div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Primary Color
                      </div>
                      <div className="text-sm font-mono text-gray-900">
                        #4A90E2
                      </div>
                    </div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg"></div>
                </div>

                {/* Preview Cards */}
                <div className="flex gap-2">
                  <div className="flex-1 h-16 bg-[#252952] rounded-lg flex items-center justify-center">
                    <div className="text-xs font-medium text-white">Button</div>
                  </div>
                  <div className="flex-1 h-16 bg-[#4A90E2] rounded-lg flex items-center justify-center">
                    <div className="text-xs font-medium text-white">Accent</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Landing Page Generation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Generate landing pages in seconds
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Turn your pitch into a beautiful landing page instantly with
                AI-powered generation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Preview in real-time and publish with one click.
              </p>

              {/* UI Preview - Page Builder */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[16px] border border-gray-200 p-5 space-y-3">
                {/* Progress Bar */}
                <div className="bg-white rounded-[10px] border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Generating...
                    </span>
                    <span className="text-xs font-bold text-[#4A90E2]">
                      87%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4A90E2] to-[#7DD3FC] rounded-full"
                      style={{ width: "87%" }}
                    ></div>
                  </div>
                </div>

                {/* Page Section Preview Panels */}
                <div className="space-y-2">
                  <div className="bg-white rounded-[10px] border border-gray-200 p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A90E2] to-purple-500 flex items-center justify-center shadow-sm">
                      <div className="w-4 h-4 rounded bg-white/30"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full mb-1.5 w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[10px] border border-gray-200 p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7DD3FC] to-blue-400 flex items-center justify-center shadow-sm">
                      <div className="w-4 h-4 rounded bg-white/30"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full mb-1.5 w-2/3"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-1/3"></div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#4A90E2] animate-pulse"></div>
                  </div>

                  <div className="bg-white rounded-[10px] border border-gray-200 p-3 flex items-center gap-3 opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <div className="w-4 h-4 rounded bg-gray-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full mb-1.5 w-3/5"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-2/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: PDF Export */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Export your pitch as PDF
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Download professional pitch decks ready to share with investors
                and partners.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                One-click export with perfect formatting every time.
              </p>

              {/* UI Preview - PDF Document */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[16px] border border-gray-200 p-5">
                {/* Document Preview */}
                <div className="bg-white rounded-[12px] border-2 border-gray-300 overflow-hidden shadow-lg mb-4">
                  {/* Document Header */}
                  <div className="bg-gradient-to-r from-[#252952] to-[#4A90E2] p-4">
                    <div className="h-3 bg-white/90 rounded w-2/3 mb-2"></div>
                    <div className="h-2 bg-white/60 rounded w-1/2"></div>
                  </div>

                  {/* Document Content */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-300 rounded w-4/6"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-16 bg-[#4A90E2]/20 rounded-lg"></div>
                      <div className="w-16 h-16 bg-[#7DD3FC]/20 rounded-lg"></div>
                      <div className="w-16 h-16 bg-purple-500/20 rounded-lg"></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>

                  {/* PDF Label */}
                  <div className="bg-red-50 border-t border-red-200 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          PDF
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        pitch-deck.pdf
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">1.2 MB</div>
                  </div>
                </div>

                {/* Export Button */}
                <button className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px] py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4️⃣ WHY FOUNDERS PAY FOR FOUNDIFY - Phone Mockup with Feature Cards */}
      <section className="py-20 bg-[#252952] relative overflow-hidden">
        {/* Soft radial glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#4A90E2]/20 to-[#7DD3FC]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white">
              A trusted Platform for Founders
            </h2>
          </motion.div>

          {/* Main Content - Phone Mockup with Feature Cards */}
          <div className="relative flex items-center justify-center min-h-[700px]">
            {/* Center Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-20"
            >
              <div className="relative w-[280px] h-[560px] bg-white rounded-[48px] shadow-2xl p-3 border-8 border-gray-800">
                {/* Phone notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-full z-30" />

                {/* Phone screen content */}
                <div className="w-full h-full bg-gradient-to-br from-[#fafbff] to-white rounded-[40px] overflow-hidden">
                  <div className="p-6 space-y-4">
                    {/* Dashboard Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#252952] to-[#4A90E2] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">F</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#252952]">
                          Foundify
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Dashboard
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Cards */}
                    {[
                      {
                        icon: Receipt,
                        label: "Invoices",
                        color: "from-pink-500 to-rose-500",
                      },
                      {
                        icon: FileSignature,
                        label: "Contracts",
                        color: "from-green-500 to-emerald-600",
                      },
                      {
                        icon: Mail,
                        label: "Emails",
                        color: "from-blue-500 to-cyan-500",
                      },
                      {
                        icon: UserCheck,
                        label: "Hiring",
                        color: "from-purple-500 to-violet-600",
                      },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className={`bg-gradient-to-br ${item.color} rounded-[12px] p-3 flex items-center gap-3 shadow-lg`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                          <span className="text-white text-xs font-semibold">
                            {item.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Phone shadow */}
                <div className="absolute inset-0 rounded-[48px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] pointer-events-none" />
              </div>
            </motion.div>

            {/* Feature Cards - Left Side */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[20px] p-6 w-[320px] shadow-xl hover:bg-white/15 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Save hours weekly
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Stop rewriting company info. Enter once, use everywhere.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[20px] p-6 w-[320px] shadow-xl hover:bg-white/15 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Single Source of Truth
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Your company knowledge lives in one place. Always
                        synced.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Feature Cards - Right Side */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[20px] p-6 w-[320px] shadow-xl hover:bg-white/15 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        AI-powered intelligence
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Smart suggestions based on your company context.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[20px] p-6 w-[320px] shadow-xl hover:bg-white/15 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Built for speed
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Generate documents in seconds, not hours.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION - Inspired by Reference */}
      <section
        id="pricing"
        className="py-32 bg-gradient-to-br from-[#f8f9ff] to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/*  */}

            <h2 className="text-5xl lg:text-6xl font-bold text-[#252952] mb-6">
              Curated Pricing{" "}
              <span className="bg-gradient-to-r from-[#4A90E2] to-[#7DD3FC] bg-clip-text text-transparent">
                Structure
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get real-time brand, campaign, and creator insights designed to
              help you find opportunities faster and close smarter.
            </p>

            {/* Monthly/Yearly Toggle */}
            <div className="inline-flex items-center gap-1 bg-white border-2 border-gray-200 rounded-[12px] p-1 shadow-sm">
              <button
                onClick={() => setPricingToggle("monthly")}
                className={`px-6 py-2 rounded-[8px] font-medium transition-all ${
                  pricingToggle === "monthly"
                    ? "bg-white text-[#252952] shadow-sm"
                    : "text-gray-500 hover:text-[#252952]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingToggle("yearly")}
                className={`px-6 py-2 rounded-[8px] font-medium transition-all flex items-center gap-2 ${
                  pricingToggle === "yearly"
                    ? "bg-white text-[#252952] shadow-sm"
                    : "text-gray-500 hover:text-[#252952]"
                }`}
              >
                Yearly
                <Badge className="bg-[#4A90E2] text-white border-0 text-xs px-2 py-0.5">
                  Save 16%
                </Badge>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white border-2 border-gray-200 rounded-[24px] p-8 h-full hover:shadow-xl hover:border-[#4A90E2] transition-all">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#252952] mb-6">
                    Starter
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-6xl font-bold text-[#252952]">
                      $0
                    </span>
                    <span className="text-gray-500 text-xl">/mo</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Ideal for individuals or small teams exploring task
                    management basics.
                  </p>
                </div>

                <Button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-[#252952] rounded-[12px] h-12 mb-8 transition-all"
                  onClick={handleGetStarted}
                >
                  Try for free
                </Button>

                <div className="space-y-4">
                  {[
                    "Up to 3 users",
                    "Basic task management",
                    "Drag-and-drop builder",
                    "Task deadlines & reminders",
                    "Mobile access",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Professional Plan - Most Recommended */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:-mt-4"
            >
              <Card className="bg-white border-2 border-[#4A90E2] rounded-[24px] p-8 h-full shadow-2xl relative overflow-hidden">
                {/* Most Recommended Badge */}
                <div className="absolute top-0 left-0 right-0 bg-[#4A90E2]/10 py-3 flex items-center justify-center gap-2 border-b border-[#4A90E2]/20">
                  <Zap className="w-4 h-4 text-[#4A90E2]" />
                  <span className="text-[#4A90E2] font-semibold text-sm">
                    Most Recommended
                  </span>
                </div>

                <div className="mb-8 mt-8">
                  <h3 className="text-2xl font-bold text-[#252952] mb-6">
                    Professional
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-6xl font-bold text-[#252952]">
                      ${pricingToggle === "monthly" ? "12" : "10"}
                    </span>
                    <span className="text-gray-500 text-xl">/mo</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Built for teams that need speed, structure, and real-time
                    collaboration.
                  </p>
                </div>

                <Button
                  className="w-full bg-[#4A90E2] hover:bg-[#3a7bc8] text-white rounded-[12px] h-12 mb-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  onClick={handleGetStarted}
                >
                  Try for free
                </Button>

                <div className="space-y-4">
                  {[
                    "Up to 10 users",
                    "Advanced task management",
                    "Drag-and-drop builder",
                    "Task deadlines & reminders",
                    "Mobile access",
                    "Priority support",
                    "1-1 calls",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#4A90E2] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white border-2 border-gray-200 rounded-[24px] p-8 h-full hover:shadow-xl hover:border-[#4A90E2] transition-all">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#252952] mb-6">
                    Enterprise
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-6xl font-bold text-[#252952]">
                      ${pricingToggle === "monthly" ? "200" : "168"}
                    </span>
                    <span className="text-gray-500 text-xl">/mo</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    AI the power, customization, and support your organization
                    needs.
                  </p>
                </div>

                <Button
                  className="w-full bg-gray-100 hover:bg-[#252952] text-[#252952] hover:text-white rounded-[12px] h-12 mb-8 transition-all"
                  onClick={handleGetStarted}
                >
                  Get started
                </Button>

                <div className="space-y-4">
                  {[
                    "Unlimited users",
                    "Advanced management",
                    "Drag-and-drop builder",
                    "Task deadlines & reminders",
                    "Mobile access",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Two-Column Modern Design */}
      <section className="py-32 bg-gradient-to-br from-[#f8f9ff] to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl lg:text-6xl font-bold text-[#252952] mb-6 leading-tight">
                What Our <span className="text-[#4A90E2]">Customers Say</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Trusted by founders who value speed, clarity, and execution.
                Here's what they're building with Foundify.
              </p>

              <Button className="bg-[#4A90E2] hover:bg-[#3a7bc8] text-white rounded-[12px] h-12 px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                View More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Right Column - Testimonial Cards */}
            <div className="relative">
              {/* Vertical accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4A90E2] via-[#7DD3FC] to-transparent rounded-full" />

              <div className="pl-8 space-y-6">
                {/* Testimonial Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-white border-2 border-gray-100 rounded-[20px] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative">
                    <div className="flex items-start gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                        alt="Sarah Chen"
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                      />
                      <div>
                        <h4 className="font-bold text-[#252952] mb-1">
                          Sarah Chen
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          Founder @ TechFlow
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          "Foundify cut my admin time in half. Everything I need
                          in one place—pitch, invoices, contracts. It just
                          works."
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Testimonial Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="ml-8"
                >
                  <Card className="bg-white border-2 border-gray-100 rounded-[20px] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative">
                    <div className="flex items-start gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                        alt="Marcus Rodriguez"
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                      />
                      <div>
                        <h4 className="font-bold text-[#252952] mb-1">
                          Marcus Rodriguez
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          CEO @ GrowthLabs
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          "Finally, a tool that understands how founders
                          actually work. Clean, fast, and zero learning curve."
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Testimonial Card 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="ml-4"
                >
                  <Card className="bg-white border-2 border-gray-100 rounded-[20px] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative">
                    <div className="flex items-start gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
                        alt="Emily Park"
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                      />
                      <div>
                        <h4 className="font-bold text-[#252952] mb-1">
                          Emily Park
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          Founder @ Mindful AI
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          "My investor emails are sharper, my contracts are
                          consistent, and my dashboard is my single source of
                          truth."
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ SOCIAL PROOF - Subtle, Trust-Building */}
      <section className="py-32 bg-gradient-to-br from-[#fafbff] to-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-6 py-3 mb-8 shadow-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#252952]">
                2,500+ founders building with Foundify
              </span>
            </div>

            <h3 className="text-3xl font-bold text-[#252952] mb-4">
              Built for founders who value clarity
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed for speed, structure, and confidence. No chaos, no
              switching between tools. Just pure execution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 7️⃣ FINAL CTA - Loom-Inspired Minimalist Banner */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#4A90E2] rounded-[32px] shadow-2xl px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* Left: Catchy Text */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center md:text-left">
              Start building like a pro.
            </h2>

            {/* Right: CTA Button */}
            <Button
              className="bg-white text-[#4A90E2] hover:bg-gray-50 rounded-[12px] h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex-shrink-0"
              onClick={handleGetStarted}
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#252952] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-white font-bold text-lg">foundify</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-white/60">
              © 2026 Foundify. Built for founders.
            </div>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
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
