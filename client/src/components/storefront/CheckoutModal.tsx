import { useState } from "react";
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

export function CheckoutModal() {
  const { cart, isCheckoutOpen, closeCheckout, clearCart } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("Tunis");
  const [orderNotes, setOrderNotes] = useState("");
  const [isEducator, setIsEducator] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{
    orderId: number;
    orderNumber: string;
  } | null>(null);

  const createOrderMutation = trpc.site.orders.create.useMutation({
    onSuccess: (data) => {
      setCreatedOrder(data);
      clearCart();
      toast.success("Votre commande a été enregistrée avec succès !");
    },
    onError: (err) => {
      toast.error(err.message || "Impossible d’enregistrer votre commande. Veuillez réessayer.");
    },
  });

  if (!isCheckoutOpen) return null;

  const shippingCost = "7.00";
  const subtotalNum = cart?.items.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice.amount) || 0) * item.quantity;
  }, 0) ?? 0;
  const totalNum = subtotalNum + parseFloat(shippingCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.items.length) {
      toast.error("Votre sélection est vide.");
      return;
    }

    createOrderMutation.mutate({
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress,
      city,
      governorate,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#172C41]/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-[#172C41]/20 bg-[#F8F5EE] p-6 text-[#172C41] shadow-2xl sm:p-9">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#172C41]/15 text-[#172C41] hover:bg-[#172C41] hover:text-[#F8F5EE]"
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
            <h2 className="mt-2 font-display text-4xl">Merci pour votre commande !</h2>
            <p className="mt-3 text-base font-semibold text-[#172C41]">
              Référence de commande : <span className="text-[#C94E36]">{createdOrder.orderNumber}</span>
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#52606B]">
              Nous avons bien enregistré votre commande. Notre équipe vous contactera au{" "}
              <strong>{phone}</strong> pour confirmer l’adresse de livraison avant l’expédition.
            </p>

            <div className="mt-8 rounded-sm border border-[#172C41]/10 bg-white p-5 text-left text-xs text-[#52606B]">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#172C41]">
                <Truck className="h-4 w-4 text-[#C94E36]" />
                Modalités de réception
              </div>
              <p className="mt-2">
                Le règlement s’effectuera <strong>en espèces à la livraison</strong> directement auprès du livreur.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="mt-8 bg-[#172C41] px-8 py-5 text-xs font-extrabold uppercase tracking-widest text-[#F8F5EE] hover:bg-[#263f58]"
            >
              Continuer mes découvertes
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#172C41]/10 pb-5">
              <p className="eyebrow text-[#C94E36]">Paiement à la livraison · Tunisie</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Finaliser votre commande</h2>
              <p className="mt-2 text-xs text-[#52606B]">
                Renseignez vos coordonnées pour recevoir votre sélection de livres professionnels.
              </p>
            </div>

            {/* Cart summary strip */}
            <div className="my-5 rounded-sm border border-[#172C41]/10 bg-white p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#52606B]">
                Articles commandés ({cart?.itemCount ?? 0})
              </p>
              <div className="mt-3 max-h-36 divide-y divide-[#172C41]/10 overflow-y-auto pr-2 text-xs">
                {cart?.items.map((item) => (
                  <div key={item.lineId} className="flex items-center justify-between py-2">
                    <span className="truncate pr-3 font-medium">
                      {item.productTitle}{" "}
                      <span className="text-[#52606B]">× {item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-bold text-[#172C41]">
                      {formatMoney((parseFloat(item.unitPrice.amount) * item.quantity).toFixed(2), "TND")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#172C41]/10 pt-3 text-sm font-bold text-[#172C41]">
                <span>Total (avec livraison 7,00 DT) :</span>
                <span className="font-display text-xl text-[#C94E36]">
                  {formatMoney(totalNum.toFixed(2), "TND")}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Prénom *</Label>
                  <Input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Walid"
                    className="mt-1 border-[#172C41]/20 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Nom *</Label>
                  <Input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ben Amor"
                    className="mt-1 border-[#172C41]/20 bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Téléphone (joignable) *</Label>
                  <Input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="21 000 000"
                    className="mt-1 border-[#172C41]/20 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Adresse email *</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@entreprise.tn"
                    className="mt-1 border-[#172C41]/20 bg-white"
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
                  className="mt-1 border-[#172C41]/20 bg-white"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider">Gouvernorat *</Label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="mt-1 h-10 w-full border border-[#172C41]/20 bg-white px-3 text-sm outline-none"
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
                    className="mt-1 border-[#172C41]/20 bg-white"
                  />
                </div>
              </div>

              <div className="rounded-sm border border-[#C94E36]/30 bg-[#F9E5E0] p-4 text-xs">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEducator}
                    onChange={(e) => setIsEducator(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    <strong className="text-[#C94E36] flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      Je suis enseignant ou formateur (Offre Educator).
                    </strong>
                    <span className="block mt-1 text-[#52606B]">
                      Je souhaite bénéficier, sous réserve de justificatif, de l’avantage Educator −50 % sur l’Educator’s Guide numérique.
                    </span>
                  </span>
                </label>
              </div>

              <div className="border-t border-[#172C41]/10 pt-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#52606B]">
                  <Truck className="h-4 w-4 text-[#C94E36]" />
                  Paiement sécurisé en espèces à la livraison. Aucun paiement en ligne requis.
                </div>

                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending || !cart?.items.length}
                  className="w-full bg-[#C94E36] py-6 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-[#A93D2D]"
                >
                  {createOrderMutation.isPending
                    ? "Enregistrement en cours…"
                    : `Confirmer ma commande (${formatMoney(totalNum.toFixed(2), "TND")})`}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
