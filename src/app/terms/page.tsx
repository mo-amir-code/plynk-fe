import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Scale, Zap, Ban, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Plynk",
  description: "Simple rules for a better creative web. Read the Plynk Terms of Service.",
};

export default function TermsPage() {
  const rules = [
    {
      icon: <Ban className="w-5 h-5" />,
      title: "Prohibited Content",
      content: "Users may not post content that is illegal, hateful, or designed to harass others. We reserve the right to remove any content that violates the spirit of a positive creative web."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Content Ownership",
      content: "You own the content you post on Plynk. By using our service, you grant us a license to display and host that content on your unique plynk.in URL."
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Liability",
      content: "Plynk is provided 'as is'. We are not liable for any damages or business losses resulting from the use of our service or any downtime that may occur."
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Termination",
      content: "We reserve the right to suspend or terminate accounts that violate our terms or cause harm to the Plynk community or infrastructure."
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-16 animate-fade-in-up">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tighter leading-tight">
              Terms of <span className="gradient-text italic">Service.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Welcome to Plynk. By using our platform, you're agreeing to these simple rules. We keep them short so you can get back to creating.
            </p>
            <p className="text-sm text-slate-400 mt-4 italic font-bold">Last updated: April 8, 2026</p>
          </div>

          {/* Core Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 animate-fade-in-up delay-150">
            {rules.map((r, i) => (
              <div key={i} className="glass rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/5">
                <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-5 sm:mb-6">
                  {r.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">{r.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8 sm:space-y-12 text-slate-700 dark:text-slate-300 animate-fade-in-up delay-300">
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">1. User Responsibility</h2>
              <p className="text-sm sm:text-base leading-relaxed font-medium mb-4">
                You are solely responsible for the content, links, and text displayed on your Plynk hub. You represent that you have the right to share all the content and links you provide.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">2. Account Security</h2>
              <p className="text-sm sm:text-base leading-relaxed font-medium mb-4">
                You are responsible for maintaining the confidentiality of your account credentials. Plynk cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">3. Impersonation</h2>
              <p className="text-sm sm:text-base leading-relaxed font-medium mb-4">
                You may not register a username or create a Plynk hub that impersonates a person, brand, or entity in a manner that is intended to mislead or deceive others.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">4. Modifications</h2>
              <p className="text-sm sm:text-base leading-relaxed font-medium">
                We are constantly improving Plynk. We reserve the right to modify or discontinue any part of the service at any time without notice. We will update these terms accordingly.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
