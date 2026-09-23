import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandMark } from "@/components/storefront/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, ShieldAlert, User, UserPlus } from "lucide-react";
import { Link } from "wouter";

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

  // If already authenticated and admin, redirect to admin dashboard
  if (isAuthenticated && user?.role === "admin") {
    setLocation("/admin");
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      setLocation("/admin");
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
      await register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      setSuccessMsg("Compte créé avec succès ! Redirection vers l'espace d'administration...");
      setTimeout(() => {
        setLocation("/admin");
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Impossible de créer le compte avec cette adresse email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5EE] text-[#172C41]">
      {/* Top Header */}
      <header className="border-b border-[#172C41]/10 bg-white/70 px-6 py-4 backdrop-blur-md">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/librairie"
              className="text-xs font-bold uppercase tracking-wider text-[#52606B] hover:text-[#172C41]"
            >
              La Librairie
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#52606B] hover:text-[#C94E36]"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg border border-[#172C41]/15 bg-white p-8 shadow-2xl sm:p-10">
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E9E2D7] text-[#172C41]">
              <Lock className="h-5 w-5" />
            </span>
            <p className="eyebrow mt-4">Espace Membre & Gestion</p>
            <h1 className="mt-2 font-display text-3xl text-[#172C41]">
              {activeTab === "login" ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="mt-2 text-xs text-[#52606B]">
              Accédez au tableau de bord, au suivi des commandes et à la gestion du catalogue LivresPro.tn.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="mt-6 grid grid-cols-2 rounded-lg bg-[#F8F5EE] p-1 border border-[#172C41]/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition ${
                activeTab === "login"
                  ? "bg-white text-[#172C41] shadow-sm"
                  : "text-[#52606B] hover:text-[#172C41]"
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
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition ${
                activeTab === "register"
                  ? "bg-white text-[#172C41] shadow-sm"
                  : "text-[#52606B] hover:text-[#172C41]"
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
                    className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
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
                    className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
                </div>
              </div>



              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#172C41] py-5 text-xs font-extrabold uppercase tracking-widest text-[#F8F5EE] hover:bg-[#263f58]"
              >
                {loading ? "Connexion en cours…" : "Se connecter"}
              </Button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                  Nom et Prénom
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    required
                    placeholder="Walid Kallel"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                  Adresse Email
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    required
                    placeholder="votre.email@exemple.tn"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                    Mot de passe
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="password"
                      required
                      placeholder="Min. 6 caractères"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                    Confirmation
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="password"
                      required
                      placeholder="Confirmer"
                      value={registerConfirm}
                      onChange={(e) => setRegisterConfirm(e.target.value)}
                      className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C94E36] py-5 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-[#A93D2D]"
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
