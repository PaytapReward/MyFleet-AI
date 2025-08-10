import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setPaidSubscription } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState<string>("Verifying your payment...");

  useEffect(() => {
    const verify = async () => {
      const orderId = params.get("order_id");
      if (!orderId) {
        setStatus("failed");
        setMessage("Missing order reference.");
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke("cashfree-verify-order", {
          body: { orderId },
        });
        if (error) throw error;
        if (data?.isPaid) {
          const plan = data?.plan === "semiannual" ? "semiannual" : "annual";
          await setPaidSubscription(plan);
          setStatus("success");
          setMessage("Payment confirmed! Redirecting to your dashboard...");
          setTimeout(() => navigate("/"), 800);
        } else {
          setStatus("failed");
          setMessage("Payment not completed yet. If you were charged, please contact support.");
        }
      } catch (e: any) {
        console.error("Verification error", e);
        setStatus("failed");
        setMessage("Could not verify payment. Please try again.");
      }
    };
    verify();
  }, [params, navigate, setPaidSubscription]);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Payment Status</h1>
        <p className="text-muted-foreground mb-8">{message}</p>
        {status === "failed" && (
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate("/subscription")}>Back to Plans</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry Verification</Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default PaymentSuccessPage;
