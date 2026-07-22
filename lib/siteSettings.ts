import "server-only";
import { unstable_cache } from "next/cache";
import { fetchBackend, readBackendJson } from "@/lib/backend";

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const response = await fetchBackend("/api/v1/settings", { cache: "no-store" });
      if (!response.ok) return { blogEnabled: true };

      const data = await readBackendJson(response);
      return {
        blogEnabled: typeof data.blogEnabled === "boolean" ? data.blogEnabled : true,
      };
    } catch {
      return { blogEnabled: true };
    }
  },
  ["site-settings"],
  { revalidate: 60 },
);
