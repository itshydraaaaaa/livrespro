import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

export type BehavioralEvent = "page_view" | "view_book" | "add_to_cart" | "initiate_checkout";

type AnalyticsDetail = {
  eventType: Exclude<BehavioralEvent, "page_view">;
  productHandle?: string;
};

const CONSENT_KEY = "atelier-analytics-consent";
const VISITOR_KEY = "atelier-visitor-id";
const SESSION_KEY = "atelier-session-id";

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage may be disabled; analytics remains opt-in and simply inactive.
  }
}

function getOrCreateId(key: string) {
  const known = readStorage(key);
  if (known) return known;
  const id = crypto.randomUUID();
  writeStorage(key, id);
  return id;
}

function sanitizedReferrer() {
  if (!document.referrer) return null;
  try {
    return new URL(document.referrer).origin;
  } catch {
    return null;
  }
}

export function trackBehavior(detail: AnalyticsDetail) {
  window.dispatchEvent(new CustomEvent<AnalyticsDetail>("atelier:analytics", { detail }));
}

export function AnalyticsManager() {
  const [location] = useLocation();
  const [consent, setConsent] = useState<"unknown" | "accepted" | "rejected">(() => {
    const saved = readStorage(CONSENT_KEY);
    if (saved === "accepted" || saved === "rejected") return saved;
    if (navigator.doNotTrack === "1") return "rejected";
    return "unknown";
  });
  const [showDetails, setShowDetails] = useState(false);
  const trackMutation = trpc.site.analytics.track.useMutation();
  const ids = useMemo(() => {
    if (consent !== "accepted") return null;
    return { visitorId: getOrCreateId(VISITOR_KEY), sessionId: getOrCreateId(SESSION_KEY) };
  }, [consent]);

  const track = (eventType: BehavioralEvent, productHandle?: string) => {
    if (consent !== "accepted" || !ids) return;
    trackMutation.mutate({
      visitorId: ids.visitorId,
      sessionId: ids.sessionId,
      eventType,
      path: window.location.pathname,
      referrer: sanitizedReferrer(),
      metadata: productHandle ? { productHandle } : null,
    });
  };

  useEffect(() => {
    if (consent === "accepted") track("page_view");
    // location intentionally drives a new page-view for client-side navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, consent]);

  useEffect(() => {
    const onBehavior = (event: Event) => {
      const detail = (event as CustomEvent<AnalyticsDetail>).detail;
      if (detail) track(detail.eventType, detail.productHandle);
    };
    window.addEventListener("atelier:analytics", onBehavior);
    return () => window.removeEventListener("atelier:analytics", onBehavior);
    // track is intentionally refreshed when consent or IDs change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, ids]);

  const setChoice = (choice: "accepted" | "rejected") => {
    writeStorage(CONSENT_KEY, choice);
    setConsent(choice);
    setShowDetails(false);
  };

  if (consent !== "unknown") return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl border border-[#172C41]/15 bg-[#FCFAF5] p-5 text-[#172C41] shadow-[0_18px_50px_rgba(23,44,65,.22)] sm:left-auto sm:right-6" aria-label="Préférences de mesure d’audience">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#172C41] text-[#F8F5EE]"><ShieldCheck className="h-4 w-4" /></span>
        <div className="min-w-0">
          <p className="text-sm font-bold">Mesure d’audience, à votre choix</p>
          <p className="mt-1 text-xs leading-5 text-[#52606B]">Avec votre accord, nous mesurons les pages et parcours utiles — sans nom, e-mail, IP, paiement ni contenus de panier.</p>
          {showDetails ? <p className="mt-2 text-xs leading-5 text-[#52606B]">Vous pouvez refuser sans incidence. Votre choix est enregistré sur cet appareil et les données présentées dans le back-office sont agrégées.</p> : null}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button type="button" size="sm" onClick={() => setChoice("accepted")} className="bg-[#C94E36] text-white hover:bg-[#A93D2D]">Accepter</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setChoice("rejected")} className="border-[#172C41]/20 bg-transparent">Refuser</Button>
            <button type="button" onClick={() => setShowDetails(value => !value)} className="text-xs font-semibold text-[#52606B] underline underline-offset-4">{showDetails ? "Réduire" : "En savoir plus"}</button>
            <button type="button" onClick={() => setChoice("rejected")} className="ml-auto text-[#52606B]" aria-label="Fermer et refuser"><X className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </aside>
  );
}
