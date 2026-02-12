import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparkleButton } from "@/components/ui/sparkles";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PricingProps {
  onGetStarted?: () => void;
}

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for early-stage founders and ideation.",
    features: [
      "Pitch Dashboard",
      "Landing Page Generator",
      "Pitch Deck Generator",
      "Basic Email Drafts (3/mo)",
      "Single User"
    ],
    cta: "Start for Free",
    popular: false
  },
  {
    name: "Professional",
    price: "12",
    description: "The complete operating system for your company.",
    features: [
      "Everything in Starter",
      "Unlimited Invoices",
      "Smart Contracts & E-sign",
      "AI Hiring Assistant",
      "Team Insights & Feedback",
      "Smart Digital Cards (QR)",
      "Priority Support"
    ],
    cta: "Get Started",
    popular: true
  }
];

export function Pricing({ onGetStarted }: PricingProps) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const handleGetStarted = (isPremium: boolean) => {
    if (onGetStarted) {
      onGetStarted();
    } else if (isPremium) {
      // Navigate to upgrade page for premium plan
      if (user) {
        navigate("/upgrade");
      } else {
        // If not logged in, redirect to sign up
        onGetStarted?.();
      }
    } else {
      // Free plan - just sign up
      onGetStarted?.();
    }
  };
  
  return (
    <section id="pricing" className="py-32 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] opacity-50 translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] opacity-50 -translate-x-1/3 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-[1.1]">
            Simple pricing.
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Start for free, upgrade when you're ready to scale your operations. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`relative rounded-3xl p-10 border transition-all duration-300 h-full flex flex-col ${
                plan.popular
                  ? "border-indigo-100 bg-white shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-50"
                  : "border-slate-100 bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              }`}
            >
              
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-indigo-900" : "text-slate-900"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-5xl font-black tracking-tight ${plan.popular ? "text-indigo-600" : "text-slate-900"}`}>${plan.price}</span>
                  <span className="text-slate-400 font-bold">/mo</span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="h-px w-full bg-slate-100" />
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium group">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${plan.popular ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full mt-auto">
                <div>
                   {plan.popular ? (
                      <SparkleButton onClick={() => handleGetStarted(true)} className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold shadow-xl shadow-indigo-500/20 hover:bg-slate-800 transition-all">
                         {plan.cta}
                      </SparkleButton>
                   ) : (
                      <Button 
                        onClick={() => handleGetStarted(false)}
                        className="w-full h-14 rounded-xl text-base font-bold transition-all shadow-lg bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-slate-200/20"
                      >
                        {plan.cta}
                      </Button>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
