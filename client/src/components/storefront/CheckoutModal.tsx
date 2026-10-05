import { useEffect, useState } from "react";
import { trackBehavior } from "@/components/AnalyticsManager";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, clearCart } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("Tunis");
  const [postalCode, setPostalCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isEducator, setIsEducator] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [createdOrder, setCreatedOrder] = useState<{
    orderId: number;
    orderNumber: string;
  } | null>(null);

  const { data: tunisia } = trpc.site.tunisia.useQuery();

  const shippingCost = "7.00";
  const subtotalNum = cart?.items.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice.amount) || 0) * item.quantity;
  }, 0) ?? 0;
  const totalNum = subtotalNum + parseFloat(shippingCost);

  useEffect(() => {
    if (isCheckoutOpen && cart?.items?.length) {
      trackBehavior({
        eventType: "initiate_checkout",
        value: totalNum,
        currency: "TND",
        numItems: cart.itemCount ?? 1,
        contentIds: cart.items.map((i) => i.productHandle),
        contents: cart.items.map((i) => ({
          id: i.productHandle,
          quantity: i.quantity,
          item_price: parseFloat(i.unitPrice.amount) || 0,
        })),
      });
    }
  }, [isCheckoutOpen]);

  const createOrderMutation = trpc.site.orders.create.useMutation({
    onSuccess: (data) => {
      setCreatedOrder(data);
      if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Purchase", {
          currency: "TND",
          value: totalNum,
          content_type: "product",
          content_ids: cart?.items.map((item) => item.productHandle) || [],
          contents: cart?.items.map((item) => ({
            id: item.productHandle,
            quantity: item.quantity,
            item_price: parseFloat(item.unitPrice.amount) || 0,
          })) || [],
          num_items: cart?.itemCount ?? 1,
          order_id: data.orderNumber || data.orderId,
        });
      }
      clearCart();
      toast.success("Votre commande a été enregistrée avec succès !");
    },
    onError: (err) => {
      toast.error(err.message || "Impossible d’enregistrer votre commande. Veuillez réessayer.");
    },
  });

  if (!isCheckoutOpen) return null;

  const digitsOnly = phone.replace(/\D/g, "");
  const nationalDigits = digitsOnly.startsWith("216") && digitsOnly.length === 11 ? digitsOnly.slice(3) : digitsOnly;
  const isPhoneValid = nationalDigits.length === 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      clearCart();
      closeCheckout();
      return;
    }

    if (!cart?.items.length) {
      toast.error("Votre sélection est vide.");
      return;
    }

    if (!isPhoneValid) {
      toast.error("Veuillez saisir un numéro de téléphone tunisien valide à 8 chiffres.");
      return;
    }

    createOrderMutation.mutate({
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: email,
      customerPhone: phone.startsWith("+216") ? phone : `+216 ${phone.trim()}`,
      deliveryAddress,
      city,
      governorate,
      postalCode: postalCode.trim() || null,
      orderNotes,
      isEducator,
      shippingCost,
      items: cart.items.map((item) => ({
        productSlug: item.productHandle,
        productTitle: item.productTitle,
        format: item.variantTitle || "Livre physique",
        unitPrice: item.unitPrice.amount,
        quantity: item.quantity,
      })),
    });
  };

  const handleClose = () => {
    setCreatedOrder(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-[#141E33]/70 backdrop-blur-md"
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl border border-white/80 bg-[#F6F1E7]/95 backdrop-blur-2xl p-4 sm:p-9 text-[#141E33] shadow-[0_30px_70px_-15px_rgba(20,30,51,0.35)] ring-1 ring-[#141E33]/05"
      >
        <button
          type="button"
          onClick={handleClose}
          className="glass-pill absolute right-4 top-4 sm:right-5 sm:top-5 grid h-9 w-9 place-items-center rounded-full text-[#141E33] hover:bg-[#141E33] hover:text-[#F6F1E7] transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {createdOrder ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <p className="eyebrow mt-5 text-emerald-800">Commande Confirmée</p>
            <h2 className="mt-2 font-display text-2xl sm:text-4xl text-[#141E33]">Merci pour votre commande !</h2>
            <p className="mt-3 text-base font-semibold text-[#141E33]">
              Référence de commande : <span className="text-[#BC3B2C]">{createdOrder.orderNumber}</span>
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#5C574C]">
              Nous avons bien enregistré votre commande. Notre équipe vous contactera au{" "}
              <strong>{phone}</strong> pour confirmer l’adresse de livraison avant l’expédition.
            </p>

            <div className="mt-8 rounded-xl border border-[#141E33]/10 bg-white p-5 text-left text-xs text-[#5C574C] shadow-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141E33]">
                <Truck className="h-4 w-4 text-[#BC3B2C]" />
                Modalités de réception
              </div>
              <p className="mt-2">
                Le règlement s’effectuera <strong>en espèces à la livraison</strong> directement auprès du livreur.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="mt-8 bg-[#141E33] px-8 py-5 text-xs font-extrabold uppercase tracking-widest text-[#F6F1E7] hover:bg-[#BC3B2C] rounded-full shadow-md transition-all"
            >
              Continuer mes découvertes
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#141E33]/10 pb-5">
              <p className="eyebrow text-[#BC3B2C]">Paiement à la livraison · Tunisie</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl text-[#141E33]">Finaliser votre commande</h2>
              <p className="mt-2 text-xs text-[#5C574C]">
                Renseignez vos coordonnées pour recevoir votre sélection de livres professionnels.
              </p>

              {/* RestCountries Official Tunisia Badge */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#BC3B2C]/20 bg-[#E9DFCF]/60 p-3.5 text-xs shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" role="img" aria-label="Drapeau de la Tunisie">
                    {tunisia?.flag?.emoji || "🇹🇳"}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#141E33]">
                      <span>{tunisia?.name?.french || "Tunisie"}</span>
                      <span className="text-sm text-[#BC3B2C] font-normal">({tunisia?.name?.arabic || "تونس"})</span>
                      <span className="rounded bg-[#141E33]/10 px-1.5 py-0.5 text-[10px] uppercase font-mono font-semibold text-[#141E33]">
                        {tunisia?.alpha2 || "TN"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C574C]">
                      Livraison express COD sur les 24 gouvernorats · Devise : {tunisia?.currency?.code || "TND"} ({tunisia?.currency?.symbol || "DT"})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#141E33]">
                  <Truck className="h-3.5 w-3.5 text-[#BC3B2C]" />
                  <span>Expédié depuis {tunisia?.capital || "Tunis"} ({tunisia?.timezone || "UTC+01:00"})</span>
                </div>
              </div>
            </div>

            {/* Cart summary strip */}
            <div className="my-5 rounded-xl border border-[#141E33]/10 bg-white p-4 shadow-xs">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C574C]">
                Articles commandés ({cart?.itemCount ?? 0})
              </p>
              <div className="mt-3 max-h-36 divide-y divide-[#141E33]/10 overflow-y-auto pr-2 text-xs">
                {cart?.items.map((item) => (
                  <div key={item.lineId} className="flex items-center justify-between py-2">
                    <span className="truncate pr-3 font-medium text-[#141E33]">
                      {item.productTitle}{" "}
                      <span className="text-[#5C574C]">× {item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-bold text-[#141E33]">
                      {formatMoney((parseFloat(item.unitPrice.amount) * item.quantity).toFixed(2), "TND")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#141E33]/10 pt-3 text-sm font-bold text-[#141E33]">
                <span>Total (avec livraison 7,00 DT) :</span>
                <span className="font-display text-xl text-[#BC3B2C]">
                  {formatMoney(totalNum.toFixed(2), "TND")}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="b2b_company_verification"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                style={{ display: "none" }}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Prénom *</Label>
                  <Input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Walid"
                    className="mt-1 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Nom *</Label>
                  <Input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ben Amor"
                    className="mt-1 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider">Téléphone (joignable) *</Label>
                    {isPhoneValid ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> 8 chiffres valides
                      </span>
                    ) : phone.length > 0 ? (
                      <span className="text-[11px] font-medium text-amber-600">
                        8 chiffres requis
                      </span>
                    ) : null}
                  </div>
                  <div className="relative mt-1 flex rounded-xl border border-[#141E33]/20 bg-white shadow-xs focus-within:border-[#BC3B2C] focus-within:ring-2 focus-within:ring-[#BC3B2C]/20 overflow-hidden transition-all">
                    <span className="inline-flex items-center gap-1.5 border-r border-[#141E33]/15 bg-[#F6F1E7] px-3 text-xs font-bold text-[#141E33]">
                      <span>{tunisia?.flag?.emoji || "🇹🇳"}</span>
                      <span className="font-mono">{tunisia?.callingCode || "+216"}</span>
                    </span>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="21 000 000"
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none font-medium"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Adresse email *</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@entreprise.tn"
                    className="mt-1 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider">Adresse complète de livraison *</Label>
                <Textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Numéro, rue, immeuble, bureau, entreprise…"
                  className="mt-1 rounded-xl border-[#141E33]/20 bg-white"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Gouvernorat *</Label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#141E33]/20 bg-white px-3 text-sm outline-none transition-all focus:border-[#BC3B2C] focus:ring-2 focus:ring-[#BC3B2C]/20"
                  >
                    {[
                      "Ariana",
                      "Béja",
                      "Ben Arous",
                      "Bizerte",
                      "Gabès",
                      "Gafsa",
                      "Jendouba",
                      "Kairouan",
                      "Kasserine",
                      "Kébili",
                      "Le Kef",
                      "Mahdia",
                      "La Manouba",
                      "Médenine",
                      "Monastir",
                      "Nabeul",
                      "Sfax",
                      "Sidi Bouzid",
                      "Siliana",
                      "Sousse",
                      "Tataouine",
                      "Tozeur",
                      "Tunis",
                      "Zaghouan",
                    ].map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Ville / Délégation</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Les Berges du Lac"
                    className="mt-1 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">
                    Code postal ({tunisia?.postalCode?.format || "####"})
                  </Label>
                  <Input
                    value={postalCode}
                    maxLength={4}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="1001"
                    className="mt-1 rounded-xl border-[#141E33]/20 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#BC3B2C]/30 bg-[#E9DFCF]/40 p-4 text-xs">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEducator}
                    onChange={(e) => setIsEducator(e.target.checked)}
                    className="mt-0.5 accent-[#BC3B2C]"
                  />
                  <span>
                    <strong className="text-[#BC3B2C] flex items-center gap-1.5 font-bold">
                      <GraduationCap className="h-4 w-4" />
                      Je suis enseignant ou formateur (Offre Educator).
                    </strong>
                    <span className="block mt-1 text-[#5C574C]">
                      Je souhaite bénéficier, sous réserve de justificatif, de l’avantage Educator −50 % sur l’Educator’s Guide numérique.
                    </span>
                  </span>
                </label>
              </div>

              <div className="border-t border-[#141E33]/10 pt-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#5C574C]">
                  <Truck className="h-4 w-4 text-[#BC3B2C]" />
                  Paiement sécurisé en espèces à la livraison. Aucun paiement en ligne requis.
                </div>

                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending || !cart?.items.length}
                  className="btn-terracotta w-full rounded-full py-6 text-xs font-extrabold uppercase tracking-widest text-white shadow-md disabled:opacity-50"
                >
                  {createOrderMutation.isPending
                    ? "Enregistrement en cours…"
                    : `Confirmer ma commande (${formatMoney(totalNum.toFixed(2), "TND")})`}
                </Button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
