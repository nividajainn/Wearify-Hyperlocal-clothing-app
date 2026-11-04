import type { UserSignupEvent } from "@netlify/functions";

// Roles people may pick for themselves when they sign up. "admin" is never self-assignable.
const SELF_SERVICE_ROLES: Record<string, string> = {
  USER: "customer",
  SHOP: "shop",
  DELIVERY: "delivery",
};

export default {
  userSignup(event: UserSignupEvent) {
    const requested = String(event.user.userMetadata?.signup_role ?? "USER").toUpperCase();
    const role = SELF_SERVICE_ROLES[requested] ?? "customer";
    const existing = Array.isArray(event.user.appMetadata?.roles)
      ? (event.user.appMetadata?.roles as string[])
      : [];

    return {
      user: {
        ...event.user,
        appMetadata: {
          ...event.user.appMetadata,
          roles: Array.from(new Set([...existing, role])),
        },
      },
    };
  },
};
