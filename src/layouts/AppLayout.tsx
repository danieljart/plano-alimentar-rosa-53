import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, ListChecks, User } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  const titles: Record<string, string> = {
    "/": "Início",
    "/plan": "Plano alimentar",
    "/onboarding": "Preferências",
    "/profile": "Perfil",
    "/print": "Imprimir",
  };
  const title = titles[path] || "Plano alimentar";

  // Left button swaps between Plan and Preferences depending on page
  const goLeft = path === "/onboarding"
    ? { to: "/plan", label: "Plano", Icon: CalendarDays }
    : { to: "/onboarding", label: "Preferências", Icon: ListChecks };
  const LeftIcon = goLeft.Icon;

  const rightBtn = path === "/profile"
    ? { to: "/plan", aria: "Plano", Icon: CalendarDays }
    : { to: "/profile", aria: "Perfil", Icon: User };
  const RightIcon = rightBtn.Icon;

  return (
    <div className="min-h-screen flex w-full">
      <div className="flex-1">
        <header
          className="h-14 flex items-center justify-between px-3 border-b text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Link to={goLeft.to} aria-label={goLeft.label} className="hover-scale">
            <Button size="icon" variant="secondary" className="shadow-sm">
              <LeftIcon />
            </Button>
          </Link>

          <div className="text-base md:text-lg font-semibold select-none">{title}</div>

          <Link to={rightBtn.to} aria-label={rightBtn.aria} className="hover-scale">
            <Button size="icon" variant="default" className="shadow-sm">
              <RightIcon />
            </Button>
          </Link>
        </header>
        <main className="flex-1 container py-4 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

