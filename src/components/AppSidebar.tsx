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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-card text-accent-foreground font-medium"
      : "text-accent-foreground hover:bg-card";

  const showPrint = location.pathname === "/plan";
  const currentDay = (typeof window !== "undefined" && localStorage.getItem("planCurrentDay")) || "Seg";
  const printHref = `/print?dia=${currentDay}`;

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
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4 text-current" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {showPrint && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to={printHref} className={getNavCls({ isActive: location.pathname === "/print" })}>
                      <Printer className="mr-2 h-4 w-4 text-current" />
                      {state === "expanded" && <span>Imprimir plano do dia</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
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
