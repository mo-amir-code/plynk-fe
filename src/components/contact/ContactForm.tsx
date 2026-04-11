"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Please enter your message";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    
    try {
      await api.post("/users/contact", {
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setStatus("success");
      toast.success("Message sent successfully!");
    } catch (error: any) {
      console.error("Contact form error:", error);
      setStatus("error");
      toast.error(error.message || "Failed to send message. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  if (status === "success") {
    return (
      <div className="glass rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-center border border-primary/20 bg-white/40 dark:bg-slate-900/40 animate-fade-in-up">
        <div className="size-16 sm:size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">Message Received!</h2>
        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 font-medium mb-8">
          Thanks for reaching out! Our team will get back to you soon.
        </p>
        <button 
          onClick={() => {
            setStatus("idle");
            setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
          }}
          className="text-primary font-bold hover:underline cursor-pointer transition-all"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      noValidate
      className="glass rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 border border-slate-200/50 dark:border-white/10 bg-white/20 dark:bg-white/5 shadow-xl animate-fade-in-up"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-[12px] sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
            Full Name
          </label>
          <input
            value={formData.name}
            onChange={handleChange}
            type="text"
            id="name"
            placeholder="John Doe"
            className={`w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${errors.name ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10'} outline-hidden transition-all text-slate-900 dark:text-white font-medium text-sm sm:text-base`}
          />
          {errors.name && (
            <div className="flex items-center gap-1.5 text-red-500 text-[10px] sm:text-xs font-bold ml-1 animate-fade-in">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-[12px] sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
            Email Address
          </label>
          <input
            value={formData.email}
            onChange={handleChange}
            type="email"
            id="email"
            placeholder="john@example.com"
            className={`w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${errors.email ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10'} outline-hidden transition-all text-slate-900 dark:text-white font-medium text-sm sm:text-base`}
          />
          {errors.email && (
            <div className="flex items-center gap-1.5 text-red-500 text-[10px] sm:text-xs font-bold ml-1 animate-fade-in">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
        <label htmlFor="subject" className="text-[12px] sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          Subject
        </label>
        <div className="relative">
          <select
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-hidden transition-all text-slate-900 dark:text-white font-medium appearance-none cursor-pointer text-sm sm:text-base"
          >
            <option>General Inquiry</option>
            <option>Feature Request</option>
            <option>Feedback / Suggestion</option>
            <option>Report Issue</option>
          </select>
          <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-slate-900 dark:text-white">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mb-8 sm:mb-10">
        <label htmlFor="message" className="text-[12px] sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="How can we help you create your world?"
          className={`w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-white/50 dark:bg-slate-900/50 border ${errors.message ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10'} outline-hidden transition-all text-slate-900 dark:text-white font-medium resize-none text-sm sm:text-base`}
        ></textarea>
        {errors.message && (
          <div className="flex items-center gap-1.5 text-red-500 text-[10px] sm:text-xs font-bold ml-1 animate-fade-in">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{errors.message}</span>
          </div>
        )}
      </div>

      <button
        disabled={status === "sending"}
        type="submit"
        className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none cursor-pointer text-sm sm:text-base"
      >
        <span>{status === "sending" ? "Sending..." : "Send Message"}</span>
        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </form>
  );
}
