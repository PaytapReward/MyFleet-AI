import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FleetOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">5</div>
          <p className="text-xs text-muted-foreground">Active fleet size</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PayTap Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-status-active" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">₹12,250</div>
          <p className="text-xs text-muted-foreground">Total across fleet</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Challans</CardTitle>
          <AlertTriangle className="h-4 w-4 text-status-urgent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-status-urgent">3</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-status-active" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-status-pending">80%</div>
          <p className="text-xs text-muted-foreground">Compliance rate</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetOverview;