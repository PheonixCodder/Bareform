import { combinedSlug } from "../lib/utils";

export type ConvexUserRaw = {
  _creationTime: number;
  _id: string;
  email: string;
  emailVerificationTime?: number;
  image?: string;
  name?: string;
};

export type Profile = {
  id: string;
  createdAtMs: number;
  email: string;
  emailVerifiedAtMs?: number;
  image?: string;
  name?: string;
};

export const normalizeProfile = (
  user: ConvexUserRaw | null,
): Profile | null => {
  if (!user) return null;

  const ExtractNameFromEmail = (email: string) => {
    const username = email.split("@")[0];
    return username
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  const name = combinedSlug(user.name!) || ExtractNameFromEmail(user.email);
  return {
    id: user._id,
    createdAtMs: user._creationTime,
    email: user.email,
    emailVerifiedAtMs: user.emailVerificationTime,
    image: user.image,
    name,
  };
};
