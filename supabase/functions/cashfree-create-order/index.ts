// Cashfree Create Order Edge Function
// Handles creating a one-time order for semiannual or annual plans
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
    const { plan, customer, returnUrl } = await req.json();

    if (!plan || !["semiannual", "annual"].includes(plan)) {
      throw new Error("Invalid or missing plan");
    }
    if (!returnUrl) {
      throw new Error("Missing returnUrl");
    }

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
    const amount = plan === "semiannual" ? 12000 : 24000; // INR

    const orderId = `mf_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;

    const body = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      order_note: plan,
      customer_details: {
        customer_id: customer?.phone || orderId,
        customer_email: customer?.email || "noemail@example.com",
        customer_phone: customer?.phone || "0000000000",
        customer_name: customer?.name || "Customer",
      },
      order_meta: {
        return_url: `${returnUrl}?order_id={order_id}`,
      },
    };

    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error("Cashfree create order error", json);
      return new Response(
        JSON.stringify({ error: json?.message || "Failed to create order" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        payment_session_id: json?.payment_session_id,
        order_id: json?.order_id,
        mode: ENV,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Unhandled error in cashfree-create-order", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
