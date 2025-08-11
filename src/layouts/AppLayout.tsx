import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="relative h-14 flex items-center px-3 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="absolute left-3" />
            <div className="mx-auto text-sm font-semibold">
              {(() => {
                const path = location.pathname;
                const titles: Record<string, string> = {
                  "/": "Início",
                  "/plan": "Plano alimentar",
                  "/onboarding": "Preferências",
                  "/profile": "Perfil",
                  "/print": "Imprimir",
                };
                return titles[path] || "Plano alimentar";
              })()}
            </div>
          </header>
          <main className="flex-1 container py-4 animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
