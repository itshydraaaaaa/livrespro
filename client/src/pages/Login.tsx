import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandMark } from "@/components/storefront/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, ShieldAlert, User, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register, user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectTarget = searchParams?.get("redirect");

  // If already authenticated, redirect to appropriate area
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      setLocation(redirectTarget && redirectTarget.startsWith("/admin") ? redirectTarget : "/admin");
    } else {
      setLocation("/mon-compte");
    }
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res?.user?.role === "admin") {
        toast.success("Connexion administrateur réussie");
        setLocation(redirectTarget && redirectTarget.startsWith("/admin") ? redirectTarget : "/admin");
      } else {
        if (redirectTarget && redirectTarget.startsWith("/admin")) {
          toast.error("Votre compte lecteur n'a pas accès à l'administration.");
        } else {
          toast.success("Connexion réussie");
        }
        setLocation("/mon-compte");
      }
    } catch (err: any) {
      setError(err?.message || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (registerPassword !== registerConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      const isAdmin = res?.user?.role === "admin";
      setSuccessMsg(
        isAdmin
          ? "Compte administrateur créé ! Redirection vers le tableau de bord..."
          : "Compte client créé avec succès ! Bienvenue sur LivresPro.tn..."
      );
      setTimeout(() => {
        setLocation(isAdmin ? "/admin" : "/mon-compte");
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Impossible de créer le compte avec cette adresse email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      {/* Top Header */}
      <header className="border-b border-[#141E33]/10 bg-white/70 px-6 py-4 backdrop-blur-md">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/librairie"
              className="text-xs font-bold uppercase tracking-wider text-[#5C574C] hover:text-[#141E33] transition-colors"
            >
              La Librairie
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C574C] hover:text-[#BC3B2C] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="card-depth w-full max-w-lg rounded-2xl border border-[#141E33]/15 bg-white p-8 shadow-2xl sm:p-10">
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#E9DFCF] text-[#141E33] shadow-xs">
              <Lock className="h-5 w-5" />
            </span>
            <p className="eyebrow mt-4 text-[#BC3B2C]">Espace Membre & Gestion</p>
            <h1 className="mt-2 font-display text-3xl text-[#141E33]">
              {activeTab === "login" ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-xs text-[#5C574C]">
              Accédez au tableau de bord, au suivi des commandes et à la gestion du catalogue LivresPro.tn.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#F6F1E7] p-1 border border-[#141E33]/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-white text-[#141E33] shadow-sm"
                  : "text-[#5C574C] hover:text-[#141E33]"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-white text-[#141E33] shadow-sm"
                  : "text-[#5C574C] hover:text-[#141E33]"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Inscription
            </button>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mt-5 flex items-start gap-3 border border-red-200 bg-red-50 p-3 text-xs text-red-800 rounded-sm">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-5 flex items-start gap-3 border border-green-200 bg-green-50 p-3 text-xs text-green-800 rounded-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                  Adresse Email
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    required
                    placeholder="admin@livrespro.tn"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border-[#141E33]/20 bg-[#F6F1E7] pl-9 text-[#141E33] focus:border-[#BC3B2C]"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5C574C]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#141E33]">
                    Mot de passe
                  </Label>
                </div>
                <div className="relative mt-1">
                  <Input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border-[#141E33]/20 bg-[#F6F1E7] pl-9 text-[#141E33] focus:border-[#BC3B2C]"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5C574C]" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#141E33] py-5 text-xs font-extrabold uppercase tracking-widest text-[#F6F1E7] hover:bg-[#BC3B2C] shadow-md transition-all"
              >
                {loading ? "Connexion en cours…" : "Se connecter"}
              </Button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-[#141E33]">
                  Nom et Prénom
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    required
                    placeholder="Walid Kallel"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="border-[#141E33]/20 bg-[#F6F1E7] pl-9 text-[#141E33] focus:border-[#BC3B2C]"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#5C574C]" />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-[#141E33]">
                  Adresse Email
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    required
                    placeholder="votre.email@exemple.tn"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="border-[#141E33]/20 bg-[#F6F1E7] pl-9 text-[#141E33] focus:border-[#BC3B2C]"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5C574C]" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#141E33]">
                    Mot de passe
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="password"
                      required
                      placeholder="Min. 6 caractères"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="border-[#141E33]/20 bg-[#F6F1E7] pl-9 text-[#141E33] focus:border-[#BC3B2C]"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5C574C]" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#141E33]">
                    Confirmation
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="password"
                      required
                      placeholder="Confirmer"
                      value={registerConfirm}
                      onChange={(e) => setRegisterConfirm(e.target.value)}
                      className="border-[#141E33]/20 bg-[#F6F1E7] pl-9 text-[#141E33] focus:border-[#BC3B2C]"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5C574C]" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="btn-terracotta w-full rounded-xl py-5 text-xs font-extrabold uppercase tracking-widest text-white shadow-md disabled:opacity-50"
              >
                {loading ? "Création du compte…" : "Créer mon compte"}
              </Button>
            </form>
          )}


        </div>
      </main>
    </div>
  );
}
