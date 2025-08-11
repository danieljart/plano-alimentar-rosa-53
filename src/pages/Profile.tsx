import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const email = localStorage.getItem("authEmail") || "";
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Perfil | Integrações</title>
        <meta name="description" content="Gerencie seus dados e integrações seguras" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <h1 className="text-2xl font-bold">Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Dados básicos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:max-w-md">
          <div>
            <Label>E-mail</Label>
            <Input value={email} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                localStorage.removeItem("authEmail");
                localStorage.removeItem("onboardingPrefs");
              } finally {
                window.location.href = "/login";
              }
            }}
          >
            Sair da conta
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
