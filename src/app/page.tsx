"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ExperienceLive } from "@/components/home/ExperienceLive";
import { Features } from "@/components/home/Features";
import { ComponentLibrary } from "@/components/home/ComponentLibrary";
import { StreamlinedOnboarding } from "@/components/home/StreamlinedOnboarding";
import { CTA } from "@/components/home/CTA";

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-scale");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { 
        if (e.isIntersecting) { 
          e.target.classList.add("visible"); 
          io.unobserve(e.target); 
        } 
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Home() {
  useReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <ExperienceLive />
      <Features />
      <ComponentLibrary />
      <StreamlinedOnboarding />
      <CTA />
      <Footer />
    </>
  );
}
