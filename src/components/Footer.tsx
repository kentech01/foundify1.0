import React from "react";
import { Separator } from "./ui/separator";
import { Github, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const favicon = new URL("../assets/FOUNDIFY-LOGO.svg", import.meta.url).href;
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          {/* Left: Brand and description */}
          <div className="space-y-4">
            <p className="text-gray-400 max-w-md leading-relaxed">
              The complete toolkit for founders. From pitch decks to essential
              business tools—everything you need in one place.
            </p>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 Foundify. All rights reserved.</p>
          <p className="text-gray-500">
            Built with ❤️{" "}
            <a
              href="https://www.thrio.co/"
              target="_blank"
              className=" hover:text-white"
            >
              by thrio.co
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
