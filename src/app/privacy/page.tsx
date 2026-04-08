import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Lock, Eye, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Plynk",
  description: "Transparent and simple. Learn how Plynk handles your data with respect and security.",
};

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "What we collect",
      content: "We keep things minimal. We collect your email address for account security, your chosen username to create your unique plynk.in URL, and the links or content you choose to display on your hub."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "How we use it",
      content: "Your data is used solely to provide and improve the Plynk experience. We do not sell your personal information to third parties. Period."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Public Visibility",
      content: "By design, the content you add to your Plynk page is public. Please only share links, images, and text that you are comfortable with the world seeing."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Cookies & Analytics",
      content: "We use basic cookies to keep you logged in and anonymous analytics to understand how Plynk is being used so we can make it faster and better for you."
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Privacy <span className="gradient-text italic">Policy.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              At Plynk, we believe privacy is a fundamental right. We've designed our platform to collect the minimum amount of data necessary to provide a premium experience.
            </p>
            <p className="text-sm text-slate-400 mt-4 italic font-bold">Last updated: April 8, 2026</p>
          </div>

          {/* Grid of Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 animate-fade-in-up delay-150">
            {sections.map((s, i) => (
              <div key={i} className="glass rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/5">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>

          {/* Detailed Content */}
          <div className="space-y-12 text-slate-700 dark:text-slate-300 animate-fade-in-up delay-300">
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">1. Data Storage</h2>
              <p className="leading-relaxed font-medium mb-4">
                Your data is stored securely using industry-standard encryption. While we strive to protect your personal information, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">2. Your Rights</h2>
              <p className="leading-relaxed font-medium mb-4">
                You have the right to access, update, or delete your information at any time through your account settings. If you close your account, your public plynk.in page will be taken down immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">3. Contact Us</h2>
              <p className="leading-relaxed font-medium">
                If you have any questions about this Privacy Policy, please reach out to our founders directly at <a href="mailto:support@plynk.in" className="text-primary hover:underline font-bold transition-all">support@plynk.in</a>.
              </p>Section
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
