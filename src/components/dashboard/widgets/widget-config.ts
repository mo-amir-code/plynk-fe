import type { SocialPlatform, WidgetTypeConfig } from "@/types/components/dashboard/widgets";

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "youtube",
  "twitter",
  "tiktok",
  "linkedin",
  "github",
  "dribbble",
] as const;

export const WIDGET_TYPE_CONFIG: Record<SocialPlatform, WidgetTypeConfig> = {
  instagram: {
    label: "Instagram",
    hint: "Photos & reels",
    defaultHandle: "yourname",
    background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    url: (handle) => `https://instagram.com/${handle}`,
  },
  facebook: {
    label: "Facebook",
    hint: "Pages & profiles",
    defaultHandle: "yourname",
    background: "linear-gradient(135deg, #1877F2 0%, #0A58CA 100%)",
    url: (handle) => `https://facebook.com/${handle}`,
  },
  youtube: {
    label: "YouTube",
    hint: "Channels & videos",
    defaultHandle: "YourChannel",
    background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
    url: (handle) => `https://youtube.com/@${handle}`,
  },
  twitter: {
    label: "X / Twitter",
    hint: "Short updates",
    defaultHandle: "your_handle",
    background: "linear-gradient(135deg, #111111 0%, #000000 100%)",
    url: (handle) => `https://x.com/${handle}`,
  },
  tiktok: {
    label: "TikTok",
    hint: "Short clips",
    defaultHandle: "yourname",
    background: "linear-gradient(135deg, #111111 0%, #25F4EE 50%, #FE2C55 100%)",
    url: (handle) => `https://tiktok.com/@${handle}`,
  },
  linkedin: {
    label: "LinkedIn",
    hint: "Professional profile",
    defaultHandle: "yourname",
    background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
    url: (handle) => `https://linkedin.com/in/${handle}`,
  },
  github: {
    label: "GitHub",
    hint: "Projects & repos",
    defaultHandle: "yourname",
    background: "linear-gradient(135deg, #24292F 0%, #57606A 100%)",
    url: (handle) => `https://github.com/${handle}`,
  },
  dribbble: {
    label: "Dribbble",
    hint: "Design showcase",
    defaultHandle: "yourname",
    background: "linear-gradient(135deg, #EA4C89 0%, #C32361 100%)",
    url: (handle) => `https://dribbble.com/${handle}`,
  },
};
