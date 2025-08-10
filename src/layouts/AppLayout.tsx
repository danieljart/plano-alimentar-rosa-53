import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="h-14 flex items-center px-3 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="mr-2" />
            <div className="text-sm font-semibold">Plano Alimentar</div>
          </header>
          <main className="flex-1 container py-4 animate-fade-in">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
