import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandMark } from "@/components/storefront/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin
  if (isAuthenticated && user?.role === "admin") {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      setLocation("/admin");
    } catch (err: any) {
      setError(err?.message || "Identifiants invalides. Veuillez vérifier votre adresse email et mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F5EE] text-[#172C41]">
      <header className="border-b border-[#172C41]/10 px-6 py-4">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <BrandMark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#52606B] hover:text-[#C94E36]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md border border-[#172C41]/15 bg-white p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E9E2D7] text-[#172C41]">
              <Lock className="h-5 w-5" />
            </span>
            <p className="eyebrow mt-4">Espace Privé</p>
            <h1 className="mt-2 font-display text-3xl">Administration</h1>
            <p className="mt-2 text-xs text-[#52606B]">
              Connectez-vous pour piloter les commandes, le catalogue et les contenus de LivresPro.tn.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                Adresse Email
              </Label>
              <div className="relative mt-1">
                <Input
                  type="email"
                  required
                  placeholder="admin@livrespro.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-[#172C41]">
                Mot de passe
              </Label>
              <div className="relative mt-1">
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#172C41]/20 bg-[#F8F5EE] pl-9"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#52606B]" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-[#172C41] py-5 text-xs font-extrabold uppercase tracking-widest text-[#F8F5EE] hover:bg-[#263f58]"
            >
              {loading ? "Vérification…" : "Se connecter"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[10px] text-[#52606B]">
            LivresPro.tn · Espace réservé aux administrateurs autorisés.
          </p>
        </div>
      </main>
    </div>
  );
}
