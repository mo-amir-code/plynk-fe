"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-scale");
    
    // Intersection Observer callback
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Once it's revealed, we don't need to observe it anymore
            io.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Start reveal slightly before it enters the viewport
      }
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null; // This component doesn't render anything
}
