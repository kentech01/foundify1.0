import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  CreditCard, 
  Users, 
  Brain, 
  Zap,
  Rocket,
  QrCode,
  CheckCircle2,
  Loader2,
  Bot
} from "lucide-react";
import { SparklesCore, SparkleButton } from "@/components/ui/sparkles";

interface AiWorkflowsProps {
  onGetStarted?: () => void;
}

export function AiWorkflows({ onGetStarted }: AiWorkflowsProps) {
  
  return (
    <section className="py-32 bg-white text-slate-900 overflow-hidden relative border-t border-slate-100">
      {/* Background Gradients & Noise */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      
      <SparklesCore
        id="tsparticlesworkflows"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={40}
        className="w-full h-full absolute inset-0 pointer-events-none opacity-40"
        particleColor="#a5b4fc"
        speed={0.5}
      />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 shadow-sm backdrop-blur-md">
            <Brain size={12} className="text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">THE COMPANY BRAIN</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-[1.1] text-slate-900">
            AI with full context – <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              embedded in your tools.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Foundify absorbs your company's DNA—docs, pitch, profile—and automatically powers every tool you need to operate and grow.
          </p>
        </div>

        {/* New Logic-Based Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* 1. INPUT: The Brain (Spans 4 cols) */}
          <div className="md:col-span-4 relative group overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 flex flex-col justify-between h-[500px] backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10">
                 <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">The Brain</h3>
              <p className="text-slate-500 leading-relaxed">
                Centralize your company profile, pitch deck, and docs. The single source of truth.
              </p>
            </div>

            {/* Visual: Context Ingestion */}
            <div className="relative mt-6 bg-slate-50 rounded-2xl border border-slate-100 p-4 overflow-hidden shadow-inner">
               <div className="space-y-3">
                 {[
                   { name: "Pitch Deck.pdf", size: "2.4 MB", status: "Analyzed" }, 
                   { name: "Company_Profile.json", size: "14 KB", status: "Synced" }, 
                   { name: "Brand_Assets.zip", size: "45 MB", status: "Processing" }
                  ].map((file, i) => (
                   <div 
                     key={i} 
                     className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm group/file"
                   >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <FileText size={14} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-700 truncate">{file.name}</p>
                        <p className="text-[9px] text-slate-400">{file.size}</p>
                      </div>
                      {file.status === "Processing" ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-full border border-amber-100">
                          <Loader2 size={10} className="text-amber-600" />
                          <span className="text-[9px] font-bold text-amber-600 uppercase">Processing</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                          <CheckCircle2 size={10} className="text-emerald-600" />
                          <span className="text-[9px] font-bold text-emerald-600 uppercase">{file.status}</span>
                        </div>
                      )}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* 2. OUTPUTS: The Workflows */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Raise & Launch */}
            <div className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 h-[240px] flex flex-col backdrop-blur-sm">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Rocket size={24} />
                 </div>
                 <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">Raise</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">Pitch Generator</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">
                 Generate investor-ready decks and landing pages directly from your profile.
               </p>
               
               {/* Micro-interaction - Static */}
               <div className="flex items-center gap-2 mt-auto">
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[50%] rounded-full" />
                 </div>
                 <span className="text-[10px] font-bold text-blue-600 whitespace-nowrap">Generating...</span>
               </div>
            </div>

            {/* Operations */}
            <div className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 h-[240px] flex flex-col backdrop-blur-sm">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FileText size={24} />
                 </div>
                 <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">Legal</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">Invoices & Contracts</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">
                 Auto-fill compliant legal docs and professional invoices with zero data entry.
               </p>

               {/* Micro-interaction */}
               <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                  <Bot size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-medium text-indigo-700">"Drafting NDA for new hire..."</span>
               </div>
            </div>

            {/* Growth */}
            <div className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 h-[240px] flex flex-col backdrop-blur-sm">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                    <Users size={24} />
                 </div>
                 <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">Team</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">Hiring Assistant</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">
                 Screen candidates, schedule interviews, and track team health insights.
               </p>
               
               {/* Micro-interaction */}
               <div className="flex -space-x-2">
                  {[1,2,3].map((_,i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center text-[8px] font-bold text-violet-600">+12</div>
               </div>
            </div>

            {/* Connect */}
            <div className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 h-[240px] flex flex-col backdrop-blur-sm">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <QrCode size={24} />
                 </div>
                 <span className="px-2 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">Connect</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">Smart Identity</h3>
               <p className="text-sm text-slate-500 mb-6 flex-1">
                 Share your dynamic digital card. Always up-to-date with your company brain.
               </p>
               
               {/* Micro-interaction - Static */}
               <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Live</span>
                  <Sparkles size={14} className="text-emerald-400" />
               </div>
            </div>

          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-20">
          <SparkleButton onClick={onGetStarted} className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 shadow-lg shadow-indigo-500/20">
             <span className="relative flex items-center gap-2">
               Get Started <ArrowRight size={18} />
             </span>
          </SparkleButton>
          <button onClick={onGetStarted} className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-900 font-bold text-lg hover:bg-slate-50 shadow-sm">
             Book a demo
          </button>
        </div>

      </div>
    </section>
  );
}
