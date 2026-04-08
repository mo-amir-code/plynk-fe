"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ExperienceLive } from "@/components/home/ExperienceLive";
import { Features } from "@/components/home/Features";
import { StreamlinedOnboarding } from "@/components/home/StreamlinedOnboarding";
import { CTA } from "@/components/home/CTA";
import { ScrollReveal } from "@/components/layout/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Navbar />
      <Hero />
      <ExperienceLive />
      <Features />
      <StreamlinedOnboarding />
      <CTA />
      <Footer />
    </>
  );
}
