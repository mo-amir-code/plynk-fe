import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, MessageSquare, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Plynk",
  description: "Get in touch with the Plynk team. We're here to help you build your perfect digital presence.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Content Side */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Let's build your <span className="gradient-text italic">world.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-xl mb-12 leading-relaxed">
              Have questions about our widgets, custom domains, or enterprise features? Our crew is standing by to help you launch your stunning new canvas.
            </p>

            {/* Info Cards - Fixed Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Us</h3>
                  <a href="mailto:support@plynk.in" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors">support@plynk.in</a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Help Center</h3>
                  <Link href="/faq" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium hover:text-blue-500 transition-colors">Check out our FAQs</Link>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Global Crew</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">Remote first, globally focused.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative mt-12 lg:mt-0">
            <div className="absolute -inset-4 bg-primary/5 dark:bg-primary/20 rounded-[3rem] blur-3xl -z-10" />
            <ContactForm />
          </div>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
