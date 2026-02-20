import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Users, 
  CreditCard, 
  Sparkles,
  Search,
  Plus, 
  Download,
  Bot,
  
} from "lucide-react";
import React from "react";

const steps = [
  {
    id: "invoices",
    title: "Invoices",
    subtitle: "Finance Automation",
    description: "Create professional invoices instantly with your company details auto-filled. Reusable, fast, and frictionless.",
    icon: CreditCard,
    color: "bg-blue-600",
    mockup: {
      title: "Invoice Generator",
      subtitle: "Professional invoices in seconds",
      content: (
        <div className="space-y-6 relative overflow-hidden">
          {/* Sparkle instead of scan line */}
          <Sparkles className="absolute top-2 right-2 text-blue-400 animate-twinkle w-4 h-4" />
          
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <div className="w-full h-9 pl-9 pr-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center text-xs text-slate-400">
                Search clients...
              </div>
            </div>
            <div className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Plus size={14} /> New Invoice
            </div>
          </div>
          <div>
            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">INV-936561</p>
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">PAID</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Acme Corp • Due Today</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Amount</p>
                  <p className="text-sm font-black text-slate-900">€100.00</p>
                </div>
                <div className="flex gap-1">
                   <div className="w-7 h-7 bg-slate-50 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors"><Download size={14}/></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Insight Pill */}
          <div className="flex justify-center">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                <Bot size={12} className="text-blue-600" />
                <span className="text-[10px] font-medium text-blue-700">Auto-reminder scheduled for Friday</span>
             </div>
          </div>
        </div>
      )
    }
  },
  {
    id: "contracts",
    title: "Contracts",
    subtitle: "Legal Engineering",
    description: "Generate NDAs and Agreements with minimal input. Legal-ready templates powered by your profile.",
    icon: FileText,
    color: "bg-indigo-600",
    mockup: {
      title: "Contract Templates",
      subtitle: "Legally binding in minutes",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "NDA", type: "Legal", status: "Ready" },
              { title: "Founder Agreement", type: "Founding", status: "Drafting..." },
              { title: "Employment", type: "HR", status: "Template" },
              { title: "Consulting", type: "Legal", status: "Review" }
            ].map((c, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all hover:shadow-md cursor-pointer group relative overflow-hidden">
                 {c.status === "Drafting..." && (
                    <div className="absolute inset-0 bg-indigo-50/50 flex items-center justify-center backdrop-blur-[1px]">
                       <Sparkles className="text-indigo-500 animate-spin w-5 h-5" />
                    </div>
                 )}
                 <div className="flex justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FileText size={16} />
                    </div>
                    <span className="text-[8px] font-bold bg-slate-50 px-1.5 py-0.5 rounded text-slate-500 uppercase h-fit">{c.type}</span>
                 </div>
                 <p className="text-xs font-bold text-slate-900">{c.title}</p>
                 <p className="text-[9px] text-slate-400 mt-1">{c.status}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  },
  {
    id: "insights",
    title: "Team Insights",
    subtitle: "Feedback & Growth",
    description: "Structured feedback management for your team. Track performance reviews, growth goals, and team records with organized insights.",
    icon: Users,
    color: "bg-violet-600",
    mockup: {
      title: "Team Insights",
      subtitle: "Feedback & performance tracking",
      content: (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <p className="text-xl font-black text-blue-600 relative z-10">12</p>
               <p className="text-[9px] font-bold text-blue-400 uppercase relative z-10">Members</p>
            </div>
            <div className="flex-1 p-3 bg-violet-50/50 rounded-xl border border-violet-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <p className="text-xl font-black text-violet-600">24</p>
               <p className="text-[9px] font-bold text-violet-400 uppercase">Reviews</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Sarah J.", role: "Engineer", type: "Quarterly", date: "Q1 2024" },
              { name: "Marcus C.", role: "Designer", type: "Yearly", date: "2024" }
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-violet-100 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {m.name[0]}
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-900">{m.name}</p>
                       <p className="text-[9px] text-slate-400">{m.role}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                   <div className="px-2 py-0.5 rounded bg-violet-50 border border-violet-100 text-[9px] font-bold text-violet-700">
                     {m.type}
                   </div>
                   <p className="text-[8px] text-slate-400">{m.date}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      let newStep = 0;
      if (latest > 0.66) newStep = 2;
      else if (latest > 0.33) newStep = 1;
      else newStep = 0;

      if (newStep !== activeStep) {
        setActiveStep(newStep);
      }
    });
  }, [scrollYProgress, activeStep]);

  return (
    <section id="how-it-works" className="bg-white py-12 lg:py-0 relative">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      
      {/* Mobile Layout - Tabbed "Surprise" View */}
      <div className="lg:hidden container mx-auto px-4 py-20">
         <div className="text-center mb-12">
            <span className="text-[#0B0F19] font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block">
              SEAMLESS WORKFLOW
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B0F19] tracking-tighter leading-tight">
              AI embedded in <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">your daily tools.</span>
            </h2>
         </div>

         <div className="relative">
            {/* Custom Tab Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 relative">
               <div className="absolute inset-y-1 transition-all duration-300 bg-white shadow-sm rounded-xl border border-slate-200/50"
                  style={{ 
                     width: "33.33%", 
                     left: `${activeStep * 33.33}%`
                  }} 
               />
               {steps.map((step, index) => (
                  <button
                     key={step.id}
                     onClick={() => setActiveStep(index)}
                     className={cn(
                        "flex-1 py-3 text-xs font-bold uppercase tracking-wide relative z-10 transition-colors duration-300 flex flex-col items-center gap-1",
                        activeStep === index ? "text-indigo-600" : "text-slate-400"
                     )}
                  >
                     <step.icon size={16} />
                     {step.title}
                  </button>
               ))}
            </div>

            {/* Single Dynamic Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden relative min-h-[400px]">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeStep}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                     className="h-full flex flex-col"
                  >
                     {/* Dynamic Header Background */}
                     <div className={cn("h-32 p-6 flex items-start justify-between relative overflow-hidden shrink-0", steps[activeStep].color)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                        <div className="relative z-10 text-white">
                           <h3 className="text-2xl font-bold mb-1">{steps[activeStep].title}</h3>
                           <p className="text-white/80 text-xs font-medium max-w-[200px] leading-relaxed">{steps[activeStep].description}</p>
                        </div>
                        <div className="relative z-10 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white border border-white/20">
                           <Bot size={20} />
                        </div>
                     </div>

                     {/* Mockup Container */}
                     <div className="flex-1 bg-white p-6 relative -mt-6 rounded-t-[2rem]">
                        <div className="bg-white rounded-xl border border-slate-100 shadow-lg p-4 h-full relative z-10">
                           <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                              <h4 className="text-sm font-bold text-slate-900">{steps[activeStep].mockup.title}</h4>
                              <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-full">
                                {steps[activeStep].mockup.subtitle}
                              </span>
                           </div>
                           {steps[activeStep].mockup.content}
                        </div>
                     </div>
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Desktop Layout (Pinned Scroll) */}
      <div ref={containerRef} className="hidden lg:block relative h-[120vh]">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center">
            
            <div className="mb-12 max-w-2xl mx-auto text-center">
              {/* <span className="text-[#0B0F19] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">
                SEAMLESS WORKFLOW
              </span> */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0F19] tracking-tighter mb-6 leading-[1.1]">
                AI with full context – <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">
                  embedded in your tools.
                </span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
              <div className="w-5/12 relative">
                <div className="relative pl-8 border-l-2 border-slate-100 space-y-12">
                  <div className="absolute left-[-2px] top-0 bottom-0 w-0.5 bg-slate-100" />
                  <motion.div 
                    className="absolute left-[-2px] top-0 w-0.5 bg-indigo-600 z-10 origin-top shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    style={{ height: progressHeight }}
                  />

                  {steps.map((step, index) => (
                    <div 
                      key={step.id}
                      onClick={() => setActiveStep(index)}
                      className={cn(
                        "cursor-pointer transition-all duration-500 group relative pl-4",
                        activeStep === index ? "opacity-100 translate-x-2" : "opacity-40 hover:opacity-70 hover:translate-x-1"
                      )}
                    >
                      <div className="flex flex-col gap-1 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{step.subtitle}</span>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{step.title}</h3>
                      </div>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-7/12 relative">
                 <div className="relative bg-white rounded-3xl p-3 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden aspect-[16/10]">
                    <div className="relative z-10 h-full w-full bg-slate-50/30 rounded-2xl overflow-hidden flex flex-col">
                       <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
                       
                       {/* Floating blobs removed */}

                       <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 shrink-0 relative z-20">
                          <div className="flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                             <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Foundify OS</span>
                          </div>
                       </div>

                       <div className="flex-1 relative p-8 lg:p-12 flex items-center justify-center z-20">
                          <AnimatePresence mode="wait">
                             <motion.div
                               key={activeStep}
                               initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" }}
                               animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                               exit={{ opacity: 0, scale: 1.05, y: -10, filter: "blur(4px)" }}
                               transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                               className="w-full max-w-lg"
                             >
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 transform transition-all hover:scale-[1.01] duration-500 relative overflow-hidden">
                                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-10" />
                                   
                                   <div className="flex items-center gap-5 mb-8 border-b border-slate-50 pb-6 relative z-10">
                                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20", steps[activeStep].color)}>
                                         {(() => {
                                           const Icon = steps[activeStep].icon;
                                           return <Icon size={28} />;
                                         })()}
                                      </div>
                                      <div>
                                         <h4 className="text-xl font-bold text-slate-900 mb-1">{steps[activeStep].mockup.title}</h4>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            {steps[activeStep].mockup.subtitle}
                                         </p>
                                      </div>
                                   </div>
                                   <div className="relative z-10">
                                      {steps[activeStep].mockup.content}
                                   </div>
                                </div>
                             </motion.div>
                          </AnimatePresence>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
