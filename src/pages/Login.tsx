import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const existing = localStorage.getItem("authEmail");
    if (existing) window.location.href = "/plan";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    // Placeholder de autenticação local. Substituir por Supabase.
    localStorage.setItem("authEmail", email);
    toast.success(mode === "login" ? "Bem-vinda de volta!" : "Conta criada com sucesso!");
    const hasPrefs = !!localStorage.getItem("onboardingPrefs");
    window.location.href = hasPrefs ? "/plan" : "/onboarding";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Helmet>
        <title>Entrar | Plano alimentar rosa</title>
        <meta name="description" content="Acesse seu plano alimentar personalizado" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card className="w-full max-w-sm shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle>Olá! Vamos começar</CardTitle>
          <CardDescription>Entre ou crie sua conta para montar seu plano.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pass">Senha</Label>
              <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full hover-scale">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
            <Button type="button" variant="subtle" className="w-full" onClick={() => setMode(mode === "login" ? "signup" : "login") }>
              {mode === "login" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
