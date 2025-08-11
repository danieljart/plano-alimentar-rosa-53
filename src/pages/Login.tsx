import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const hasPrefs = !!localStorage.getItem("onboardingPrefs");
      navigate(hasPrefs ? "/plan" : "/onboarding");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, displayName);
      }

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success(mode === "login" ? "Bem-vinda de volta!" : "Conta criada! Verifique seu e-mail para confirmar.");
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            {mode === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="name">Nome (opcional)</Label>
                <Input id="name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="pass">Senha</Label>
              <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full hover-scale" disabled={loading}>
              {loading ? "Aguarde..." : (mode === "login" ? "Entrar" : "Criar conta")}
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
