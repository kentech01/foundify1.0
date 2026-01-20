import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  Sparkles, 
  Database, 
  Workflow, 
  Zap, 
  Brain,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SparkleButton } from "@/components/ui/sparkles";

interface WhyFoundifyProps {
  onGetStarted?: () => void;
}

const reasons = [
  {
    id: "time",
    title: "Saves Hours Weekly",
    description: "Stop rewriting company info. Enter once, use everywhere. We automate the repetitive boring stuff so you can focus on building.",
    icon: Clock,
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-500",
    stat: "10h+",
    statLabel: "Saved / Week"
  },
  {
    id: "quality",
    title: "Professional by Default",
    description: "Every output looks polished. No design skills required. Investor-ready decks and legal-grade contracts instantly.",
    icon: Sparkles,
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-violet-500",
    stat: "100%",
    statLabel: "Design Polish"
  },
  {
    id: "truth",
    title: "Single Source of Truth",
    description: "Your company knowledge lives in one place. Always synced. Update your pitch deck and your landing page updates automatically.",
    icon: Database,
    color: "text-violet-600",
    gradient: "from-violet-500 to-fuchsia-500",
    stat: "1",
    statLabel: "Central Brain"
  },
  {
    id: "speed",
    title: "Built for Speed",
    description: "Generate documents in seconds, not hours. Move at the speed of thought without waiting for agencies or freelancers.",
    icon: Zap,
    color: "text-fuchsia-600",
    gradient: "from-fuchsia-500 to-pink-500",
    stat: "30s",
    statLabel: "Avg. Gen Time"
  },
  {
    id: "ai",
    title: "AI-Powered Intelligence",
    description: "Smart suggestions based on your company context. It knows your brand voice, your metrics, and your roadmap better than you do.",
    icon: Brain,
    color: "text-rose-600",
    gradient: "from-rose-500 to-orange-500",
    stat: "24/7",
    statLabel: "Active Agent"
  }
];

export function WhyFoundify({ onGetStarted }: WhyFoundifyProps) {
  const [activeId, setActiveId] = useState(reasons[0].id);

  return (
    <section className="py-32 bg-slate-950 text-white relative">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.org/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Mobile Only: Visual Cards Stack */}
          <div className="w-full lg:hidden space-y-6">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12 text-white text-center">
              Why Founders <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Choose Foundify
              </span>
            </h2>

             <div className="relative space-y-16">
             {reasons.map((reason, index) => (
                <div key={reason.id} className="sticky top-28" style={{ zIndex: index + 1 }}>
                    <div className="relative w-full aspect-[4/5] max-w-sm mx-auto bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-500">
                      {/* Top shine */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                      
                      <div className={cn(
                        "w-20 h-20 rounded-3xl mb-6 flex items-center justify-center bg-gradient-to-br shadow-lg shrink-0",
                        reason.gradient
                      )}>
                        <reason.icon size={40} className="text-white drop-shadow-md" />
                      </div>

                      <h4 className="text-2xl font-bold text-white mb-2">{reason.title}</h4>
                      <p className="text-white/50 text-sm mb-8">{reason.description}</p>

                      {/* Stat Visualization */}
                      <div className="mt-auto w-full bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                        <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-r", reason.gradient)} />
                        
                        <p className="text-4xl font-black text-white mb-1 tracking-tighter relative z-10">
                          {reason.stat}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 relative z-10">
                          {reason.statLabel}
                        </p>

                        <Sparkles className="absolute top-2 right-2 text-white/20 w-8 h-8" />
                      </div>

                      {/* Floating Decorative Elements */}
                      <div 
                        className="absolute top-16 -right-2 p-3 rounded-2xl bg-slate-800/90 border border-white/10 backdrop-blur-md shadow-xl transform scale-75"
                      >
                        <div className="flex gap-2 items-center">
                          <div className={cn("w-2 h-2 rounded-full", reason.color.replace('text-', 'bg-'))} />
                          <div className="h-1.5 w-10 bg-white/20 rounded-full" />
                        </div>
                      </div>

                      <div 
                        className="absolute bottom-28 -left-4 p-3 rounded-2xl bg-slate-800/90 border border-white/10 backdrop-blur-md shadow-xl transform scale-75"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="h-1.5 w-16 bg-white/20 rounded-full" />
                          <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                        </div>
                      </div>
                </div>
                </div>
             ))}
             </div>
          </div>

          {/* Left: Interactive List (Desktop Only) */}
          <div className="hidden lg:block w-full lg:w-1/2 space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12 text-white">
              Why Founders <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Choose Foundify
              </span>
            </h2>

            <div className="space-y-4">
              {reasons.map((reason) => (
                <div 
                  key={reason.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setActiveId(reason.id)}
                >
                  <div className={cn(
                    "flex items-center justify-between p-6 rounded-2xl transition-all duration-500 border",
                    "bg-white/10 backdrop-blur-md border-white/10 shadow-2xl",
                    activeId !== reason.id && "lg:bg-transparent lg:border-transparent lg:shadow-none lg:hover:bg-white/5"
                  )}>
                    <div className="flex items-center gap-6">
                      <span className={cn(
                        "text-2xl font-black transition-colors duration-300",
                        "text-white",
                        activeId !== reason.id && "lg:text-white/20"
                      )}>
                        0{reasons.indexOf(reason) + 1}
                      </span>
                      <div>
                        <h3 className={cn(
                          "text-xl font-bold transition-colors duration-300",
                          "text-white",
                          activeId !== reason.id && "lg:text-white/60"
                        )}>
                          {reason.title}
                        </h3>
                        
                        {/* Expandable Description */}
                        <div className={cn(
                          "grid transition-all duration-500 ease-in-out overflow-hidden text-slate-400 text-sm leading-relaxed",
                          "grid-rows-[1fr] opacity-100 mt-2",
                          activeId !== reason.id && "lg:grid-rows-[0fr] lg:opacity-0 lg:mt-0"
                        )}>
                          <div className="min-h-0">
                            {reason.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className={cn(
                      "transition-all duration-300 transform",
                      "opacity-100 translate-x-0 text-indigo-400",
                      activeId !== reason.id && "lg:opacity-0 lg:-translate-x-4"
                    )} />
                  </div>
                  
                  {/* Progress Line for Active Item - Desktop Only with animation */}
                  {activeId === reason.id && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-l-2xl"
                    />
                  )}
                  
                  {/* Progress Line - Mobile Only (Always visible for card look) */}
                  <div className="lg:hidden absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-l-2xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dynamic Visualization (Desktop Only) */}
          <div className="hidden lg:block w-full lg:w-1/2 h-[600px] relative">
            <AnimatePresence mode="wait">
              {reasons.map((reason) => reason.id === activeId && (
                <motion.div
                  key={reason.id}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.1, x: -20 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Glowing Orb Background */}
                    <div className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-40 bg-gradient-to-r",
                      reason.gradient
                    )} />

                    {/* Central Visual Card */}
                    <div className="relative z-10 w-[380px] h-[480px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center text-center overflow-hidden">
                      {/* Top shine */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                      
                      <div className={cn(
                        "w-24 h-24 rounded-3xl mb-8 flex items-center justify-center bg-gradient-to-br shadow-lg",
                        reason.gradient
                      )}>
                        <reason.icon size={48} className="text-white drop-shadow-md" />
                      </div>

                      <h4 className="text-3xl font-bold text-white mb-2">{reason.title}</h4>
                      <p className="text-white/50 text-sm mb-12 max-w-[260px]">{reason.description}</p>

                      {/* Stat Visualization */}
                      <div className="mt-auto w-full bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                        <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-r", reason.gradient)} />
                        
                        <p className="text-5xl font-black text-white mb-1 tracking-tighter relative z-10">
                          {reason.stat}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 relative z-10">
                          {reason.statLabel}
                        </p>

                        <Sparkles className="absolute top-2 right-2 text-white/20 w-12 h-12" />
                      </div>
                    </div>

                    {/* Floating Decorative Elements */}
                    <div 
                      className="absolute top-20 right-10 p-4 rounded-2xl bg-slate-800/90 border border-white/10 backdrop-blur-md shadow-xl"
                    >
                      <div className="flex gap-2 items-center">
                        <div className={cn("w-3 h-3 rounded-full", reason.color.replace('text-', 'bg-'))} />
                        <div className="h-2 w-16 bg-white/20 rounded-full" />
                      </div>
                    </div>

                    <div 
                      className="absolute bottom-32 -left-4 p-4 rounded-2xl bg-slate-800/90 border border-white/10 backdrop-blur-md shadow-xl"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="h-2 w-24 bg-white/20 rounded-full" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center">
           <SparkleButton onClick={onGetStarted} className="px-10 py-5 bg-white text-[#0F1123] rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transform hover:-translate-y-1 text-lg">
             Start Building <ArrowRight size={20} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
           </SparkleButton>
        </div>
      </div>
    </section>
  );
}
