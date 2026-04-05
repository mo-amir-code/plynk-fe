import { 
  FaInstagram, 
  FaFacebook, 
  FaYoutube, 
  FaXTwitter, 
  FaTiktok, 
  FaLinkedin, 
  FaGithub, 
  FaDribbble 
} from "react-icons/fa6";
import type { SocialPlatform } from "@/types/components/dashboard/widgets";

/** Renders the correct brand icon for each platform using FontAwesome 6 (react-icons/fa6).
 *  This provides modern, high-fidelity brand logos for all platforms.
 */
export function PlatformIcon({
  platform,
  className = "",
}: {
  platform: SocialPlatform;
  className?: string; // Tailwind text-size class
}) {
  const iconProps = { className };

  switch (platform) {
    case "instagram":
      return <FaInstagram {...iconProps} />;
    case "facebook":
      return <FaFacebook {...iconProps} />;
    case "youtube":
      return <FaYoutube {...iconProps} />;
    case "twitter":
      return <FaXTwitter {...iconProps} />;
    case "tiktok":
      return <FaTiktok {...iconProps} />;
    case "linkedin":
      return <FaLinkedin {...iconProps} />;
    case "github":
      return <FaGithub {...iconProps} />;
    case "dribbble":
      return <FaDribbble {...iconProps} />;
    default:
      return null;
  }
}
