"use client";

import { useState } from "react";
import type { FormInputProps } from "@/types/components/auth";

export function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  showPasswordToggle = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] capitalize tracking-[0.1em] font-semibold text-slate-500 dark:text-slate-400 ml-1">
        {label}
        <span className="text-red-500/80">*</span>
      </label>
      <div className="relative group">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 backdrop-blur-xl border transition-all duration-300 font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
            error
              ? "border-red-400/50 dark:border-red-500/30 focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 dark:border-white/10 focus:border-primary/50 dark:focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
          } outline-none cursor-text`}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-primary/70 dark:hover:text-primary/70 transition-colors cursor-pointer"
            aria-label="Toggle password visibility"
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        )}
      </div>
      {error && (
        <span className="text-[11px] text-red-500 dark:text-red-400 font-bold flex items-center gap-1.5 ml-1 animate-fade-in">
          <span className="material-symbols-outlined text-sm leading-none">error</span>
          {error}
        </span>
      )}
    </div>
  );
}
