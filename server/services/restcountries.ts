/**
 * LivresPro.tn — RestCountries Integration Service
 * Fetches and caches official country data for Tunisia (TN)
 * from https://api.restcountries.com/countries/v5/codes.alpha_2/TN
 */

export interface TunisiaCountryData {
  alpha2: string;
  alpha3: string;
  name: {
    common: string;
    official: string;
    french: string;
    arabic: string;
    arabicOfficial: string;
  };
  callingCode: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
    symbolNative: string;
  };
  capital: string;
  region: string;
  subregion: string;
  flag: {
    emoji: string;
    svg: string;
    png: string;
    description: string;
  };
  postalCode: {
    format: string;
    regex: string;
  };
  timezone: string;
  description: string;
  source: "live_api" | "cached" | "fallback";
}

const FALLBACK_TUNISIA_DATA: TunisiaCountryData = {
  alpha2: "TN",
  alpha3: "TUN",
  name: {
    common: "Tunisia",
    official: "Republic of Tunisia",
    french: "Tunisie",
    arabic: "تونس",
    arabicOfficial: "الجمهورية التونسية",
  },
  callingCode: "+216",
  currency: {
    code: "TND",
    name: "Tunisian Dinar",
    symbol: "DT",
    symbolNative: "د.ت",
  },
  capital: "Tunis",
  region: "Africa",
  subregion: "Northern Africa",
  flag: {
    emoji: "🇹🇳",
    svg: "https://flags.restcountries.com/v5/svg/tn.svg",
    png: "https://flags.restcountries.com/v5/w640/tn.png",
    description: "The flag of Tunisia has a red field with a white circle bearing a five-pointed red star and crescent.",
  },
  postalCode: {
    format: "####",
    regex: "^(\\d{4})$",
  },
  timezone: "UTC+01:00",
  description: "Tunisie — Livraison express sur l'ensemble des 24 gouvernorats.",
  source: "fallback",
};

let cachedData: TunisiaCountryData | null = null;
let cacheExpiry = 0;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const RESTCOUNTRIES_TOKEN =
  process.env.RESTCOUNTRIES_API_TOKEN || "rc_live_5d19939d8dae4d3d8fa3a266c5d35ba0";

export async function fetchTunisiaData(): Promise<TunisiaCountryData> {
  const now = Date.now();
  if (cachedData && now < cacheExpiry) {
    return { ...cachedData, source: "cached" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://api.restcountries.com/countries/v5/codes.alpha_2/TN?pretty=1", {
      headers: {
        Authorization: `Bearer ${RESTCOUNTRIES_TOKEN}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[RestCountries] API returned HTTP ${res.status}, using cached/fallback`);
      return cachedData ?? FALLBACK_TUNISIA_DATA;
    }

    const json = await res.json();
    const obj = json?.data?.objects?.[0];

    if (!obj) {
      return cachedData ?? FALLBACK_TUNISIA_DATA;
    }

    const parsed: TunisiaCountryData = {
      alpha2: obj.codes?.alpha_2 || "TN",
      alpha3: obj.codes?.alpha_3 || "TUN",
      name: {
        common: obj.names?.common || "Tunisia",
        official: obj.names?.official || "Republic of Tunisia",
        french: obj.names?.translations?.fra?.common || "Tunisie",
        arabic: obj.names?.native?.ara?.common || "تونس",
        arabicOfficial: obj.names?.native?.ara?.official || "الجمهورية التونسية",
      },
      callingCode: obj.calling_codes?.[0] ? `+${obj.calling_codes[0]}` : "+216",
      currency: {
        code: obj.currencies?.[0]?.code || "TND",
        name: obj.currencies?.[0]?.name || "Tunisian dinar",
        symbol: "DT",
        symbolNative: obj.currencies?.[0]?.symbol || "د.ت",
      },
      capital: obj.capitals?.[0]?.name || "Tunis",
      region: obj.region || "Africa",
      subregion: obj.subregion || "Northern Africa",
      flag: {
        emoji: obj.flag?.emoji || "🇹🇳",
        svg: obj.flag?.url_svg || "https://flags.restcountries.com/v5/svg/tn.svg",
        png: obj.flag?.url_png || "https://flags.restcountries.com/v5/w640/tn.png",
        description: obj.flag?.description || "Flag of Tunisia",
      },
      postalCode: {
        format: obj.postal_code?.format || "####",
        regex: obj.postal_code?.regex || "^(\\d{4})$",
      },
      timezone: obj.timezones?.[0] || "UTC+01:00",
      description: obj.descriptions?.short || FALLBACK_TUNISIA_DATA.description,
      source: "live_api",
    };

    cachedData = parsed;
    cacheExpiry = now + CACHE_DURATION_MS;
    return parsed;
  } catch (err: any) {
    console.warn("[RestCountries] Failed to fetch live data:", err?.message || err);
    return cachedData ?? FALLBACK_TUNISIA_DATA;
  }
}
