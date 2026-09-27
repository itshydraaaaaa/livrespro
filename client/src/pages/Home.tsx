import { useRef } from "react";
import { AnimatedCounter } from "@/components/storefront/AnimatedCounter";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "wouter";

const A = "/editorial/b2b-launch/";

const proof = [
  ["100+", "participants au lancement"],
  ["50", "dirigeants & décideurs"],
  ["10–11", "médias présents"],
  ["30+", "publications"],
  ["10K+", "vues, réactions & partages"],
  ["95%+", "satisfaction"],
];

const caseStudies = [
  { name: "BIAT", logo: "biat.jpg" },
  { name: "Wallyscar", logo: "wallyscar.jpg" },
  { name: "MSB", logo: "msb.jpg" },
  { name: "ARVEA", logo: "arvea.jpg" },
  { name: "Gourmandise", logo: "gourmandise.jpg" },
  { name: "MPBS", logo: "mpbs.jpg" },
  { name: "CHO Group", logo: "cho-group.jpg" },
];

const transformations = [
  "Produit → Marque",
  "Notoriété → Préférence",
  "Communication → Stratégie",
  "Promesse → Expérience",
  "Identité → Architecture de marque",
  "Marketing isolé → Alignement",
];

const valueProps = [
  [
    "Être préféré",
    "Dépasser une comparaison fondée uniquement sur le prix et les caractéristiques.",
  ],
  [
    "Construire la confiance",
    "Réduire le risque perçu dans les décisions B2B.",
  ],
  ["Créer de la valeur", "Faire de la marque un actif stratégique."],
  [
    "Aligner l’organisation",
    "Relier stratégie, culture, expérience client et promesse.",
  ],
];

// Motion reveal variants with smooth easeOutExpo easing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const kickerReveal: Variants = {
  hidden: { opacity: 0, y: -6, letterSpacing: "0.14em" },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.22em",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const blurInUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const statScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export default function Home() {
  const prefersReduced = useReducedMotion();

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useTransform(
    heroProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [0, 45]
  );

  const darkSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: darkProgress } = useScroll({
    target: darkSectionRef,
    offset: ["start end", "end start"],
  });
  const darkParallaxY = useTransform(
    darkProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [-30, 30]
  );

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#141E33] selection:bg-[#BC3B2C]/20 selection:text-[#141E33]">
      <SiteHeader />
      <main>
        {/* SECTION 1: HERO */}
        <section
          id="livre"
          ref={heroSectionRef}
          className="relative overflow-hidden border-b border-[#141E33]/08 bg-[#F6F1E7]"
        >
          {/* Subtle warm depth gradient & ambient glowing orbs */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#E9DFCF]/40 via-transparent to-[#F6F1E7]" />
          <div className="ambient-mesh-glow -left-20 top-20 h-96 w-96 bg-[#BC3B2C]/10" />
          <div className="ambient-mesh-glow -right-20 top-40 h-[450px] w-[450px] bg-[#1E5FC2]/08" />

          <div className="container relative grid min-h-[720px] items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
            <motion.div
              className="max-w-3xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={kickerReveal} className="glass-panel inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#BC3B2C] animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-[.22em] text-[#BC3B2C]">
                  Tunisia Edition · B2B Brand Management
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="mt-6 font-display text-[clamp(3.8rem,7vw,7.4rem)] leading-[.86] tracking-[-.055em] text-[#141E33]"
              >
                Construire une marque B2B qui crée de la{" "}
                <span className="italic bg-gradient-to-r from-[#BC3B2C] via-[#BC3B2C] to-[#1E5FC2] bg-clip-text text-transparent">
                  préférence.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-7 text-xl font-semibold text-[#141E33]"
              >
                Philip Kotler · Waldemar Pfoertsch · Walid Kallel
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="mt-5 max-w-2xl text-base leading-7 text-[#5C574C]"
              >
                Une édition tunisienne qui relie les fondamentaux internationaux du B2B Brand Management à des études de cas et à la réalité des organisations tunisiennes.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/livres/b2b-brand-management"
                  className="btn-terracotta inline-flex items-center gap-3 rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.16em] text-white shadow-md"
                >
                  Commander le livre <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#decouvrir"
                  className="glass-panel inline-flex items-center rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#141E33] shadow-xs transition-all duration-300 hover:border-[#141E33] hover:bg-white hover:-translate-y-0.5"
                >
                  Découvrir le livre
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-9 flex flex-wrap gap-x-4 gap-y-2.5 text-xs font-semibold text-[#5C574C]"
              >
                <span className="glass-panel flex items-center gap-2 rounded-full px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BC3B2C]" />
                  Édition tunisienne
                </span>
                <span className="glass-panel flex items-center gap-2 rounded-full px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BC3B2C]" />
                  Études de cas tunisiennes
                </span>
                <span className="glass-panel flex items-center gap-2 rounded-full px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BC3B2C]" />
                  Disponible maintenant
                </span>
              </motion.div>
            </motion.div>

            {/* Book Cover with subtle 3D hover & scroll parallax */}
            <motion.div
              style={{ y: heroParallaxY }}
              className="relative mx-auto w-full max-w-[560px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute -inset-5 -z-10 translate-x-5 translate-y-5 rounded-3xl bg-[#E9DFCF]/80 backdrop-blur-xl shadow-lg border border-white/40" />
              <motion.div
                whileHover={{ scale: 1.015, translateY: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-[#141E33]/10"
              >
                <img
                  src={`${A}book-angle.jpg`}
                  alt="B2B Brand Management Tunisia Edition"
                  className="h-[610px] w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                {/* Floating Glassmorphic Pill on Book Cover */}
                <div className="glass-panel absolute bottom-6 left-6 z-20 flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold text-[#141E33] shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#BC3B2C] animate-pulse" />
                  <span>Édition Reliée · 65,00 DT</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: TRUST / AUTHOR BAR */}
        <section className="relative overflow-hidden border-y border-white/10 bg-[#141E33]/95 backdrop-blur-xl py-7 text-white">
          <div className="container relative z-10 flex flex-wrap items-center justify-between gap-5">
            <p className="text-sm font-semibold tracking-wide text-white/90">
              Une édition portée par trois regards complémentaires sur le marketing, la marque B2B et son application.
            </p>
            <div className="flex flex-wrap gap-6 text-xs font-extrabold uppercase tracking-[.16em] text-white/75">
              <span className="transition-colors hover:text-white">Philip Kotler</span>
              <span className="transition-colors hover:text-white">Waldemar Pfoertsch</span>
              <span className="transition-colors hover:text-white">Walid Kallel</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: POURQUOI CE LIVRE */}
        <section id="decouvrir" className="container relative py-20 md:py-28">
          <div className="ambient-mesh-glow -left-20 top-1/2 h-80 w-80 bg-[#E9DFCF]/60" />
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
            >
              <motion.p variants={kickerReveal} className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                Pourquoi ce livre
              </motion.p>
              <h2 className="mt-4 font-display text-5xl leading-[.92] tracking-[-.04em] text-[#141E33] md:text-6xl">
                Le branding B2B ne se résume pas à un logo.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#5C574C]">
                Quand les offres deviennent comparables et que plusieurs décideurs participent à l’achat, la marque aide à construire confiance, préférence et valeur.
              </p>
            </motion.div>

            {/* 4 Value Cards with blur-to-sharp focus transition & .glass-panel */}
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
            >
              {valueProps.map(([t, b]) => (
                <motion.div
                  variants={blurInUp}
                  key={t}
                  className="glass-panel flex flex-col justify-between rounded-2xl p-8 transition-all duration-300"
                >
                  <div>
                    <h3 className="font-display text-3xl text-[#141E33]">{t}</h3>
                    <p className="mt-4 text-sm leading-6 text-[#5C574C]">{b}</p>
                  </div>
                  <div className="mt-6 h-0.5 w-8 rounded-full bg-[#BC3B2C]/40" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: LE LANCEMENT (STATS) */}
        <section className="relative overflow-hidden border-y border-[#141E33]/08 bg-[#E9DFCF] py-20 md:py-24">
          <div className="ambient-mesh-glow -right-20 top-20 h-80 w-80 bg-white/40" />
          <div className="container relative z-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <motion.p variants={kickerReveal} className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                  Le lancement
                </motion.p>
                <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[.92] text-[#141E33] md:text-6xl">
                  Une édition présentée à l’écosystème business tunisien.
                </h2>
              </motion.div>
              <p className="text-sm leading-7 text-[#5C574C]">
                Des chiffres de la cérémonie de lancement, présentés comme repères d’activité et de mobilisation autour de cette première édition.
              </p>
            </div>

            {/* Event photo with glass framing */}
            <div className="mt-10 overflow-hidden rounded-2xl shadow-xl ring-1 ring-[#141E33]/10">
              <img
                src={`${A}audience.jpg`}
                alt="Cérémonie de lancement B2B Brand Management"
                className="aspect-[16/7] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Stats grid with animated number counters and frosted glass panels */}
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
            >
              {proof.map(([n, l]) => (
                <motion.div
                  variants={statScaleIn}
                  key={l}
                  className="glass-panel flex flex-col justify-center rounded-2xl p-6 text-center border border-white/80 transition-all duration-300"
                >
                  <p className="font-display text-4xl text-[#BC3B2C]">
                    <AnimatedCounter value={n} />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#5C574C]">{l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: CE QUE VOUS ALLEZ TRAVAILLER */}
        <section className="container relative py-20 md:py-28">
          <div className="ambient-mesh-glow right-10 top-1/3 h-72 w-72 bg-[#BC3B2C]/08" />
          <div className="relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <motion.p variants={kickerReveal} className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                Ce que vous allez travailler
              </motion.p>
              <h2 className="mt-4 max-w-4xl font-display text-5xl leading-[.92] text-[#141E33] md:text-6xl">
                Passer du produit à la marque. De la notoriété à la préférence.
              </h2>
            </motion.div>

            {/* Alternating left/right sliding pairs with .glass-panel */}
            <motion.div
              className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
            >
              {transformations.map((x, index) => (
                <motion.div
                  variants={index % 2 === 0 ? slideInLeft : slideInRight}
                  key={x}
                  className="glass-panel rounded-2xl border-t-4 border-t-[#BC3B2C] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="font-display text-2xl text-[#141E33]">{x}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 6: DARK INTERNATIONAL THINKING SECTION WITH SCROLL PARALLAX */}
        <section
          ref={darkSectionRef}
          className="relative overflow-hidden border-y border-white/10 bg-[#141E33] py-20 text-white md:py-24"
        >
          {/* Ambient luminous glow behind photo and text */}
          <div className="ambient-mesh-glow -right-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#BC3B2C]/20" />
          <div className="ambient-mesh-glow -left-20 top-1/3 h-[400px] w-[400px] rounded-full bg-[#1E5FC2]/15" />

          <div className="container relative z-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <motion.p variants={kickerReveal} className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#E9DFCF]">
                International thinking. Tunisian reality.
              </motion.p>
              <h2 className="mt-4 font-display text-5xl leading-[.92] text-white">
                Des principes internationaux confrontés aux décisions d’entreprises tunisiennes.
              </h2>
              <p className="mt-6 text-sm leading-7 text-white/70">
                Une édition qui rapproche les cadres du B2B Brand Management de cas et contextes locaux, pour rendre l’analyse plus concrète et directement discutable.
              </p>
            </motion.div>

            {/* Scroll-linked depth parallax on the dark-section photo */}
            <motion.div
              style={{ y: darkParallaxY }}
              className="glass-panel-dark overflow-hidden rounded-2xl shadow-2xl p-2.5 ring-1 ring-white/20"
            >
              <img
                src={`${A}recognition.jpg`}
                alt="Lancement et reconnaissance autour du livre"
                className="aspect-[4/3] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>
        </section>

        {/* SECTION 7: CASE STUDIES LOGO STRIP WITH MARQUEE */}
        <section
          id="cas"
          className="relative overflow-hidden border-y border-[#141E33]/10 bg-white/60 backdrop-blur-xl py-18 md:py-22"
        >
          <div className="ambient-mesh-glow left-1/3 top-10 h-72 w-72 bg-[#E9DFCF]/50" />
          <div className="container relative z-10">
            <motion.div
              className="max-w-3xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <motion.p variants={kickerReveal} className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                Case Studies · Tunisia Edition
              </motion.p>
              <h2 className="mt-4 font-display text-5xl leading-[.95] text-[#141E33]">
                Des entreprises tunisiennes au cœur du livre.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#5C574C]">
                L’édition tunisienne relie les principes du B2B Brand Management à des études de cas issues d’entreprises et d’organisations du marché tunisien. Une preuve de terrain qui donne au lecteur des situations concrètes à analyser.
              </p>
            </motion.div>

            {/* Responsive grid with frosted glass panels */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {caseStudies.map((x) => (
                <div
                  key={x.name}
                  className="glass-panel flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <img
                    src={`/editorial/case-study-logos/${x.logo}`}
                    alt={`Logo ${x.name}`}
                    className="h-14 w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#5C574C]">
                    {x.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-[#5C574C]/80">
              Entreprises et organisations présentées dans les études de cas de l’édition tunisienne.
            </p>
          </div>
        </section>

        {/* SECTION 8: EDUCATOR OFFER */}
        <section id="educator" className="container py-20 md:py-28">
          <div className="glass-panel grid overflow-hidden rounded-3xl shadow-xl lg:grid-cols-[.9fr_1.1fr]">
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#BC3B2C] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-white shadow-xs">
                  <GraduationCap className="h-4 w-4" /> Offre Educator
                </div>
                <h2 className="mt-6 font-display text-5xl leading-[.92] text-[#141E33]">
                  Vous enseignez ou formez au marketing ?
                </h2>
                <p className="mt-5 text-base leading-7 text-[#5C574C]">
                  À l’achat de <strong>B2B Brand Management — Tunisia Edition</strong>, les enseignants et formateurs éligibles bénéficient de <strong>50 % de remise</strong> sur la version numérique de l’<em>Educator’s Guide & Case Study Companion — Tunisia Edition 2026</em>.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/educators"
                    className="inline-flex items-center gap-2 rounded-full bg-[#141E33] px-7 py-4 text-[11px] font-extrabold uppercase tracking-[.14em] text-white transition-all duration-300 hover:bg-[#BC3B2C] hover:shadow-md"
                  >
                    Découvrir l’offre Educator <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 text-xs leading-5 text-[#5C574C]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#BC3B2C]" />
                Avantage réservé aux enseignants et formateurs, conditionné à l’achat du livre.
              </div>
            </div>

            <div className="grid min-h-[460px] grid-cols-2 bg-[#E9DFCF] p-8">
              <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-[#141E33]/10">
                <img
                  src={`${A}book-front.jpg`}
                  alt="B2B Brand Management"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center rounded-2xl bg-[#141E33] p-7 text-white shadow-xl">
                <GraduationCap className="h-8 w-8 text-[#E9DFCF]" />
                <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#E9DFCF]">
                  Digital companion
                </p>
                <h3 className="mt-3 font-display text-3xl">
                  Educator’s Guide & Case Study Companion
                </h3>
                <p className="mt-4 text-sm text-white/60">Tunisia Edition 2026</p>
                <p className="mt-8 font-display text-5xl text-[#E9DFCF]">−50%</p>
                <p className="mt-2 text-xs text-white/60">
                  avec achat du livre + statut Educator éligible
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: PHOTO GALLERY */}
        <section id="lancement" className="container pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-[#141E33]/08">
              <img
                src={`${A}speaker.jpg`}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Prise de parole au lancement"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-[#141E33]/08">
              <img
                src={`${A}community.jpg`}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Communauté autour du lancement"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-[#141E33]/08">
              <img
                src={`${A}media.jpg`}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Interview média lors du lancement"
              />
            </div>
          </div>

          {/* SECTION 10: CLOSING CTA BAND */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="glass-panel mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 shadow-md md:flex-row md:items-center md:p-10 border border-white/90"
          >
            <div>
              <motion.p variants={kickerReveal} className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#BC3B2C]">
                Tunisia Edition
              </motion.p>
              <h2 className="mt-2 font-display text-4xl text-[#141E33]">
                Faites du branding B2B un{" "}
                <span className="bg-gradient-to-r from-[#141E33] via-[#BC3B2C] to-[#BC3B2C] bg-clip-text text-transparent">
                  avantage stratégique.
                </span>
              </h2>
            </div>
            <Link
              href="/livres/b2b-brand-management"
              className="btn-terracotta inline-flex shrink-0 items-center gap-3 rounded-full px-8 py-4 text-[11px] font-extrabold uppercase tracking-[.16em] text-white shadow-md"
            >
              Commander <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
