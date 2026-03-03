import {
  fetchMutation,
  preloadedQueryResult,
  preloadQuery,
} from "convex/nextjs";
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

export const ProjectsQuery = async () => {
  const rawProfile = await ProfileQuery();
  const user = preloadedQueryResult(rawProfile);
  const profile = normalizeProfile(user as ConvexUserRaw | null);

  if (!profile?.id) {
    return { projects: null, profile: null };
  }

  const projects = await preloadQuery(
    api.projects.getUserProjects,
    {
      userId: profile.id as Id<"users">,
    },
    { token: await convexAuthNextjsToken() },
  );

  return {
    projects,
    profile,
  };
};

export const ProjectQuery = async (projectId: string) => {
  const rawProfile = await ProfileQuery();
  const user = preloadedQueryResult(rawProfile);
  const profile = normalizeProfile(user as ConvexUserRaw | null);

  if (!profile?.id || !projectId) {
    return { project: null, profile: null };
  }

  const project = await preloadQuery(
    api.projects.getProject,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  );

  return { project, profile };
};

export const StyleGuideQuery = async (projectId: string) => {
  const styleGuide = await preloadQuery(
    api.projects.getProjectStyleGuide,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  );

  return { styleGuide };
};

export const MoodBoardImagesQuery = async (projectId: string) => {
  const images = await preloadQuery(
    api.moodboard.getMoodBoardImages,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  );

  return { images };
};

export const CreditsBalanceQuery = async () => {
  const rawProfile = await ProfileQuery();
  const user = preloadedQueryResult(rawProfile);
  const profile = normalizeProfile(user as ConvexUserRaw | null);

  if (!profile?.id) {
    return { ok: false, balance: 0, profile: null };
  }

  const balance = await preloadQuery(
    api.subscription.getCreditsBalance,
    { userId: profile.id as Id<"users"> },
    { token: await convexAuthNextjsToken() },
  );

  return { ok: true, balance: preloadedQueryResult(balance), profile };
};

export const ConsumeCreditsQuery = async ({ amount }: { amount?: number }) => {
  const rawProfile = await ProfileQuery();
  const user = preloadedQueryResult(rawProfile);
  const profile = normalizeProfile(user as ConvexUserRaw | null);

  if (!profile?.id) {
    return { ok: false, balance: 0, profile: null };
  }

  const normalizedAmount = amount ?? 1;
  if (!Number.isInteger(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const credits = await fetchMutation(
    api.subscription.consumeCredits,
    {
      reason: "ai:generation",
      userId: profile.id as Id<"users">,
      amount: normalizedAmount,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  );

  return { ok: credits.ok, balance: credits.balance, profile };
};

export const InspirationImagesQuery = async (projectId: string) => {
  const images = await preloadQuery(
    api.inspiration.getInspirationImages,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  );

  return { images };
};
