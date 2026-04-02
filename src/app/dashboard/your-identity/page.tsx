import { Metadata } from "next";
import { YourIdentityClient } from "@/components/dashboard/your-identity/YourIdentityClient";
import { BRAND_NAME } from "@/config/app-config";

export const metadata: Metadata = {
  title: `Your Identity | ${BRAND_NAME}`,
  description: `Manage your social widgets and identity on ${BRAND_NAME}`,
};

export default function YourIdentityPage() {
  return <YourIdentityClient />;
}
