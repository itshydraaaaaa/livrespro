import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";

function setMeta(name: string, content?: string | null, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("meta");
    if (property) tag.setAttribute("property", name);
    else tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function SeoManager() {
  const [location] = useLocation();
  const { data } = trpc.site.seo.byPath.useQuery({ path: location });

  useEffect(() => {
    if (!data) return;
    document.title = data.title;
    setMeta("description", data.description);
    setMeta("robots", data.robots);
    setMeta("og:title", data.ogTitle || data.title, true);
    setMeta("og:description", data.ogDescription || data.description, true);

    const previous = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (data.canonicalUrl) {
      const canonical = previous ?? document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = data.canonicalUrl;
      if (!previous) document.head.appendChild(canonical);
    } else {
      previous?.remove();
    }
  }, [data]);

  return null;
}
