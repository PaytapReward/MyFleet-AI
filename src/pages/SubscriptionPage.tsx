import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    id: "trial",
    name: "30-day Free Trial",
    price: "Free for 30 days",
    description: "Requires a valid payment method. Auto-renews unless canceled.",
    cta: "Start Free Trial",
    badge: "Best for getting started",
  },
  {
    id: "semiannual",
    name: "6 Months Plan",
    price: "₹600 / 6 months",
    description: "Save more with a semi-annual plan.",
    cta: "Choose 6 Months",
    badge: "Popular",
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: "₹1200 / year",
    description: "Best value for growing fleets.",
    cta: "Choose Annual",
    badge: "Best value",
  },
] as const;

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Choose Plan | MyFleet Subscription";
  }, []);

  const handleCheckout = async (plan: typeof plans[number]["id"]) => {
    try {
      setLoadingPlan(plan);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        toast({
          title: "Opening secure checkout",
          description: "Complete your payment in the new tab.",
        });
      } else {
        toast({ title: "Checkout unavailable", description: "Please try again shortly." });
      }
    } catch (err: any) {
      console.error("Checkout error", err);
      toast({
        title: "Stripe not configured yet",
        description: "Please add Stripe secrets to enable checkout.",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      if (data?.subscribed) {
        toast({ title: "Subscription active", description: "Reloading your access..." });
        setTimeout(() => window.location.replace("/"), 800);
      } else {
        toast({ title: "No active plan found", description: "Please choose a plan to continue." });
      }
    } catch (err: any) {
      console.error("Status error", err);
      toast({ title: "Unable to verify subscription", description: "Please try again." });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Choose your MyFleet plan</h1>
        <p className="text-muted-foreground mt-2">
          Access to the dashboard requires an active subscription. Start a 30-day free trial or
          pick a paid plan.
        </p>
      </header>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.badge}</div>
                <CardTitle className="mt-1">{p.name}</CardTitle>
                <CardDescription>{p.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="text-sm text-muted-foreground space-y-2">
                  {p.id === "trial" ? (
                    <>
                      <li>• Full access for 30 days</li>
                      <li>• Card on file required</li>
                      <li>• Auto-renews unless canceled</li>
                    </>
                  ) : p.id === "semiannual" ? (
                    <>
                      <li>• 6 months of access</li>
                      <li>• Priority support</li>
                      <li>• Save versus monthly</li>
                    </>
                  ) : (
                    <>
                      <li>• 12 months of access</li>
                      <li>• Best value</li>
                      <li>• Priority support</li>
                    </>
                  )}
                </ul>
                <Separator className="my-6" />
                <Button
                  onClick={() => handleCheckout(p.id)}
                  disabled={loadingPlan === p.id}
                  aria-label={p.cta}
                >
                  {loadingPlan === p.id ? "Preparing checkout..." : p.cta}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-md border border-input bg-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold">Already subscribed?</h2>
              <p className="text-sm text-muted-foreground">Verify your subscription and continue to dashboard.</p>
            </div>
            <Button variant="secondary" onClick={handleRefreshStatus} disabled={refreshing}>
              {refreshing ? "Checking..." : "Refresh Subscription Status"}
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="sr-only">Subscription FAQs</h2>
        {/* Structured data could be added here if needed */}
      </section>
    </main>
  );
};

export default SubscriptionPage;
