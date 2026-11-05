import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Lock } from "lucide-react";

export interface BookChapterMeta {
  number: number;
  title: string;
  page: number;
  caseStudy?: {
    name: string;
    title: string;
    page: number;
  };
  sections: { title: string; page: number }[];
}

export const BOOK_CHAPTERS: BookChapterMeta[] = [
  {
    number: 1,
    title: "Performance Branding: Quantifying the Impact of B2B Branding Strategy",
    page: 22,
    caseStudy: {
      name: "Mediterranean School of Business (MSB)",
      title: "Co-designing a Holistic Future Proof Educational Brand",
      page: 34,
    },
    sections: [
      { title: "Performance Branding Defined", page: 23 },
      { title: "How it delivers strategic benefits", page: 24 },
      { title: "Additional critical benefits", page: 24 },
      { title: "Challenges in Brand Management B2B Branding", page: 25 },
      { title: "The Rise of Big Tech and H2H Marketing", page: 25 },
      { title: "What Branding Really Means", page: 26 },
      { title: "Brand Leadership", page: 27 },
      { title: "B2B Performance Branding Benefits", page: 27 },
      { title: "The 95-5 Rule and Performance Branding", page: 28 },
      { title: "Performance Branding in Action", page: 28 },
      { title: "Common Challenges in Performance Branding", page: 29 },
      { title: "AI and Performance Branding in B2B", page: 30 },
      { title: "Summary & Questions for Discussion", page: 31 },
      { title: "Literature", page: 32 },
    ],
  },
  {
    number: 2,
    title: "Digital Transformative reshaping strategies, processes, and outcomes of B2B Marketing",
    page: 48,
    caseStudy: {
      name: "BIAT (MyBIAT)",
      title: "An innovative and responsible digital solution",
      page: 62,
    },
    sections: [
      { title: "Introduction: The Evolution of B2B Branding", page: 48 },
      { title: "Transformative Marketing and Brand Management", page: 49 },
      { title: "Guiding Principles in Transformative Marketing", page: 50 },
      { title: "B2B Market Dynamics & Complexity of Industrial Products", page: 50 },
      { title: "Derived Demand & Organizational Buying", page: 51 },
      { title: "Human Factors in Business Decisions", page: 52 },
      { title: "Brand Relevance and Functions in B2B", page: 53 },
      { title: "Holistic Branding and H2H Marketing", page: 54 },
      { title: "The Branding Triangle & Branding Commodities", page: 55 },
      { title: "The Role of Emotions in B2B Branding", page: 56 },
      { title: "AI and Transformative Marketing in B2B", page: 57 },
      { title: "Summary, Questions for Discussion & Literature", page: 59 },
    ],
  },
  {
    number: 3,
    title: "Dimensions of Brand Management and Brand Distinction",
    page: 73,
    caseStudy: {
      name: "ARVEA Nature",
      title: "The Community-Based Brand",
      page: 88,
    },
    sections: [
      { title: "The Evolution of B2B Branding Management", page: 73 },
      { title: "The Four Dimensions of Brand Management", page: 74 },
      { title: "How Brands Create Value in B2B", page: 75 },
      { title: "Make a Consistent Impression", page: 77 },
      { title: "AI and Brand Management Dimensions", page: 78 },
      { title: "Brand Distinction & Return on Brand Investment (ROBI)", page: 79 },
      { title: "Brand Architecture & Marketing-Mix 5Es", page: 80 },
      { title: "AI and Brand Distinction", page: 83 },
      { title: "Summary, Questions for Discussion & Literature", page: 84 },
    ],
  },
  {
    number: 4,
    title: "Dynamic Capability of Transformative Brand Strategy",
    page: 107,
    caseStudy: {
      name: "Gourmandise & Co.",
      title: "From Garden Oven to Gourmandise Glory: A Mother's Wish Becomes a Legacy Brand",
      page: 125,
    },
    sections: [
      { title: "Introduction: Transformative Brand Strategy", page: 107 },
      { title: "Corporate, Family, and Individual Brands", page: 109 },
      { title: "National and International Brands", page: 112 },
      { title: "Brand Elements (Name, Logo, Tagline, Story)", page: 115 },
      { title: "AI and Transformative Brand Strategy", page: 119 },
      { title: "Summary, Questions for Discussion & Literature", page: 120 },
    ],
  },
  {
    number: 5,
    title: "Brand Specialties and Brand Communication",
    page: 142,
    caseStudy: {
      name: "CHO Group (Terra Delyssa)",
      title: "Smart Olive Oil: Blockchain-Enabled Shared Value Creation & Branding",
      page: 157,
    },
    sections: [
      { title: "Introduction: Holistic Brand Communication", page: 142 },
      { title: "The Branding Triangle & Key Communication Tools", page: 144 },
      { title: "Personal Selling, LinkedIn, Direct Marketing & Trade Shows", page: 144 },
      { title: "Sponsoring, Advertising & Sales Promotion", page: 146 },
      { title: "Brand Evaluation & AI in Communication", page: 148 },
      { title: "Living the Brand & Word-of-Mouth Brand Building", page: 149 },
      { title: "Social Branding and Corporate Social Responsibility", page: 151 },
      { title: "Summary, Questions for Discussion & Literature", page: 152 },
    ],
  },
  {
    number: 6,
    title: "The Process of Building B2B Brandings",
    page: 184,
    caseStudy: {
      name: "Wallyscar",
      title: "Wallyscar 619: Turning Crisis Into Opportunity",
      page: 200,
    },
    sections: [
      { title: "Introduction: The Holistic Approach to Brand Building", page: 184 },
      { title: "Service-Dominant Logic and Brand Co-Creation", page: 185 },
      { title: "Brand Planning and Shareholder Value", page: 186 },
      { title: "The Brand Building Process & Branding Principles", page: 187 },
      { title: "Brand Strategy and Analysis", page: 189 },
      { title: "Brand Architecture & Brand Portfolio Management", page: 191 },
      { title: "Brand Audit, Metrics & Business Intelligence", page: 192 },
      { title: "CEO and Personal Branding / Generative AI", page: 194 },
      { title: "Summary, Questions for Discussion & Literature", page: 197 },
    ],
  },
  {
    number: 7,
    title: "Exercise Caution Regarding Branding Missteps",
    page: 209,
    caseStudy: {
      name: "MPBS",
      title: "Building Brand Power Across the B2B Ecosystem",
      page: 218,
    },
    sections: [
      { title: "Introduction: Learning from Branding Failures", page: 209 },
      { title: "Maintaining Brand Identity & Obstacles", page: 210 },
      { title: "AI and Branding Obstacles", page: 214 },
      { title: "Summary, Questions for Discussion & Literature", page: 215 },
    ],
  },
  {
    number: 8,
    title: "The Strategic Awakening of B2B in Tunisia",
    page: 226,
    caseStudy: {
      name: "Secteur Optique (Essilor / Partenaires)",
      title: "Organic B2B Branding in the Optical Sector",
      page: 230,
    },
    sections: [
      { title: "Tunisia, a Mediterranean B2B Hub – Potential vs. Brand Reality", page: 227 },
      { title: "The Pioneers: Establishing Proof of Concept", page: 227 },
      { title: "Digital B2B & Thought Leadership", page: 228 },
      { title: "The Missing Link: The B2B2C Value Chain", page: 229 },
      { title: "The Systemic Impact: The Expanded Stakeholder Ecosystem", page: 231 },
    ],
  },
  {
    number: 9,
    title: "Future Perspective of B2B Brandings",
    page: 237,
    sections: [
      { title: "The Changing Business Landscape", page: 237 },
      { title: "The Rising Importance of B2B Branding", page: 238 },
      { title: "Artificial Intelligence in B2B Branding Management", page: 239 },
      { title: "Transformative Marketing and Performance Branding", page: 240 },
      { title: "Future Trends in B2B Branding Management", page: 241 },
      { title: "Timeless Principles: Relevance, Simplicity, and Humanity", page: 242 },
      { title: "Co-Creation and Service-Dominant Logic", page: 243 },
      { title: "Conclusion, Summary & Literature", page: 243 },
      { title: "List of Abbreviations", page: 249 },
      { title: "List of Companies Mentioned", page: 253 },
      { title: "List of Figures", page: 277 },
    ],
  },
];

// Clean page labels for direct selection
const PAGE_DESCRIPTIONS: { page: number; label: string }[] = [
  { page: 1, label: "Page 1 · Titre & Couverture officielle" },
  { page: 2, label: "Page 2 · Faux-titre" },
  { page: 3, label: "Page 3 · Auteurs, Institutions & ISBN" },
  { page: 4, label: "Page 4 · Protection du Copyright" },
  { page: 5, label: "Page 5 · Préface : The Future of B2B Is Human" },
  { page: 6, label: "Page 6 · Préface (suite)" },
  { page: 7, label: "Page 7 · Remerciements & Contacts" },
  { page: 8, label: "Page 8 · Disclaimer & Avertissements" },
  { page: 9, label: "Page 9 · Préface Abdelaziz Makhloufi (CEO CHO Group)" },
  { page: 10, label: "Page 10 · Préface Abdelaziz Makhloufi (suite)" },
  { page: 11, label: "Page 11 · Dr. Philip Kotler — Biographie" },
  { page: 12, label: "Page 12 · Dr. Philip Kotler (suite)" },
  { page: 13, label: "Page 13 · Dr. Waldemar Pfoertsch — Biographie" },
  { page: 14, label: "Page 14 · Dr. Waldemar Pfoertsch (suite)" },
  { page: 15, label: "Page 15 · Walid Kallel — Biographie" },
  { page: 16, label: "Page 16 · Walid Kallel (suite)" },
  { page: 17, label: "Page 17 · Agenda & Sommaire Général" },
  { page: 18, label: "Page 18 · Sommaire détaillé — Ch. 1 & Ch. 2" },
  { page: 19, label: "Page 19 · Sommaire détaillé — Ch. 3 & Ch. 4" },
  { page: 20, label: "Page 20 · Sommaire détaillé — Ch. 5 & Ch. 6" },
  { page: 21, label: "Page 21 · Sommaire détaillé — Ch. 7, 8, 9 & Index" },
];

export interface ProtectedBookTableOfContentsProps {
  pdfUrl?: string | null;
  bookTitle?: string;
  initialChapters?: BookChapterMeta[];
  defaultPage?: number;
}

export function ProtectedBookTableOfContents({
  pdfUrl,
  bookTitle = "B2B Brand Management — Tunisia Edition",
  defaultPage = 17,
}: ProtectedBookTableOfContentsProps = {}) {
  // We default to Page 17 (Agenda & Sommaire), or page 1 if custom PDF
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [totalPages, setTotalPages] = useState<number>(21);
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Load custom PDF if provided via pdfUrl
  useEffect(() => {
    if (!pdfUrl) {
      setPdfDoc(null);
      setTotalPages(21);
      return;
    }

    let cancelled = false;
    const loadPdf = async () => {
      try {
        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) return;
        const task = pdfjs.getDocument(pdfUrl);
        const doc = await task.promise;
        if (!cancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("PDF load error:", err);
      }
    };

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  // Preload neighboring pages for instant flipping
  useEffect(() => {
    if (pdfDoc) return;
    const preload = (p: number) => {
      if (p >= 1 && p <= totalPages) {
        const img = new Image();
        img.src = `/sommaire-pages/page-${p}.webp`;
      }
    };
    preload(currentPage - 1);
    preload(currentPage + 1);
  }, [currentPage, totalPages, pdfDoc]);

  // Render current page onto high-resolution Canvas (Zero DOM text => impossible to copy/paste)
  const renderCurrentPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (pdfDoc) {
      // Dynamic PDF.js render
      setLoading(true);
      pdfDoc
        .getPage(currentPage)
        .then((page: any) => {
          const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
          const viewport = page.getViewport({ scale: dpr * 1.5 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          page.render({ canvasContext: ctx, viewport }).promise.then(() => {
            // Subtle watermark
            ctx.save();
            ctx.translate(viewport.width / 2, viewport.height / 2);
            ctx.rotate(-Math.PI / 6);
            ctx.font = `600 ${Math.round(20 * dpr)}px system-ui, -apple-system, sans-serif`;
            ctx.fillStyle = "rgba(188, 59, 44, 0.05)";
            ctx.textAlign = "center";
            ctx.fillText("LIVRESPRO.TN · LECTURE SÉCURISÉE · REPRODUCTION INTERDITE", 0, -60);
            ctx.fillText(`TUNISIA EDITION · ${bookTitle.toUpperCase()}`, 0, 40);
            ctx.restore();
            setLoading(false);
          });
        })
        .catch(() => setLoading(false));
      return;
    }

    // Default book: High-DPI authentic PDF page render
    setLoading(true);
    const img = new Image();
    img.src = `/sommaire-pages/page-${currentPage}.webp`;
    img.onload = () => {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original crisp PDF page
      ctx.drawImage(img, 0, 0);

      // Baked-in Anti-Theft Watermark across canvas pixels (non-intrusive)
      ctx.save();
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.font = "600 22px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(188, 59, 44, 0.055)";
      ctx.textAlign = "center";
      ctx.fillText("LIVRESPRO.TN · LECTURE PROTÉGÉE · REPRODUCTION INTERDITE", 0, -80);
      ctx.fillText("© 2026 GLOBAL MARKETING NEXUS · KOTLER · PFOERTSCH · KALLEL", 0, 20);
      ctx.restore();

      setLoading(false);
    };
    img.onerror = () => setLoading(false);
  }, [currentPage, pdfDoc, bookTitle]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Keyboard navigation & anti-copy interceptors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left / Right arrow navigation
      if (e.key === "ArrowLeft") {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      }

      // Block copy shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "c" || e.key.toLowerCase() === "p" || e.key.toLowerCase() === "s" || e.key.toLowerCase() === "u")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPages]);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX > 45) handlePrev();
    else if (deltaX < -45) handleNext();
    touchStartXRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl border border-[#141E33]/15 bg-[#FCFAF6] shadow-lg transition-all"
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      onCopy={(e) => {
        e.preventDefault();
        if (e.clipboardData) e.clipboardData.clearData();
      }}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Essential Navigation Header — Minimal, clean, no additional clutter */}
      <div className="flex items-center justify-between border-b border-[#141E33]/10 bg-white px-4 py-3 sm:px-6">
        {/* Anti-copy Status Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#141E33]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline font-bold uppercase tracking-wider text-[11px] text-[#5C574C]">
            Sommaire Officiel ·
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#BC3B2C] font-bold">
            <Lock className="h-3 w-3" /> Anti-Copie
          </span>
        </div>

        {/* Essential Page Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            aria-label="Page précédente"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#141E33]/15 bg-white text-[#141E33] transition hover:bg-[#F6F1E7] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Clean Page Selector */}
          <div className="relative">
            <select
              aria-label="Sélectionner la page"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="h-9 cursor-pointer appearance-none rounded-lg border border-[#141E33]/15 bg-[#F6F1E7] py-1 pl-3 pr-8 text-xs font-bold text-[#141E33] focus:border-[#BC3B2C] focus:outline-hidden"
            >
              {PAGE_DESCRIPTIONS.slice(0, totalPages).map((p) => (
                <option key={p.page} value={p.page}>
                  {p.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#5C574C]">
              ▼
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            aria-label="Page suivante"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#141E33]/15 bg-white text-[#141E33] transition hover:bg-[#F6F1E7] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reader Canvas Area with Multi-layer Anti-Copy Protection */}
      <div className="relative flex justify-center bg-[#EFECE6]/50 p-3 sm:p-6 md:p-8">
        {/* Invisible protection shield preventing drag and inspection */}
        <div
          className="absolute inset-0 z-10 cursor-default select-none"
          style={{ WebkitUserSelect: "none", MozUserSelect: "none", userSelect: "none" }}
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => {
            if (e.detail > 1) e.preventDefault();
          }}
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#FCFAF6]/75 backdrop-blur-xs">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BC3B2C] border-t-transparent" />
          </div>
        )}

        {/* Canvas Frame — Native raster rendering (no selectable DOM text) */}
        <div className="relative w-full max-w-[760px] overflow-hidden rounded-xl bg-white shadow-xl border border-[#141E33]/10">
          <canvas
            ref={canvasRef}
            className="block h-auto w-full select-none pointer-events-none"
            style={{
              aspectRatio: "998 / 1418",
            }}
          />
        </div>
      </div>

      {/* Minimal Footer Info */}
      <div className="flex items-center justify-between border-t border-[#141E33]/10 bg-white px-4 py-2.5 text-[11px] text-[#5C574C]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Document officiel sous licence exclusive</span>
        </div>
        <div className="font-semibold text-[#141E33]">
          Page {currentPage} sur {totalPages}
        </div>
      </div>
    </div>
  );
}
