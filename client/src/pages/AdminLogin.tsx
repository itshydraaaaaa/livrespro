import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail, Shield, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated as admin, redirect to admin dashboard
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      setLocation("/admin");
    } else {
      // Non-admin user trying to access admin login — show 403 inline
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.user?.role === "admin") {
        toast.success("Authentification administrateur réussie");
        setLocation("/admin");
      } else {
        // Logged in but not admin
        setError("Ce compte n'a pas les droits d'administration. Accès refusé.");
        toast.error("Accès réservé aux administrateurs autorisés.");
      }
    } catch (err: any) {
      setError(err?.message || "Identifiants invalides. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#141E33] p-4 text-[#F6F1E7] selection:bg-[#BC3B2C]/30">
      {/* Back to site link */}
      <div className="mb-8 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique publique
        </Link>
      </div>

      {/* Admin Auth Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-md sm:p-10">
        {/* Icon & Title */}
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#BC3B2C]/20 text-[#BC3B2C] shadow-inner border border-[#BC3B2C]/30">
            <Shield className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#BC3B2C]">
            Accès Restreint
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            Administration
          </h1>
          <p className="mt-2 text-xs leading-5 text-white/50">
            Espace exclusivement réservé aux administrateurs autorisés de Liverspro.shop.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">
              Adresse Email Administrateur
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="email"
                required
                placeholder="admin@liverspro.shop"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-white/[0.07] pl-9 text-white placeholder:text-white/30 focus:border-[#BC3B2C] focus:ring-0"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-white/30" />
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">
              Mot de passe
            </Label>
            <div className="relative mt-1.5">
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/10 bg-white/[0.07] pl-9 text-white placeholder:text-white/30 focus:border-[#BC3B2C] focus:ring-0"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#BC3B2C] py-5 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg hover:bg-[#a83426] disabled:opacity-50 transition-all"
          >
            {loading ? "Vérification en cours…" : "Accéder au tableau de bord"}
          </Button>
        </form>

        {/* Security notice */}
        <p className="mt-6 text-center text-[10px] text-white/30">
          Toutes les tentatives de connexion sont enregistrées et surveillées.
        </p>
      </div>

      <p className="mt-8 text-[10px] text-white/20">
        © 2026 L'Atelier des Pages · Liverspro.shop
      </p>
    </div>
  );
}
