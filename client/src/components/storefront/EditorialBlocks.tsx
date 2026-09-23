import { trpc } from "@/lib/trpc";
import { ArrowUpRight } from "lucide-react";

export function EditorialBlocks() {
  const { data: sections = [] } = trpc.site.content.published.useQuery();

  if (!sections.length) return null;

  return (
    <section className="border-t border-[#172C41]/10 bg-[#FCFAF5] py-16 md:py-24" aria-label="Contenus éditoriaux">
      <div className="container space-y-12">
        {sections.map((section, index) => (
          <article key={section.id} className="grid gap-8 border-b border-[#172C41]/10 pb-12 last:border-0 last:pb-0 lg:grid-cols-[0.4fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{section.eyebrow || `Édition ${String(index + 1).padStart(2, "0")}`}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#52606B]">Publié le {new Date(section.updatedAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              {section.imageUrl ? <img src={section.imageUrl} alt="" className="mb-7 max-h-[420px] w-full object-cover" /> : null}
              <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.92] tracking-[-0.04em]">{section.title}</h2>
              {section.body ? <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#52606B]">{section.body}</p> : null}
              {section.ctaLabel && section.ctaHref ? <a href={section.ctaHref} className="mt-7 inline-flex items-center gap-2 border-b border-[#172C41] pb-2 text-[11px] font-extrabold uppercase tracking-[0.15em] transition hover:border-[#C94E36] hover:text-[#C94E36]">{section.ctaLabel}<ArrowUpRight className="h-4 w-4" /></a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
