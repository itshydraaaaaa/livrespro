import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole } from "lucide-react";
import { Link } from "wouter";

const A = "/editorial/b2b-launch/";

export default function Educators() {
  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />
      <main>
        <section className="container grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#BC3B2C] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-white">
              <GraduationCap className="h-4 w-4" /> Educator offer
            </div>
            <h1 className="mt-6 font-display text-[clamp(3.6rem,6vw,6.5rem)] leading-[.88] tracking-[-.05em] text-[#141E33]">
              Transformez le livre en expérience pédagogique.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#5C574C]">
              L’<strong>Educator’s Guide & Case Study Companion — Tunisia Edition 2026</strong> est une ressource numérique réservée aux enseignants et formateurs.
            </p>
            <div className="mt-7 rounded-xl border-l-4 border-[#BC3B2C] bg-white p-6 shadow-sm">
              <p className="font-display text-4xl text-[#BC3B2C]">−50 %</p>
              <p className="mt-2 text-sm leading-6 text-[#141E33]">
                <strong>à l’achat de B2B Brand Management — Tunisia Edition</strong>, pour les enseignants et formateurs éligibles.
              </p>
            </div>
            <Link
              href="/livres/b2b-brand-management"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#141E33] px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.15em] text-white shadow-md transition-all duration-300 hover:bg-[#BC3B2C]"
            >
              Acheter le livre & débloquer l’avantage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-[1.05fr_.95fr] gap-4 rounded-2xl bg-[#E9DFCF] p-7 shadow-lg">
            <div className="overflow-hidden rounded-xl shadow-xl">
              <img
                src={`${A}book-front.jpg`}
                className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105"
                alt="B2B Brand Management"
              />
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-[#141E33] p-7 text-white shadow-xl">
              <GraduationCap className="h-8 w-8 text-[#E9DFCF]" />
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[.18em] text-[#E9DFCF]">
                Tunisia Edition 2026
              </p>
              <h2 className="mt-3 font-display text-3xl">Educator’s Guide & Case Study Companion</h2>
              <p className="mt-8 font-display text-6xl text-[#E9DFCF]">−50%</p>
              <p className="mt-3 text-xs leading-5 text-white/60">
                Version numérique · avantage conditionné à l’achat du livre.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#141E33]/10 bg-[#141E33] py-16 text-white">
          <div className="container grid gap-6 md:grid-cols-3">
            {[
              [
                "1",
                "Achetez le livre",
                "B2B Brand Management — Tunisia Edition déclenche l’éligibilité commerciale.",
              ],
              [
                "2",
                "Confirmez votre profil",
                "L’avantage est réservé aux enseignants et formateurs.",
              ],
              [
                "3",
                "Ajoutez le Guide",
                "Le prix Educator à −50 % est appliqué à la version numérique.",
              ],
            ].map(([n, t, b]) => (
              <div key={n} className="border-t border-white/20 pt-5">
                <p className="font-display text-5xl text-[#E9DFCF]">{n}</p>
                <h3 className="mt-4 font-display text-2xl text-white">{t}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                Conditions de l’avantage
              </p>
              <h2 className="mt-4 font-display text-5xl leading-[.92] text-[#141E33]">
                Une offre professionnelle, pas un coupon public.
              </h2>
            </div>
            <div className="space-y-4">
              {[
                "Profil enseignant ou formateur éligible",
                "Achat de B2B Brand Management requis",
                "Remise de 50 % appliquée uniquement à l’Educator’s Guide numérique",
              ].map((x) => (
                <div key={x} className="flex gap-3 border-b border-[#141E33]/10 pb-4 text-sm text-[#141E33]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#BC3B2C]" />
                  <span>{x}</span>
                </div>
              ))}
              <div className="flex gap-3 rounded-xl bg-[#E9DFCF] p-5 text-xs leading-5 text-[#5C574C]">
                <LockKeyhole className="h-5 w-5 shrink-0 text-[#141E33]" />
                <span>
                  Le back-office permet de modifier le taux de remise, le produit déclencheur, le produit remisé, les profils éligibles et l’activation de l’offre.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
