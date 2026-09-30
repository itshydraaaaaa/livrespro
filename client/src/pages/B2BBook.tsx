import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { ProtectedBookTableOfContents } from "@/components/storefront/ProtectedBookTableOfContents";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Minus, Plus, Truck, GraduationCap, ArrowRight, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

const A = "/editorial/b2b-launch/";

const BOOK_PHOTOS = [
  { url: A + "book-angle.jpg", title: "Photo d'angle (Bureau)" },
  { url: A + "book-front.jpg", title: "Couverture officielle" },
  { url: A + "book-back.jpg", title: "Quatrième de couverture" },
  { url: A + "media.jpg", title: "Présentation média" },
];

export default function B2BBook() {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroParallax = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, 30]);

  const [qty, setQty] = useState(1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [educator, setEducator] = useState(false);
  const [done, setDone] = useState<string | number | null>(null);
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", deliveryAddress: "" });

  const { data: mainBook } = trpc.commerce.products.byHandle.useQuery({
    handle: "b2b-brand-management",
  });
  const { data: publishedSections } = trpc.site.content.published.useQuery();

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

  const order = trpc.site.orders.create.useMutation({
    onSuccess: (r: any) => {
      setDone(r.orderNumber || r.orderId);
      toast.success("Commande enregistrée");
    },
    onError: () => toast.error("Impossible d’enregistrer la commande."),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    order.mutate({
      ...f,
      quantity: qty,
      educator,
      productHandle: mainBook?.handle || "b2b-brand-management",
      productTitle: mainBook?.title || "B2B Brand Management — Tunisia Edition",
      unitPrice: mainBook?.priceRange?.min?.amount || "65.00",
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />
      <main>
        {/* HERO SECTION WITH AMBIENT GLOW & PARALLAX */}
        <section ref={heroRef} className="relative overflow-hidden border-b border-[#141E33]/08 bg-[#F6F1E7]">
          {/* Ambient Glowing Orbs */}
          <div className="ambient-mesh-glow -left-20 top-20 h-96 w-96 bg-[#BC3B2C]/10 pointer-events-none" />
          <div className="ambient-mesh-glow -right-20 top-40 h-[450px] w-[450px] bg-[#1E5FC2]/08 pointer-events-none" />

          <div className="container relative z-10 grid gap-12 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20 items-center">
            {/* Interactive Photo Showcase */}
            <motion.div style={{ y: heroParallax }} className="flex flex-col items-center">
              <div className="relative w-full max-w-[500px]">
                {/* Soft warm depth glow behind book */}
                <div className="absolute -inset-4 -z-10 rounded-full bg-[#BC3B2C]/10 blur-3xl pointer-events-none" />
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#141E33]/10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={BOOK_PHOTOS[activePhotoIndex].url}
                      src={BOOK_PHOTOS[activePhotoIndex].url}
                      alt={BOOK_PHOTOS[activePhotoIndex].title}
                      fetchPriority="high"
                      decoding="async"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </AnimatePresence>
                  <div className="glass-panel absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-[#141E33] shadow-md backdrop-blur-md bg-white/90">
                    <span className="h-2 w-2 rounded-full bg-[#BC3B2C] animate-pulse" />
                    <span>{BOOK_PHOTOS[activePhotoIndex].title}</span>
                  </div>
                </div>
              </div>

              {/* Photo Selector Thumbnails */}
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                {BOOK_PHOTOS.map((p, idx) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative h-16 w-14 overflow-hidden rounded-lg border-2 transition-all duration-300 shadow-xs ${
                      activePhotoIndex === idx
                        ? "border-[#BC3B2C] ring-2 ring-[#BC3B2C]/30 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-[#141E33]/20"
                    }`}
                    aria-label={p.title}
                  >
                    <img src={p.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Book Details and Action Area */}
            <div className="lg:pt-2">
              <div className="glass-panel inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#BC3B2C] animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-[.22em] text-[#BC3B2C]">
                  Tunisia Edition · Ouvrage de Référence
                </span>
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,5.5rem)] leading-[0.95] sm:leading-[0.9] tracking-[-0.04em] text-[#141E33]">
                B2B Brand Management
              </h1>

              <p className="mt-4 text-xl font-semibold text-[#141E33]">
                Philip Kotler · Waldemar Pfoertsch · Walid Kallel
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#5C574C]">
                Une édition tunisienne qui relie les fondamentaux internationaux du B2B Brand Management à des études de cas concrètes et à la réalité économique des organisations tunisiennes.
              </p>

              {/* Price & COD Highlight Card */}
              <div className="glass-panel mt-7 rounded-2xl p-6 shadow-md border border-white/80">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#5C574C]">Prix & Paiement</p>
                  <p className="font-display text-3xl text-[#BC3B2C]">
                    {mainBook?.priceRange?.min ? `${parseFloat(mainBook.priceRange.min.amount).toFixed(2).replace(".", ",")} DT` : "65,00 DT"}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#141E33]">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#BC3B2C]" /> Paiement à la livraison partout en Tunisie
                  </span>
                  <span className="flex items-center gap-2 text-[#5C574C]">
                    <ShieldCheck className="h-4 w-4 text-[#BC3B2C]" /> Aucun paiement en ligne requis
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <a
                  href="#commander"
                  className="btn-terracotta inline-flex w-full sm:w-auto justify-center items-center gap-3 rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.15em] text-white shadow-md"
                >
                  Commander le livre <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#sommaire"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full border border-[#141E33]/20 bg-white/70 backdrop-blur-xs px-6 py-4 text-[11px] font-extrabold uppercase tracking-[.15em] text-[#141E33] hover:bg-white transition-all shadow-xs"
                >
                  <BookOpen className="h-4 w-4 text-[#BC3B2C]" /> Consulter le sommaire
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#141E33]/10 bg-white py-16">
          <div className="container">
            <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
              Case Studies · Tunisia Edition
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-[#141E33]">
              Les entreprises au cœur des cas.
            </h2>
            <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
              {[
                { name: "BIAT", logo: "biat.png" },
                { name: "Wallyscar", logo: "wallyscar.png" },
                { name: "MSB", logo: "msb.png" },
                { name: "ARVEA", logo: "arvea.png" },
                { name: "Gourmandise", logo: "gourmandise.png" },
                { name: "MPBS", logo: "mpbs.png" },
                { name: "CHO Group", logo: "cho-group.png" },
              ].map((x) => (
                <div
                  className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border border-[#141E33]/10 bg-[#F6F1E7]/50 px-4 py-5 text-center transition-all hover:bg-white hover:shadow-sm"
                  key={x.name}
                >
                  <img
                    src={`/editorial/case-study-logos/${x.logo}`}
                    alt={`Logo ${x.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-full object-contain mix-blend-multiply"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#5C574C]">
                    {x.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {educatorSection && educatorSection.status === "published" && educatorOffer.active !== false && (
          <section className="container py-16">
            <div className="grid overflow-hidden rounded-2xl border border-[#BC3B2C]/20 bg-white shadow-lg lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#BC3B2C] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-white">
                  <GraduationCap className="h-4 w-4" /> Offre Educator
                </div>
                <h2 className="mt-5 font-display text-4xl text-[#141E33]">
                  Vous êtes {educatorOffer.audience.toLowerCase()} ?
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#5C574C]">
                  À l’achat de <strong>{educatorOffer.trigger}</strong>, les {educatorOffer.audience.toLowerCase()} éligibles bénéficient de <strong>{educatorOffer.discount} % de remise</strong> sur la version numérique de l’<em>{educatorOffer.companion}</em>.
                </p>
              </div>
              <div className="bg-[#141E33] p-10 text-white flex flex-col justify-center">
                <p className="font-display text-7xl text-[#E9DFCF]">−{educatorOffer.discount}%</p>
                <p className="mt-4 text-sm text-white/65">
                  Avantage professionnel conditionné à l’achat du livre et au statut {educatorOffer.audience.toLowerCase()}.
                </p>
              </div>
            </div>
          </section>
        )}

        <section id="sommaire" className="border-t border-[#141E33]/10 bg-white py-16">
          <div className="container">
            <div className="mb-8">
              <p className="eyebrow text-[#BC3B2C]">Structure de l'ouvrage</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#141E33]">
                Sommaire & Extraits Protégés
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#5C574C] max-w-2xl">
                Consultez le sommaire officiel et l’organisation pédagogique de <em>{mainBook?.title || "B2B Brand Management — Tunisia Edition"}</em> en lecture sécurisée anti-copie.
              </p>
            </div>
            <ProtectedBookTableOfContents
              pdfUrl={mainBook?.tableOfContentsPdf || undefined}
              bookTitle={mainBook?.title || "B2B Brand Management — Tunisia Edition"}
            />
          </div>
        </section>

        <section id="commander" className="border-t border-[#141E33]/10 bg-[#141E33] py-16 text-white">
          <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#E9DFCF]">
                Commande directe
              </p>
              <h2 className="mt-4 font-display text-5xl text-white">
                Commandez sur le site. Payez à la livraison.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/70">
                Votre commande est enregistrée directement par L’Atelier des Pages. Nous utilisons vos coordonnées pour la confirmation et la livraison.
              </p>
            </div>

            {done ? (
              <div className="rounded-2xl bg-white p-10 text-[#141E33] shadow-xl">
                <CheckCircle2 className="h-10 w-10 text-[#BC3B2C]" />
                <h3 className="mt-5 font-display text-4xl">Commande reçue.</h3>
                <p className="mt-3 text-sm text-[#5C574C]">
                  Référence #{done}. Nous disposons des informations nécessaires pour confirmer votre commande et organiser la livraison.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-2xl bg-white p-5 sm:p-7 md:p-9 text-[#141E33] shadow-xl">
                <div className="mb-7 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-[#141E33]/10 pb-5">
                  <div>
                    <p className="font-display text-2xl text-[#141E33]">{mainBook?.title || "B2B Brand Management"}</p>
                    <p className="text-xs text-[#5C574C]">
                      {mainBook?.priceRange?.min ? `${parseFloat(mainBook.priceRange.min.amount).toFixed(2).replace(".", ",")} DT` : "65,00 DT"} · Paiement à la livraison
                    </p>
                  </div>
                  <div className="flex items-center rounded-full border border-[#141E33]/15 px-1 py-1">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-[#141E33]">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-9 text-center font-bold text-[#141E33]">{qty}</span>
                    <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} className="p-2 text-[#141E33]">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Prénom" value={f.firstName} onChange={(v) => setF({ ...f, firstName: v })} />
                  <Field label="Nom" value={f.lastName} onChange={(v) => setF({ ...f, lastName: v })} />
                  <Field label="Adresse email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
                  <Field label="Téléphone" type="tel" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
                </div>

                <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-[#141E33]">
                  Adresse de livraison
                  <textarea
                    required
                    value={f.deliveryAddress}
                    onChange={(e) => setF({ ...f, deliveryAddress: e.target.value })}
                    className="mt-2 min-h-28 w-full rounded-xl border border-[#141E33]/15 bg-[#F6F1E7] p-3 text-sm font-normal outline-none focus:border-[#BC3B2C]"
                  />
                </label>

                <label className="mt-5 flex items-start gap-3 rounded-xl bg-[#F6F1E7] p-4 text-sm text-[#141E33]">
                  <input
                    type="checkbox"
                    checked={educator}
                    onChange={(e) => setEducator(e.target.checked)}
                    className="mt-1 accent-[#BC3B2C]"
                  />
                  <span>
                    <strong>Je suis {educatorOffer.audience.toLowerCase()}.</strong>
                    <br />
                    <span className="text-xs text-[#5C574C]">
                      Je souhaite bénéficier, après vérification de mon éligibilité et avec cet achat, de l’avantage Educator −{educatorOffer.discount}% sur le {educatorOffer.companion}.
                    </span>
                  </span>
                </label>

                <button
                  disabled={order.isPending}
                  className="btn-terracotta mt-6 w-full rounded-full py-4 text-xs font-extrabold uppercase tracking-[.15em] text-white shadow-md disabled:opacity-50"
                >
                  {order.isPending ? "Enregistrement…" : "Confirmer ma commande · Paiement à la livraison"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wide text-[#141E33]">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-[#141E33]/15 bg-[#F6F1E7] px-3 text-sm font-normal outline-none focus:border-[#BC3B2C]"
      />
    </label>
  );
}
