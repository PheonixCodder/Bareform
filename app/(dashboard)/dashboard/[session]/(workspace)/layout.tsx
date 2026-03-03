import { Navbar } from "@/components/navbar";
import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { preloadedQueryResult } from "convex/nextjs";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const { profileName, entitlement } = await SubscriptionEntitlementQuery();
  if (!preloadedQueryResult(entitlement!)) {
    redirect(`/billing/${profileName}`);
  }
  return (
    <div className="grid grid-cols-1 min-h-screen">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
