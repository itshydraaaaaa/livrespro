import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Shield,
  ShoppingBag,
  Truck,
  User as UserIcon,
} from "lucide-react";

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [updatingName, setUpdatingName] = useState(false);

  // Fetch client's orders
  const { data: myOrders = [], isLoading: ordersLoading, refetch: refetchOrders } =
    trpc.site.orders.myOrders.useQuery(undefined, {
      enabled: Boolean(user?.email),
    });

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Vos informations ont été mises à jour avec succès");
      setEditingName(false);
      setUpdatingName(false);
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la mise à jour");
      setUpdatingName(false);
    },
  });

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || nameInput.trim().length < 2) {
      toast.error("Le nom doit comporter au moins 2 caractères");
      return;
    }
    setUpdatingName(true);
    updateProfileMutation.mutate({ name: nameInput.trim() });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      setLocation("/login");
    } catch {
      setLocation("/login");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8F5EE] text-[#172C41]">
        <SiteHeader />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-[#52606B]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#172C41] border-t-transparent" />
            <p className="text-sm font-semibold">Chargement de votre compte...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8F5EE] text-[#172C41]">
        <SiteHeader />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="w-full max-w-md rounded-2xl border border-[#172C41]/10 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E9E2D7] text-[#172C41]">
              <UserIcon className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold">Espace Client</h1>
            <p className="mt-2 text-sm text-[#52606B]">
              Veuillez vous connecter pour accéder à votre profil et consulter vos commandes.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => setLocation("/login")}
                className="h-11 w-full rounded-xl bg-[#172C41] font-bold text-[#F8F5EE] hover:bg-[#B71922]"
              >
                Se connecter / S’inscrire
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/librairie")}
                className="h-11 w-full rounded-xl border-[#172C41]/20 font-bold text-[#172C41]"
              >
                Explorer la Librairie
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Derive initial letters
  const initials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  const latestDeliveryAddress = myOrders[0]?.deliveryAddress || myOrders[0]?.delivery_address || null;
  const latestPhone = myOrders[0]?.customerPhone || myOrders[0]?.customer_phone || null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5EE] text-[#172C41]">
      <SiteHeader />

      <main className="container flex-1 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#52606B]">
          <Link href="/" className="hover:text-[#172C41]">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-[#172C41]">Mon Compte</span>
        </nav>

        {/* Hero Profile Banner */}
        <div className="overflow-hidden rounded-2xl border border-[#172C41]/10 bg-white shadow-sm">
          <div className="bg-[#172C41] px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#B71922] font-display text-2xl font-bold text-white shadow-md">
                  {initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-display text-2xl font-bold sm:text-3xl">
                      {user.name || "Client LivresPro"}
                    </h1>
                    {user.role === "admin" ? (
                      <Badge className="bg-[#B71922] text-xs font-bold uppercase tracking-wider text-white">
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge className="bg-white/20 text-xs font-bold uppercase tracking-wider text-white">
                        Client Particulier
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#172C41] shadow-sm transition hover:bg-[#F8F5EE]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard Admin</span>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="h-10 border-white/30 bg-transparent text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#172C41]/10 bg-[#F8F5EE]/60 px-6 sm:px-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 border-b-2 py-3.5 text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === "orders"
                  ? "border-[#B71922] text-[#B71922]"
                  : "border-transparent text-[#52606B] hover:text-[#172C41]"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Mes Commandes ({myOrders.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("profile");
                setNameInput(user.name || "");
              }}
              className={`ml-8 flex items-center gap-2 border-b-2 py-3.5 text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === "profile"
                  ? "border-[#B71922] text-[#B71922]"
                  : "border-transparent text-[#52606B] hover:text-[#172C41]"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Informations du Compte</span>
            </button>
          </div>
        </div>

        {/* Tab Content: Mes Commandes */}
        {activeTab === "orders" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-[#172C41]">Historique de vos commandes</h2>
                <p className="text-xs text-[#52606B]">
                  Suivez vos commandes payables à la livraison (COD) partout en Tunisie.
                </p>
              </div>
              <Link
                href="/librairie"
                className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B71922] hover:underline sm:flex"
              >
                <BookOpen className="h-4 w-4" />
                <span>Commander un autre livre</span>
              </Link>
            </div>

            {ordersLoading ? (
              <div className="rounded-2xl border border-[#172C41]/10 bg-white p-12 text-center text-[#52606B]">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#172C41] border-t-transparent" />
                <p className="mt-3 text-xs font-semibold">Chargement de vos commandes...</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="rounded-2xl border border-[#172C41]/10 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E9E2D7] text-[#172C41]">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">Aucune commande pour le moment</h3>
                <p className="mx-auto mt-2 max-w-md text-xs text-[#52606B]">
                  Vous n'avez pas encore passé de commande avec cette adresse email ({user.email}). Dès que vous
                  commandez un livre, il apparaîtra ici avec son statut d'expédition.
                </p>
                <div className="mt-6">
                  <Link
                    href="/librairie"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#172C41] px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#B71922]"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Découvrir le Catalogue</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order: any) => {
                  const items = order.items || order.order_items || [];
                  const total = order.totalAmount || order.total_amount || "72.00";
                  const dateStr = (order.createdAt || order.created_at)
                    ? new Date(order.createdAt || order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Récemment";

                  // Status badge format
                  let statusBadge = {
                    label: "En préparation",
                    bg: "bg-amber-100 text-amber-800 border-amber-200",
                    icon: Clock,
                  };
                  if (order.status === "shipped") {
                    statusBadge = {
                      label: "Expédiée (En livraison)",
                      bg: "bg-blue-100 text-blue-800 border-blue-200",
                      icon: Truck,
                    };
                  } else if (order.status === "delivered") {
                    statusBadge = {
                      label: "Livrée",
                      bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
                      icon: CheckCircle2,
                    };
                  } else if (order.status === "cancelled") {
                    statusBadge = {
                      label: "Annulée",
                      bg: "bg-rose-100 text-rose-800 border-rose-200",
                      icon: Clock,
                    };
                  }

                  const StatusIcon = statusBadge.icon;

                  return (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-[#172C41]/10 bg-white shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#172C41]/10 bg-[#F8F5EE]/40 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#172C41]">
                            {order.orderNumber || order.order_number || `#${order.id}`}
                          </span>
                          <span className="text-xs text-[#52606B]">|</span>
                          <span className="flex items-center gap-1.5 text-xs text-[#52606B]">
                            <Calendar className="h-3.5 w-3.5" />
                            {dateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusBadge.bg}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="divide-y divide-[#172C41]/5 p-6">
                        {items.length > 0 ? (
                          items.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#E9E2D7] text-[#172C41]">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-[#172C41]">{item.productTitle || item.product_title || "Livre"}</h4>
                                  <p className="text-xs text-[#52606B]">
                                    Format : {item.format || "Livre physique"} — Quantité : {item.quantity || 1}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono text-sm font-bold text-[#172C41]">
                                {item.subtotal || item.unitPrice || item.unit_price || "65.00"} TND
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-between py-2 text-sm text-[#52606B]">
                            <span>B2B Brand Management — Édition Tunisie (1 exemplaire)</span>
                            <span className="font-bold text-[#172C41]">65.00 TND</span>
                          </div>
                        )}
                      </div>

                      {/* Order Footer & Delivery Details */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#172C41]/10 bg-[#F8F5EE]/20 px-6 py-3.5 text-xs">
                        <div className="flex flex-wrap items-center gap-4 text-[#52606B]">
                          {order.delivery_address && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#172C41]" />
                              {order.delivery_address}
                              {order.city ? `, ${order.city}` : ""}
                            </span>
                          )}
                          {order.customer_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-[#172C41]" />
                              {order.customer_phone}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[#52606B]">Mode :</span>
                          <span className="font-bold text-[#172C41]">Paiement à la livraison (COD)</span>
                          <span className="text-[#52606B]">| Frais de port : 7.00 TND</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Informations du Compte */}
        {activeTab === "profile" && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Personal Details Card */}
            <div className="rounded-2xl border border-[#172C41]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#172C41]/10 pb-4">
                <h3 className="font-display text-lg font-bold text-[#172C41]">Informations Personnelles</h3>
                {!editingName ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNameInput(user.name || "");
                      setEditingName(true);
                    }}
                    className="h-8 text-xs font-bold text-[#B71922] hover:bg-[#B71922]/10"
                  >
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                    Modifier
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingName(false)}
                    className="h-8 text-xs text-[#52606B]"
                  >
                    Annuler
                  </Button>
                )}
              </div>

              {!editingName ? (
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#52606B]">Nom complet</span>
                    <p className="mt-1 font-semibold text-[#172C41]">{user.name || "Non renseigné"}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#52606B]">Adresse email</span>
                    <p className="mt-1 font-semibold text-[#172C41]">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#52606B]">Rôle sur la plateforme</span>
                    <p className="mt-1 font-semibold text-[#172C41]">
                      {user.role === "admin" ? "Administrateur LivresPro" : "Client Enregistré"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#52606B]">Type de compte</span>
                    <p className="mt-1 font-semibold text-[#172C41]">Compte Standard Particulier / B2B</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateName} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#172C41]">
                      Votre Nom et Prénom
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      minLength={2}
                      className="mt-1.5 h-11 rounded-xl"
                      placeholder="Ex : Chahin Alibi"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#52606B]">
                      Adresse email (identifiant unique)
                    </Label>
                    <Input
                      type="email"
                      value={user.email}
                      disabled
                      className="mt-1.5 h-11 rounded-xl bg-[#F8F5EE] text-[#52606B]"
                    />
                    <p className="mt-1 text-[11px] text-[#52606B]">
                      L'adresse email est votre identifiant unique de compte et ne peut pas être modifiée.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={updatingName}
                      className="h-11 w-full rounded-xl bg-[#172C41] font-bold text-white hover:bg-[#B71922]"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {updatingName ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Delivery & Security Card */}
            <div className="space-y-6">
              {/* Coordonnées de livraison */}
              <div className="rounded-2xl border border-[#172C41]/10 bg-white p-6 shadow-sm">
                <div className="border-b border-[#172C41]/10 pb-4">
                  <h3 className="font-display text-lg font-bold text-[#172C41]">Adresse de livraison par défaut</h3>
                  <p className="text-xs text-[#52606B]">
                    Informations renseignées lors de votre dernière commande.
                  </p>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  {latestDeliveryAddress ? (
                    <>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-[#B71922]" />
                        <div>
                          <span className="text-xs uppercase tracking-wider text-[#52606B]">Adresse</span>
                          <p className="font-semibold text-[#172C41]">{latestDeliveryAddress}</p>
                        </div>
                      </div>
                      {latestPhone && (
                        <div className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-4 w-4 text-[#B71922]" />
                          <div>
                            <span className="text-xs uppercase tracking-wider text-[#52606B]">Téléphone de contact</span>
                            <p className="font-semibold text-[#172C41]">{latestPhone}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-xl bg-[#F8F5EE] p-4 text-xs text-[#52606B]">
                      <p>
                        Aucune adresse de livraison enregistrée. Vos coordonnées seront automatiquement
                        sauvegardées lors de votre première commande sur la boutique.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Client & Support */}
              <div className="rounded-2xl border border-[#172C41]/10 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-[#172C41]">Support & Service Client</h3>
                <p className="mt-1 text-xs text-[#52606B]">
                  Une question sur une commande ou un livre ? Notre équipe est à votre disposition.
                </p>
                <div className="mt-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#172C41]">
                    <Mail className="h-4 w-4 text-[#B71922]" />
                    <a href="mailto:contact@livrespro.tn" className="font-semibold hover:underline">
                      contact@livrespro.tn
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[#172C41]">
                    <Phone className="h-4 w-4 text-[#B71922]" />
                    <span className="font-semibold">+216 71 000 000 (Tunis, Tunisie)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
