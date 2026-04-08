"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in-up delay-150">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index}
            className={`glass rounded-2xl transition-all duration-300 overflow-hidden border ${
              isOpen 
                ? "border-primary/20 bg-white/60 dark:bg-slate-900/60 shadow-md" 
                : "border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20 hover:bg-white/40 dark:hover:bg-slate-800/40"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-5 sm:p-8 text-left focus:outline-hidden cursor-pointer"
            >
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 pr-4 sm:pr-8 leading-tight">
                {faq.question}
              </h3>
              <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-primary text-white rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] opacity-100 px-5 sm:px-8 pb-5 sm:pb-8" : "max-h-0 opacity-0 px-5 sm:px-8 pb-0"
              }`}
            >
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
