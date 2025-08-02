import { Bell, Menu, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddDriverModal from "@/components/AddDriverModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">MyFleet AI</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.fullName || (user?.role === 'driver' ? 'Driver' : 'Fleet Manager')} 
              {user?.role && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-md">
                  {user.role === 'owner' ? 'Owner' : 'Driver'}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Show Assign Driver button only for owners */}
          {user?.role === 'owner' && (
            <AddDriverModal />
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.fullName || 'Fleet Manager'}</p>
                    <p className="text-xs text-muted-foreground">+91 {user?.phone}</p>
                    {user?.companyName && (
                      <p className="text-xs text-muted-foreground">{user.companyName}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;