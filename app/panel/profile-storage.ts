export type PanelProfile = {
  fullName: string;
  photoDataUrl: string | null;
  updatedAt: string | null;
};

export const PANEL_PROFILE_STORAGE_KEY = "dadg.panel.profile";

export const emptyPanelProfile: PanelProfile = {
  fullName: "",
  photoDataUrl: null,
  updatedAt: null,
};

export function normalizeProfileName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function readPanelProfile(): PanelProfile {
  if (typeof window === "undefined") return emptyPanelProfile;

  const rawProfile = window.localStorage.getItem(PANEL_PROFILE_STORAGE_KEY);
  if (!rawProfile) return emptyPanelProfile;

  try {
    const parsedProfile = JSON.parse(rawProfile) as Partial<PanelProfile>;

    return {
      fullName: normalizeProfileName(parsedProfile.fullName ?? ""),
      photoDataUrl: parsedProfile.photoDataUrl ?? null,
      updatedAt: parsedProfile.updatedAt ?? null,
    };
  } catch {
    window.localStorage.removeItem(PANEL_PROFILE_STORAGE_KEY);
    return emptyPanelProfile;
  }
}

export function savePanelProfile(profile: PanelProfile) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    PANEL_PROFILE_STORAGE_KEY,
    JSON.stringify({
      fullName: normalizeProfileName(profile.fullName),
      photoDataUrl: profile.photoDataUrl,
      updatedAt: profile.updatedAt,
    })
  );
}

export function getProfileInitials(fullName: string) {
  const names = normalizeProfileName(fullName).split(" ").filter(Boolean);
  const initials = names.slice(0, 2).map((name) => name[0]?.toUpperCase()).join("");

  return initials || "DA";
}
