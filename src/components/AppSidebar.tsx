import { NavLink, useLocation } from "react-router-dom";
import { LogOut, User, CalendarDays, ListChecks, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const baseItems = [
  { title: "Plano Alimentar", url: "/plan", icon: CalendarDays },
  { title: "Preferências", url: "/onboarding", icon: ListChecks },
  { title: "Perfil", url: "/profile", icon: User },
];

const adminItems = [
  { title: "Administração", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpen, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  
  const items = isAdmin ? [...baseItems, ...adminItems] : baseItems;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-card text-accent-foreground font-medium"
      : "text-accent-foreground hover:bg-card";

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };
  return (
    <Sidebar className="">
      <SidebarHeader className="relative border-b bg-card">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-accent-foreground font-semibold">
          Menu
        </div>
        <div className="flex items-center justify-end">
          <SidebarTrigger className="text-accent-foreground" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls} onClick={handleNavigate}>
                      <item.icon className="mr-2 h-4 w-4 text-current" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="bg-card border-t">
        <Button
          variant="outline"
          className="justify-start"
          onClick={async () => {
            try {
              localStorage.removeItem("onboardingPrefs");
              localStorage.removeItem("gemini_api_key");
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
