import React from "react";
import { Separator } from "./ui/separator";
import { Github, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FooterModern() {
  const navigate = useNavigate();
  const favicon = new URL("../assets/FOUNDIFY-LOGO.svg", import.meta.url).href;
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          {/* Left: Brand and description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={favicon}
                alt="Foundify"
                className="h-8 w-auto cursor-pointer select-none"
                onClick={() => navigate("/")}
              />
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              The complete toolkit for founders. From pitch decks to essential
              business tools—everything you need in one place.
            </p>
          </div>

          {/* Right: Social icons */}
          <div className="flex gap-4 md:self-start md:justify-end">
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 Foundify. All rights reserved.</p>
          <p className="text-gray-500">Built with ❤️ for founders</p>
        </div>
      </div>
    </footer>
  );
}
