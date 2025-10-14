"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NavbarProps {
  onGetStarted: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6"
    >
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl px-6 py-3 shadow-2xl shadow-black/20">
        {/* Subtle light accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-2xl" />

        <div className="flex items-center gap-8 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* SVG Logo */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "Home", id: "hero" },
              { label: "Features", id: "solution" },
              { label: "How it Works", id: "how-it-works" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={onGetStarted}
            size="sm"
            className="bg-white hover:bg-zinc-100 text-zinc-900 px-4 py-2 text-sm rounded-xl transition-colors duration-200 font-medium"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
