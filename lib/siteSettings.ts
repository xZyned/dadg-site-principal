import "server-only";
import { unstable_cache } from "next/cache";
import { fetchBackend, readBackendJson } from "@/lib/backend";

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const response = await fetchBackend("/api/v1/settings", { cache: "no-store" });
      if (!response.ok) return { blogEnabled: false };

      const data = await readBackendJson(response);
      return {
        blogEnabled: typeof data.blogEnabled === "boolean" ? data.blogEnabled : false,
      };
    } catch {
      return { blogEnabled: false };
    }
  },
  ["site-settings"],
  { revalidate: 60 },
);
