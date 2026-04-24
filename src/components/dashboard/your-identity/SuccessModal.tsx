"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Twitter, Linkedin, MessageCircle, Share2, Sparkles, Link } from "lucide-react";
import { toast } from "sonner";
import { BRAND_NAME, getPublicProfileDisplay, getPublicProfileUrl } from "@/config/app-config";
import type { SuccessModalProps } from "@/types/components/dashboard/your-identity";

export function SuccessModal({ isOpen, onClose, username }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = getPublicProfileDisplay(username);
  const fullUrl = getPublicProfileUrl(username);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out my new ${BRAND_NAME} profile! 🚀\n\n${publicUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Deepest Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-1000" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#020617] rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-slate-200 dark:border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        
        {/* Subtle Brand Accent (Top-Edge Leak) */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        
        {/* Ambient Glow behind the card content */}
        <div className="absolute -top-32 -left-32 size-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Minimalist Icon Section with Moving Gradient */}
        <div className="relative h-44 flex flex-col items-center justify-center pt-4">
            <div className="relative">
                {/* Sunken Glass Circle with Rotating Orange Orbit */}
                <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 shadow-inner flex items-center justify-center relative overflow-hidden group">
                    {/* The Moving Background Gradient */}
                    <div className="absolute inset-x-[-50%] inset-y-[-50%] bg-[conic-gradient(from_0deg,transparent,transparent,rgba(255,77,0,0.4),transparent)] animate-[spin_3s_linear_infinite]" />
                    
                    <div className="relative z-10 size-16 rounded-full bg-white/70 dark:bg-[#020617]/40 backdrop-blur-sm flex items-center justify-center">
                        <Check className="text-slate-900 dark:text-white drop-shadow-[0_0_8px_rgba(255,100,0,0.5)]" size={32} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span className="size-1 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Identity Verified</span>
            </div>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-10">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Your Canvas is Live.
            </h2>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[240px] mx-auto tracking-wide">
              Your artistic digital hub is now synchronized across our global nodes.
            </p>
          </div>

          {/* URL Block - Frosted glass style */}
          <div className="space-y-4 mb-10">
            <div className="group relative flex items-center p-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20">
              <div className="flex-1 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 truncate tracking-widest lowercase">
                {publicUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[11px] font-black Capitalize tracking-widest transition-all duration-500 ${
                  copied 
                    ? "bg-emerald-500 text-white" 
                    : "bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 cursor-pointer"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Social Proof Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <a 
              href={fullUrl} 
              target="_blank" 
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300 hover:brightness-125 shadow-[0_10px_30px_-10px_rgba(255,77,0,0.4)]"
            >
              <ExternalLink size={16} />
              Visit Page
            </a>
            <button 
              onClick={shareTwitter}
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-white/5 transition-all duration-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
            >
              <Twitter size={16} fill="currentColor" />
              Twitter
            </button>
          </div>

          {/* Back Action */}
          <button 
            onClick={onClose}
            className="w-full text-[10px] font-black text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-wider pt-4 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
