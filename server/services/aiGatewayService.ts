const AI_GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Tu es l'assistant et conseiller commercial intelligent de "LivresPro.tn" (L'Atelier des Pages), la librairie en ligne de référence pour les professionnels, dirigeants, universitaires et entrepreneurs en Tunisie.

INFORMATIONS CLÉS DE LA PLATEFORME & DU LIVRE VEDETTE :
1. Titre vedette : "B2B Brand Management — Édition Tunisie"
   - Auteurs originaux : Philip Kotler & Waldemar Pfoertsch
   - Auteur de l'adaptation tunisienne : Walid Kallel
   - Prix spécial lancement : 65,00 DT (au lieu de 85,00 DT).
   - Format : Livre relié de haute qualité, 384 pages, langue française.
   - 7 cas réels d'entreprises tunisiennes inclus :
     * BIAT (Secteur bancaire et services financiers)
     * Wallyscar (Constructeur automobile tunisien)
     * MSB - Mediterranean School of Business (Enseignement supérieur d'élite)
     * ARVEA Nature (Cosmétique et vente directe)
     * Gourmandise (Agroalimentaire & gastronomie)
     * MPBS (Industrie des panneaux de bois)
     * CHO Group / Terra Delyssa (Leader mondial de l'huile d'olive tunisienne)
2. Modalités commerciales en Tunisie :
   - Mode de paiement : Paiement à la livraison (Cash on Delivery) en Dinars Tunisiens (DT).
   - Frais de livraison : 7,00 DT sur l'ensemble des 24 gouvernorats de Tunisie.
   - Délais de livraison : 24 à 48 heures ouvrables.
   - Avantage Éducateur : Remise spéciale pour enseignants, universitaires et chercheurs (case à cocher au checkout).
   - Commandes groupées / B2B : Tarifs dégressifs pour entreprises et universités disponibles via le service commercial.
   - Contact WhatsApp : +216 29 511 111 | Email : contact@livrespro.tn

RÈGLES DE RÉPONSE :
- Réponds toujours en français de manière chaleureuse, professionnelle, concise et encourageante.
- Si le client hésite ou demande des conseils, guide-le vers la commande ou l'ajout au panier.
- Reste précis sur les prix (65 DT), les auteurs et les entreprises tunisiennes mentionnées.`;

/**
 * Fallback semantic responder if AI Gateway requires card verification or key is missing.
 */
function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("prix") || q.includes("combien") || q.includes("cout") || q.includes("coût")) {
    return "Le livre **B2B Brand Management — Édition Tunisie** est actuellement proposé au tarif préférentiel de **65,00 DT** (au lieu de 85,00 DT). Les frais de livraison sont de 7,00 DT partout en Tunisie, avec paiement à la réception du colis !";
  }

  if (q.includes("livraison") || q.includes("délai") || q.includes("delai") || q.includes("gouvernorat")) {
    return "Nous livrons sur **l'ensemble des 24 gouvernorats tunisiens** (Grand Tunis, Sousse, Sfax, Bizerte, Nabeul, etc.) sous **24 à 48 heures ouvrables**. Les frais s'élèvent à 7,00 DT et vous payez directement en espèces au livreur lors de la remise.";
  }

  if (q.includes("cas") || q.includes("entreprise") || q.includes("biat") || q.includes("wallyscar") || q.includes("cho") || q.includes("arvea")) {
    return "L'édition tunisienne intègre **7 études de cas d'entreprises tunisiennes pionnières** : **BIAT** (banque), **Wallyscar** (automobile), **MSB** (enseignement d'excellence), **ARVEA Nature** (cosmétique & vente directe), **Gourmandise** (pâtisserie haut de gamme), **MPBS** (industrie bois), et **CHO Group / Terra Delyssa** (huile d'olive). Ces cas illustrent concrètement l'application des concepts de marque B2B sur notre marché national.";
  }

  if (q.includes("auteur") || q.includes("kotler") || q.includes("pfoertsch") || q.includes("kallel")) {
    return "L'ouvrage est co-signé par **Philip Kotler**, père mondial du marketing moderne, et le Pr **Waldemar Pfoertsch**, sommité du marketing B2B international, avec une adaptation approfondie par **Walid Kallel** qui contextualise chaque concept aux réalités de l'économie tunisienne.";
  }

  if (q.includes("paiement") || q.includes("payer") || q.includes("carte") || q.includes("espece") || q.includes("espèces")) {
    return "Sur LivresPro.tn, le règlement s'effectue en toute sécurité par **paiement à la livraison** (espèces remises directement au livreur après vérification de votre livre).";
  }

  if (q.includes("enseignant") || q.includes("universitaire") || q.includes("educateur") || q.includes("étudiant") || q.includes("etudiant")) {
    return "Nous offrons un **Avantage Éducateur** pour les professeurs, chercheurs et formateurs universitaires. Il vous suffit de cocher l'option lors de votre commande pour bénéficier de nos tarifs et supports académiques.";
  }

  return "Bienvenue sur LivresPro.tn ! L'ouvrage phare **« B2B Brand Management — Édition Tunisie »** de Philip Kotler, Waldemar Pfoertsch et Walid Kallel est disponible au prix de 65,00 DT avec livraison rapide et paiement à la livraison sur toute la Tunisie. Que souhaitez-vous savoir sur le livre ou la livraison ?";
}

export async function askAiAdvisor(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; source: "ai_gateway" | "fallback" }> {
  const apiKey =
    process.env.VERCEL_AI_GATEWAY_API_KEY ||
    process.env.AI_GATEWAY_API_KEY ||
    process.env.GATEWAY_API_KEY ||
    "";

  if (!apiKey) {
    return {
      reply: getFallbackResponse(userQuery),
      source: "fallback",
    };
  }

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-6),
      { role: "user", content: userQuery },
    ];

    const res = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) {
        return { reply: text, source: "ai_gateway" };
      }
    } else {
      const errText = await res.text().catch(() => "");
      console.warn("[AI Gateway] Gateway returned non-200:", res.status, errText);
    }
  } catch (error) {
    console.warn("[AI Gateway] Request exception, falling back:", error);
  }

  return {
    reply: getFallbackResponse(userQuery),
    source: "fallback",
  };
}
