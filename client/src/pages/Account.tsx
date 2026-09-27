import { useState, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  Truck,
  User as UserIcon,
} from "lucide-react";

const TUNISIAN_GOVERNORATES = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "security">("orders");

  // Fetch client's orders
  const { data: myOrders = [], isLoading: ordersLoading } =
    trpc.site.orders.myOrders.useQuery(undefined, {
      enabled: Boolean(user?.email),
    });

  const latestOrder = myOrders[0];
  const latestDeliveryAddress = myOrders[0]?.deliveryAddress || myOrders[0]?.delivery_address || null;
  const latestPhone = myOrders[0]?.customerPhone || myOrders[0]?.customer_phone || null;

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    deliveryAddress: "",
    governorate: "Tunis",
    city: "",
    postalCode: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profile form with user data and recent order
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: (user as any).phone || latestPhone || "",
        deliveryAddress: (user as any).deliveryAddress || latestDeliveryAddress || "",
        governorate: (user as any).governorate || latestOrder?.governorate || "Tunis",
        city: (user as any).city || latestOrder?.city || "",
        postalCode: (user as any).postalCode || latestOrder?.postalCode || "",
      });
    }
  }, [user, latestPhone, latestDeliveryAddress, latestOrder]);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Account deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Mutations
  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: (data) => {
      toast.success("Vos coordonnées ont été mises à jour avec succès !");
      setSavingProfile(false);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la mise à jour");
      setSavingProfile(false);
    },
  });

  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Votre mot de passe a été modifié avec succès !");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la modification du mot de passe");
      setChangingPassword(false);
    },
  });

  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Votre compte a été définitivement supprimé.");
      setDeletingAccount(false);
      setShowDeleteModal(false);
      try {
        await logout();
      } catch {}
      setLocation("/");
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la suppression du compte");
      setDeletingAccount(false);
    },
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || profileForm.name.trim().length < 2) {
      toast.error("Le nom doit comporter au moins 2 caractères");
      return;
    }
    setSavingProfile(true);
    updateProfileMutation.mutate({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      deliveryAddress: profileForm.deliveryAddress.trim(),
      governorate: profileForm.governorate,
      city: profileForm.city.trim(),
      postalCode: profileForm.postalCode.trim(),
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error("Veuillez saisir votre mot de passe actuel");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit comporter au moins 6 caractères");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Les deux nouveaux mots de passe ne correspondent pas");
      return;
    }
    setChangingPassword(true);
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== "SUPPRIMER") {
      toast.error("Veuillez saisir le mot SUPPRIMER pour confirmer.");
      return;
    }
    setDeletingAccount(true);
    deleteAccountMutation.mutate({});
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
      <div className="flex min-h-screen flex-col bg-[#F6F1E7] text-[#141E33]">
        <SiteHeader />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-[#5C574C]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#141E33] border-t-transparent" />
            <p className="text-sm font-semibold">Chargement de votre compte...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F1E7] text-[#141E33]">
        <SiteHeader />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="w-full max-w-md rounded-2xl border border-[#141E33]/10 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#E9DFCF] text-[#141E33]">
              <UserIcon className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold text-[#141E33]">Espace Client</h1>
            <p className="mt-2 text-sm text-[#5C574C]">
              Veuillez vous connecter pour accéder à votre profil et consulter vos commandes.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => setLocation("/login")}
                className="btn-terracotta h-11 w-full rounded-xl font-bold shadow-md"
              >
                Se connecter / S’inscrire
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/librairie")}
                className="h-11 w-full rounded-xl border-[#141E33]/20 font-bold text-[#141E33] hover:bg-[#F6F1E7]"
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

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />

      <main className="container flex-1 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5C574C]">
          <Link href="/" className="transition-colors hover:text-[#BC3B2C]">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-[#141E33]">Mon Compte</span>
        </nav>

        {/* Hero Profile Banner with Glassmorphic Dashboard Elevation */}
        <div className="glass-panel overflow-hidden rounded-3xl border border-white/80 shadow-xl">
          <div className="relative overflow-hidden bg-[#141E33] px-6 py-8 text-white sm:px-8">
            <div className="ambient-mesh-glow -right-10 -top-10 h-64 w-64 bg-[#BC3B2C]/20" />
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#BC3B2C] font-display text-2xl font-bold text-white shadow-md ring-2 ring-white/20">
                  {initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-display text-2xl font-bold sm:text-3xl text-white">
                      {user.name || "Client LivresPro"}
                    </h1>
                    {user.role === "admin" ? (
                      <Badge className="bg-[#BC3B2C] text-xs font-bold uppercase tracking-wider text-white border-none shadow-xs">
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge className="bg-white/20 text-xs font-bold uppercase tracking-wider text-white border-none">
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
                    className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#141E33] shadow-sm transition hover:bg-[#F6F1E7]"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#BC3B2C]" />
                    <span>Dashboard Admin</span>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="h-10 rounded-xl border-white/30 bg-transparent text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs with Spring Indicator */}
          <div className="flex border-b border-[#141E33]/10 bg-[#F6F1E7]/70 px-6 sm:px-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`relative flex items-center gap-2 py-4 text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                activeTab === "orders" ? "text-[#BC3B2C]" : "text-[#5C574C] hover:text-[#141E33]"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Mes Commandes ({myOrders.length})</span>
              {activeTab === "orders" && (
                <motion.span
                  layoutId="accountTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BC3B2C]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`relative ml-8 flex items-center gap-2 py-4 text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                activeTab === "profile" ? "text-[#BC3B2C]" : "text-[#5C574C] hover:text-[#141E33]"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Coordonnées & Livraison</span>
              {activeTab === "profile" && (
                <motion.span
                  layoutId="accountTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BC3B2C]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`relative ml-8 flex items-center gap-2 py-4 text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                activeTab === "security" ? "text-[#BC3B2C]" : "text-[#5C574C] hover:text-[#141E33]"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Sécurité & Compte</span>
              {activeTab === "security" && (
                <motion.span
                  layoutId="accountTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BC3B2C]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content: Mes Commandes */}
        {activeTab === "orders" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-[#141E33]">Historique de vos commandes</h2>
                <p className="text-xs text-[#5C574C]">
                  Suivez vos commandes payables à la livraison (COD) partout en Tunisie.
                </p>
              </div>
              <Link
                href="/librairie"
                className="btn-terracotta hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-md"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Commander un autre livre
              </Link>
            </div>

            {ordersLoading ? (
              <div className="rounded-2xl border border-[#141E33]/10 bg-white p-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#141E33] border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-[#5C574C]">Chargement de vos commandes...</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center shadow-sm">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E9DFCF] text-[#141E33] animate-float-gentle">
                  <Package className="h-8 w-8 text-[#BC3B2C]" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-[#141E33]">Aucune commande passée</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[#5C574C]">
                  Vous n'avez pas encore passé de commande avec ce compte. Découvrez nos ouvrages business et commandez directement en ligne avec paiement à la livraison.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href="/librairie"
                    className="btn-terracotta inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    <BookOpen className="h-4 w-4" />
                    Explorer la Librairie
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order: any) => {
                  const items = order.items || order.order_items || [];
                  const total = order.totalAmount || order.total_amount || "0.00";
                  const dateStr = order.createdAt || order.created_at
                    ? new Date(order.createdAt || order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Récemment";

                  let statusBadge = {
                    label: "Nouvelle / En préparation",
                    bg: "bg-amber-100 text-amber-800 border-amber-200",
                    icon: Clock,
                  };
                  if (order.status === "confirmed") {
                    statusBadge = {
                      label: "Confirmée",
                      bg: "bg-blue-100 text-blue-800 border-blue-200",
                      icon: CheckCircle2,
                    };
                  } else if (order.status === "shipped") {
                    statusBadge = {
                      label: "Expédiée (En route)",
                      bg: "bg-purple-100 text-purple-800 border-purple-200",
                      icon: Truck,
                    };
                  } else if (order.status === "delivered") {
                    statusBadge = {
                      label: "Livrée & Payée",
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
                      className="card-depth overflow-hidden rounded-2xl border border-[#141E33]/10 bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141E33]/10 bg-[#F6F1E7]/50 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#141E33]">
                            {order.orderNumber || order.order_number || `#${order.id}`}
                          </span>
                          <span className="text-xs text-[#5C574C]">|</span>
                          <span className="flex items-center gap-1.5 text-xs text-[#5C574C]">
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

                      <div className="divide-y divide-[#141E33]/08 p-6">
                        {items.length > 0 ? (
                          items.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E9DFCF] text-[#141E33]">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-[#141E33]">{item.productTitle || item.product_title || "Livre"}</h4>
                                  <p className="text-xs text-[#5C574C]">
                                    Format : {item.format || "Livre physique"} — Quantité : {item.quantity || 1}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono text-sm font-bold text-[#141E33]">
                                {item.subtotal || item.unitPrice || item.unit_price || "65.00"} TND
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-between py-2 text-sm text-[#5C574C]">
                            <span>B2B Brand Management — Édition Tunisie (1 exemplaire)</span>
                            <span className="font-bold text-[#141E33]">65.00 TND</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#141E33]/10 bg-[#F6F1E7]/30 px-6 py-3.5 text-xs">
                        <div className="flex flex-wrap items-center gap-4 text-[#5C574C]">
                          {(order.deliveryAddress || order.delivery_address) && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-[#BC3B2C]" />
                              {order.deliveryAddress || order.delivery_address}
                              {order.city ? `, ${order.city}` : ""}
                              {order.governorate ? ` (${order.governorate})` : ""}
                            </span>
                          )}
                          {(order.customerPhone || order.customer_phone) && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-[#141E33]" />
                              {order.customerPhone || order.customer_phone}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[#5C574C]">Mode :</span>
                          <span className="font-semibold text-[#141E33]">
                            Espèces à la livraison (COD)
                          </span>
                          <span className="mx-2 text-[#141E33]/20">|</span>
                          <span className="font-display text-base font-bold text-[#BC3B2C]">
                            {total} TND
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Coordonnées & Livraison */}
        {activeTab === "profile" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleUpdateProfile} className="glass-panel rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[#141E33]/10 pb-4">
                  <h3 className="font-display text-xl font-bold text-[#141E33]">
                    Coordonnées personnelles & Livraison
                  </h3>
                  <p className="mt-1 text-xs text-[#5C574C]">
                    Mettez à jour vos informations de contact et votre adresse par défaut pour vos prochaines commandes en Tunisie.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="prof-name" className="text-xs uppercase tracking-wider text-[#141E33]">
                      Nom et Prénom *
                    </Label>
                    <Input
                      id="prof-name"
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Ex: Mohamed Ben Salem"
                      className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prof-phone" className="text-xs uppercase tracking-wider text-[#141E33]">
                      Numéro de Téléphone (Mobile Tunisie)
                    </Label>
                    <Input
                      id="prof-phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="Ex: +216 98 123 456"
                      className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prof-email" className="text-xs uppercase tracking-wider text-[#5C574C]">
                    Adresse Email (Identifiant de connexion)
                  </Label>
                  <Input
                    id="prof-email"
                    type="email"
                    value={user.email}
                    disabled
                    className="mt-1.5 h-11 rounded-xl border-[#141E33]/15 bg-[#F6F1E7] text-[#5C574C]"
                  />
                  <p className="mt-1 text-[11px] text-[#5C574C]">
                    L'adresse email sert d'identifiant unique et ne peut être modifiée directement.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="border-t border-[#141E33]/10 pt-4">
                    <h4 className="font-semibold text-sm text-[#141E33] flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#BC3B2C]" />
                      Adresse de livraison par défaut
                    </h4>
                  </div>

                  <div>
                    <Label htmlFor="prof-address" className="text-xs uppercase tracking-wider text-[#141E33]">
                      Adresse détaillée (Rue, Bâtiment, Étage...)
                    </Label>
                    <Input
                      id="prof-address"
                      type="text"
                      value={profileForm.deliveryAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, deliveryAddress: e.target.value })}
                      placeholder="Ex: 14 Rue Habib Bourguiba, Appt 3B"
                      className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="prof-gov" className="text-xs uppercase tracking-wider text-[#141E33]">
                        Gouvernorat
                      </Label>
                      <select
                        id="prof-gov"
                        value={profileForm.governorate}
                        onChange={(e) => setProfileForm({ ...profileForm, governorate: e.target.value })}
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#141E33]/20 bg-white px-3 text-sm font-medium text-[#141E33]"
                      >
                        {TUNISIAN_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="prof-city" className="text-xs uppercase tracking-wider text-[#141E33]">
                        Ville / Délégation
                      </Label>
                      <Input
                        id="prof-city"
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        placeholder="Ex: La Marsa, Les Berges du Lac"
                        className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prof-zip" className="text-xs uppercase tracking-wider text-[#141E33]">
                        Code Postal
                      </Label>
                      <Input
                        id="prof-zip"
                        type="text"
                        maxLength={4}
                        value={profileForm.postalCode}
                        onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                        placeholder="Ex: 2078"
                        className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#141E33]/10 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-terracotta h-11 px-8 rounded-xl font-bold shadow-md"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {savingProfile ? "Enregistrement en cours..." : "Enregistrer mes coordonnées"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Aside Column */}
            <div className="space-y-6">
              {/* Delivery overview card */}
              <div className="glass-panel rounded-2xl p-6 shadow-sm">
                <h4 className="font-display text-base font-bold text-[#141E33]">Aperçu de livraison</h4>
                <p className="mt-1 text-xs text-[#5C574C]">
                  Vos coordonnées actuelles enregistrées pour la livraison COD en Tunisie :
                </p>

                <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-xs border border-[#141E33]/10">
                  <div className="flex items-start gap-2.5">
                    <UserIcon className="h-4 w-4 text-[#BC3B2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5C574C]">Destinataire</span>
                      <p className="font-bold text-[#141E33]">{profileForm.name || user.name || "Non spécifié"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="h-4 w-4 text-[#BC3B2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5C574C]">Contact</span>
                      <p className="font-semibold text-[#141E33]">{profileForm.phone || "Aucun téléphone"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-[#BC3B2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5C574C]">Adresse</span>
                      <p className="font-semibold text-[#141E33]">
                        {profileForm.deliveryAddress || "Aucune adresse"}
                        {profileForm.city ? `, ${profileForm.city}` : ""}
                        {profileForm.governorate ? ` (${profileForm.governorate})` : ""}
                        {profileForm.postalCode ? ` - ${profileForm.postalCode}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="glass-panel rounded-2xl p-6 shadow-sm">
                <h4 className="font-display text-base font-bold text-[#141E33]">Assistance & Commandes</h4>
                <p className="mt-1 text-xs text-[#5C574C]">
                  Notre équipe logistique basée à Tunis est joignable du lundi au samedi.
                </p>
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#141E33]">
                    <Mail className="h-4 w-4 text-[#BC3B2C]" />
                    <a href="mailto:contact@livrespro.tn" className="font-semibold hover:underline">
                      contact@livrespro.tn
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[#141E33]">
                    <Phone className="h-4 w-4 text-[#BC3B2C]" />
                    <a href="https://wa.me/21629511111" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                      WhatsApp : +216 29 511 111
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Sécurité & Compte */}
        {activeTab === "security" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Password Change Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#141E33]/10 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E9DFCF] text-[#141E33]">
                  <KeyRound className="h-5 w-5 text-[#BC3B2C]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#141E33]">Modifier le mot de passe</h3>
                  <p className="text-xs text-[#5C574C]">Mettez à jour vos identifiants pour sécuriser vos commandes.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="cur-pass" className="text-xs uppercase tracking-wider text-[#141E33]">
                    Mot de passe actuel *
                  </Label>
                  <Input
                    id="cur-pass"
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="new-pass" className="text-xs uppercase tracking-wider text-[#141E33]">
                    Nouveau mot de passe * (min. 6 caractères)
                  </Label>
                  <Input
                    id="new-pass"
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="conf-pass" className="text-xs uppercase tracking-wider text-[#141E33]">
                    Confirmer le nouveau mot de passe *
                  </Label>
                  <Input
                    id="conf-pass"
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="mt-1.5 h-11 rounded-xl border-[#141E33]/20 bg-white"
                  />
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={changingPassword}
                    className="btn-terracotta h-11 w-full rounded-xl font-bold shadow-md"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {changingPassword ? "Mise à jour en cours..." : "Changer le mot de passe"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-sm border-rose-200 bg-rose-50/30">
              <div className="flex items-center gap-3 border-b border-rose-200/60 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-rose-900">Zone Dangereuse : Suppression du compte</h3>
                  <p className="text-xs text-rose-700">Suppression irréversible de votre profil et de vos accès.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs text-[#5C574C]">
                <p>
                  Si vous décidez de supprimer votre compte LivresPro :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-rose-950/80">
                  <li>Toutes vos coordonnées et sessions seront immédiatement effacées.</li>
                  <li>Vous ne pourrez plus vous connecter avec cette adresse email ({user.email}).</li>
                  <li>Les factures et bons de livraison existants déjà traités pour les livreurs resteront archivés selon la réglementation fiscale.</li>
                </ul>

                {user.role === "admin" && user.email.toLowerCase().includes("admin@livrespro.tn") ? (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
                    <p className="font-bold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Compte Administrateur Racine Protégé
                    </p>
                    <p className="mt-1 text-[11px]">
                      Le compte administrateur racine de la plateforme ne peut pas être supprimé afin de préserver l'accès au tableau de bord.
                    </p>
                  </div>
                ) : (
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteModal(true)}
                      className="h-11 w-full rounded-xl bg-rose-600 font-bold hover:bg-rose-700 text-white shadow-sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer définitivement mon compte
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-200"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-rose-950">
                    Confirmer la suppression ?
                  </h3>
                  <p className="text-xs text-rose-700">Cette action est définitive et irréversible.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs text-[#5C574C]">
                <p>
                  Pour confirmer que vous souhaitez supprimer votre compte associé à{" "}
                  <strong className="text-[#141E33]">{user.email}</strong>, veuillez taper{" "}
                  <strong className="text-rose-600">SUPPRIMER</strong> ci-dessous :
                </p>
                <Input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="h-11 rounded-xl border-rose-300 font-mono text-center tracking-widest uppercase focus-visible:ring-rose-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmationText("");
                  }}
                  className="h-10 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  disabled={deleteConfirmationText.trim().toUpperCase() !== "SUPPRIMER" || deletingAccount}
                  onClick={handleDeleteAccount}
                  className="h-10 rounded-xl bg-rose-600 font-bold hover:bg-rose-700 text-white"
                >
                  {deletingAccount ? "Suppression en cours..." : "Confirmer la suppression"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
