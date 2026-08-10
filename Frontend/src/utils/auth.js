// Stores/reads the logged-in user's info in sessionStorage.
// No JWT - the stored user object (specifically its "id") is what the
// frontend sends as the "x-user-id" header on requests that need to
// know who's logged in (see api.js and cart.js).
//
// Session behavior:
// - sessionStorage clears automatically when the tab/browser is closed.
// - As a safety net, the session also expires after SESSION_DURATION_MS
//   even if the tab is kept open (e.g. left idle overnight).

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours - adjust as needed
const STORAGE_KEY = "currentUser";

function normalizeUser(user) {
  if (!user || typeof user !== "object") return null;
  if (user.id) return user;
  if (user._id) {
    return {
      ...user,
      id: String(user._id),
    };
  }
  return user;
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session || !session.user || !session.loginTime) return null;

    const isExpired = Date.now() - session.loginTime > SESSION_DURATION_MS;
    if (isExpired) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return normalizeUser(session.user);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  const normalized = normalizeUser(user);
  if (!normalized) return;

  const session = {
    user: normalized,
    loginTime: Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}