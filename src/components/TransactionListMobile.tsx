import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";

interface TransactionListMobileProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const typeLabels: Record<Transaction["type"], string> = {
  revenue: "Revenue",
  fuel: "Fuel",
  parking: "Parking",
  toll: "Toll",
  fasttag: "FASTag",
  maintenance: "Maintenance",
  insurance: "Insurance",
  add_money: "Add Money",
  permit: "Permit",
  fine: "Fine",
  manual_income: "Manual Income",
  manual_expense: "Manual Expense",
};

export const TransactionListMobile = ({ transactions, isLoading }: TransactionListMobileProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <Card key={t.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{t.vehicleNumber}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(t.date).toLocaleDateString("en-IN")} • {t.description}
              </div>
              <div className="mt-1">
                <Badge variant="secondary">{typeLabels[t.type]}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${t.category === "income" ? "text-status-active" : "text-status-urgent"}`}>
                {t.category === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
              </div>
              {t.reference && (
                <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]">
                  {t.reference}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
