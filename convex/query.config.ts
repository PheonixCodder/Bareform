import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "../convex/_generated/api";
import { ConvexUserRaw, normalizeProfile } from "../types/user";
import { Id } from "./_generated/dataModel";

export const ProfileQuery = async () => {
  return await preloadQuery(
    api.user.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
};
export const SubscriptionEntitlementQuery = async () => {
  const rawProfile = await ProfileQuery();
  const user = preloadedQueryResult(rawProfile);
  const profile = normalizeProfile(user as ConvexUserRaw | null);

  if (!profile) {
    return { entitlement: null, profileName: null };
  }
  const entitlement = await preloadQuery(
    api.subscription.hasEntitlement,
    {
      userId: profile.id as Id<"users">,
    },
    { token: await convexAuthNextjsToken() },
  );
  return { entitlement, profileName: profile?.name };
};
