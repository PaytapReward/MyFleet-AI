// Cashfree Verify Order Edge Function
// Verifies the status of a Cashfree order after redirect
// CORS enabled and JWT verification disabled via config

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getBaseUrl(env: string) {
  return env === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error("Missing orderId");

    const APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const ENV = Deno.env.get("CASHFREE_ENV") || "sandbox";

    if (!APP_ID || !SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Cashfree credentials not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const baseUrl = getBaseUrl(ENV);

    const res = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
    });

    const json = await res.json();
    if (!res.ok) {
      console.error("Cashfree verify order error", json);
      return new Response(
        JSON.stringify({ error: json?.message || "Failed to verify order" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const status = (json?.order_status || "").toString().toUpperCase();
    const isPaid = ["PAID", "COMPLETED", "CAPTURED"].includes(status);
    const plan = json?.order_note || null;

    return new Response(
      JSON.stringify({ isPaid, plan, raw: json }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Unhandled error in cashfree-verify-order", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
