import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FOODS, FoodItem } from "@/data/foods";
import { TEMPLATES } from "@/data/schedules";
import { toast } from "sonner";

export type Preferences = {
  versao: number;
  timestamp: string;
  caloriasDiarias: number;
  gostaIds: string[];
  restricoes: { lactose: boolean; gluten: boolean; alergias?: string };
  priorizarFrango: boolean;
  templateId: string;
};

function groupByCategory(items: FoodItem[]) {
  return items.reduce<Record<string, FoodItem[]>>((acc, item) => {
    (acc[item.categoria] ||= []).push(item);
    return acc;
  }, {});
}

export default function Onboarding() {
  const [calorias, setCalorias] = useState<number>(1800);
  const [gosta, setGosta] = useState<string[]>([]);
  const [restricoes, setRestricoes] = useState({ lactose: false, gluten: false, alergias: "" });
  const [priorizarFrango, setPriorizarFrango] = useState(true);
  const [templateId, setTemplateId] = useState("A");

  useEffect(() => {
    const saved = localStorage.getItem("onboardingPrefs");
    if (saved) {
      const p = JSON.parse(saved) as Preferences;
      setCalorias(p.caloriasDiarias);
      setGosta(p.gostaIds);
      setRestricoes({ lactose: p.restricoes.lactose, gluten: p.restricoes.gluten, alergias: p.restricoes.alergias || "" });
      setPriorizarFrango(p.priorizarFrango);
      setTemplateId(p.templateId);
    }
  }, []);

  const byCat = useMemo(() => groupByCategory(FOODS), []);

  const toggleGosta = (id: string) => {
    setGosta((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (calorias < 1000 || calorias > 4000) {
      toast.error("Defina calorias entre 1000 e 4000 kcal");
      return;
    }
    if (gosta.length < 6) {
      toast.error("Selecione pelo menos 6 alimentos que você gosta");
      return;
    }
    const versaoAnterior = Number(JSON.parse(localStorage.getItem("onboardingPrefs") || "{\"versao\":0}").versao || 0);
    const prefs: Preferences = {
      versao: versaoAnterior + 1,
      timestamp: new Date().toISOString(),
      caloriasDiarias: calorias,
      gostaIds: gosta,
      restricoes,
      priorizarFrango,
      templateId,
    };
    localStorage.setItem("onboardingPrefs", JSON.stringify(prefs));
    toast.success("Preferências salvas. Você pode gerar seu plano!");
    window.location.href = "/plan";
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Onboarding | Plano alimentar rosa</title>
        <meta name="description" content="Defina calorias, preferências e restrições para seu plano alimentar" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suas preferências</h1>
        <Button variant="hero" onClick={handleSave} className="hover-scale">Salvar e continuar</Button>
      </header>

      <Card className="shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle>Calorias e horários</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="kcal">Calorias diárias (kcal)</Label>
            <Input id="kcal" type="number" min={1000} max={4000} value={calorias}
              onChange={(e) => setCalorias(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground mt-1">Distribuição padrão: 20/10/30/10/25/5</p>
          </div>
          <div>
            <Label htmlFor="template">Template de horários</Label>
            <select
              id="template"
              className="mt-2 h-10 rounded-md border bg-background px-3"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.id} — {t.nome}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">Você poderá editar depois.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle>Restrições e prioridades</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Checkbox id="lact" checked={restricoes.lactose}
              onCheckedChange={(v) => setRestricoes((r) => ({ ...r, lactose: Boolean(v) }))} />
            <Label htmlFor="lact">Sem lactose</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="glut" checked={restricoes.gluten}
              onCheckedChange={(v) => setRestricoes((r) => ({ ...r, gluten: Boolean(v) }))} />
            <Label htmlFor="glut">Sem glúten</Label>
          </div>
          <div>
            <Label htmlFor="aler">Alergias (opcional)</Label>
            <Input id="aler" placeholder="Ex.: amendoim" value={restricoes.alergias}
              onChange={(e) => setRestricoes((r) => ({ ...r, alergias: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="frango" checked={priorizarFrango}
              onCheckedChange={(v) => setPriorizarFrango(Boolean(v))} />
            <Label htmlFor="frango">Priorizar frango</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle>Alimentos que você gosta (mín. 6)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(byCat).map(([cat, items]) => (
            <section key={cat} className="space-y-2">
              <h2 className="text-sm font-semibold">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((f) => (
                  <label key={f.id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-secondary/50 transition-colors">
                    <Checkbox checked={gosta.includes(f.id)} onCheckedChange={() => toggleGosta(f.id)} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{f.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.price_label} {f.affordable_flag ? "• acessível" : ""}
                      </div>
                    </div>
                    <img src={f.image_url} alt={f.alt} className="h-12 w-16 object-cover rounded" loading="lazy" />
                  </label>
                ))}
              </div>
              <Separator />
            </section>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="hero" size="lg" onClick={handleSave} className="hover-scale">Salvar e continuar</Button>
      </div>
    </div>
  );
}
