"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Twitter, Linkedin, MessageCircle, Share2, Sparkles } from "lucide-react";
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
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out my new ${BRAND_NAME} profile! 🚀\n\n${fullUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with heavy blur */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-4xl overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5 animate-in zoom-in-95 fade-in duration-300">
        
        {/* Decorative Top Gradient/Icon Section */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600">
            {/* Animated particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-0 left-0 w-full h-full animate-pulse">
                    <div className="absolute top-1/4 left-1/4 size-12 bg-white rounded-full blur-2xl" />
                    <div className="absolute bottom-1/4 right-1/4 size-16 bg-blue-300 rounded-full blur-3xl" />
                </div>
            </div>
            
            <div className="relative size-16 rounded-2xl bg-white shadow-xl flex items-center justify-center rotate-3 animate-in slide-in-from-bottom-4 duration-500 delay-150">
                <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Check className="text-white" size={24} strokeWidth={3} />
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              Your {BRAND_NAME} is Live! <Sparkles className="text-amber-400" size={20} fill="currentColor" />
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Your identity is now public and ready to share with the world.
            </p>
          </div>

          {/* URL Block */}
          <div className="space-y-3 mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
              Public Link
            </label>
            <div className="group relative flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:border-blue-500/30">
              <div className="flex-1 px-3 py-2 text-sm font-bold text-slate-700 dark:text-blue-400 truncate">
                {publicUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  copied 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Share Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <a 
              href={fullUrl} 
              target="_blank" 
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <ExternalLink size={18} />
              View Page
            </a>
            <button 
              onClick={shareTwitter}
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/5 dark:shadow-white/5"
            >
              <Twitter size={18} fill="currentColor" />
              Twitter
            </button>
          </div>

          {/* Close Action */}
          <button 
            onClick={onClose}
            className="w-full py-4 text-sm font-bold text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            Done for now
          </button>
        </div>
      </div>
    </div>
  );
}
