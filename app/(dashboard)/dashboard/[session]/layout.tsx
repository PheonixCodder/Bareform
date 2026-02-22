import { Navbar } from "@/components/navbar";
import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const { profileName, entitlement } = await SubscriptionEntitlementQuery();
  return (
    <div className="grid grid-cols-1 min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
