import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { LayoutDashboard, Menu, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[#172C41]/10 bg-[#F8F5EE]/95 backdrop-blur-md">
      <div className="container flex h-[72px] items-center justify-between gap-5">
        <Link href="/" aria-label="Accueil de L’Atelier des Pages" className="shrink-0">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-7 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#44515B] md:flex">
          <Link className="transition hover:text-[#B71922]" href="/librairie">La Librairie</Link>
          <a className="transition hover:text-[#B71922]" href="/#livre">Le livre</a>
          <a className="transition hover:text-[#B71922]" href="/#cas">Études de cas</a>
          <a className="transition hover:text-[#B71922]" href="/#educator">Pour les enseignants</a>
          <a className="transition hover:text-[#B71922]" href="/#lancement">Le lancement</a>
        </nav>
        <div className="flex items-center gap-2">
          {user?.role === "admin" ? <Link href="/admin" aria-label="Ouvrir le back-office" className="hidden h-10 w-10 place-items-center rounded-full border border-[#172C41]/15 text-[#172C41] transition hover:border-[#172C41] hover:bg-[#172C41] hover:text-[#F8F5EE] md:grid"><LayoutDashboard className="h-4 w-4" /></Link> : null}
          <Link
            href="/livres/b2b-brand-management"
            aria-label="Voir le livre"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#172C41]/15 text-[#172C41] transition hover:border-[#172C41] hover:bg-[#172C41] hover:text-[#F8F5EE] md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Link>
          <button
            type="button"
            data-pressable
            onClick={openCart}
            className="relative flex h-10 items-center gap-2 rounded-full border border-[#172C41]/15 px-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#172C41] transition hover:border-[#172C41] hover:bg-[#172C41] hover:text-[#F8F5EE]"
            aria-label={`Ouvrir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Panier</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#C94E36] px-1 text-[10px] text-white">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
