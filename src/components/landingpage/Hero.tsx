import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Users, 
  Brain, 
  Zap, 
  ArrowRight,
  Sparkles,
  Bot,
  Activity,
  ChevronRight,
  CreditCard,
  Mail,
  IdCard,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SparklesCore, SparkleButton } from "@/components/ui/sparkles";
import React from "react";

const ROTATION_INTERVAL = 3000;

interface HeroProps {
  onGetStarted?: () => void;
}

const words = [
  { text: "Analytics", color: "text-indigo-600" },
  { text: "Drafting", color: "text-blue-600" },
  { text: "Hiring", color: "text-sky-600" },
  { text: "Operations", color: "text-violet-600" },
  { text: "Pitches", color: "text-fuchsia-600" },
  { text: "Company Brain", color: "text-indigo-600" },
];

const activities = [
  { 
    text: "Analyzing revenue, churn, and growth metrics", 
    icon: Brain,
    color: "bg-indigo-500"
  },
  { 
    text: "Generating contracts, invoices, and proposals", 
    icon: FileText,
    color: "bg-blue-500"
  },
  { 
    text: "Screening candidates and scheduling interviews", 
    icon: Users,
    color: "bg-sky-500"
  },
  { 
    text: "Managing workflows and daily tasks", 
    icon: Zap,
    color: "bg-violet-500"
  },
  { 
    text: "Creating decks and refining your story", 
    icon: Sparkles,
    color: "bg-fuchsia-500"
  },
  { 
    text: "Centralizing all your business knowledge", 
    icon: Bot,
    color: "bg-indigo-500"
  },
];

function SparkleTextMask({ text, className, gradient = "from-blue-600 to-indigo-600" }: { text: string, className?: string, gradient?: string }) {
  return (
    <div className={cn("relative inline-block select-none", className)}>
      <span className={cn("bg-clip-text text-transparent bg-gradient-to-r leading-[1.2] pb-2", gradient)}>
        {text}
      </span>
    </div>
  );
}

export function Hero({ onGetStarted }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = activities[index].icon;

  return (
    <section className="relative pt-24 pb-24 md:pt-44 overflow-hidden bg-white selection:bg-indigo-50 selection:text-indigo-600">
      
      {/* Background Gradients (Light) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-50/50 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Centered Content */}
        <div className="max-w-6xl w-full text-center flex flex-col items-center mb-16">

            <h1 className="text-5xl md:text-7xl lg:text-[60px] font-bold tracking-tighter text-slate-900 leading-[1.1] md:leading-[1.05] mb-8 px-2 md:px-0">
              One platform built for founders.
            </h1>

            {/* Rotating Sub-headline (Nouns) */}
            <div className="h-24 md:h-32 mb-6 w-full flex items-center justify-center overflow-visible">
               <AnimatePresence mode="popLayout">
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute w-full flex justify-center"
                  >
                     <span className={cn("text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r py-4 leading-normal", 
                        index === 0 ? "from-indigo-600 to-violet-600" :
                        index === 1 ? "from-blue-600 to-indigo-600" :
                        index === 2 ? "from-sky-600 to-blue-600" :
                        index === 3 ? "from-violet-600 to-fuchsia-600" :
                        index === 4 ? "from-fuchsia-600 to-pink-600" :
                        "from-indigo-600 to-sky-600"
                     )}>
                        {words[index].text}
                     </span>
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* AI Activity Bar (Glass Style) */}
            <div className="relative mb-12 w-full max-w-md mx-auto h-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                   <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-lg shadow-slate-200/10 rounded-full px-5 py-2.5 w-max max-w-full">
                     <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm", activities[index].color)}>
                       <CurrentIcon size={14} />
                     </div>
                     <p className="text-sm font-medium text-slate-600 truncate">
                        {activities[index].text}
                     </p>
                   </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex flex-col sm:flex-row justify-center gap-4 mb-12">
               <SparkleButton onClick={onGetStarted} className="px-8 py-4 bg-[#252952] text-white rounded-2xl font-bold hover:bg-[#1e2142] transition-all shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transform hover:-translate-y-1">
                 Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </SparkleButton>
            </div>
        </div>

        {/* Mobile Phone Mockup (Visible < md) */}
        <div className="md:hidden w-full max-w-[320px] mx-auto relative z-20 -mb-20 mt-4">
           <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
           >
              {/* Phone Frame */}
              <div className="w-full aspect-[9/18] rounded-[3rem] border-[8px] border-slate-900 bg-slate-900 overflow-hidden relative shadow-2xl ring-1 ring-white/10">
                 {/* Dynamic Island */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-30" />
                 
                 {/* App Interface */}
                 <div className="h-full w-full bg-[#0F1117] relative overflow-hidden flex flex-col pt-12">
                     
                     {/* App Header */}
                     <div className="flex items-center justify-between mb-6 px-6">
                        <div className="flex items-center gap-2">
                        </div>
                     </div>

                     {/* Content Container */}
                     <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col gap-6">
                        {/* Search Bar */}
                        <div className="h-12 bg-slate-800/50 rounded-2xl flex items-center px-4 gap-3 border border-white/5 shrink-0">
                           <div className="text-slate-500"><Brain size={16} /></div>
                           <div className="text-slate-500 text-sm">Ask your company brain...</div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar shrink-0">
                           <div className="min-w-[140px] bg-[#1A1D26] p-4 rounded-2xl border border-white/5">
                              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Invoices</div>
                              <div className="text-2xl font-bold text-white">€12.4k</div>
                              <div className="text-emerald-400 text-[10px] flex items-center gap-1 mt-1">
                                 <ArrowRight size={10} className="-rotate-45" /> +12%
                              </div>
                           </div>
                           <div className="min-w-[140px] bg-[#1A1D26] p-4 rounded-2xl border border-white/5">
                              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Runway</div>
                              <div className="text-2xl font-bold text-white">18m</div>
                              <div className="text-slate-500 text-[10px] flex items-center gap-1 mt-1">
                                 Stable
                              </div>
                           </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="flex-1 min-h-0 flex flex-col gap-4">
                           <div className="flex items-center justify-between shrink-0">
                              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recent</span>
                              <span className="text-indigo-400 text-xs font-bold">View All</span>
                           </div>
                           
                           <div className="space-y-3 overflow-hidden mask-linear-fade">
                              {[
                                 { title: "Series A Pitch", subtitle: "Drafting • 2m ago", icon: FileText, color: "text-purple-400", bg: "bg-purple-400/10" },
                                 { title: "Frontend Engineer", subtitle: "Hiring • 1h ago", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                                 { title: "Client Contract", subtitle: "Legal • 3h ago", icon: Brain, color: "text-blue-400", bg: "bg-blue-400/10" },
                                 { title: "Q1 Roadmap", subtitle: "Planning • 5h ago", icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" }
                              ].map((item, i) => (
                                 <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                       <item.icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="text-white text-sm font-bold truncate">{item.title}</div>
                                       <div className="text-slate-500 text-xs">{item.subtitle}</div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-600" />
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Full Width Dashboard - Desktop Only */}
        <div className="hidden md:block w-full max-w-6xl mx-auto perspective-[2000px] relative z-20 -mb-24 md:-mb-32">
            <motion.div
              initial={{ opacity: 0, rotateX: 10, y: 100 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group"
            >
              {/* Floating Robot Card - Positioned Behind */}
              <div className="absolute -top-16 -right-4 md:-right-12 z-0 animate-float-slow delay-700 hidden md:block">
                 <motion.div 
                   className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 text-slate-600 flex flex-col items-center gap-3 w-32 rotate-6"
                 >
                    <div className="relative">
                      <Bot size={32} className="text-indigo-600" />
                      <Sparkles className="absolute -top-3 -right-3 text-amber-400 w-5 h-5 animate-twinkle" />
                    </div>
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                    <div className="h-1.5 w-10 bg-slate-100 rounded-full" />
                 </motion.div>
              </div>

              {/* Main Dashboard UI */}
              <div className="relative z-10 bg-white rounded-t-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[600px] border-b-0">
                 
                 {/* Sidebar */}
                 <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-100 p-6 flex-col gap-6 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                          <Sparkles size={12} className="text-white" />
                       </div>
                       <span className="font-bold text-slate-900 text-lg">foundify</span>
                    </div>

                    <div className="space-y-1">
                       <div className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                          <Brain size={18} className="text-slate-900" />
                          <span className="text-sm font-bold text-slate-900">Company Dashboard</span>
                       </div>
                       
                       <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-1">Founder Essentials</div>
                       
                       <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
                          <CreditCard size={16} />
                          <span className="text-sm font-medium">Invoice Generator</span>
                       </div>
                       <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
                          <FileText size={16} />
                          <span className="text-sm font-medium">Contract Templates</span>
                       </div>
                       <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
                          <Users size={16} />
                          <span className="text-sm font-medium">Team Insights</span>
                       </div>
                       <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
                          <Bot size={16} />
                          <span className="text-sm font-medium">AI Hiring Assistant</span>
                       </div>
                       <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
                          <Mail size={16} />
                          <span className="text-sm font-medium">Email Generation</span>
                       </div>
                       <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors">
                          <IdCard size={16} />
                          <span className="text-sm font-medium">Smart Digital Card</span>
                       </div>
                    </div>

                    <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
                       <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
                       <div className="h-2 w-1/2 bg-slate-200 rounded-full" />
                    </div>
                 </div>

                 {/* Main Content Area */}
                 <div className="flex-1 p-8 bg-white">
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-8">
                       <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                       <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg shadow-slate-900/10">
                          <Sparkles size={14} />
                          Create New
                       </div>
                    </div>

                    {/* Company Card */}
                    <div className="mb-8 p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6 group hover:border-indigo-100 transition-colors">
                       <div className="flex gap-5">
                          <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10">
                             <div className="w-7 h-7 border-2 border-white/30 rounded-full" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900">Thrio</h3>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wide border border-emerald-100">Complete</span>
                             </div>
                             <p className="text-sm text-slate-500 leading-relaxed max-w-md">Solving business issues with digital products. Our platform streamlines workflow automation for creative agencies.</p>
                          </div>
                       </div>
                       <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap">
                          EDIT INFO
                       </button>
                    </div>

                    {/* Assets Section */}
                    <div>
                       <div className="flex items-center justify-between mb-6">
                          <h4 className="font-bold text-slate-900 text-base">Pitch Assets</h4>
                          <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1 rounded-full">REGENERATE ALL</span>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {/* Asset 1 */}
                          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-100 transition-all group/asset">
                             <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover/asset:border-indigo-100 group-hover/asset:text-indigo-600 text-slate-400 transition-colors">
                                   <FileText size={20} />
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                             </div>
                             <h5 className="font-bold text-slate-900 text-sm mb-1">Pitch Deck</h5>
                             <p className="text-xs text-slate-500 mb-4">Professional presentation</p>
                             <div className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                <div className="w-2.5 h-3 border border-slate-400 rounded-sm" /> Download PDF
                             </div>
                          </div>

                          {/* Asset 2 */}
                          <div className="p-5 rounded-2xl border border-slate-100 bg-indigo-50/30 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all group/asset relative overflow-hidden">
                             <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shadow-sm text-indigo-600">
                                   <Zap size={20} />
                                </div>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                             </div>
                             <h5 className="font-bold text-slate-900 text-sm mb-1 relative z-10">Live Landing Page</h5>
                             <p className="text-xs text-slate-500 mb-4 relative z-10">Generate your landing page</p>
                             <div className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 relative z-10">
                                <Sparkles size={12} /> Generate Page
                             </div>
                             
                             {/* Gradient Effect */}
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                          </div>

                          {/* Asset 3 */}
                          <div className="hidden lg:block p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-purple-200/50 hover:border-purple-100 transition-all group/asset relative overflow-hidden">
                             <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] flex items-center justify-center shadow-sm text-white">
                                   <Palette size={20} />
                                </div>
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                             </div>
                             <h5 className="font-bold text-slate-900 text-sm mb-1 relative z-10">Logo & Brand</h5>
                             <p className="text-xs text-slate-500 mb-4 relative z-10">Generate your logo</p>
                             <div className="w-full py-2.5 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-500/20 relative z-10">
                                <Sparkles size={12} /> Generate Logo
                             </div>
                             
                             {/* Gradient Effect */}
                             <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Decorative Blur Layers */}
              <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] -z-10 transform scale-95 translate-y-4" />
            </motion.div>
          </div>
      </div>
    </section>
  );
}
