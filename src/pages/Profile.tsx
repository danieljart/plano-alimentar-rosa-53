import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAdmin, signOut } = useAuth();
  const [geminiKey, setGeminiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const localKey = localStorage.getItem("gemini_api_key");
    if (localKey) {
      setGeminiKey("***configurada***");
    }
  }, []);

  const handleSaveGeminiKey = () => {
    if (!geminiKey.trim()) {
      toast.error("Insira uma chave válida");
      return;
    }
    localStorage.setItem("gemini_api_key", geminiKey);
    toast.success("Chave Gemini salva localmente");
    setShowKeyInput(false);
    setGeminiKey("***configurada***");
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("onboardingPrefs");
      localStorage.removeItem("gemini_api_key");
      await signOut();
      toast.success("Desconectado com sucesso");
    } catch (error) {
      toast.error("Erro ao sair");
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Perfil | Integrações</title>
        <meta name="description" content="Gerencie seus dados e integrações seguras" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Perfil</h1>
        {isAdmin && <Badge variant="default">Admin</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados básicos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:max-w-md">
          <div>
            <Label>E-mail</Label>
            <Input value={user?.email || ""} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrações IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Status do Gemini</Label>
            <div className="mt-2 space-y-2">
              {isAdmin ? (
                <Badge variant="default">Configurado no servidor (Admin)</Badge>
              ) : (
                <div className="space-y-2">
                  <Badge variant={geminiKey.includes("***") ? "default" : "secondary"}>
                    {geminiKey.includes("***") ? "Configurado localmente" : "Não configurado"}
                  </Badge>
                  {!showKeyInput ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowKeyInput(true)}
                    >
                      Configurar chave local
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Sua chave API do Gemini"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveGeminiKey}>
                          Salvar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowKeyInput(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut}>
            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
