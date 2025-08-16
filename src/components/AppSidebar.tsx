import { Home, BarChart3, Settings, LifeBuoy, Users, Car, ChevronRight } from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Profit & Loss", url: "/profit-loss", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Support", url: "/support", icon: LifeBuoy },
];

const operatorsItems = [
  { title: "Vehicle Operators", url: "/manage-operators" },
  { title: "Trip Manager", url: "/trip-manager" },
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

  // Check if any operators section should be expanded
  const isOperatorsExpanded = operatorsItems.some(item => isActive(item.url));

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Main navigation items */}
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className={getNavCls} onClick={handleNavClick}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{labelMap[item.title]}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Vehicle Operators with sub-menu */}
              <Collapsible defaultOpen={isOperatorsExpanded}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group/collapsible">
                      <Users className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && (
                        <>
                          <span>{t("nav.manageOperators")}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state !== "collapsed" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {operatorsItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                              <NavLink to={item.url} className={getNavCls} onClick={handleNavClick}>
                                {item.title === "Trip Manager" && <Car className="mr-2 h-4 w-4" />}
                                <span>{labelMap[item.title]}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
