import { useNavigate } from "react-router-dom";
import React from "react";

const productLinks = [
  { label: "Pitch Dashboard", path: "/dashboard/pitches" },
  { label: "Invoices & Contracts", path: "/dashboard/invoices" },
  { label: "Hiring & Team Insights", path: "/dashboard/ai-hiring-assistant" },
  { label: "Email & Digital Card", path: "/dashboard/investor-email-draft" },
];

export function Footer() {
  const navigate = useNavigate();
  const logo = new URL("./../assets/logo.svg", import.meta.url).href;

  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 py-12 md:py-16">
        {/* Main content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-16">
          {/* Brand */}
          <div className="md:max-w-xs">
            <img
              src={logo}
              alt="Foundify"
              className="h-8 w-auto mb-4"
            />
            <p className="text-slate-500 text-sm leading-relaxed">
              The AI-powered company brain that organizes, analyzes, and assists your entire operation.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Product</h4>
              <nav className="flex flex-col gap-3">
                {productLinks.map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors text-left w-fit"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Legal</h4>
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/terms")}
                  className="text-sm text-slate-500 hover:text-indigo-600 transition-colors text-left w-fit"
                >
                  Terms
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            © 2026 Foundify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
