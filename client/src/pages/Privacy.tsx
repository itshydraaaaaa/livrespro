import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { ArrowLeft, CheckCircle2, Lock, Shield, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
            <Shield className="h-3.5 w-3.5" />
            Confidentialité & Données Personnelles
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-normal tracking-tight text-[#141E33]">
            Politique de Confidentialité
          </h1>
          <p className="text-sm md:text-base text-[#5C574C] max-w-2xl leading-relaxed">
            Dernière mise à jour : 27 septembre 2026. L'Atelier des Pages (marque de la société BUSINESS SUCCESS, Tunis, Tunisie) s’engage à protéger votre vie privée et vos données personnelles.
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
              Cadre Légal & Responsable du Traitement
            </h2>
            <p>
              Le présent traitement de données est opéré par <strong>BUSINESS SUCCESS</strong>, société éditrice de <strong>L'Atelier des Pages</strong> et de la plateforme <strong>LivresPro.tn</strong>, domiciliée à Tunis, République Tunisienne.
            </p>
            <p>
              Nos traitements respectent les dispositions de la <strong>Loi organique n° 2004-63 du 27 juillet 2004</strong> portant sur la protection des données à caractère personnel en Tunisie, sous le contrôle de l’Instance Nationale de Protection des Données Personnelles (INPDP).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                2
              </span>
              Données Collectées & Finalités
            </h2>
            <p>
              Dans le cadre de votre commande de livres ou de la création de votre compte lecteur, nous collectons exclusivement les données strictement indispensables :
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BC3B2C] mt-1" />
                <span><strong>Identité :</strong> Nom complet, prénom ou raison sociale professionnelle pour la facturation et le bordereau de livraison.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BC3B2C] mt-1" />
                <span><strong>Coordonnées :</strong> Numéro de téléphone tunisien (+216) pour la coordination de la livraison par le coursier, et adresse email pour l'envoi de la confirmation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BC3B2C] mt-1" />
                <span><strong>Adresse de livraison :</strong> Rue, ville, code postal et gouvernorat parmi les 24 gouvernorats tunisiens.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#BC3B2C] mt-1" />
                <span><strong>Aucune donnée bancaire :</strong> Toutes nos commandes sont réglées à la livraison (Cash on Delivery - COD). Nous ne demandons ni ne stockons aucun numéro de carte bancaire.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                3
              </span>
              Partage et Destinataires des Données
            </h2>
            <p>
              Vos données ne sont jamais vendues, cédées ou louées à des tiers à des fins publicitaires. Elles sont transmises uniquement :
            </p>
            <p>
              • Au <strong>transporteur / livreur partenaire</strong> en Tunisie pour l'acheminement physique de votre colis et le contact téléphonique préalable.<br />
              • Aux autorités judiciaires ou administratives tunisiennes si la législation en vigueur l'exige.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-6 md:p-8 backdrop-blur-md shadow-xs">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BC3B2C]/10 text-xs font-bold text-[#BC3B2C]">
                4
              </span>
              Mesure d’Audience & Cookies
            </h2>
            <p>
              Notre site propose un bandeau de consentement transparent. Lorsque vous acceptez la mesure d'audience, nous collectons des données strictement pseudonymisées (parcours de pages, volumes de commandes agrégés) afin d'améliorer la librairie.
            </p>
            <p>
              Si vous refusez, aucun cookie de suivi n'est déposé, sans dégradation de votre expérience de navigation ou d'achat.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 rounded-2xl border border-[#BC3B2C]/20 bg-[#BC3B2C]/5 p-6 md:p-8 backdrop-blur-md">
            <h2 className="font-display text-xl md:text-2xl text-[#141E33] flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-[#BC3B2C]" />
              Vos Droits & Suppression Immédiate du Compte
            </h2>
            <p>
              Conformément à la réglementation, vous bénéficiez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
            </p>
            <p>
              Vous pouvez à tout moment <strong>modifier vos informations ou supprimer définitivement votre compte</strong> en toute autonomie depuis votre{" "}
              <Link href="/mon-compte" className="font-semibold text-[#BC3B2C] underline underline-offset-4">
                Espace Lecteur
              </Link>
              , ou nous contacter par email à <strong>contact@business-success.tn</strong>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
