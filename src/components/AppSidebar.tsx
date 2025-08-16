import { Home, BarChart3, Settings, LifeBuoy, Users, Car } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Profit & Loss", url: "/profit-loss", icon: BarChart3 },
  { title: "Vehicle Operators", url: "/manage-operators", icon: Users },
  { title: "Trip Manager", url: "/trip-manager", icon: Car },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Support", url: "/support", icon: LifeBuoy },
];

export default function AppSidebar() {
  const { t } = useTranslation();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";
  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };
  const labelMap: Record<string, string> = {
    Dashboard: t("nav.dashboard"),
    "Profit & Loss": t("nav.profitLoss"),
    "Vehicle Operators": t("nav.manageOperators"),
    "Trip Manager": t("nav.tripManager"),
    Settings: t("nav.settings"),
    Support: t("nav.support"),
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 glass-effect">
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider px-4 mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="h-11 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground apple-shadow-sm"
                  >
                    <NavLink to={item.url} end className={getNavCls} onClick={handleNavClick}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {state !== "collapsed" && <span className="font-medium">{labelMap[item.title]}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
