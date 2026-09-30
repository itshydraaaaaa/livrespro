import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { trpc } from "@/lib/trpc";
import { BookOpen, Search, SlidersHorizontal, Sparkles, X, ArrowUpDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Shop() {
  const prefersReduced = useReducedMotion();
  const { data: products = [], isLoading, isError } = trpc.commerce.products.list.useQuery({ first: 24 });
  const [activeTag, setActiveTag] = useState("Tous les livres");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "title">("featured");

  const tags = useMemo(
    () =>
      Array.from(
        new Set([
          "Marketing & marque",
          "Management & leadership",
          "Stratégie & innovation",
          "Entrepreneuriat & croissance",
          "Travail & productivité",
          ...products.flatMap((product) => product.tags),
        ])
      ).slice(0, 7),
    [products]
  );

  const visibleProducts = useMemo(() => {
    let result = products;

    // Filter by tag
    if (activeTag !== "Tous les livres") {
      result = result.filter((product) => product.tags.includes(activeTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(q) ||
          (product.vendor || "").toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q)) ||
          product.description.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      const priceA = parseFloat(a.priceRange.min.amount) || 0;
      const priceB = parseFloat(b.priceRange.min.amount) || 0;
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "title") return a.title.localeCompare(b.title, "fr");
      return 0; // default order
    });
  }, [activeTag, products, searchQuery, sortBy]);

  const clearFilters = () => {
    setActiveTag("Tous les livres");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />
      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#141E33]/08 bg-[#E9DFCF]">
          <div className="ambient-mesh-glow -left-20 top-0 h-72 w-72 bg-[#BC3B2C]/08" />
          <div className="ambient-mesh-glow -right-20 top-10 h-72 w-72 bg-[#1E5FC2]/06" />
          <div className="container relative z-10 grid gap-8 py-14 lg:grid-cols-[1fr_0.62fr] lg:py-20">
            <div className="max-w-2xl animate-rise">
              <p className="eyebrow text-[#BC3B2C]">La librairie business</p>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,6.6rem)] leading-[0.92] sm:leading-[0.88] tracking-[-0.045em] text-[#141E33]">
                Lire juste.<br />
                <em className="font-normal text-[#BC3B2C]">Décider mieux.</em>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#5C574C]">
                Explorez les idées et méthodes qui font évoluer une marque, une équipe, une stratégie ou une entreprise.
              </p>
            </div>
            <div className="relative min-h-[200px] sm:min-h-[230px] overflow-hidden rounded-2xl bg-[#141E33] shadow-xl ring-1 ring-white/10">
              <img
                src="/editorial/b2b-launch/audience.jpg"
                alt="Une sélection de livres business, marketing et management"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#141E33]/30" />
              <p className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 max-w-[230px] font-display text-2xl sm:text-3xl leading-tight text-[#F6F1E7]">
                « Une bonne idée devient utile quand elle passe à l’action. »
              </p>
            </div>
          </div>
        </section>

        {/* CATALOG SECTION */}
        <section className="container py-12 md:py-16">
          <div className="flex flex-col justify-between gap-5 border-b border-[#141E33]/10 pb-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-[#BC3B2C]">Les rayons business</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-[-0.03em] text-[#141E33]">
                Les idées qui font avancer
              </h2>
            </div>

            {/* Live Counter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[240px] sm:min-w-[280px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C574C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, auteur…"
                  className="w-full h-11 pl-10 pr-9 rounded-full border border-[#141E33]/12 bg-white/80 backdrop-blur-md text-xs font-medium text-[#141E33] placeholder:text-[#5C574C]/70 shadow-xs outline-none transition focus:border-[#BC3B2C] focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 grid place-items-center rounded-full text-[#5C574C] hover:bg-[#141E33]/10 transition"
                    aria-label="Effacer la recherche"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="glass-pill flex items-center gap-2 rounded-full px-3.5 py-1.5 border border-white/80 shadow-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#BC3B2C]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[11px] font-bold text-[#141E33] uppercase tracking-wider outline-none cursor-pointer"
                  aria-label="Trier les livres"
                >
                  <option value="featured">Recommandés</option>
                  <option value="price-asc">Prix : croissant</option>
                  <option value="price-desc">Prix : décroissant</option>
                  <option value="title">Titre : A-Z</option>
                </select>
              </div>

              {/* Counter Badge */}
              <div className="glass-pill flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-[#5C574C] shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-[#BC3B2C]" />
                <span>
                  {products.length
                    ? `${visibleProducts.length} titre${visibleProducts.length > 1 ? "s" : ""}`
                    : "Catalogue en préparation"}
                </span>
              </div>
            </div>
          </div>

          {/* CATEGORY TAGS */}
          {tags.length > 0 && (
            <div className="glass-panel mt-6 flex overflow-x-auto no-scrollbar scroll-smooth flex-nowrap sm:flex-wrap gap-2 rounded-2xl p-2 sm:p-2.5 border border-white/80 shadow-xs">
              {["Tous les livres", ...tags].map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    data-pressable
                    onClick={() => setActiveTag(tag)}
                    className={`shrink-0 relative rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[10px] font-extrabold uppercase tracking-[0.14em] transition-all duration-300 ${
                      isActive ? "text-[#F6F1E7]" : "text-[#5C574C] hover:text-[#141E33]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeFilterPill"
                        className="absolute inset-0 rounded-full bg-[#141E33] shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tag}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* PRODUCT GRID / LOADING / EMPTY STATES */}
          {isLoading ? (
            <div role="status" aria-label="Chargement du catalogue" className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse flex flex-col">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#E9DFCF] via-[#F6F1E7] to-[#E9DFCF] shadow-sm" />
                  <div className="mt-4 h-3 w-20 rounded-full bg-[#E9DFCF]" />
                  <div className="mt-3 h-5 w-4/5 rounded bg-[#E9DFCF]" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-[#E9DFCF]" />
                </div>
              ))}
            </div>
          ) : visibleProducts.length ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTag}-${sortBy}-${searchQuery}`}
                initial={prefersReduced ? { opacity: 0 } : "hidden"}
                animate={prefersReduced ? { opacity: 1 } : "visible"}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                variants={containerVariants}
                className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
              >
                {visibleProducts.map((product, index) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 grid place-items-center rounded-3xl border border-dashed border-[#141E33]/20 bg-white/70 backdrop-blur-md p-12 text-center shadow-xs"
            >
              <div className="relative">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#E9DFCF] text-[#141E33] shadow-inner">
                  <BookOpen className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-[#BC3B2C] animate-pulse" />
              </div>
              <h3 className="mt-5 font-display text-3xl text-[#141E33]">Les rayons business prennent forme.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#5C574C]">
                {isError
                  ? "Le catalogue business n’est pas disponible pour le moment. Revenez bientôt explorer les premières sélections."
                  : searchQuery || activeTag !== "Tous les livres"
                  ? `Aucun livre ne correspond à vos critères actuels${searchQuery ? ` (« ${searchQuery} »)` : ""}. Essayez de réinitialiser la recherche.`
                  : "Les premiers titres de marketing, management et stratégie seront ajoutés ici. Chaque rayon est déjà prêt à les mettre en perspective."}
              </p>
              {(searchQuery || activeTag !== "Tous les livres") && !isError && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#141E33] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#BC3B2C]"
                >
                  <X className="h-3.5 w-3.5" /> Réinitialiser les filtres
                </button>
              )}
            </motion.div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
