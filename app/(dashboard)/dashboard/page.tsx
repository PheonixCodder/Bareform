import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const { entitlement, profileName } = await SubscriptionEntitlementQuery();
  if (!entitlement._valueJSON) {
    redirect(`/billing/${combinedSlug(profileName!)}`);
  }
  redirect(`/dashboard/${combinedSlug(profileName!)}`);
};

export default Dashboard;
