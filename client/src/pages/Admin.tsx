import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout, { type DashboardMenuItem } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  BookOpen,
  BookOpenText,
  Download,
  Eye,
  FileSearch,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  Plus,
  Save,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

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
  { icon: LineChart, label: "Audience", path: "/admin/audience" },
];

function frame(children: React.ReactNode) {
  return <DashboardLayout menuItems={adminMenu} brandName="LivresPro · Admin">{children}</DashboardLayout>;
}

export default function Admin({ tab }: { tab: AdminTab }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return frame(<div className="min-h-[70vh] flex items-center justify-center text-sm text-[#52606B]">Chargement…</div>);
  }

  if (!user || user.role !== "admin") {
    return frame(
      <section className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 text-center">
        <div>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E9E2D7] text-[#172C41]">
            <LockKeyhole className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-display text-4xl">Accès réservé</h1>
          <p className="mt-3 text-sm leading-6 text-[#52606B]">
            Veuillez vous connecter avec un compte administrateur pour accéder au back-office de LivresPro.tn.
          </p>
          <Button onClick={() => setLocation("/login")} className="mt-6 bg-[#172C41] text-white">
            Se connecter
          </Button>
        </div>
      </section>
    );
  }

  return frame(<AdminWorkspace tab={tab} />);
}

function AdminWorkspace({ tab }: { tab: AdminTab }) {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const overview = trpc.admin.overview.useQuery({ days: 30 });
  const audience = trpc.admin.audience.summary.useQuery({ days: 30 });
  const content = trpc.admin.content.list.useQuery(undefined, { enabled: tab === "content" || tab === "educator" });
  const orders = trpc.admin.orders.list.useQuery(undefined, { enabled: tab === "orders" });
  const products = trpc.admin.products.list.useQuery(undefined, { enabled: tab === "products" });
  const categories = trpc.admin.categories.list.useQuery(undefined, { enabled: tab === "categories" || tab === "products" });
  const authors = trpc.admin.authors.list.useQuery(undefined, { enabled: tab === "authors" || tab === "products" });
  const seo = trpc.admin.seo.list.useQuery(undefined, { enabled: tab === "seo" });

  const updateOrderStatusMutation = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut de commande mis à jour");
      utils.admin.orders.list.invalidate();
    },
  });

  const saveProductMutation = trpc.admin.products.save.useMutation({
    onSuccess: () => {
      toast.success("Livre enregistré dans le catalogue !");
      utils.admin.products.list.invalidate();
    },
    onError: (err) => toast.error(err.message || "Erreur lors de l'enregistrement du livre"),
  });

  const saveCategoryMutation = trpc.admin.categories.save.useMutation({
    onSuccess: () => {
      toast.success("Catégorie enregistrée !");
      utils.admin.categories.list.invalidate();
    },
  });

  const saveAuthorMutation = trpc.admin.authors.save.useMutation({
    onSuccess: () => {
      toast.success("Auteur enregistré !");
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
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString("fr-TN"),
      `"${o.customerFirstName} ${o.customerLastName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail}"`,
      `"${(o.deliveryAddress || "").replace(/"/g, '""')}"`,
      `"${o.governorate || ""}"`,
      `"${(o.items || []).map((i: any) => `${i.productTitle} (x${i.quantity})`).join("; ")}"`,
      o.totalAmount,
      o.status,
      o.isEducator ? "Oui" : "Non",
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
      <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
        <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Commerce & Expéditions</p>
            <h1 className="mt-2 font-display text-4xl">Commandes à la livraison (COD)</h1>
            <p className="mt-2 text-xs text-[#52606B]">
              Suivi des commandes passées sur le site, coordonnées clients, statuts et export livreurs.
            </p>
          </div>
          <Button onClick={exportOrdersCsv} className="bg-[#172C41] text-white hover:bg-[#263f58]">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>

        <div className="overflow-x-auto border border-[#172C41]/10 bg-white">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-[#F8F5EE] text-[10px] uppercase tracking-wider text-[#52606B]">
              <tr>
                <th className="p-3">Réf.</th>
                <th className="p-3">Client</th>
                <th className="p-3">Téléphone</th>
                <th className="p-3">Adresse & Région</th>
                <th className="p-3">Articles</th>
                <th className="p-3">Total</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172C41]/10">
              {(orders.data ?? []).map((o: any) => (
                <tr key={o.id} className="hover:bg-[#F8F5EE]/40">
                  <td className="p-3 font-bold text-[#C94E36]">{o.orderNumber || `#${o.id}`}</td>
                  <td className="p-3 font-semibold">
                    {o.customerFirstName} {o.customerLastName}
                    {o.isEducator === 1 && (
                      <span className="ml-1 inline-flex items-center rounded-full bg-[#B71922]/10 px-2 py-0.5 text-[9px] font-bold text-[#B71922]">
                        Educator
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-[#172C41]">{o.customerPhone}</td>
                  <td className="max-w-xs p-3 text-xs text-[#52606B]">
                    <p className="font-semibold text-[#172C41]">{o.governorate || "Tunis"}</p>
                    <p className="truncate">{o.deliveryAddress}</p>
                  </td>
                  <td className="p-3 text-xs">
                    {(o.items || []).map((it: any, idx: number) => (
                      <div key={idx} className="font-medium text-[#172C41]">
                        {it.productTitle} <span className="text-[#C94E36]">× {it.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-display text-base font-bold text-[#172C41]">
                    {o.totalAmount} DT
                  </td>
                  <td className="p-3">
                    <select
                      aria-label="Statut de la commande"
                      value={o.status}
                      onChange={(e) =>
                        updateOrderStatusMutation.mutate({
                          orderId: o.id,
                          status: e.target.value as any,
                        })
                      }
                      className="border border-[#172C41]/20 bg-white px-2 py-1 text-xs font-semibold rounded-sm"
                    >
                      <option value="new">Nouvelle</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En préparation</option>
                      <option value="shipped">Expédiée (En route)</option>
                      <option value="delivered">Livrée (Payée)</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="p-3 text-xs text-[#52606B]">
                    {new Date(o.createdAt).toLocaleDateString("fr-TN")}
                  </td>
                </tr>
              ))}
              {!(orders.data ?? []).length && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-[#52606B]">
                    Aucune commande enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (tab === "products") {
    return (
      <ProductManager
        rows={products.data ?? []}
        categories={categories.data ?? []}
        onSave={(data) => saveProductMutation.mutate(data)}
        saving={saveProductMutation.isPending}
      />
    );
  }

  if (tab === "categories") {
    return (
      <CategoryManager
        rows={categories.data ?? []}
        onSave={(data) => saveCategoryMutation.mutate(data)}
        saving={saveCategoryMutation.isPending}
      />
    );
  }

  if (tab === "authors") {
    return (
      <AuthorManager
        rows={authors.data ?? []}
        onSave={(data) => saveAuthorMutation.mutate(data)}
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
    const maxPageViews = Math.max(1, ...(audienceData?.topPages.map((row: any) => row.total) ?? [0]));
    return <AudiencePanel data={audienceData} maxPageViews={maxPageViews} />;
  }

  // Default: Overview
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Tableau de bord</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl leading-none tracking-[-0.04em]">
            Le bureau éditorial LivresPro.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52606B]">
            Pilotage centralisé du catalogue de livres, des commandes à la livraison et de l’audience.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-[#C94E36]/30 bg-[#F9E5E0] px-3 py-1.5 text-[#A93D2D]">
          30 derniers jours
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={ShoppingBag} label="Commandes totales" value={String(overview.data?.totalOrders ?? 0)} note="enregistrées sur le site" />
        <Metric icon={BookOpen} label="Livres au catalogue" value={String(overview.data?.totalProducts ?? 0)} note="titres actifs" />
        <Metric icon={Users} label="Visiteurs uniques" value={String(overview.data?.analytics.uniqueVisitors ?? 0)} note="avec consentement" />
        <Metric icon={Eye} label="Pages consultées" value={String(overview.data?.analytics.pageViews ?? 0)} note="parcours anonymisés" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <QuickAction
          icon={ShoppingBag}
          title="Commandes"
          value={`${overview.data?.totalOrders ?? 0} commande(s)`}
          text="Consultez les adresses de livraison et exportez pour les livreurs."
          onClick={() => setLocation("/admin/commandes")}
        />
        <QuickAction
          icon={BookOpen}
          title="Catalogue"
          value={`${overview.data?.totalProducts ?? 0} livre(s)`}
          text="Ajoutez de nouveaux titres, modifiez les prix et stocks."
          onClick={() => setLocation("/admin/produits")}
        />
        <QuickAction
          icon={FileSearch}
          title="Référencement"
          value={`${overview.data?.seoPages ?? 0} page(s)`}
          text="Contrôlez les balises Google et réseaux sociaux par URL."
          onClick={() => setLocation("/admin/seo")}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Product Manager Subcomponent
// -----------------------------------------------------------------------------
function ProductManager({
  rows,
  categories,
  onSave,
  saving,
}: {
  rows: Array<any>;
  categories: Array<any>;
  onSave: (payload: any) => void;
  saving: boolean;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);

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

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-2 font-display text-4xl">Livres & Publications</h1>
          <p className="mt-2 text-xs text-[#52606B]">Gérez les livres disponibles à la vente sur LivresPro.tn.</p>
        </div>
        <Button onClick={handleNew} className="bg-[#C94E36] text-white hover:bg-[#A93D2D]">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un livre
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border border-[#172C41]/10 bg-[#FCFAF5] p-4">
          <p className="px-2 pb-3 text-[10px] font-extrabold uppercase tracking-wider text-[#52606B]">
            Livres existants ({rows.length})
          </p>
          <div className="space-y-2">
            {rows.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedId(b.id)}
                className={`w-full border p-3 text-left transition ${
                  selectedId === b.id ? "border-[#C94E36] bg-[#F9E5E0]" : "border-[#172C41]/10 hover:border-[#172C41]/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-display text-base text-[#172C41]">{b.title}</p>
                  <span className="font-bold text-xs text-[#C94E36]">{b.price} DT</span>
                </div>
                <p className="mt-1 text-[11px] text-[#52606B]">/{b.slug}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="border border-[#172C41]/10 bg-white p-6">
          <h2 className="font-display text-2xl text-[#172C41]">
            {selectedId ? "Modifier le livre" : "Nouveau livre"}
          </h2>
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
                  className="mt-1 h-10 w-full border border-[#172C41]/20 bg-white px-3 text-sm outline-none"
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
                  className="mt-1 h-10 w-full border border-[#172C41]/20 bg-white px-3 text-sm outline-none"
                >
                  <option value="PHYSICAL_BOOK">Livre physique relié</option>
                  <option value="DIGITAL_BOOK">Guide / Format numérique</option>
                </select>
              </div>
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
              <label className="flex items-center gap-2 text-xs font-semibold">
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
                  className="border px-2 py-1 text-xs"
                >
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end pt-4">
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
function CategoryManager({ rows, onSave, saving }: { rows: Array<any>; onSave: (p: any) => void; saving: boolean }) {
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

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Classification</p>
          <h1 className="mt-2 font-display text-4xl">Rayons & Catégories</h1>
        </div>
        <Button
          onClick={() => {
            setSelectedId(null);
            setName("");
            setSlug("");
            setDescription("");
          }}
          className="bg-[#C94E36] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau rayon
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border border-[#172C41]/10 bg-[#FCFAF5] p-4">
          <div className="space-y-2">
            {rows.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full border p-3 text-left transition ${
                  selectedId === c.id ? "border-[#C94E36] bg-[#F9E5E0]" : "border-[#172C41]/10"
                }`}
              >
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-[#52606B]">/{c.slug}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="border border-[#172C41]/10 bg-white p-6 space-y-4">
          <h2 className="font-display text-2xl">{selectedId ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider">Nom du rayon</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!selectedId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider">Identifiant URL (slug)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>
          <div className="flex justify-end pt-3">
            <Button
              onClick={() => onSave({ id: selectedId ?? undefined, name, slug, description })}
              disabled={saving || !name || !slug}
              className="bg-[#172C41] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Author Manager Subcomponent
// -----------------------------------------------------------------------------
function AuthorManager({ rows, onSave, saving }: { rows: Array<any>; onSave: (p: any) => void; saving: boolean }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => rows.find((r) => r.id === selectedId), [rows, selectedId]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [biography, setBiography] = useState("");

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setSlug(selected.slug);
      setBiography(selected.biography || "");
    }
  }, [selected]);

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="flex flex-col gap-4 border-b border-[#172C41]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Auteurs</p>
          <h1 className="mt-2 font-display text-4xl">Profils d'Auteurs</h1>
        </div>
        <Button
          onClick={() => {
            setSelectedId(null);
            setName("");
            setSlug("");
            setBiography("");
          }}
          className="bg-[#C94E36] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvel auteur
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="border border-[#172C41]/10 bg-[#FCFAF5] p-4">
          <div className="space-y-2">
            {rows.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`w-full border p-3 text-left transition ${
                  selectedId === a.id ? "border-[#C94E36] bg-[#F9E5E0]" : "border-[#172C41]/10"
                }`}
              >
                <p className="font-semibold text-sm">{a.name}</p>
                <p className="text-xs text-[#52606B]">/{a.slug}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="border border-[#172C41]/10 bg-white p-6 space-y-4">
          <h2 className="font-display text-2xl">{selectedId ? "Modifier l'auteur" : "Nouvel auteur"}</h2>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider">Nom complet de l'auteur</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!selectedId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider">Identifiant URL (slug)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider">Biographie</Label>
            <Textarea value={biography} onChange={(e) => setBiography(e.target.value)} rows={4} className="mt-1" />
          </div>
          <div className="flex justify-end pt-3">
            <Button
              onClick={() => onSave({ id: selectedId ?? undefined, name, slug, biography })}
              disabled={saving || !name || !slug}
              className="bg-[#172C41] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Existing Helper Components (Content, SEO, Audience, Educator)
// -----------------------------------------------------------------------------
function EducatorAdmin({ row, onSave, saving }: { row?: any; onSave: (val: any) => void; saving: boolean }) {
  const defaults = {
    discount: "50",
    trigger: "B2B Brand Management — Tunisia Edition",
    companion: "Educator’s Guide & Case Study Companion — Tunisia Edition 2026",
    audience: "Enseignants et formateurs",
    enabled: true,
  };
  let parsed: any = defaults;
  try {
    parsed = { ...defaults, ...(row?.body ? JSON.parse(row.body) : {}) };
  } catch {}

  const [discount, setDiscount] = useState(String(parsed.discount));
  const [trigger, setTrigger] = useState(parsed.trigger);
  const [companion, setCompanion] = useState(parsed.companion);
  const [audience, setAudience] = useState(parsed.audience);
  const [enabled, setEnabled] = useState(Boolean(parsed.enabled));

  const save = () =>
    onSave({
      id: row?.id,
      key: "educator-offer",
      eyebrow: "Offre Educator",
      title: "Avantage Educator",
      body: JSON.stringify({ discount, trigger, companion, audience, enabled }),
      ctaLabel: "Découvrir l’offre Educator",
      ctaHref: "/educators",
      imageUrl: "/editorial/b2b-launch/book-front.jpg",
      status: enabled ? "published" : "draft",
    });

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <div className="border-b border-[#172C41]/10 pb-7">
        <p className="eyebrow">Conversion & Académique</p>
        <h1 className="mt-2 font-display text-4xl">Offre Educator</h1>
        <p className="mt-2 text-xs text-[#52606B]">Pilotez la remise professionnelle liée à l’achat du livre sans modifier le code.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <section className="border border-[#172C41]/10 bg-[#FCFAF5] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Conditions d’éligibilité</h2>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              Offre active
            </label>
          </div>
          <div>
            <Label className="text-xs font-bold uppercase">Remise (%)</Label>
            <Input value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase">Livre déclencheur</Label>
            <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase">Ressource numérique remisée</Label>
            <Input value={companion} onChange={(e) => setCompanion(e.target.value)} className="mt-1" />
          </div>
          <div className="flex justify-end pt-3">
            <Button onClick={save} disabled={saving} className="bg-[#172C41] text-white">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Enregistrement…" : "Enregistrer la règle"}
            </Button>
          </div>
        </section>
        <aside className="border border-[#B71922]/20 bg-[#FFFDFC] p-7">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#B71922]">Aperçu client</p>
          <div className="mt-5 inline-flex bg-[#B71922] px-3 py-2 text-[10px] font-bold uppercase text-white">Offre Educator</div>
          <h2 className="mt-4 font-display text-3xl">Vous enseignez ou formez au marketing ?</h2>
          <p className="mt-4 text-sm leading-6 text-[#52606B]">
            À l’achat de <strong>{trigger}</strong>, les {audience.toLowerCase()} éligibles bénéficient de <strong>{discount}% de remise</strong> sur la version numérique de <em>{companion}</em>.
          </p>
          <div className="mt-6 border-l-4 border-[#B71922] bg-[#F9E5E0] p-5">
            <p className="font-display text-5xl text-[#B71922]">−{discount}%</p>
          </div>
        </aside>
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
        <aside className="border p-4 bg-[#FCFAF5] space-y-2">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`w-full p-3 text-left border ${selectedId === r.id ? "border-[#C94E36] bg-[#F9E5E0]" : ""}`}
            >
              <p className="font-semibold">{r.title}</p>
              <p className="text-xs text-[#52606B]">/{r.key}</p>
            </button>
          ))}
        </aside>
        <section className="border p-6 bg-white space-y-4">
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
        <aside className="border p-4 bg-[#FCFAF5] space-y-2">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`w-full p-3 text-left border ${selectedId === r.id ? "border-[#C94E36] bg-[#F9E5E0]" : ""}`}
            >
              <p className="font-semibold">{r.path}</p>
              <p className="text-xs text-[#52606B]">{r.title}</p>
            </button>
          ))}
        </aside>
        <section className="border p-6 bg-white space-y-4">
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

function AudiencePanel({ data, maxPageViews }: { data?: any; maxPageViews: number }) {
  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-3 md:px-4 md:py-8">
      <h1 className="font-display text-4xl">Audience & Comportements</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Visiteurs" value={String(data?.uniqueVisitors ?? 0)} note="identifiants anonymes" />
        <Metric icon={Eye} label="Pages vues" value={String(data?.pageViews ?? 0)} note="parcours consentis" />
        <Metric icon={BookOpenText} label="Fiches livre" value={String(data?.bookViews ?? 0)} note="intérêt produit" />
        <Metric icon={BarChart3} label="Ajouts panier" value={String(data?.cartAdds ?? 0)} note={`${data?.cartRate ?? 0}% conversion`} />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: any; label: string; value: string; note: string }) {
  return (
    <div className="border border-[#172C41]/10 bg-[#FCFAF5] p-5">
      <Icon className="h-4 w-4 text-[#C94E36]" />
      <p className="mt-5 text-[10px] font-extrabold uppercase tracking-wider text-[#52606B]">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none">{value}</p>
      <p className="mt-2 text-xs text-[#52606B]">{note}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, title, value, text, onClick }: { icon: any; title: string; value: string; text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-[#172C41]/10 bg-[#FCFAF5] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#172C41]/30"
    >
      <Icon className="h-5 w-5 text-[#C94E36]" />
      <p className="mt-5 font-display text-3xl">{title}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[#52606B]">{text}</p>
    </button>
  );
}
