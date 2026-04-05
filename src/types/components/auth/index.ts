import type React from "react";

export interface AuthLayoutProps {
  children: React.ReactNode;
  showBlobLeft?: boolean;
  showBlobRight?: boolean;
}

export interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: string;
  showPasswordToggle?: boolean;
}
