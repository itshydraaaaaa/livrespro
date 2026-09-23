import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

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
