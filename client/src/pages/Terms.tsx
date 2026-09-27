import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, Truck } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#BC3B2C] antialiased">
      <SiteHeader />

      <main className="container max-w-4xl py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#BC3B2C] hover:underline mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à l'accueil
        </Link>

        {/* Page Header */}
        <div className="space-y-4 border-b border-[#141E33]/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#141E33]/15 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#BC3B2C] shadow-xs backdrop-blur-md">
            <FileText className="h-3.5 w-3.5" />
            Cadre Contractuel & Commercial
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-normal tracking-tight text-[#141E33]">
            Conditions Générales de Vente & d’Utilisation
          </h1>
          <p className="text-sm md:text-base text-[#5C574C] max-w-2xl leading-relaxed">
            Dernière mise à jour : 27 septembre 2026. Les présentes conditions régissent l'achat d'ouvrages et l'utilisation de la plateforme LivresPro.tn éditée par BUSINESS SUCCESS (Tunis, Tunisie).
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-10 text-sm md:text-base leading-relaxed text-[#5C574C]">
          {/* Section 1 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                1
              </span>
              Mentions Légales & Éditeur
            </h2>
            <p>
              Le site <strong>LivresPro.tn</strong> et la marque <strong>L’Atelier des Pages</strong> sont édités et exploités par la société <strong>BUSINESS SUCCESS</strong>, société de conseil et d'édition de droit tunisien, sise à Tunis, Tunisie.
            </p>
            <p>
              Contact service client et commandes : <strong>contact@business-success.tn</strong> · Téléphone commercial Tunisie : <strong>(+216) 24 555 777</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                2
              </span>
              Processus de Commande & Confirmation
            </h2>
            <p>
              Le client passe commande directement sur le site en sélectionnant les ouvrages et en renseignant son formulaire de coordonnées (nom, numéro de téléphone tunisien, adresse précise et gouvernorat).
            </p>
            <p>
              Dès validation de la commande :
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BC3B2C] mt-1" />
                <span>La commande est instantanément enregistrée dans notre système avec un numéro de référence unique.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BC3B2C] mt-1" />
                <span>Notre équipe logistique ou le service d'expédition prend contact par téléphone ou WhatsApp si des précisions d'adresse sont requises.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                3
              </span>
              Prix & Modalités de Paiement (Paiement à la Livraison)
            </h2>
            <p>
              Les prix des livres sont indiqués en <strong>Dinars Tunisiens (TND)</strong> toutes taxes comprises (TTC). Les frais de livraison sont calculés ou offerts selon les conditions promotionnelles en vigueur.
            </p>
            <p>
              <strong>Paiement à la livraison (Cash on Delivery - COD) :</strong> Le règlement s'effectue en espèces directement auprès du livreur au moment de la remise en main propre de votre colis. Aucun prépaiement par carte bancaire n'est requis.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <Truck className="h-5 w-5 text-[#BC3B2C]" />
              Livraison sur l'Ensemble de la Tunisie
            </h2>
            <p>
              Les livraisons sont assurées sur l'intégralité du territoire tunisien (les 24 gouvernorats : Grand Tunis, Nabeul, Sousse, Sfax, Bizerte, Kairouan, Monastir, Mahdia, Gabès, Médenine, etc.).
            </p>
            <p>
              Le délai d'acheminement habituel est de <strong>24 à 48 heures ouvrables</strong> pour le Grand Tunis et les grandes métropoles, et de <strong>48 à 72 heures</strong> pour les autres gouvernorats.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                5
              </span>
              Conformité, Échange & Retours
            </h2>
            <p>
              Chaque exemplaire expédié est soigneusement inspecté et conditionné. Si un ouvrage présente un défaut d'impression, une reliure défectueuse ou une détérioration survenue durant le transport, BUSINESS SUCCESS procède à son échange sans frais supplémentaires dans un délai de 7 jours suivant la réception.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-[#BC3B2C]" />
              Propriété Intellectuelle & Droits d'Auteur
            </h2>
            <p>
              Les contenus textuels, graphiques, marques, logos et ouvrages commercialisés (notamment <em>B2B Brand Management — Tunisia Edition</em>) sont protégés par la législation tunisienne et internationale relative aux droits d'auteur et à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, distribution ou numérisation non autorisée d'un ouvrage ou de son contenu est formellement interdite.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                7
              </span>
              Droit Applicable & Juridiction
            </h2>
            <p>
              Les présentes conditions sont soumises à la législation de la République Tunisienne. En cas de contestation ou de litige non résolu à l'amiable, les tribunaux compétents de Tunis sont seuls habilités à trancher le différend.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
