
import FleetOverview from "@/components/FleetOverview";
import VehicleCard from "@/components/VehicleCard";
import AddVehicleModal from "@/components/AddVehicleModal";
import { useVehicles } from "@/contexts/VehicleContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Index = () => {
  const { vehicles, isLoading } = useVehicles();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-primary-foreground rounded"></div>
              </div>
              <p className="text-muted-foreground">Loading your fleet...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Fleet Overview Stats - moved to top */}
        <FleetOverview />
        
        {/* Vehicle Cards Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Your Fleet</h2>
              <p className="hidden sm:block text-sm text-muted-foreground">Manage up to 25 vehicles ({vehicles.length}/25)</p>
            </div>
            <AddVehicleModal />
          </div>
          
          {/* Vehicles - mobile carousel or desktop list */}
          {vehicles.length > 0 ? (
            <>
              {isMobile ? (
                <div className="relative">
                  <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="pb-8">
                    <CarouselContent>
                      {vehicles.map((vehicle) => (
                        <CarouselItem key={vehicle.id}>
                          <VehicleCard vehicle={vehicle} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious
                      className="left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md border-border"
                      aria-label="Previous vehicle"
                    />
                    <CarouselNext
                      className="right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md border-border"
                      aria-label="Next vehicle"
                    />
                  </Carousel>
                  {count > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2" aria-label={`Slide ${current + 1} of ${count}`}>
                      {Array.from({ length: count }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => api?.scrollTo(i)}
                          className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30 data-[active=true]:bg-foreground transition-colors"
                          data-active={i === current}
                          aria-label={`Go to vehicle ${i + 1}`}
                          aria-current={i === current ? "true" : undefined}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row md:space-x-4 md:overflow-x-auto pb-4 scrollbar-hide mobile-scroll">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}

                  {/* Add Vehicle Card - Desktop only */}
                  {vehicles.length < 25 && (
                    <div className="hidden md:flex md:w-80 md:flex-shrink-0 border-2 border-dashed border-border rounded-lg items-center justify-center min-h-[400px] bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="text-center p-6">
                        <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">Add New Vehicle</h3>
                        <p className="text-sm text-muted-foreground">Expand your fleet management</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="w-full md:w-80 md:flex-shrink-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center min-h-[400px] bg-muted/30">
              <div className="text-center p-6">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Vehicles Yet</h3>
                <p className="text-sm text-muted-foreground">Click "Add Vehicle" to get started</p>
              </div>
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
};

export default Index;
