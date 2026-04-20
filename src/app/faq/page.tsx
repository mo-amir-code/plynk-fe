import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Plynk Support",
  description: "Find answers to all your questions about Plynk—the most artistic bio-link hub. Learn about widgets, customization, privacy, and how to get started.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
              Frequently Asked <span className="gradient-text italic">Questions.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about setting up your stunning new creative hub with Plynk.
            </p>
          </div>

          <FAQAccordion />

          <div className="mt-16 sm:mt-20 text-center animate-fade-in-up delay-300">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mb-6">
              Still have questions? We're here to help.
            </p>
            <Link
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-linear-to-b from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 rounded-full text-sm sm:text-base font-bold shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/10 dark:ring-black/5 transition-all duration-300 hover:brightness-110 cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
