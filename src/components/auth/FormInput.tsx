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
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-0 bottom-0 flex items-center justify-center pointer-events-none text-slate-400 dark:text-slate-700 group-focus-within:text-primary transition-colors z-10">
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 ${
            icon ? "pl-11" : ""
          } py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 backdrop-blur-xl border transition-all duration-300 font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
            error
              ? "border-red-400/50 dark:border-red-500/30 focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 dark:border-white/20 focus:border-primary/50 dark:focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_25px_-5px_rgba(var(--primary-rgb),0.2)]"
          } outline-none`}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-0 bottom-0 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            aria-label="Toggle password visibility"
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">error</span>
          {error}
        </span>
      )}
    </div>
  );
}
