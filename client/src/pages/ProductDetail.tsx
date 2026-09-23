import { ProductCard } from "@/components/storefront/ProductCard";
import { trackBehavior } from "@/components/AnalyticsManager";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BookOpen, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
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
          <div className="aspect-[3/4] max-w-[520px] animate-pulse bg-[#E9E2D7]" />
          <div className="animate-pulse pt-8"><div className="h-4 w-28 bg-[#E9E2D7]" /><div className="mt-6 h-16 w-4/5 bg-[#E9E2D7]" /><div className="mt-10 h-4 w-full bg-[#E9E2D7]" /></div>
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
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E9E2D7] text-[#172C41]"><BookOpen className="h-7 w-7" /></span>
            <h1 className="mt-6 font-display text-4xl">Ce titre n’est plus au catalogue.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#52606B]">Nous n’avons pas retrouvé cette référence dans les rayons business actuels.</p>
            <Link href="/librairie" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#172C41] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#F8F5EE]">Voir le catalogue <ArrowLeft className="h-3.5 w-3.5 rotate-180" /></Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const variant = product.variants[0];
  const mainImage = product.images[0];
  const otherBooks = related.filter(item => item.handle !== product.handle).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#172C41]">
      <SiteHeader />
      <main>
        <section className="container py-7 md:py-10">
          <Link href="/librairie" className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#52606B] transition hover:text-[#C94E36]"><ArrowLeft className="h-3.5 w-3.5" /> Retour au catalogue</Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <div className="flex justify-center bg-[#E9E2D7] px-8 py-10 md:px-12">
              <div className="w-full max-w-[440px] overflow-hidden rounded-sm bg-[#D9CFBE] shadow-[18px_20px_0_rgba(23,44,65,0.12),0_28px_50px_-28px_rgba(23,44,65,0.75)]">
                {mainImage?.url ? <img src={mainImage.url} alt={mainImage.altText || `Couverture de ${product.title}`} className="w-full object-cover" /> : <div className="aspect-[3/4] grid place-items-center"><BookOpen className="h-12 w-12 text-[#172C41]/35" /></div>}
              </div>
            </div>
            <div className="flex max-w-xl flex-col justify-center">
              <p className="eyebrow">{product.productType || "Livre business"}</p>
              <h1 className="mt-4 font-display text-[clamp(3rem,5vw,5.4rem)] leading-[0.91] tracking-[-0.04em]">{product.title}</h1>
              {product.vendor ? <p className="mt-5 text-base font-semibold text-[#52606B]">par {product.vendor}</p> : null}
              <p className="mt-7 font-display text-3xl text-[#C94E36]">{formatMoney(product.priceRange.min)}</p>
              <div className="my-8 h-px bg-[#172C41]/12" />
              <div className="prose prose-sm max-w-none text-[#52606B] prose-p:leading-7" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }} />
              {variant ? (
                <div className="mt-8">
                  <button
                    type="button"
                    data-pressable
                    disabled={!variant.availableForSale || cartLoading}
                    onClick={onAddToCart}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#C94E36] px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-[#A93D2D] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {!variant.availableForSale ? "Indisponible" : cartLoading ? "Ajout en cours…" : "Ajouter à ma sélection"}
                  </button>
                  <p className="mt-4 flex items-center gap-2 text-xs text-[#52606B]"><Check className="h-4 w-4 text-[#C94E36]" /> Commande directe et paiement à la livraison (règlement en espèces à réception).</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {product.title.toLowerCase().includes("b2b brand") && (
          <section className="border-y border-[#B71922]/20 bg-[#FFFDFC] py-14">
            <div className="container grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#B71922]">Offre Educator</p><h2 className="mt-3 font-display text-4xl leading-tight text-[#171717]">Vous êtes enseignant ou formateur ?</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#52606B]">À l’achat de <strong>B2B Brand Management — Tunisia Edition</strong>, les enseignants et formateurs éligibles bénéficient de <strong>50 % de remise</strong> sur la version numérique de l’<em>Educator’s Guide & Case Study Companion — Tunisia Edition 2026</em>.</p><Link href="/educators" className="mt-6 inline-flex items-center gap-2 border-b border-[#B71922] pb-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#B71922]">Découvrir l’avantage Educator</Link></div>
              <div className="border-l-4 border-[#B71922] bg-[#F9E5E0] p-7"><p className="font-display text-6xl text-[#B71922]">−50%</p><p className="mt-3 text-xs leading-5 text-[#52606B]">Version numérique · avec achat du livre + statut enseignant/formateur éligible.</p></div>
            </div>
          </section>
        )}

        {otherBooks.length > 0 && (
          <section className="border-t border-[#172C41]/10 bg-[#FCFAF5] py-16 md:py-20">
            <div className="container">
              <p className="eyebrow">Prolonger la réflexion</p>
              <h2 className="mt-3 font-display text-4xl">Dans le même sujet</h2>
              <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                {otherBooks.map((item, index) => <ProductCard product={item} index={index} key={item.id} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
