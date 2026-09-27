import { useCart } from "@/contexts/CartContext";
import { canProceedToCheckout, getNextCartQuantity } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    loading,
    closeCart,
    updateQuantity,
    removeItem,
    openCheckout,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label="Fermer le panier"
        onClick={closeCart}
        className="absolute inset-0 cursor-default bg-[#141E33]/60 backdrop-blur-md transition-opacity"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className="absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-[#F6F1E7]/95 backdrop-blur-2xl border-l border-white/80 shadow-[0_25px_60px_-15px_rgba(20,30,51,0.35)] animate-drawer"
      >
        <div className="flex items-center justify-between border-b border-[#141E33]/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#BC3B2C]">Votre bibliothèque de travail</p>
            <h2 className="mt-1 font-display text-2xl text-[#141E33]">La sélection</h2>
          </div>
          <button
            type="button"
            data-pressable
            onClick={closeCart}
            className="glass-pill grid h-10 w-10 place-items-center rounded-full text-[#141E33] transition hover:bg-[#141E33] hover:text-[#F6F1E7]"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!cart?.items.length ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#E9DFCF] text-[#141E33] animate-float-gentle shadow-md">
              <ShoppingBag className="h-6 w-6 text-[#BC3B2C]" strokeWidth={1.4} />
            </span>
            <h3 className="mt-6 font-display text-3xl text-[#141E33]">Votre sélection est prête.</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#5C574C]">
              Ajoutez un titre pour nourrir votre prochaine stratégie, conversation d’équipe ou décision.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {cart.items.map(item => (
                <div key={item.lineId} className="flex gap-4">
                  <div className="h-24 w-[72px] shrink-0 overflow-hidden rounded-lg bg-[#E9DFCF] shadow-xs">
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.image.altText || item.productTitle} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-xl leading-tight text-[#141E33]">{item.productTitle}</h3>
                    {item.variantTitle !== "Default Title" && (
                      <p className="mt-1 text-xs text-[#5C574C]">{item.variantTitle}</p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-[#141E33]">{formatMoney(item.unitPrice)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-[#141E33]/15 px-1 py-1">
                        <button
                          type="button"
                          data-pressable
                          disabled={loading}
                          onClick={() => updateQuantity(item.lineId, getNextCartQuantity(item.quantity, -1))}
                          className="grid h-6 w-6 place-items-center rounded-full text-[#141E33] transition hover:bg-[#E9DFCF] disabled:opacity-40"
                          aria-label={`Retirer un exemplaire de ${item.productTitle}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#141E33]">{item.quantity}</span>
                        <button
                          type="button"
                          data-pressable
                          disabled={loading}
                          onClick={() => updateQuantity(item.lineId, getNextCartQuantity(item.quantity, 1))}
                          className="grid h-6 w-6 place-items-center rounded-full text-[#141E33] transition hover:bg-[#E9DFCF] disabled:opacity-40"
                          aria-label={`Ajouter un exemplaire de ${item.productTitle}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        data-pressable
                        disabled={loading}
                        onClick={() => removeItem(item.lineId)}
                        className="grid h-7 w-7 place-items-center text-[#5C574C] transition hover:text-[#BC3B2C] disabled:opacity-40"
                        aria-label={`Retirer ${item.productTitle} du panier`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cart?.items.length ? (
          <div className="border-t border-[#141E33]/10 px-6 py-5">
            <div className="mb-2 flex items-center justify-between text-xs text-[#5C574C]">
              <span>Livraison estimée</span>
              <span>7,00 DT (Paiement à la livraison)</span>
            </div>
            <div className="mb-5 flex items-center justify-between font-display text-xl text-[#141E33]">
              <span>Sous-total</span>
              <span className="text-[#BC3B2C]">{formatMoney(cart.subtotal)}</span>
            </div>
            <button
              type="button"
              disabled={loading || cart.itemCount === 0}
              onClick={openCheckout}
              className="btn-terracotta w-full rounded-full px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-md disabled:opacity-50"
            >
              Commander · Paiement à la livraison
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
