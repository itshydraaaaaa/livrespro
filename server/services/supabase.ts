import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://tvuktwtartbqmggndinu.supabase.co";

const DEFAULT_PUB =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dWt0d3RhcnRicW1nZ25kaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NTQ3NTUsImV4cCI6MjA5NzAzMDc1NX0.eFHEiyBw83bvGxA7gJ3rNypQTAJ11R0Ae0K0XN-tr24";

const DEFAULT_SEC =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dWt0d3RhcnRicW1nZ25kaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTQ1NDc1NSwiZXhwIjoyMDk3MDMwNzU1fQ.9_RtAYJGAcgavShKRpOLSz27Tpc3hNUbMM9vDY_bXmg";

const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_PUB;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || DEFAULT_SEC;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabasePublishableKey || supabaseSecretKey) && !supabaseUrl.includes("YOUR_PROJECT_REF")
);

let _supabaseAdmin: SupabaseClient | null = null;
let _supabaseClient: SupabaseClient | null = null;

/**
 * Returns an authenticated Supabase admin client (using Secret Key) bypassing RLS for server-side operations.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey || supabasePublishableKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

/**
 * Returns a public Supabase client (using Publishable Key) subject to RLS.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseClient;
}

/**
 * Persist an order to Supabase orders and order_items tables
 */
export async function persistOrderToSupabase(orderData: any, items: any[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderErr) {
      console.warn("[Supabase] Failed to insert order:", orderErr.message);
      return null;
    }

    if (items.length > 0) {
      const itemsToInsert = items.map((it) => ({
        ...it,
        order_id: order.id,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(itemsToInsert);
      if (itemsErr) {
        console.warn("[Supabase] Failed to insert order items:", itemsErr.message);
      }
    }

    return order;
  } catch (err) {
    console.warn("[Supabase] Unexpected order persistence error:", err);
    return null;
  }
}

/**
 * Fetch published products from Supabase
 */
export async function fetchProductsFromSupabase() {
  const supabase = getSupabaseAdmin() || getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*)")
      .eq("status", "published")
      .order("featured", { ascending: false });

    if (error) {
      console.warn("[Supabase] Products query error:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("[Supabase] Error fetching products:", err);
    return null;
  }
}
