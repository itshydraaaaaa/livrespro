import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const A = "/editorial/b2b-launch/";

export default function Educators() {
  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          {/* Ambient mesh glows */}
          <div className="ambient-mesh-glow -left-20 -top-20 h-96 w-96 bg-[#BC3B2C]/10" />
          <div className="ambient-mesh-glow right-0 top-1/3 h-96 w-96 bg-[#1E5FC2]/08" />

          <div className="container relative z-10 grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#BC3B2C] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-white shadow-xs">
                <GraduationCap className="h-4 w-4" /> Offre Spéciale Enseignants & Formateurs
              </div>
              <h1 className="mt-6 font-display text-[clamp(3.2rem,5.5vw,5.8rem)] leading-[.92] tracking-[-.04em] text-[#141E33]">
                Transformez le livre en expérience pédagogique.
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#5C574C]">
                L’<strong>Educator’s Guide & Case Study Companion — Tunisia Edition 2026</strong> est une ressource numérique exclusive réservée aux enseignants universitaires, formateurs exécutifs et directeurs de programmes académiques.
              </p>
              <div className="glass-panel mt-7 rounded-2xl border-l-4 border-[#BC3B2C] p-6 shadow-sm">
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-4xl text-[#BC3B2C]">−50 %</p>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C574C]">Tarif préférentiel</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#141E33]">
                  <strong>à l’achat de B2B Brand Management — Tunisia Edition</strong>, pour les enseignants et formateurs éligibles.
                </p>
              </div>
              <Link
                href="/livres/b2b-brand-management"
                className="btn-terracotta mt-7 inline-flex items-center gap-3 rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.15em] text-white shadow-md transition-all duration-300"
              >
                Acheter le livre & débloquer l’avantage <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="grid grid-cols-[1.05fr_.95fr] gap-4 rounded-3xl bg-[#E9DFCF]/80 p-6 sm:p-7 shadow-xl border border-white/60"
            >
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={`${A}book-front.jpg`}
                  loading="lazy"
                  decoding="async"
                  className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105"
                  alt="B2B Brand Management"
                />
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-[#141E33] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
                <div className="ambient-mesh-glow -right-10 -bottom-10 h-40 w-40 bg-[#BC3B2C]/30" />
                <div>
                  <GraduationCap className="h-8 w-8 text-[#E9DFCF]" />
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-[#E9DFCF]">
                    Tunisia Edition 2026
                  </p>
                  <h2 className="mt-3 font-display text-2xl sm:text-3xl leading-snug">
                    Educator’s Guide & Case Study Companion
                  </h2>
                </div>
                <div>
                  <p className="font-display text-5xl sm:text-6xl text-[#E9DFCF]">−50%</p>
                  <p className="mt-3 text-xs leading-5 text-white/70">
                    Version numérique enrichie · avantage appliqué lors de la confirmation d'éligibilité.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-[#141E33]/10 bg-[#141E33] py-20 text-white relative overflow-hidden">
          <div className="ambient-mesh-glow -left-20 top-0 h-64 w-64 bg-[#BC3B2C]/20" />
          <div className="container relative z-10 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                "Achetez le livre",
                "B2B Brand Management — Tunisia Edition déclenche l’éligibilité commerciale.",
              ],
              [
                "02",
                "Confirmez votre profil",
                "L’avantage est réservé aux enseignants, chercheurs et formateurs certifiés.",
              ],
              [
                "03",
                "Ajoutez le Guide",
                "Le tarif Educator à −50 % est appliqué automatiquement à la version numérique.",
              ],
            ].map(([n, t, b], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="border-t border-white/20 pt-6 transition-all"
              >
                <p className="font-display text-5xl font-bold text-[#E9DFCF]/90">{n}</p>
                <h3 className="mt-4 font-display text-2xl text-white">{t}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{b}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container py-24">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                Conditions de l’avantage
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[.94] text-[#141E33]">
                Une offre professionnelle, pas un coupon public.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#5C574C]">
                L’Atelier des Pages soutient activement l'excellence de l'enseignement supérieur tunisien en rendant les cas d'entreprises locales directement accessibles aux étudiants et professionnels en formation continue.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Profil enseignant ou formateur éligible (validation simplifiée)",
                "Achat préalable ou simultané de B2B Brand Management requis",
                "Remise de 50 % appliquée uniquement à l’Educator’s Guide numérique",
              ].map((x) => (
                <div key={x} className="flex gap-3.5 rounded-xl border border-[#141E33]/08 bg-white/70 p-4 text-sm text-[#141E33] shadow-xs backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#BC3B2C]" />
                  <span className="font-medium">{x}</span>
                </div>
              ))}
              <div className="flex gap-3.5 rounded-2xl bg-[#E9DFCF]/70 border border-[#141E33]/10 p-5 text-xs leading-5 text-[#5C574C]">
                <LockKeyhole className="h-5 w-5 shrink-0 text-[#141E33]" />
                <span>
                  Le back-office administrateur permet de modifier le taux de remise, le produit déclencheur, le produit remisé, les profils éligibles et l’activation de l’offre à tout moment.
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
