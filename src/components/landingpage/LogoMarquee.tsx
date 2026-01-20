import { motion } from "motion/react";

const logos = [
  "Acme Corp",
  "GlobalBank",
  "Nebula",
  "Trio",
  "FoxHub",
  "Circle",
  "LightAI",
  "Bolt",
];

export function LogoMarquee() {
  return (
    <div className="w-full py-12 overflow-hidden bg-white border-y border-slate-100 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 mb-8 text-center relative z-20">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          Trusted by forward-thinking companies
        </p>
      </div>
      <div className="relative flex w-full overflow-hidden">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
        >
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="text-xl font-bold text-slate-300 flex items-center gap-2 select-none group"
            >
              <div className="w-6 h-6 rounded bg-slate-100 group-hover:bg-indigo-50 transition-colors" />
              <span className="group-hover:text-indigo-600 transition-colors">{logo}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
