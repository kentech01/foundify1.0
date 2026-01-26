import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Users, 
  CreditCard,
  Briefcase,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Bot,
  Scale,
  Landmark,
  BadgeDollarSign,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";

interface ToolsShowcaseProps {
  onGetStarted?: () => void;
}

export function ToolsShowcase({ onGetStarted }: ToolsShowcaseProps) {
  const [activeTab, setActiveTab] = useState("start");

  const tabs = [
    { id: "start", label: "Legal & Admin", icon: Scale },
    { id: "finance", label: "Finance", icon: Landmark },
    { id: "team", label: "Team & Hiring", icon: Users },
    { id: "raise", label: "Fundraising", icon: BadgeDollarSign }
  ];

  const content = {
    start: {
      headline: "Never worry about compliance again.",
      description: "Get your legal and admin running on autopilot. From incorporation to IP assignment, Foundify handles the paperwork so you can focus on building.",
      replaces: ["LegalZoom", "Clerky", "DocuSign"],
      checklist: [
        "Instant Incorporation & EIN",
        "Auto-generated Post-Incorp Docs",
        "Trademark & IP Assignment",
        "State Compliance Monitoring"
      ],
      agents: [
        {
          name: "Legal Agent",
          role: "Drafts Contracts",
          desc: "Generates NDAs, Advisor Agreements, and IP assignments instantly.",
          icon: FileText,
          color: "bg-indigo-100 text-indigo-600"
        },
        {
          name: "Compliance Bot",
          role: "Monitors Filings",
          desc: "Alerts you before state filings are due and auto-prepares forms.",
          icon: Shield,
          color: "bg-blue-100 text-blue-600"
        }
      ],
      theme: "indigo"
    },
    finance: {
      headline: "Your financial autopilot.",
      description: "Stop stitching together banks, spreadsheets, and payroll tools. Foundify gives you a complete financial operating system from day one.",
      replaces: ["Quickbooks", "Mercury", "Gusto"],
      checklist: [
        "Business Banking Integration",
        "Automated Bookkeeping",
        "One-Click Payroll Run",
        "Expense Management"
      ],
      agents: [
        {
          name: "Finance Agent",
          role: "Bookkeeper",
          desc: "Categorizes expenses and reconciles transactions in real-time.",
          icon: CreditCard,
          color: "bg-emerald-100 text-emerald-600"
        },
        {
          name: "Tax Assistant",
          role: "Planner",
          desc: "Estimates quarterly taxes and identifies potential deductions.",
          icon: Bot,
          color: "bg-teal-100 text-teal-600"
        }
      ],
      theme: "emerald"
    },
    team: {
      headline: "Scale your workforce without the headache.",
      description: "Hire, onboard, and manage your team globally. Foundify handles the contracts, benefits, and device management automatically.",
      replaces: ["Deel", "Rippling", "Greenhouse"],
      checklist: [
        "Global Contractor Payments",
        "Automated Onboarding Flows",
        "Benefits Administration",
        "Equipment Provisioning"
      ],
      agents: [
        {
          name: "Recruiter AI",
          role: "Sourcing",
          desc: "Screens resumes and schedules interviews with top candidates.",
          icon: Users,
          color: "bg-violet-100 text-violet-600"
        },
        {
          name: "HR Bot",
          role: "Onboarding",
          desc: "Guides new hires through paperwork and tool access setup.",
          icon: Briefcase,
          color: "bg-purple-100 text-purple-600"
        }
      ],
      theme: "violet"
    },
    raise: {
      headline: "Close your round faster.",
      description: "Everything you need to impress investors. Generate pitch decks, manage your data room, and track investor interest in one place.",
      replaces: ["DocSend", "Carta", "Pitch"],
      checklist: [
        "AI Pitch Deck Generator",
        "Secure Data Room",
        "Cap Table Management",
        "Investor Updates CRM"
      ],
      agents: [
        {
          name: "Pitch Agent",
          role: "Designer",
          desc: "Turns your metrics into a compelling, design-ready pitch deck.",
          icon: Rocket,
          color: "bg-rose-100 text-rose-600"
        },
        {
          name: "Analyst Bot",
          role: "Due Diligence",
          desc: "Prepares answers for common investor due diligence questions.",
          icon: FileText,
          color: "bg-orange-100 text-orange-600"
        }
      ],
      theme: "rose"
    }
  };

  const activeContent = content[activeTab as keyof typeof content];

  return (
    <section id="tools" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-20">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-6 relative group"
           >
             <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
             <Sparkles size={12} className="text-indigo-600 relative z-10" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 relative z-10">
               Foundational AI
             </span>
           </motion.div>
           
           <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B0F19] tracking-tighter mb-6 leading-[1.1]">
             AI solutions for <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
               every stage of your journey.
             </span>
           </h2>
           
           <p className="text-slate-500 text-lg font-medium leading-relaxed">
             Your key workflows, powered by Foundify Agents.
           </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap justify-start md:justify-center gap-2 mb-8 md:mb-12 px-4 md:px-0 -mx-4 md:mx-0 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm font-bold transition-all duration-300 border whitespace-nowrap flex-shrink-0 relative overflow-hidden group",
                  isActive 
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-100 md:scale-105" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                )}
                <tab.icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                 <SparklesCore
                    id="tool-sparkles"
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={30}
                    className="w-[300px] h-[300px]"
                    particleColor="#6366f1"
                 />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center relative z-10">
                
                {/* Left Column: Description */}
                <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                      {activeContent.headline}
                    </h3>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                      {activeContent.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Replaces</p>
                    <div className="flex flex-wrap gap-3">
                      {activeContent.replaces.map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 shadow-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200/50">
                    {activeContent.checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className={`text-${activeContent.theme}-500 flex-shrink-0`} />
                        <span className="text-sm font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                     <button onClick={onGetStarted} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        Explore Solution <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>

                {/* Right Column: Agents */}
                <div className="grid gap-3 md:gap-4 order-1 lg:order-2 mb-4 lg:mb-0">
                  {activeContent.agents.map((agent, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 md:gap-4 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles size={12} className={cn("text-slate-400 animate-twinkle")} />
                      </div>
                      
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 relative", agent.color)}>
                        <agent.icon size={24} className="relative z-10" />
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                          {agent.name}
                          <span className="text-[10px] font-normal text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                             {agent.role}
                          </span>
                        </h4>
                        <p className="text-sm text-slate-500 leading-snug">
                          {agent.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Decorative Agent Card (Blurry/Coming Soon) */}
                   <div className="bg-white/50 p-5 rounded-xl border border-slate-100 border-dashed flex items-center justify-center text-slate-400 text-sm font-medium">
                      + More agents coming soon
                   </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
