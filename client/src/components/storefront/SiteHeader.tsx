import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { LayoutDashboard, ShoppingBag, User } from "lucide-react";
import { Link } from "wouter";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const sections = ["livre", "decouvrir", "cas", "educator", "lancement"];
      const scrollPosition = window.scrollY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "glass-panel !rounded-none !border-x-0 !border-t-0 border-b border-white/80 shadow-[0_12px_36px_-6px_rgba(20,30,51,0.07)]"
          : "border-b border-[#141E33]/06 bg-[#F6F1E7]/90 backdrop-blur-xl"
      }`}
    >
      {/* Top Tunisia Delivery Strip */}
      <div className="border-b border-white/10 bg-[#141E33]/95 backdrop-blur-md px-4 py-1.5 text-center text-[10px] font-semibold tracking-wider text-[#F6F1E7]/90">
        <span className="flex items-center justify-center gap-2">
          <span>🇹🇳</span>
          <span>Livraison express COD sur les 24 gouvernorats de Tunisie · Paiement à la réception</span>
        </span>
      </div>

      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Accueil de L’Atelier des Pages" className="shrink-0 transition-transform duration-300 hover:scale-[1.01]">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5C574C] lg:flex">
          <Link
            className="relative py-1 transition-colors hover:text-[#BC3B2C] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#BC3B2C] after:transition-all after:duration-300 hover:after:w-full"
            href="/librairie"
          >
            La Librairie
          </Link>
          <a
            className={`relative py-1 transition-colors ${
              activeSection === "livre" ? "text-[#BC3B2C]" : "hover:text-[#BC3B2C]"
            } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
              activeSection === "livre" ? "after:w-full after:bg-[#BC3B2C]" : "after:w-0 hover:after:w-full after:bg-[#BC3B2C]"
            }`}
            href="/#livre"
          >
            Le livre phare
          </a>
          <a
            className={`relative py-1 transition-colors ${
              activeSection === "cas" ? "text-[#BC3B2C]" : "hover:text-[#BC3B2C]"
            } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
              activeSection === "cas" ? "after:w-full after:bg-[#BC3B2C]" : "after:w-0 hover:after:w-full after:bg-[#BC3B2C]"
            }`}
            href="/#cas"
          >
            Études de cas
          </a>
          <a
            className={`relative py-1 transition-colors ${
              activeSection === "educator" ? "text-[#BC3B2C]" : "hover:text-[#BC3B2C]"
            } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
              activeSection === "educator" ? "after:w-full after:bg-[#BC3B2C]" : "after:w-0 hover:after:w-full after:bg-[#BC3B2C]"
            }`}
            href="/#educator"
          >
            Offre Educator
          </a>
          <a
            className={`relative py-1 transition-colors ${
              activeSection === "lancement" ? "text-[#BC3B2C]" : "hover:text-[#BC3B2C]"
            } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
              activeSection === "lancement" ? "after:w-full after:bg-[#BC3B2C]" : "after:w-0 hover:after:w-full after:bg-[#BC3B2C]"
            }`}
            href="/#lancement"
          >
            Lancement
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Login / Sign Up or Mon Compte / Admin */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex h-10 items-center gap-2 rounded-full bg-[#141E33] px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#F6F1E7] shadow-xs transition hover:bg-[#BC3B2C]"
                  title="Accéder au Tableau de bord Administrateur"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/mon-compte"
                className="glass-pill flex h-10 items-center gap-2 rounded-full px-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#141E33] transition hover:bg-[#141E33] hover:text-[#F6F1E7]"
                title="Consulter mon profil et mes commandes"
              >
                <User className="h-3.5 w-3.5 text-[#BC3B2C]" />
                <span className="hidden sm:inline">
                  {user.name ? user.name.split(" ")[0] : "Mon Compte"}
                </span>
                <span className="sm:hidden">Compte</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="glass-pill flex h-10 items-center gap-2 rounded-full px-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#141E33] transition hover:bg-[#141E33] hover:text-[#F6F1E7]"
              title="Se connecter ou Créer un compte"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Connexion / Inscription</span>
              <span className="sm:hidden">Compte</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            type="button"
            data-pressable
            onClick={openCart}
            className="glass-pill relative flex h-10 items-center gap-2 rounded-full px-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#141E33] transition hover:border-[#141E33] hover:bg-[#141E33] hover:text-[#F6F1E7]"
            aria-label={`Ouvrir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden md:inline">Panier</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#BC3B2C] px-1 text-[10px] text-white font-bold shadow-xs">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
