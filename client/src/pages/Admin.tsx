import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout, { type DashboardMenuItem } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BookOpenText,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Eye,
  FileSearch,
  Filter,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

type AdminTab =
  | "overview"
  | "products"
  | "categories"
  | "authors"
  | "orders"
  | "educator"
  | "content"
  | "seo"
  | "audience";

const adminMenu: DashboardMenuItem[] = [
  { icon: LayoutDashboard, label: "Vue d’ensemble", path: "/admin" },
  { icon: BookOpen, label: "Livres & Catalogue", path: "/admin/produits" },
  { icon: ShoppingBag, label: "Commandes (COD)", path: "/admin/commandes" },
  { icon: Users, label: "Auteurs", path: "/admin/auteurs" },
  { icon: Globe2, label: "Rayons & Catégories", path: "/admin/categories" },
  { icon: GraduationCap, label: "Offre Educator", path: "/admin/offre-educator" },
  { icon: BookOpenText, label: "Contenus", path: "/admin/contenu" },
  { icon: FileSearch, label: "SEO", path: "/admin/seo" },
  { icon: LineChart, label: "Audience & Stats", path: "/admin/audience" },
];

function frame(children: React.ReactNode) {
  return <DashboardLayout menuItems={adminMenu} brandName="LivresPro · Admin">{children}</DashboardLayout>;
}

export default function Admin({ tab }: { tab: AdminTab }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F1E7] text-[#141E33]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#141E33] border-t-transparent" />
        <p className="mt-3 text-xs font-semibold text-[#52606B]">Vérification des autorisations d’accès...</p>
      </div>
    );
  }

  // 1. Visiteur non connecté : invitation stricte à s'authentifier
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F1E7] p-4 text-[#141E33]">
        <div className="w-full max-w-md rounded-3xl border border-[#141E33]/15 bg-white p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-amber-700 shadow-xs border border-amber-200">
            <LockKeyhole className="h-8 w-8" />
          </div>

          <span className="mt-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-900">
            Authentification Requise
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-[#141E33] sm:text-3xl">
            Espace d’Administration
          </h1>
          <p className="mt-3 text-xs leading-6 text-[#5C574C]">
            L’accès à cette section est strictement réservé aux administrateurs autorisés de LivresPro.tn. Veuillez vous connecter avec vos identifiants d’administration.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => setLocation("/login?redirect=/admin")}
              className="btn-terracotta h-12 w-full rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md"
            >
              Se connecter à mon compte
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-xs text-[#5C574C] hover:text-[#141E33]"
            >
              ← Retour à la boutique publique
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Utilisateur connecté mais rôle client (user) : écran 403 Forbidden sans contournement
  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F1E7] p-4 text-[#141E33]">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600 shadow-xs border border-rose-200">
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>

          <span className="mt-5 inline-block rounded-full bg-rose-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-rose-800">
            Accès Non Autorisé · Erreur 403
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-[#141E33] sm:text-3xl">
            Privilèges Insuffisants
          </h1>
          <p className="mt-3 text-xs leading-6 text-[#5C574C]">
            Vous êtes connecté en tant que <strong className="text-[#141E33]">{user.email}</strong> (compte lecteur). Cet espace est strictement restreint à la direction et aux gestionnaires du site.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => setLocation("/mon-compte")}
              className="h-12 w-full rounded-xl bg-[#141E33] text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#BC3B2C] transition-colors"
            >
              Consulter Mon Espace Lecteur
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              className="h-11 w-full rounded-xl border-[#141E33]/20 text-xs font-bold uppercase tracking-wider text-[#141E33] hover:bg-[#F6F1E7]"
            >
              Retour au catalogue public
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Administrateur authentifié et validé
  return frame(<AdminWorkspace tab={tab} />);
}

function AdminWorkspace({ tab }: { tab: AdminTab }) {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const overview = trpc.admin.overview.useQuery({ days: 30 });
  const audience = trpc.admin.audience.summary.useQuery({ days: 30 });
  const content = trpc.admin.content.list.useQuery(undefined, { enabled: tab === "content" || tab === "educator" });
  const orders = trpc.admin.orders.list.useQuery(undefined, { enabled: tab === "orders" || tab === "overview" });
  const products = trpc.admin.products.list.useQuery(undefined, { enabled: tab === "products" });
  const categories = trpc.admin.categories.list.useQuery(undefined, { enabled: tab === "categories" || tab === "products" });
  const authors = trpc.admin.authors.list.useQuery(undefined, { enabled: tab === "authors" || tab === "products" });
  const seo = trpc.admin.seo.list.useQuery(undefined, { enabled: tab === "seo" });

  // Mutations
  const updateOrderStatusMutation = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut de commande mis à jour");
      utils.admin.orders.list.invalidate();
      utils.admin.overview.invalidate();
    },
  });

  const updateOrderDetailsMutation = trpc.admin.orders.updateDetails.useMutation({
    onSuccess: () => {
      toast.success("Informations de la commande mises à jour !");
      utils.admin.orders.list.invalidate();
      utils.admin.overview.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erreur de mise à jour"),
  });

  const deleteOrderMutation = trpc.admin.orders.delete.useMutation({
    onSuccess: () => {
      toast.success("Commande supprimée.");
      utils.admin.orders.list.invalidate();
      utils.admin.overview.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erreur de suppression"),
  });

  const saveProductMutation = trpc.admin.products.save.useMutation({
    onSuccess: () => {
      toast.success("Livre enregistré dans le catalogue !");
      utils.admin.products.list.invalidate();
      utils.admin.overview.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erreur lors de l'enregistrement du livre"),
  });

  const updateProductQuickMutation = trpc.admin.products.updateQuick.useMutation({
    onSuccess: () => {
      toast.success("Catalogue mis à jour !");
      utils.admin.products.list.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erreur de mise à jour"),
  });

  const deleteProductMutation = trpc.admin.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Livre archivé / supprimé.");
      utils.admin.products.list.invalidate();
      utils.admin.overview.invalidate();
    },
  });

  const saveCategoryMutation = trpc.admin.categories.save.useMutation({
    onSuccess: () => {
      toast.success("Catégorie enregistrée !");
      utils.admin.categories.list.invalidate();
    },
  });

  const deleteCategoryMutation = trpc.admin.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("Catégorie supprimée.");
      utils.admin.categories.list.invalidate();
    },
  });

  const saveAuthorMutation = trpc.admin.authors.save.useMutation({
    onSuccess: () => {
      toast.success("Auteur enregistré !");
      utils.admin.authors.list.invalidate();
    },
  });

  const deleteAuthorMutation = trpc.admin.authors.delete.useMutation({
    onSuccess: () => {
      toast.success("Auteur supprimé.");
      utils.admin.authors.list.invalidate();
    },
  });

  const saveContent = trpc.admin.content.save.useMutation({
    onSuccess: async () => {
      toast.success("Le contenu a été enregistré.");
      await Promise.all([utils.admin.content.list.invalidate(), utils.admin.overview.invalidate(), utils.site.content.published.invalidate()]);
    },
  });

  const saveSeo = trpc.admin.seo.save.useMutation({
    onSuccess: async () => {
      toast.success("Les paramètres SEO ont été enregistrés.");
      await Promise.all([utils.admin.seo.list.invalidate(), utils.admin.overview.invalidate(), utils.site.seo.invalidate()]);
    },
  });

  // Export orders to CSV function
  const exportOrdersCsv = () => {
    const data = orders.data ?? [];
    if (!data.length) {
      toast.error("Aucune commande à exporter.");
      return;
    }

    const headers = [
      "ID",
      "Reference",
      "Date",
      "Client",
      "Telephone",
      "Email",
      "Adresse",
      "Gouvernorat",
      "Articles",
      "Total DT",
      "Statut",
      "Educator",
    ];

    const rows = data.map((o: any) => [
      o.id,
      o.orderNumber || o.order_number || `#${o.id}`,
      new Date(o.createdAt || o.created_at || Date.now()).toLocaleDateString("fr-TN"),
      `"${((o.customerFirstName || o.customer_first_name || "") + " " + (o.customerLastName || o.customer_last_name || "")).trim()}"`,
      `"${o.customerPhone || o.customer_phone || ""}"`,
      `"${o.customerEmail || o.customer_email || ""}"`,
      `"${(o.deliveryAddress || o.delivery_address || "").replace(/"/g, '""')}"`,
      `"${o.governorate || o.city || ""}"`,
      `"${(o.items || o.order_items || []).map((i: any) => `${i.productTitle || i.product_title || "Livre"} (x${i.quantity || 1})`).join("; ")}"`,
      o.totalAmount || o.total_amount || "0.00",
      o.status,
      (o.isEducator || o.is_educator) ? "Oui" : "Non",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `commandes-livrespro-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV exporté pour les livreurs.");
  };

  // Render Tabs
  if (tab === "orders") {
    return (
      <OrderManager
        orders={orders.data ?? []}
        onUpdateStatus={(orderId, status) => updateOrderStatusMutation.mutate({ orderId, status })}
        onUpdateDetails={(data) => updateOrderDetailsMutation.mutate(data)}
        onDeleteOrder={(orderId) => deleteOrderMutation.mutate({ orderId })}
        onExportCsv={exportOrdersCsv}
        loading={orders.isLoading}
      />
    );
  }

  if (tab === "products") {
    return (
      <ProductManager
        rows={products.data ?? []}
        categories={categories.data ?? []}
        onSave={(data) => saveProductMutation.mutate(data)}
        onQuickUpdate={(data) => updateProductQuickMutation.mutate(data)}
        onDelete={(id) => deleteProductMutation.mutate({ id })}
        saving={saveProductMutation.isPending}
      />
    );
  }

  if (tab === "categories") {
    return (
      <CategoryManager
        rows={categories.data ?? []}
        onSave={(data) => saveCategoryMutation.mutate(data)}
        onDelete={(id) => deleteCategoryMutation.mutate({ id })}
        saving={saveCategoryMutation.isPending}
      />
    );
  }

  if (tab === "authors") {
    return (
      <AuthorManager
        rows={authors.data ?? []}
        onSave={(data) => saveAuthorMutation.mutate(data)}
        onDelete={(id) => deleteAuthorMutation.mutate({ id })}
        saving={saveAuthorMutation.isPending}
      />
    );
  }

  if (tab === "educator") {
    const educator = (content.data ?? []).find((row: any) => row.key === "educator-offer");
    return <EducatorAdmin row={educator} onSave={(payload) => saveContent.mutate(payload)} saving={saveContent.isPending} />;
  }

  if (tab === "content") {
    return <ContentManager rows={content.data ?? []} onSave={(p) => saveContent.mutate(p)} saving={saveContent.isPending} />;
  }

  if (tab === "seo") {
    return <SeoManager rows={seo.data ?? []} onSave={(p) => saveSeo.mutate(p)} saving={saveSeo.isPending} />;
  }

  if (tab === "audience") {
    const audienceData = audience.data ?? overview.data?.analytics;
    const maxPageViews = Math.max(1, ...(audienceData?.topPages?.map((row: any) => row.total) ?? [0]));
    return <AudiencePanel data={audienceData} maxPageViews={maxPageViews} />;
  }

  // Default: Overview with Rich Recharts Graphics
  const ov = overview.data;
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-1 py-3 md:px-4 md:py-8">
      {/* Overview Header */}
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Tableau de bord interactif</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl leading-none tracking-[-0.04em]">
            Le bureau éditorial & analytics.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52606B]">
            Indicateurs en temps réel, chiffre d'affaires, répartition des livraisons en Tunisie et suivi des ventes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="w-fit border-[#C94E36]/30 bg-[#F9E5E0] px-3 py-1.5 text-[#A93D2D] font-bold">
            Paiements COD Tunisie
          </Badge>
          <Button
            onClick={exportOrdersCsv}
            variant="outline"
            size="sm"
            className="border-[#172C41]/20 hover:bg-[#F8F5EE] text-xs font-semibold"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={TrendingUp}
          label="Chiffre d’affaires"
          value={`${ov?.totalRevenue ? ov.totalRevenue.toFixed(2) : "0.00"} DT`}
          note="hors commandes annulées"
          highlight
        />
        <Metric
          icon={ShoppingBag}
          label="Commandes totales"
          value={String(ov?.totalOrders ?? 0)}
          note="enregistrées sur la boutique"
        />
        <Metric
          icon={Package}
          label="Panier moyen"
          value={`${ov?.averageOrderValue ? ov.averageOrderValue.toFixed(2) : "65.00"} DT`}
          note="valeur moyenne par commande"
        />
        <Metric
          icon={GraduationCap}
          label="Commandes Educator"
          value={String(ov?.educatorOrdersCount ?? 0)}
          note="enseignants & formateurs"
        />
      </div>

      {/* Main Interactive Graph: Revenue & Orders Timeline */}
      <div className="border border-[#172C41]/10 bg-white p-6 shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
          <div>
            <h2 className="font-display text-2xl text-[#141E33]">Évolution des Ventes & Volume de Commandes</h2>
            <p className="text-xs text-[#52606B]">Chiffre d'affaires journalier (TND) et commandes passées sur les 14 derniers jours.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#BC3B2C]" />
              Chiffre d'affaires (DT)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#1E5FC2]" />
              Commandes
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ov?.salesTrend ?? []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BC3B2C" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#BC3B2C" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E5FC2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E5FC2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="label" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip
                formatter={(value: any, name: any) => [
                  name === "revenue" ? `${Number(value).toFixed(2)} DT` : `${value} commande(s)`,
                  name === "revenue" ? "Chiffre d'affaires" : "Commandes",
                ]}
                contentStyle={{
                  backgroundColor: "#141E33",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#BC3B2C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#1E5FC2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Status Breakdown & Regional Deliveries */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Status Distribution */}
        <div className="border border-[#172C41]/10 bg-white p-6 shadow-sm rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl text-[#141E33]">Statuts des Commandes</h3>
            <p className="text-xs text-[#52606B]">Répartition des flux logistiques (En attente, Expédiées, Livrées).</p>
          </div>

          <div className="my-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ov?.ordersByStatus ?? []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(ov?.ordersByStatus ?? []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#BC3B2C"} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: any, name: any) => [`${val} commande(s)`, name]}
                  contentStyle={{
                    backgroundColor: "#141E33",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value: any) => <span className="text-xs font-medium text-[#141E33]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deliveries by Governorate */}
        <div className="border border-[#172C41]/10 bg-white p-6 shadow-sm rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl text-[#141E33]">Top Régions de Livraison (Tunisie)</h3>
            <p className="text-xs text-[#52606B]">Gouvernorats concentrant le plus de commandes physiques.</p>
          </div>

          <div className="my-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ov?.ordersByGovernorate ?? []}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={11} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#141E33" fontSize={11} tickLine={false} width={80} />
                <RechartsTooltip
                  formatter={(val: any) => [`${val} commande(s)`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "#141E33",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#BC3B2C" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        <QuickAction
          icon={ShoppingBag}
          title="Commandes"
          value={`${ov?.totalOrders ?? 0} commande(s)`}
          text="Consultez les adresses, coordonnées clients et exportez pour les livreurs."
          onClick={() => setLocation("/admin/commandes")}
        />
        <QuickAction
          icon={BookOpen}
          title="Catalogue"
          value={`${ov?.totalProducts ?? 0} livre(s)`}
          text="Modifiez les prix, contrôlez les stocks et créez de nouveaux titres."
          onClick={() => setLocation("/admin/produits")}
        />
        <QuickAction
          icon={FileSearch}
          title="Référencement"
          value={`${ov?.seoPages ?? 0} page(s)`}
          text="Contrôlez les balises Google et métadonnées par URL."
          onClick={() => setLocation("/admin/seo")}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Interactive Order Manager Subcomponent (with Filter, Search, Edit Modal)
// -----------------------------------------------------------------------------
function OrderManager({
  orders,
  onUpdateStatus,
  onUpdateDetails,
  onDeleteOrder,
  onExportCsv,
  loading,
}: {
  orders: Array<any>;
  onUpdateStatus: (orderId: number, status: any) => void;
  onUpdateDetails: (data: any) => void;
  onDeleteOrder: (orderId: number) => void;
  onExportCsv: () => void;
  loading: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [governorateFilter, setGovernorateFilter] = useState<string>("all");
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const name = `${o.customerFirstName || o.customer_first_name || ""} ${o.customerLastName || o.customer_last_name || ""}`.toLowerCase();
      const phone = (o.customerPhone || o.customer_phone || "").toLowerCase();
      const email = (o.customerEmail || o.customer_email || "").toLowerCase();
      const ref = (o.orderNumber || o.order_number || `#${o.id}`).toLowerCase();
      const city = (o.city || "").toLowerCase();
      const gov = (o.governorate || "").toLowerCase();

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        name.includes(term) ||
        phone.includes(term) ||
        email.includes(term) ||
        ref.includes(term) ||
        city.includes(term) ||
        gov.includes(term);

      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesGov = governorateFilter === "all" || o.governorate === governorateFilter;

      return matchesSearch && matchesStatus && matchesGov;
    });
  }, [orders, searchTerm, statusFilter, governorateFilter]);

  // Extract unique governorates from existing orders
  const availableGovernorates = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.governorate) set.add(o.governorate);
    });
    return Array.from(set).sort();
  }, [orders]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      const st = o.status || "new";
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Commerce & Expéditions</p>
          <h1 className="mt-2 font-display text-4xl">Commandes à la livraison (COD)</h1>
          <p className="mt-2 text-xs text-[#52606B]">
            Recherche avancée, modification des coordonnées clients, statuts logistiques et export pour coursiers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onExportCsv} className="bg-[#172C41] text-white hover:bg-[#263f58]">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="space-y-4 rounded-xl border border-[#172C41]/10 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#52606B]" />
            <Input
              type="text"
              placeholder="Rechercher par client, téléphone (+216), référence ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-[#172C41]/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-[#52606B] hover:text-[#141E33]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Governorate Filter */}
          <div>
            <select
              aria-label="Filtrer par gouvernorat"
              value={governorateFilter}
              onChange={(e) => setGovernorateFilter(e.target.value)}
              className="h-10 w-full rounded-md border border-[#172C41]/20 bg-white px-3 text-xs font-semibold text-[#141E33] outline-none"
            >
              <option value="all">Tous les gouvernorats ({orders.length})</option>
              {availableGovernorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#172C41]/08">
          {[
            { key: "all", label: "Toutes" },
            { key: "new", label: "Nouvelles" },
            { key: "confirmed", label: "Confirmées" },
            { key: "processing", label: "En cours" },
            { key: "shipped", label: "Expédiées" },
            { key: "delivered", label: "Livrées" },
            { key: "cancelled", label: "Annulées" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab.key
                  ? "bg-[#172C41] text-white shadow-xs"
                  : "bg-[#F8F5EE] text-[#52606B] hover:bg-[#E9E2D7] hover:text-[#172C41]"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                statusFilter === tab.key ? "bg-white/20 text-white" : "bg-black/10 text-[#52606B]"
              }`}>
                {statusCounts[tab.key] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto border border-[#172C41]/10 bg-white rounded-xl shadow-sm">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-[#F8F5EE] text-[10px] uppercase tracking-wider text-[#52606B]">
            <tr>
              <th className="p-3">Réf.</th>
              <th className="p-3">Client</th>
              <th className="p-3">Téléphone & WhatsApp</th>
              <th className="p-3">Adresse & Région</th>
              <th className="p-3">Articles</th>
              <th className="p-3">Total</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172C41]/10">
            {filteredOrders.map((o: any) => {
              const phone = o.customerPhone || o.customer_phone || "";
              const cleanPhone = phone.replace(/[^0-9]/g, "");
              const waNumber = cleanPhone.startsWith("216") ? cleanPhone : `216${cleanPhone}`;

              return (
                <tr key={o.id} className="hover:bg-[#F8F5EE]/40 transition">
                  <td className="p-3 font-bold text-[#C94E36]">{o.orderNumber || o.order_number || `#${o.id}`}</td>
                  <td className="p-3 font-semibold">
                    {(o.customerFirstName || o.customer_first_name || "") + " " + (o.customerLastName || o.customer_last_name || "")}
                    {Boolean(o.isEducator === 1 || o.is_educator === 1) && (
                      <span className="ml-1.5 inline-flex items-center rounded-full bg-[#B71922]/10 px-2 py-0.5 text-[9px] font-bold text-[#B71922]">
                        Educator
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#172C41]">{phone || "-"}</span>
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Contacter sur WhatsApp"
                          className="grid h-6 w-6 place-items-center rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="max-w-xs p-3 text-xs text-[#52606B]">
                    <p className="font-semibold text-[#172C41]">{o.governorate || o.city || "Tunisie"}</p>
                    <p className="truncate">{o.deliveryAddress || o.delivery_address || "-"}</p>
                  </td>
                  <td className="p-3 text-xs">
                    {(o.items || o.order_items || []).map((it: any, idx: number) => (
                      <div key={idx} className="font-medium text-[#172C41]">
                        {it.productTitle || it.product_title || "Livre"} <span className="text-[#C94E36]">× {it.quantity || 1}</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-display text-base font-bold text-[#172C41]">
                    {o.totalAmount || o.total_amount || "0.00"} DT
                  </td>
                  <td className="p-3">
                    <select
                      aria-label="Statut de la commande"
                      value={o.status}
                      onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                      className="border border-[#172C41]/20 bg-white px-2 py-1 text-xs font-semibold rounded-md shadow-2xs"
                    >
                      <option value="new">Nouvelle</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En préparation</option>
                      <option value="shipped">Expédiée (En route)</option>
                      <option value="delivered">Livrée (Payée)</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingOrder(o)}
                        className="h-8 px-2.5 text-xs font-semibold border-[#172C41]/20 hover:bg-[#F8F5EE]"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1 text-[#172C41]" />
                        Détails
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Supprimer la commande ${o.orderNumber || `#${o.id}`} ?`)) {
                            onDeleteOrder(o.id);
                          }
                        }}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filteredOrders.length && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-sm text-[#52606B]">
                  {loading ? "Chargement des commandes..." : "Aucune commande ne correspond aux filtres appliqués."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={(data) => {
            onUpdateDetails({ orderId: editingOrder.id, ...data });
            setEditingOrder(null);
          }}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Order Details & Edit Modal
// -----------------------------------------------------------------------------
function OrderEditModal({
  order,
  onClose,
  onSave,
}: {
  order: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    customerFirstName: order.customerFirstName || order.customer_first_name || "",
    customerLastName: order.customerLastName || order.customer_last_name || "",
    customerPhone: order.customerPhone || order.customer_phone || "",
    deliveryAddress: order.deliveryAddress || order.delivery_address || "",
    city: order.city || "",
    governorate: order.governorate || "Tunis",
    orderNotes: order.orderNotes || order.order_notes || "",
    status: order.status || "new",
  });

  const items = order.items || order.order_items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-[#172C41]/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[#141E33]">
              Commande {order.orderNumber || order.order_number || `#${order.id}`}
            </h3>
            <p className="text-xs text-[#52606B]">
              Date : {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString("fr-TN")} · Mode : COD
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Line Items List */}
        <div className="mt-4 rounded-xl bg-[#F8F5EE] p-4 text-xs space-y-2">
          <p className="font-bold uppercase tracking-wider text-[10px] text-[#52606B]">Articles commandés</p>
          {items.map((it: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center py-1 border-b border-[#141E33]/08 last:border-none">
              <div>
                <span className="font-bold text-[#141E33]">{it.productTitle || it.product_title || "Livre"}</span>
                <span className="text-[#52606B] ml-2">× {it.quantity || 1}</span>
              </div>
              <span className="font-mono font-bold text-[#BC3B2C]">{it.subtotal || it.unitPrice || "65.00"} DT</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 font-bold text-sm text-[#141E33]">
            <span>Total à encaisser :</span>
            <span>{order.totalAmount || order.total_amount || "0.00"} DT</span>
          </div>
        </div>

        {/* Editable fields */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="mt-6 space-y-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase font-bold text-[#141E33]">Prénom client</Label>
              <Input
                value={form.customerFirstName}
                onChange={(e) => setForm({ ...form, customerFirstName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs uppercase font-bold text-[#141E33]">Nom client</Label>
              <Input
                value={form.customerLastName}
                onChange={(e) => setForm({ ...form, customerLastName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase font-bold text-[#141E33]">Téléphone mobile</Label>
              <Input
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs uppercase font-bold text-[#141E33]">Statut logistique</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 h-10 w-full rounded-md border border-[#172C41]/20 bg-white px-3 text-sm"
              >
                <option value="new">Nouvelle</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiée (En route)</option>
                <option value="delivered">Livrée (Payée)</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Adresse de livraison</Label>
            <Input
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase font-bold text-[#141E33]">Gouvernorat</Label>
              <Input
                value={form.governorate}
                onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs uppercase font-bold text-[#141E33]">Ville / Région</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Notes de livraison / Remarques coursier</Label>
            <Textarea
              rows={2}
              value={form.orderNotes}
              onChange={(e) => setForm({ ...form, orderNotes: e.target.value })}
              className="mt-1"
              placeholder="Instructions particulières de livraison..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#172C41] text-white">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Product Manager Subcomponent (with Quick stock adjustments and delete)
// -----------------------------------------------------------------------------
function ProductManager({
  rows,
  categories,
  onSave,
  onQuickUpdate,
  onDelete,
  saving,
}: {
  rows: Array<any>;
  categories: Array<any>;
  onSave: (payload: any) => void;
  onQuickUpdate: (payload: any) => void;
  onDelete: (id: number) => void;
  saving: boolean;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("65.00");
  const [stockQuantity, setStockQuantity] = useState(100);
  const [format, setFormat] = useState<any>("PHYSICAL_BOOK");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState<any>("published");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setSlug(selected.slug);
      setPrice(selected.price);
      setStockQuantity(selected.stockQuantity ?? 100);
      setFormat(selected.format || "PHYSICAL_BOOK");
      setCoverImage(selected.coverImage || "");
      setDescription(selected.description || "");
      setCategoryId(selected.categoryId ?? null);
      setStatus(selected.status || "published");
      setFeatured(Boolean(selected.featured));
    }
  }, [selected]);

  const handleSave = () => {
    onSave({
      id: selectedId ?? undefined,
      title,
      slug,
      price,
      stockQuantity,
      format,
      coverImage,
      description,
      categoryId: categoryId || null,
      status,
      featured,
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    setTitle("");
    setSlug("");
    setPrice("45.00");
    setStockQuantity(100);
    setFormat("PHYSICAL_BOOK");
    setCoverImage("/editorial/b2b-launch/book-front.jpg");
    setDescription("");
    setCategoryId(categories[0]?.id ?? null);
    setStatus("published");
    setFeatured(false);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || r.title.toLowerCase().includes(term) || r.slug.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "all" || r.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [rows, searchTerm, categoryFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Catalogue & Stock</p>
          <h1 className="mt-2 font-display text-4xl">Livres & Publications</h1>
          <p className="mt-2 text-xs text-[#52606B]">Gérez les prix, les niveaux de stock et les informations éditoriales.</p>
        </div>
        <Button onClick={handleNew} className="bg-[#C94E36] text-white hover:bg-[#A93D2D]">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un livre
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* Left: Book List with Quick Controls */}
        <aside className="border border-[#172C41]/10 bg-[#FCFAF5] p-4 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#52606B]">
              Livres au catalogue ({filteredRows.length})
            </p>
          </div>

          <Input
            placeholder="Filtrer par titre ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 text-xs bg-white border-[#172C41]/20"
          />

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredRows.map((b) => (
              <div
                key={b.id}
                className={`w-full border p-3 rounded-lg transition ${
                  selectedId === b.id ? "border-[#C94E36] bg-[#F9E5E0]" : "border-[#172C41]/10 bg-white hover:border-[#172C41]/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(b.id)}
                    className="text-left flex-1"
                  >
                    <p className="font-display text-base font-bold text-[#172C41] hover:text-[#C94E36] transition">{b.title}</p>
                    <p className="text-[11px] text-[#52606B]">/{b.slug}</p>
                  </button>
                  <span className="font-bold text-sm text-[#C94E36] shrink-0">{b.price} DT</span>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#172C41]/08 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#52606B]">Stock :</span>
                    <span className="font-bold font-mono text-[#141E33]">{b.stockQuantity ?? 100}</span>
                    <button
                      onClick={() => onQuickUpdate({ id: b.id, stockQuantity: (b.stockQuantity ?? 100) + 5 })}
                      className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-700 hover:bg-gray-200"
                      title="Ajouter 5 exemplaires au stock"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => onQuickUpdate({ id: b.id, stockQuantity: Math.max(0, (b.stockQuantity ?? 100) - 1) })}
                      className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-700 hover:bg-gray-200"
                      title="Diminuer le stock de 1"
                    >
                      -1
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQuickUpdate({ id: b.id, featured: !b.featured })}
                      className={`p-1 rounded ${b.featured ? "text-amber-500" : "text-gray-300 hover:text-gray-500"}`}
                      title={b.featured ? "Livre en vedette" : "Mettre en vedette"}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer / Archiver le livre "${b.title}" ?`)) {
                          onDelete(b.id);
                        }
                      }}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50"
                      title="Supprimer / Archiver"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Full Book Form */}
        <section className="border border-[#172C41]/10 bg-white p-6 rounded-xl shadow-xs">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="font-display text-2xl text-[#172C41]">
              {selectedId ? "Modifier le livre" : "Nouveau livre"}
            </h2>
            {selectedId && (
              <Button size="sm" variant="ghost" onClick={handleNew} className="text-xs text-[#52606B]">
                Créer un nouveau
              </Button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider">Titre du livre *</Label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!selectedId) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                    );
                  }
                }}
                className="mt-1"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider">Identifiant URL (slug) *</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider">Prix en Dinars (TND) *</Label>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider">Rayon / Catégorie</Label>
                <select
                  aria-label="Catégorie"
                  value={categoryId ?? ""}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                  className="mt-1 h-10 w-full border border-[#172C41]/20 bg-white px-3 text-sm rounded-md"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider">Format</Label>
                <select
                  aria-label="Format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-1 h-10 w-full border border-[#172C41]/20 bg-white px-3 text-sm rounded-md"
                >
                  <option value="PHYSICAL_BOOK">Livre physique relié</option>
                  <option value="DIGITAL_BOOK">Guide / Format numérique</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider">Stock initial disponible</Label>
              <Input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider">URL Image de couverture</Label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/editorial/b2b-launch/book-front.jpg"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider">Description éditoriale</Label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Mettre en vedette (Hero / Première sélection)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold">
                <span>Statut :</span>
                <select
                  aria-label="Statut"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border px-2 py-1 text-xs rounded-md"
                >
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSave} disabled={saving || !title || !slug} className="bg-[#172C41] text-white">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Enregistrement…" : "Enregistrer le livre"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Category Manager Subcomponent
// -----------------------------------------------------------------------------
function CategoryManager({
  rows,
  onSave,
  onDelete,
  saving,
}: {
  rows: Array<any>;
  onSave: (p: any) => void;
  onDelete: (id: number) => void;
  saving: boolean;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setSlug(selected.slug);
      setDescription(selected.description || "");
    }
  }, [selected]);

  const handleNew = () => {
    setSelectedId(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Taxonomie</p>
          <h1 className="mt-2 font-display text-4xl">Rayons & Catégories</h1>
          <p className="mt-2 text-xs text-[#52606B]">Classement des livres de la librairie.</p>
        </div>
        <Button onClick={handleNew} className="bg-[#172C41] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border border-[#172C41]/10 bg-[#FCFAF5] p-4 rounded-xl space-y-2">
          {rows.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition ${
                selectedId === c.id ? "border-[#C94E36] bg-[#F9E5E0]" : "border-[#172C41]/10 bg-white"
              }`}
            >
              <button onClick={() => setSelectedId(c.id)} className="text-left flex-1">
                <p className="font-semibold text-sm text-[#141E33]">{c.name}</p>
                <p className="text-xs text-[#52606B]">/{c.slug}</p>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer la catégorie "${c.name}" ?`)) {
                    onDelete(c.id);
                  }
                }}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </aside>

        <section className="border border-[#172C41]/10 bg-white p-6 rounded-xl space-y-4">
          <h3 className="font-display text-xl text-[#141E33]">{selectedId ? "Modifier la catégorie" : "Ajouter une catégorie"}</h3>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Nom du rayon *</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!selectedId) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Slug URL *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>
          <Button
            onClick={() => onSave({ id: selectedId ?? undefined, name, slug, description })}
            disabled={saving || !name || !slug}
            className="bg-[#172C41] text-white"
          >
            Enregistrer
          </Button>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Author Manager Subcomponent
// -----------------------------------------------------------------------------
function AuthorManager({
  rows,
  onSave,
  onDelete,
  saving,
}: {
  rows: Array<any>;
  onSave: (p: any) => void;
  onDelete: (id: number) => void;
  saving: boolean;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [biography, setBiography] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setSlug(selected.slug);
      setBiography(selected.biography || "");
      setPhoto(selected.photo || "");
    }
  }, [selected]);

  const handleNew = () => {
    setSelectedId(null);
    setName("");
    setSlug("");
    setBiography("");
    setPhoto("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Éditorial</p>
          <h1 className="mt-2 font-display text-4xl">Auteurs & Experts</h1>
          <p className="mt-2 text-xs text-[#52606B]">Biographies des auteurs contributeurs.</p>
        </div>
        <Button onClick={handleNew} className="bg-[#172C41] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel auteur
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border border-[#172C41]/10 bg-[#FCFAF5] p-4 rounded-xl space-y-2">
          {rows.map((a) => (
            <div
              key={a.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition ${
                selectedId === a.id ? "border-[#C94E36] bg-[#F9E5E0]" : "border-[#172C41]/10 bg-white"
              }`}
            >
              <button onClick={() => setSelectedId(a.id)} className="text-left flex-1">
                <p className="font-semibold text-sm text-[#141E33]">{a.name}</p>
                <p className="text-xs text-[#52606B]">/{a.slug}</p>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer l'auteur "${a.name}" ?`)) {
                    onDelete(a.id);
                  }
                }}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </aside>

        <section className="border border-[#172C41]/10 bg-white p-6 rounded-xl space-y-4">
          <h3 className="font-display text-xl text-[#141E33]">{selectedId ? "Modifier l'auteur" : "Ajouter un auteur"}</h3>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Nom de l'auteur *</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!selectedId) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Slug URL *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Photo URL</Label>
            <Input value={photo} onChange={(e) => setPhoto(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase font-bold text-[#141E33]">Biographie</Label>
            <Textarea rows={4} value={biography} onChange={(e) => setBiography(e.target.value)} className="mt-1" />
          </div>
          <Button
            onClick={() => onSave({ id: selectedId ?? undefined, name, slug, biography, photo })}
            disabled={saving || !name || !slug}
            className="bg-[#172C41] text-white"
          >
            Enregistrer
          </Button>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Educator, Content, SEO, Audience Subcomponents
// -----------------------------------------------------------------------------
function EducatorAdmin({ row, onSave, saving }: { row: any; onSave: (p: any) => void; saving: boolean }) {
  const [trigger, setTrigger] = useState("B2B Brand Management — Tunisie");
  const [discount, setDiscount] = useState("30");
  const [audience, setAudience] = useState("Enseignants et Formateurs");
  const [companion, setCompanion] = useState("Guide Pédagogique Numérique");

  const save = () => {
    onSave({
      id: row?.id ?? undefined,
      key: "educator-offer",
      title: "Offre Educator & Académique",
      body: JSON.stringify({ trigger, discount, audience, companion }),
      status: "published",
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <h1 className="font-display text-4xl">Règle Educator & Remises</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border p-6 bg-white space-y-4 rounded-xl">
          <div>
            <Label className="text-xs font-bold uppercase">Livre déclencheur</Label>
            <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase">Remise (%)</Label>
            <Input value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase">Public éligible</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase">Support offert</Label>
            <Input value={companion} onChange={(e) => setCompanion(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={save} disabled={saving} className="bg-[#172C41] text-white">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </section>
      </div>
    </div>
  );
}

function ContentManager({ rows, onSave, saving }: { rows: Array<any>; onSave: (p: any) => void; saving: boolean }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (selected) {
      setKey(selected.key);
      setTitle(selected.title);
      setBody(selected.body || "");
    }
  }, [selected]);

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <h1 className="font-display text-4xl">Blocs de contenu</h1>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border p-4 bg-[#FCFAF5] space-y-2 rounded-xl">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`w-full p-3 text-left border rounded-lg ${selectedId === r.id ? "border-[#C94E36] bg-[#F9E5E0]" : "bg-white"}`}
            >
              <p className="font-semibold text-sm">{r.title}</p>
              <p className="text-xs text-[#52606B]">/{r.key}</p>
            </button>
          ))}
        </aside>
        <section className="border p-6 bg-white space-y-4 rounded-xl">
          <Input placeholder="Clé technique" value={key} onChange={(e) => setKey(e.target.value)} />
          <Input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Texte" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          <Button
            onClick={() => onSave({ id: selectedId ?? undefined, key, title, body, status: "published" })}
            disabled={saving || !key || !title}
            className="bg-[#172C41] text-white"
          >
            Enregistrer
          </Button>
        </section>
      </div>
    </div>
  );
}

function SeoManager({ rows, onSave, saving }: { rows: Array<any>; onSave: (p: any) => void; saving: boolean }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);
  const [path, setPath] = useState("/");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selected) {
      setPath(selected.path);
      setTitle(selected.title);
      setDescription(selected.description || "");
    }
  }, [selected]);

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <h1 className="font-display text-4xl">SEO & Référencement</h1>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border p-4 bg-[#FCFAF5] space-y-2 rounded-xl">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`w-full p-3 text-left border rounded-lg ${selectedId === r.id ? "border-[#C94E36] bg-[#F9E5E0]" : "bg-white"}`}
            >
              <p className="font-semibold text-sm">{r.path}</p>
              <p className="text-xs text-[#52606B]">{r.title}</p>
            </button>
          ))}
        </aside>
        <section className="border p-6 bg-white space-y-4 rounded-xl">
          <Input placeholder="Chemin (/librairie)" value={path} onChange={(e) => setPath(e.target.value)} />
          <Input placeholder="Titre SEO" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Meta description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button
            onClick={() => onSave({ id: selectedId ?? undefined, path, title, description, robots: "index" })}
            disabled={saving || !path || !title}
            className="bg-[#172C41] text-white"
          >
            Enregistrer
          </Button>
        </section>
      </div>
    </div>
  );
}

function AudiencePanel({ data }: { data?: any; maxPageViews: number }) {
  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div>
        <p className="eyebrow">Télémétrie respectueuse</p>
        <h1 className="mt-2 font-display text-4xl">Audience & Parcours Clients</h1>
        <p className="mt-2 text-xs text-[#52606B]">Données anonymisées sans traceurs tiers conformément aux standards de confidentialité.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Visiteurs uniques" value={String(data?.uniqueVisitors ?? 0)} note="identifiants anonymes" />
        <Metric icon={Eye} label="Pages vues" value={String(data?.pageViews ?? 0)} note="parcours consentis" />
        <Metric icon={BookOpenText} label="Fiches livre vues" value={String(data?.bookViews ?? 0)} note="intérêt produit" />
        <Metric icon={BarChart3} label="Ajouts panier" value={String(data?.cartAdds ?? 0)} note={`${data?.cartRate ?? 0}% conversion`} />
      </div>

      {/* Funnel Graph */}
      <div className="border border-[#172C41]/10 bg-white p-6 rounded-xl shadow-xs">
        <h3 className="font-display text-xl text-[#141E33]">Entonnoir d'Engagement & Conversion</h3>
        <p className="text-xs text-[#52606B]">Parcours de la découverte du site jusqu'à la commande confirmée.</p>

        <div className="my-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.funnel ?? []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="stage" stroke="#141E33" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} allowDecimals={false} />
              <RechartsTooltip
                formatter={(val: any) => [`${val} personnes`, "Volume"]}
                contentStyle={{
                  backgroundColor: "#141E33",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {(data?.funnel ?? []).map((entry: any, index: number) => (
                  <Cell key={`funnel-cell-${index}`} fill={entry.fill || "#BC3B2C"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
  highlight,
}: {
  icon: any;
  label: string;
  value: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div className={`border p-5 rounded-xl transition ${
      highlight
        ? "border-[#BC3B2C]/30 bg-[#BC3B2C]/05 shadow-xs"
        : "border-[#172C41]/10 bg-[#FCFAF5]"
    }`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#52606B]">{label}</p>
        <Icon className={`h-4 w-4 ${highlight ? "text-[#BC3B2C]" : "text-[#172C41]"}`} />
      </div>
      <p className={`mt-3 font-display text-3xl font-bold leading-none ${highlight ? "text-[#BC3B2C]" : "text-[#172C41]"}`}>
        {value}
      </p>
      <p className="mt-2 text-xs text-[#52606B]">{note}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  value,
  text,
  onClick,
}: {
  icon: any;
  title: string;
  value: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-[#172C41]/10 bg-[#FCFAF5] p-6 text-left rounded-xl transition hover:-translate-y-0.5 hover:border-[#172C41]/30 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-[#C94E36]" />
        <ArrowUpRight className="h-4 w-4 text-[#52606B]" />
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-[#141E33]">{title}</p>
      <p className="mt-1 text-sm font-semibold text-[#BC3B2C]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#52606B]">{text}</p>
    </button>
  );
}
