import type React from "react";

export interface SocialWidgetProps {
  platform: string;
  icon: string | React.ReactNode;
  url?: string;
  containerClass?: string;
  overlayClass?: string;
  arrowClass?: string;
  iconContainerClass?: string;
  iconColorClass?: string;
  iconCustomStyle?: React.CSSProperties;
  textClass?: string;
}

export interface WideWidgetProps {
  title: string;
  icon: string | React.ReactNode;
  url?: string;
  containerClass?: string;
  overlayClass?: string;
  arrowClass?: string;
  iconContainerClass?: string;
  iconColorClass?: string;
  iconCustomStyle?: React.CSSProperties;
  textClass?: string;
}
