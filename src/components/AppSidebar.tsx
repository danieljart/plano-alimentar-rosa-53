import { NavLink, useLocation } from "react-router-dom";
import { LogOut, User, Settings, Printer, CalendarDays, ListChecks } from "lucide-react";
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

const items = [
  { title: "Plano Alimentar", url: "/plan", icon: CalendarDays },
  { title: "Preferências", url: "/onboarding", icon: ListChecks },
  { title: "Perfil", url: "/profile", icon: User },
  { title: "Imprimir", url: "/print", icon: Printer },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent/70";

  return (
    <Sidebar className="">
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>Menu</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
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
      <SidebarFooter>
        <Button
          variant="outline"
          className="justify-start"
          onClick={async () => {
            try {
              localStorage.removeItem("authEmail");
              localStorage.removeItem("onboardingPrefs");
            } finally {
              window.location.href = "/login";
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
