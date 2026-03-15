import { Metadata } from "next";
import { YourIdentityClient } from "@/components/dashboard/your-identity/YourIdentityClient";

export const metadata: Metadata = {
  title: "Your Identity | Moku",
  description: "Manage your social widgets and identity on Moku",
};

export default function YourIdentityPage() {
  return <YourIdentityClient />;
}
