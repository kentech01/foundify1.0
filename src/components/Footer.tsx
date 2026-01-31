import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import React from "react";

export function Footer() {
  const navigate = useNavigate();
const logo = new URL("./../assets/logo.svg", import.meta.url).href;
  
  
  return (
    <footer className="bg-white border-t border-slate-100 py-16 text-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="foundify logo" />

            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The AI-powered company brain that organizes, analyzes, and assists your entire operation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition-colors">Invoices</button></li>
              <li><button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition-colors">Contracts</button></li>
              <li><button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition-colors">Hiring</button></li>
              <li><button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition-colors">Team Insights</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
              <li><button onClick={() => navigate("/terms")} className="hover:text-indigo-600 transition-colors">Terms</button></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 Foundify Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
