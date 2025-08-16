import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Car, 
  User,
  Navigation,
  Calendar,
  Filter,
  BarChart3
} from "lucide-react";
import { useTrips } from "@/contexts/TripContext";
import { useTranslation } from "react-i18next";
import { Trip, TripStatus } from "@/types/trip";
import { CreateTripModal } from "@/components/CreateTripModal";

const TripManagerPage = () => {
  const { t } = useTranslation();
  const { trips, analytics, isLoading } = useTrips();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: TripStatus) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Trip Manager</h1>
          <p className="text-muted-foreground">Manage all your trips, track earnings, and analyze performance</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />
          Create Trip
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-500" />
              Active Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeTrips}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedToday}</div>
            <p className="text-xs text-muted-foreground">Trips finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.todaysEarnings)}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-status-active" />
              Profit %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.profitPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Net margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Trips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Active Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trips.filter(trip => trip.status === 'active').length === 0 ? (
                  <div className="text-center py-8">
                    <Navigation className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No active trips</p>
                  </div>
                ) : (
                  trips.filter(trip => trip.status === 'active').map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{trip.tripNumber}</div>
                          <div className="text-sm text-muted-foreground">{trip.passenger.name}</div>
                        </div>
                        <Badge className={getStatusColor(trip.status)}>
                          {getStatusText(trip.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{trip.pickup.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{trip.destination.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            {trip.vehicleNumber}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {trip.driverName}
                          </span>
                        </div>
                        {trip.eta && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {trip.eta}m ETA
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trips.filter(trip => trip.status === 'completed').slice(0, 5).map((trip) => (
                  <div key={trip.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{trip.tripNumber}</div>
                        <div className="text-sm text-muted-foreground">{trip.passenger.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(trip.earnings.totalFare)}</div>
                        <div className="text-sm text-status-active">+{formatCurrency(trip.earnings.netProfit)}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{trip.pickup.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{trip.destination.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 text-sm text-muted-foreground">
                      <span>{trip.distance}km • {trip.duration}min</span>
                      <span>{new Date(trip.actualEndTime || trip.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Trips</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Map View
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {trips.filter(trip => trip.status === 'active').map((trip) => (
              <Card key={trip.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{trip.tripNumber}</h4>
                      <p className="text-muted-foreground">{trip.passenger.name} • {trip.passenger.phone}</p>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {getStatusText(trip.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Route</h5>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span>{trip.pickup.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="h-4 w-4 text-red-500" />
                          <span>{trip.destination.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Assignment</h5>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-4 w-4" />
                          <span>{trip.vehicleNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4" />
                          <span>{trip.driverName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Progress</h5>
                      <div className="space-y-1">
                        {trip.eta && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{trip.eta}m ETA</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(trip.earnings.totalFare)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Track Live
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Driver
                    </Button>
                    <Button size="sm">
                      Complete Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Trip History</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {trips.filter(trip => trip.status === 'completed').map((trip) => (
              <Card key={trip.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{trip.tripNumber}</h4>
                      <p className="text-muted-foreground">
                        {new Date(trip.actualEndTime || trip.createdAt).toLocaleDateString()} • 
                        {trip.passenger.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(trip.earnings.totalFare)}</div>
                      <div className="text-sm text-status-active">
                        Profit: {formatCurrency(trip.earnings.netProfit)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Route</h5>
                      <div className="text-sm text-muted-foreground">
                        {trip.pickup.address} → {trip.destination.address}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Distance & Time</h5>
                      <div className="text-sm text-muted-foreground">
                        {trip.distance}km • {trip.duration}min
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Vehicle & Driver</h5>
                      <div className="text-sm text-muted-foreground">
                        {trip.vehicleNumber} • {trip.driverName}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Type</h5>
                      <Badge variant="secondary" className="text-xs">
                        {trip.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topDestinations.map((dest, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{dest.destination}</div>
                        <div className="text-xs text-muted-foreground">{dest.count} trips</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(dest.earnings)}</div>
                        <div className="text-xs text-muted-foreground">earnings</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.driverPerformance.map((driver, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{driver.driverName}</div>
                        <div className="text-xs text-muted-foreground">{driver.trips} trips</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(driver.earnings)}</div>
                        <div className="text-xs text-muted-foreground">profit</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateTripModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
};

export default TripManagerPage;