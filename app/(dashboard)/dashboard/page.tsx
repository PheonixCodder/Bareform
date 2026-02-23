import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { entitlement, profileName } = await SubscriptionEntitlementQuery();
  if (!profileName) {
    redirect("/login");
  }
  if (!entitlement._valueJSON) {
    redirect(`/billing/${profileName}`);
  }
  redirect(`/dashboard/${profileName}`);
};

export default Dashboard;
