import { Link } from "wouter";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#10151F] text-[#F6F1E7]">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.25fr_.8fr_1fr] md:py-16">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            Une sélection éditoriale business conçue pour transformer les idées en décisions, puis les décisions en impact.
          </p>
          <div className="mt-6 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-[#E9DFCF] backdrop-blur-md w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Livraison COD sur toute la Tunisie</span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#BC3B2C]">
            Navigation & Rayons
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <Link href="/librairie" className="block transition-colors hover:text-white">
              La Librairie en ligne
            </Link>
            <a href="/#livre" className="block transition-colors hover:text-white">
              B2B Brand Management
            </a>
            <a href="/#cas" className="block transition-colors hover:text-white">
              Études de cas réels
            </a>
            <a href="/#educator" className="block transition-colors hover:text-white">
              Offre Enseignants & Formateurs
            </a>
            <Link href="/mon-compte" className="block transition-colors hover:text-white">
              Espace Lecteur & Commandes
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#BC3B2C]">
            Une marque de
          </p>
          <img
            src="/business-success-logo.png"
            alt="BUSINESS SUCCESS"
            className="mt-4 h-20 w-auto max-w-full object-contain object-left"
          />
          <p className="mt-3 text-xs leading-5 text-white/60">
            LivresPro.tn — L’Atelier des Pages est une marque de la société BUSINESS SUCCESS.
          </p>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-between gap-4 border-t border-white/10 py-5 text-[10px] font-bold uppercase tracking-[.14em] text-white/40 sm:flex-row">
        <div className="flex flex-wrap items-center gap-3">
          <span>© 2026 L’Atelier des Pages · Tous droits réservés.</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-white/60">
            <span>🇹🇳</span>
            <span>Tunisie (TND · Indicatif +216)</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="transition-colors hover:text-white">
            Connexion
          </Link>
          <span>·</span>
          <Link href="/login" className="transition-colors hover:text-white">
            Inscription
          </Link>
          <span>·</span>
          <Link href="/mon-compte" className="transition-colors hover:text-white">
            Mon Compte
          </Link>
        </div>
      </div>
    </footer>
  );
}
