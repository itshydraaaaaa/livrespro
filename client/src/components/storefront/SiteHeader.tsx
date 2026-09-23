import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { LayoutDashboard, ShoppingBag, User } from "lucide-react";
import { Link } from "wouter";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[#172C41]/10 bg-[#F8F5EE]/95 backdrop-blur-md">
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Accueil de L’Atelier des Pages" className="shrink-0">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#44515B] lg:flex">
          <Link className="transition hover:text-[#B71922]" href="/librairie">La Librairie</Link>
          <a className="transition hover:text-[#B71922]" href="/#livre">Le livre phare</a>
          <a className="transition hover:text-[#B71922]" href="/#cas">Études de cas</a>
          <a className="transition hover:text-[#B71922]" href="/#educator">Offre Educator</a>
          <a className="transition hover:text-[#B71922]" href="/#lancement">Lancement</a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Login / Sign Up or Admin Dashboard Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="flex h-10 items-center gap-2 rounded-full bg-[#172C41] px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#F8F5EE] transition hover:bg-[#B71922]"
                  title="Accéder au Tableau de bord Administrateur"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              ) : (
                <span className="hidden text-xs font-semibold text-[#172C41] md:inline">
                  {user.name || user.email}
                </span>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-full border border-[#172C41]/20 bg-white/60 px-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#172C41] transition hover:bg-[#172C41] hover:text-[#F8F5EE]"
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
            className="relative flex h-10 items-center gap-2 rounded-full border border-[#172C41]/15 bg-white/40 px-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#172C41] transition hover:border-[#172C41] hover:bg-[#172C41] hover:text-[#F8F5EE]"
            aria-label={`Ouvrir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden md:inline">Panier</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#C94E36] px-1 text-[10px] text-white">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
