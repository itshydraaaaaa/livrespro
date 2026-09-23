import { Link } from "wouter";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#171717] text-[#F7F4EE]">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.25fr_.8fr_1fr] md:py-16">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            Une sélection éditoriale business conçue pour transformer les idées en décisions, puis les décisions en impact.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#DDA39B] transition hover:text-white underline underline-offset-4"
            >
              🔐 Espace Administration & Connexion
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#DDA39B]">
            Navigation & Rayons
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <Link href="/librairie" className="block hover:text-white">
              La Librairie en ligne
            </Link>
            <a href="/#livre" className="block hover:text-white">
              B2B Brand Management
            </a>
            <a href="/#cas" className="block hover:text-white">
              Études de cas réels
            </a>
            <a href="/#educator" className="block hover:text-white">
              Offre Enseignants & Formateurs
            </a>
            <Link href="/admin" className="block hover:text-white">
              Tableau de bord Back-Office
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#DDA39B]">
            Une marque de
          </p>
          <img
            src="/business-success-logo.png"
            alt="BUSINESS SUCCESS"
            className="mt-4 h-20 w-auto max-w-full object-contain object-left"
          />
          <p className="mt-3 text-xs leading-5 text-white/55">
            LivresPro.tn — L’Atelier des Pages est une marque de la société BUSINESS SUCCESS.
          </p>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-between gap-4 border-t border-white/10 py-5 text-[10px] font-bold uppercase tracking-[.14em] text-white/40 sm:flex-row">
        <span>© 2026 L’Atelier des Pages · Tous droits réservés.</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-white">
            Connexion
          </Link>
          <span>·</span>
          <Link href="/login" className="hover:text-white">
            Inscription
          </Link>
          <span>·</span>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
