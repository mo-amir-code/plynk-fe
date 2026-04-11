"use client";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { footerSocials, footerLinkGroups } from "@/data/site-data";
import { BRAND_NAME } from "@/config/app-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-12 sm:mt-24 pt-10">
      {/* The massive top-rounded card footer */}
      <div className="relative overflow-hidden rounded-t-[3rem] sm:rounded-t-[4rem] bg-orange-50/20 dark:bg-slate-900/40 pt-16 sm:pt-24 pb-10 border-t border-slate-200/50 dark:border-slate-800">
        
        {/* Soft Organic Mesh Gradient (Wishlink Style) */}
        <div className="absolute inset-0 pointer-events-none -z-10 opacity-80 dark:opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-full bg-amber-100/60 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten" />
          <div className="absolute top-[10%] left-[30%] w-[50%] h-[120%] bg-orange-200/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-full bg-rose-100/60 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12 sm:mb-16">
            {/* Brand Anchor (Left) */}
            <div className="col-span-1 md:col-span-4 lg:col-span-5">
              <Link href="/" className="flex items-center gap-2.5 mb-5 sm:mb-6 group cursor-pointer w-fit">
                <div className="size-10 sm:size-12 rounded-xl overflow-hidden">
                  <img src="/logo.svg" alt="plynk logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl sm:text-2xl font-bold tracking-[-0.03em] text-slate-900 dark:text-slate-100">plynk</span>
              </Link>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
                One Link. Everything you are.
              </p>
            </div>
            
            {/* Navigation & Socials (Right) */}
            <div className="col-span-1 md:col-span-8 lg:col-span-7 flex flex-wrap lg:justify-end gap-10 sm:gap-16">
              {footerLinkGroups.map((col) => (
                <div key={col.title} className="min-w-[120px]">
                  <h4 className="font-bold mb-4 sm:mb-6 text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">{col.title}</h4>
                  <ul className="flex flex-col gap-3 sm:gap-4 text-sm text-slate-600 dark:text-slate-400">
                    {col.links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          className="hover:text-primary dark:hover:text-primary transition-colors duration-200 relative group inline-block py-0.5" 
                          href={link.href}
                        >
                          {link.name}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {/* Social Icons mapped as a column */}
              <div className="min-w-[120px]">
                <h4 className="font-bold mb-4 sm:mb-6 text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">Social</h4>
                <div className="flex gap-3">
                  {footerSocials.map((icon) => (
                    <a key={icon.id} href={icon.href} target="_blank" rel="noopener noreferrer" className={`size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-sm group ${icon.color}`}>
                      {icon.id === 'instagram' ? (
                        <Instagram size={18} className="transition-colors duration-300 grayscale group-hover:grayscale-0" />
                      ) : (
                        <i className={`${icon.class} text-lg leading-none transition-colors duration-300 grayscale group-hover:grayscale-0`} />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 sm:pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col justify-center items-center gap-4 text-sm text-slate-500">
            <p className="text-xs text-slate-500 dark:text-slate-600 tracking-wide font-bold">
              Copyright © {currentYear} {BRAND_NAME}, All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
