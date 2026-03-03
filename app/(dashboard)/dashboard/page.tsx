import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { preloadedQueryResult } from "convex/nextjs";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { entitlement, profileName } = await SubscriptionEntitlementQuery();
  if (!profileName) {
    redirect("/login");
  }
  if (!preloadedQueryResult(entitlement)) {
    redirect(`/billing/${profileName}`);
  }
  redirect(`/dashboard/${profileName}`);
};

export default Dashboard;
