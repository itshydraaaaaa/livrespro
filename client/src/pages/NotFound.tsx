import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F1E7] p-4 text-[#141E33] antialiased">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#BC3B2C]/10 text-[#BC3B2C] shadow-inner mb-6">
          <Compass className="h-8 w-8 animate-spin-slow" />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#BC3B2C]">
          Erreur 404 · Page introuvable
        </p>

        <h1 className="mt-3 font-display text-3xl md:text-4xl font-normal tracking-tight text-[#141E33]">
          Cette page n’existe pas ou a été déplacée
        </h1>

        <p className="mt-4 text-sm md:text-base leading-relaxed text-[#5C574C]">
          L'ouvrage ou la section que vous cherchez n'est pas accessible à cette adresse. Vous pouvez explorer notre sélection business ou regagner l'accueil.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              className="w-full h-12 min-h-[44px] rounded-full bg-[#141E33] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#BC3B2C]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l’accueil
            </Button>
          </Link>
          <Link href="/librairie" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full h-12 min-h-[44px] rounded-full border-[#141E33]/20 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-[#141E33] transition-all hover:bg-white/80 hover:text-[#BC3B2C]"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              La Librairie
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
