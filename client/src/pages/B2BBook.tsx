import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Minus, Plus, Truck, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const A = "/editorial/b2b-launch/";

export default function B2BBook() {
  const [qty, setQty] = useState(1);
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
        <section className="container grid gap-12 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-18">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 overflow-hidden rounded-xl shadow-2xl">
              <img
                src={A + "book-angle.jpg"}
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                alt="B2B Brand Management angle"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-sm">
              <img src={A + "book-front.jpg"} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" alt="B2B Brand Management front" />
            </div>
            <div className="overflow-hidden rounded-lg shadow-sm">
              <img src={A + "book-back.jpg"} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" alt="B2B Brand Management back" />
            </div>
            <div className="overflow-hidden rounded-lg shadow-sm">
              <img src={A + "media.jpg"} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" alt="B2B Brand Management media" />
            </div>
          </div>

          <div className="lg:pt-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
              Tunisia Edition
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,6.5rem)] leading-[.92] sm:leading-[.88] tracking-[-.05em] text-[#141E33]">
              B2B Brand Management
            </h1>
            <p className="mt-5 text-lg font-semibold text-[#141E33]">
              Philip Kotler · Waldemar Pfoertsch · Walid Kallel
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#5C574C]">
              Une édition tunisienne qui relie les fondamentaux internationaux du B2B Brand Management à des études de cas et à la réalité des organisations tunisiennes.
            </p>
            <div className="mt-8 rounded-xl border border-[#141E33]/10 bg-white p-6 shadow-xs">
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#5C574C]">Prix & Paiement</p>
                <p className="font-display text-2xl text-[#BC3B2C]">
                  {mainBook?.priceRange?.min ? `${parseFloat(mainBook.priceRange.min.amount).toFixed(2).replace(".", ",")} DT` : "65,00 DT"}
                </p>
              </div>
              <p className="mt-2 flex items-center gap-2 font-semibold text-[#141E33]">
                <Truck className="h-5 w-5 text-[#BC3B2C]" /> Paiement à la livraison
              </p>
              <p className="mt-2 text-xs text-[#5C574C]">
                Aucun paiement en ligne. Vos coordonnées servent à confirmer et livrer votre commande.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <a
                href="#commander"
                className="btn-terracotta inline-flex w-full sm:w-auto justify-center items-center gap-3 rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.15em] text-white shadow-md"
              >
                Commander le livre <ArrowRight className="h-4 w-4" />
              </a>
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
