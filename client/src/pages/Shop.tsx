import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { trpc } from "@/lib/trpc";
import { BookOpen, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

export default function Shop() {
  const { data: products = [], isLoading, isError } = trpc.commerce.products.list.useQuery({ first: 24 });
  const [activeTag, setActiveTag] = useState("Tous les livres");
  const tags = useMemo(
    () => Array.from(new Set(["Marketing & marque", "Management & leadership", "Stratégie & innovation", "Entrepreneuriat & croissance", "Travail & productivité", ...products.flatMap(product => product.tags)])).slice(0, 7),
    [products]
  );
  const visibleProducts = useMemo(
    () => (activeTag === "Tous les livres" ? products : products.filter(product => product.tags.includes(activeTag))),
    [activeTag, products]
  );

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#172C41]">
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-[#172C41]/10 bg-[#E9E2D7]">
          <div className="container grid gap-8 py-14 lg:grid-cols-[1fr_0.62fr] lg:py-20">
            <div className="max-w-2xl animate-rise">
              <p className="eyebrow">La librairie business</p>
              <h1 className="mt-4 font-display text-[clamp(3.1rem,7vw,6.6rem)] leading-[0.88] tracking-[-0.045em]">
                Lire juste.<br />
                <em className="font-normal text-[#C94E36]">Décider mieux.</em>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#52606B]">
                Explorez les idées et méthodes qui font évoluer une marque, une équipe, une stratégie ou une entreprise.
              </p>
            </div>
            <div className="relative min-h-[230px] overflow-hidden rounded-[2px] bg-[#172C41]">
              <img
                src="/editorial/b2b-launch/audience.jpg"
                alt="Une sélection de livres business, marketing et management"
                className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-[#172C41]/25" />
              <p className="absolute bottom-7 left-7 max-w-[230px] font-display text-3xl leading-tight text-[#F8F5EE]">
                « Une bonne idée devient utile quand elle passe à l’action. »
              </p>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="flex flex-col justify-between gap-5 border-b border-[#172C41]/12 pb-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Les rayons business</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.03em]">Les idées qui font avancer</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#52606B]">
              <SlidersHorizontal className="h-4 w-4 text-[#C94E36]" />
              {products.length ? `${visibleProducts.length} titre${visibleProducts.length > 1 ? "s" : ""}` : "Catalogue en préparation"}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {["Tous les livres", ...tags].map(tag => (
                <button
                  key={tag}
                  type="button"
                  data-pressable
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] transition ${
                    activeTag === tag
                      ? "border-[#172C41] bg-[#172C41] text-[#F8F5EE]"
                      : "border-[#172C41]/15 text-[#52606B] hover:border-[#172C41]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div role="status" aria-label="Chargement du catalogue" className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#E9E2D7]" />
                  <div className="mt-4 h-3 w-20 bg-[#E9E2D7]" />
                  <div className="mt-3 h-6 w-4/5 bg-[#E9E2D7]" />
                </div>
              ))}
            </div>
          ) : visibleProducts.length ? (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard product={product} index={index} key={product.id} />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid place-items-center border border-dashed border-[#172C41]/20 bg-[#FCFAF5] px-6 py-20 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#E9E2D7] text-[#172C41]">
                <BookOpen className="h-6 w-6" strokeWidth={1.4} />
              </span>
              <h3 className="mt-5 font-display text-3xl">Les rayons business prennent forme.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#52606B]">
                {isError
                  ? "Le catalogue business n’est pas disponible pour le moment. Revenez bientôt explorer les premières sélections."
                  : "Les premiers titres de marketing, management et stratégie seront ajoutés ici. Chaque rayon est déjà prêt à les mettre en perspective."}
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
