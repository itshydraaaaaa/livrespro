import { ProductCard } from "@/components/storefront/ProductCard";
import { ProtectedBookTableOfContents } from "@/components/storefront/ProtectedBookTableOfContents";
import { trackBehavior } from "@/components/AnalyticsManager";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BookOpen, Check, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/livres/:handle");
  const handle = params?.handle ?? "";
  const { data: product, isLoading, isError } = trpc.commerce.products.byHandle.useQuery(
    { handle },
    { enabled: Boolean(handle) }
  );
  const { addItem, loading: cartLoading } = useCart();
  const { data: related = [] } = trpc.commerce.products.list.useQuery({ first: 4 });
  const publishedSectionsQuery = trpc.site?.content?.published?.useQuery ? trpc.site.content.published.useQuery() : { data: [] };
  const publishedSections = publishedSectionsQuery?.data;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const educatorSection = (publishedSections ?? []).find((s: any) => s.key === "educator-offer");
  const educatorOffer = useMemo(() => {
    let offer = {
      trigger: "B2B Brand Management — Tunisia Edition",
      discount: "50",
      audience: "Enseignants et Formateurs",
      companion: "Educator’s Guide & Case Study Companion — Tunisia Edition 2026",
      active: true,
    };
    if (educatorSection?.body) {
      try {
        const parsed = JSON.parse(educatorSection.body);
        if (parsed.trigger) offer.trigger = parsed.trigger;
        if (parsed.discount) offer.discount = parsed.discount;
        if (parsed.audience) offer.audience = parsed.audience;
        if (parsed.companion) offer.companion = parsed.companion;
        if (parsed.active !== undefined) offer.active = Boolean(parsed.active);
      } catch {}
    }
    return offer;
  }, [educatorSection]);

  useEffect(() => {
    if (product?.handle) trackBehavior({ eventType: "view_book", productHandle: product.handle });
  }, [product?.handle]);

  const onAddToCart = async () => {
    if (!product) return;
    try {
      await addItem({ product }, 1);
      trackBehavior({ eventType: "add_to_cart", productHandle: product.handle });
      toast.success("Ajouté à votre sélection professionnelle.");
    } catch {
      toast.error("Impossible d’ajouter ce titre pour le moment.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5EE]">
        <SiteHeader />
        <main role="status" aria-label="Chargement de la fiche livre" className="container grid gap-10 py-14 lg:grid-cols-2">
          <div className="aspect-[3/4] max-w-[520px] animate-pulse rounded-2xl bg-[#E9E2D7]" />
          <div className="animate-pulse pt-8">
            <div className="h-4 w-28 rounded-full bg-[#E9E2D7]" />
            <div className="mt-6 h-16 w-4/5 rounded-xl bg-[#E9E2D7]" />
            <div className="mt-10 h-4 w-full rounded-md bg-[#E9E2D7]" />
          </div>
        </main>
      </div>
    );
  }

  if (!product || isError) {
    return (
      <div className="min-h-screen bg-[#F8F5EE]">
        <SiteHeader />
        <main className="container grid min-h-[60vh] place-items-center py-16 text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E9E2D7] text-[#172C41]">
              <BookOpen className="h-7 w-7" />
            </span>
            <h1 className="mt-6 font-display text-4xl">Ce titre n’est plus au catalogue.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#52606B]">
              Nous n’avons pas retrouvé cette référence dans les rayons business actuels.
            </p>
            <Link
              href="/librairie"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#172C41] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#F8F5EE] shadow-md transition hover:bg-[#BC3B2C]"
            >
              Voir le catalogue <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const variant = product.variants[0];
  const galleryImages = product.images.length > 0 ? product.images : [{ url: product.coverImage || "/editorial/b2b-launch/book-angle.jpg", altText: product.title }];
  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];
  const otherBooks = related.filter((item) => item.handle !== product.handle).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />
      <main>
        <section className="container py-7 md:py-10">
          <Link
            href="/librairie"
            className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5C574C] transition hover:text-[#BC3B2C]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour au catalogue
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:gap-16 items-start">
            {/* INTERACTIVE GALLERY */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[460px] rounded-3xl bg-[#E9DFCF] p-4 sm:p-6 md:p-8 shadow-md">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#141E33]/10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage?.url}
                      src={currentImage?.url}
                      alt={currentImage?.altText || `Couverture de ${product.title}`}
                      fetchPriority="high"
                      decoding="async"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img.url + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-16 w-12 overflow-hidden rounded-lg border-2 transition-all duration-300 shadow-xs ${
                        activeImageIndex === idx
                          ? "border-[#BC3B2C] ring-2 ring-[#BC3B2C]/30 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-[#141E33]/20"
                      }`}
                      aria-label={`Afficher la vue ${idx + 1}`}
                    >
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT BUY BOX & CONTENT */}
            <div className="flex max-w-xl flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="eyebrow text-[#BC3B2C]">{product.productType || "Livre business"}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C574C]">• Édition Officielle</span>
              </div>
              <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,5.4rem)] leading-[0.93] sm:leading-[0.91] tracking-[-0.04em] text-[#141E33]">
                {product.title}
              </h1>
              {product.vendor ? <p className="mt-4 text-base font-semibold text-[#5C574C]">par {product.vendor}</p> : null}
              <div className="mt-6 flex items-baseline gap-3">
                <p className="font-display text-3xl sm:text-4xl text-[#BC3B2C]">{formatMoney(product.priceRange.min)}</p>
                <span className="text-xs font-semibold text-[#5C574C]">Paiement à la livraison inclus</span>
              </div>

              <div className="my-7 h-px bg-[#141E33]/10" />
              <div
                className="prose prose-sm max-w-none text-[#5C574C] prose-p:leading-7"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }}
              />

              {variant ? (
                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      disabled={!variant.availableForSale || cartLoading}
                      onClick={onAddToCart}
                      className="btn-terracotta inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-md disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {!variant.availableForSale ? "Indisponible" : cartLoading ? "Ajout en cours…" : "Ajouter à ma sélection"}
                    </button>
                    {Boolean(product.tableOfContentsPdf || product.handle.includes("b2b") || product.title.toLowerCase().includes("b2b brand")) && (
                      <a
                        href="#sommaire"
                        className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full border border-[#141E33]/20 bg-white/70 backdrop-blur-xs px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#141E33] hover:bg-white transition-all shadow-xs"
                      >
                        <BookOpen className="h-4 w-4 text-[#BC3B2C]" /> Consulter le sommaire
                      </a>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5C574C]">
                    <span className="flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-[#BC3B2C]" /> Livraison partout en Tunisie (24 gouvernorats)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#BC3B2C]" /> Règlement en espèces à réception (COD)
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* EDUCATOR OFFER CALLOUT */}
        {educatorSection && educatorSection.status === "published" && educatorOffer.active !== false && product.title.toLowerCase().includes("b2b brand") && (
          <section className="border-y border-[#BC3B2C]/20 bg-white py-14">
            <div className="container grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#BC3B2C]">Offre Educator</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-[#141E33]">Vous êtes {educatorOffer.audience.toLowerCase()} ?</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5C574C]">
                  À l’achat de <strong>{educatorOffer.trigger}</strong>, les {educatorOffer.audience.toLowerCase()} éligibles bénéficient de <strong>{educatorOffer.discount} % de remise</strong> sur la version numérique de l’<em>{educatorOffer.companion}</em>.
                </p>
                <Link href="/educators" className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#BC3B2C] pb-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#BC3B2C] hover:text-[#141E33] transition-colors">
                  Découvrir l’avantage Educator
                </Link>
              </div>
              <div className="rounded-xl border-l-4 border-[#BC3B2C] bg-[#E9DFCF]/50 p-7 shadow-xs">
                <p className="font-display text-6xl text-[#BC3B2C]">−{educatorOffer.discount}%</p>
                <p className="mt-3 text-xs leading-5 text-[#5C574C]">Version numérique · avec achat du livre + statut {educatorOffer.audience.toLowerCase()} éligible.</p>
              </div>
            </div>
          </section>
        )}

        {/* TABLE OF CONTENTS FOR THIS BOOK (DRM SECURE) */}
        {Boolean(product.tableOfContentsPdf || product.handle.includes("b2b") || product.title.toLowerCase().includes("b2b brand")) && (
          <section id="sommaire" className="container py-12 md:py-16 border-t border-[#141E33]/08 scroll-mt-20">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <span className="eyebrow text-[#BC3B2C]">Structure de l'ouvrage</span>
                <span className="glass-pill px-3 py-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border-emerald-200">
                  Lecteur Sécurisé Anti-Copie
                </span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl text-[#141E33]">
                Sommaire & Extraits Protégés
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#5C574C] max-w-2xl">
                Consultez le sommaire officiel et l'organisation détaillée de <em>{product.title}</em> en lecture sécurisée anti-copie (téléchargement et capture restreints).
              </p>
            </div>
            <ProtectedBookTableOfContents
              pdfUrl={product.tableOfContentsPdf || undefined}
              bookTitle={product.title}
            />
          </section>
        )}

        {otherBooks.length > 0 && (
          <section className="border-t border-[#141E33]/10 bg-white py-16 md:py-20">
            <div className="container">
              <p className="eyebrow text-[#BC3B2C]">Prolonger la réflexion</p>
              <h2 className="mt-3 font-display text-4xl text-[#141E33]">Dans le même sujet</h2>
              <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                {otherBooks.map((item, index) => <ProductCard product={item} index={index} key={item.id} />)}
              </div>
            </div>
          </section>
        )}

        {/* Floating Mobile Bottom Action Bar */}
        <AnimatePresence>
          {variant && variant.availableForSale && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-3 border-t border-white/80 bg-[#F6F1E7]/95 px-4 py-3 shadow-[0_-10px_25px_-5px_rgba(20,30,51,0.14)] backdrop-blur-xl sm:hidden pb-safe"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5C574C] truncate">{product.title}</p>
                <p className="font-display text-lg text-[#BC3B2C]">{formatMoney(product.priceRange.min)}</p>
              </div>
              <button
                type="button"
                disabled={cartLoading}
                onClick={onAddToCart}
                className="btn-terracotta flex shrink-0 items-center justify-center gap-2 rounded-full px-6 min-h-[44px] text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{cartLoading ? "Ajout…" : "Ajouter"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}
