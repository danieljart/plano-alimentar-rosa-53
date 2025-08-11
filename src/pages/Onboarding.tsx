import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FOODS, FoodItem } from "@/data/foods";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Drumstick, Wheat, Bean, Leaf, Apple, Milk, Popcorn, CupSoda, Utensils } from "lucide-react";
export type Preferences = {
  versao: number;
  timestamp: string;
  caloriasDiarias: number;
  gostaIds: string[];
};
function groupByCategory(items: FoodItem[]) {
  return items.reduce<Record<string, FoodItem[]>>((acc, item) => {
    (acc[item.categoria] ||= []).push(item);
    return acc;
  }, {});
}
const categoryIconMap = {
  "Proteínas (Animais)": Drumstick,
  "Carboidratos": Wheat,
  "Legumes & Verduras": Leaf,
  "Leguminosas": Bean,
  "Frutas": Apple,
  "Gorduras & Complementos": Utensils,
  "Laticínios": Milk,
  "Snacks": Popcorn,
  "Bebidas": CupSoda
} as const;
type CatKey = keyof typeof categoryIconMap;
const getIcon = (categoria: FoodItem["categoria"]) => categoryIconMap[categoria as CatKey] || Utensils;
export default function Onboarding() {
  const [calorias, setCalorias] = useState<number>(1800);
  const [gosta, setGosta] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("onboardingPrefs");
    if (saved) {
      const p = JSON.parse(saved) as Preferences;
      setCalorias(p.caloriasDiarias);
      setGosta(p.gostaIds);
    }
  }, []);
  const byCat = useMemo(() => groupByCategory(FOODS), []);
  const [openCat, setOpenCat] = useState<string | undefined>(undefined);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const toggleGosta = (id: string) => {
    setGosta(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleSave = () => {
    if (calorias < 1000 || calorias > 4000) {
      toast.error("Defina calorias entre 1000 e 4000 kcal");
      return;
    }
    if (gosta.length < 3) {
      toast.error("Selecione pelo menos 3 alimentos que você gosta");
      return;
    }
    const versaoAnterior = Number(JSON.parse(localStorage.getItem("onboardingPrefs") || "{\"versao\":0}").versao || 0);
    const prefs: Preferences = {
      versao: versaoAnterior + 1,
      timestamp: new Date().toISOString(),
      caloriasDiarias: calorias,
      gostaIds: gosta
    };
    localStorage.setItem("onboardingPrefs", JSON.stringify(prefs));
    toast.success("Preferências salvas. Você pode gerar seu plano!");
    window.location.href = "/plan";
  };
  return <div className="space-y-6 pb-24">
      <Helmet>
        <title>Onboarding | Plano alimentar rosa</title>
        <meta name="description" content="Defina calorias, preferências e restrições para seu plano alimentar" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>


    <Card className="shadow-[var(--shadow-elegant)]">
  <CardHeader className="bg-card">
    <CardTitle className="text-primary">Calorias diárias</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-4 sm:grid-cols-2 bg-card">
    <div className="sm:col-span-2">
      <Label htmlFor="kcal" className="bg-transparent">Calorias diárias (kcal)</Label>
      <Input id="kcal" type="number" min={1000} max={4000} value={calorias} onChange={e => setCalorias(Number(e.target.value))} />
      <p className="text-xs mt-1 text-accent-foreground">Distribuição padrão: 20/10/30/10/25/5</p>
    </div>
  </CardContent>
    </Card>


    <Card className="shadow-[var(--shadow-elegant)]">
  <CardHeader>
    <CardTitle className="text-primary">Alimentos que você gosta (mín. 3)</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    <Accordion type="single" collapsible className="w-full" value={openCat} onValueChange={v => {
          setOpenCat(v);
          if (v) {
            setTimeout(() => itemRefs.current[v!]?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            }), 0);
          }
        }}>
      {Object.entries(byCat).map(([cat, items], idx) => <AccordionItem ref={el => itemRefs.current[`cat-${idx}`] = el} key={cat} value={`cat-${idx}`} className="scroll-mt-24">
          <AccordionTrigger className="px-2 py-2 text-left font-semibold text-accent-foreground"><span className="inline-flex items-center gap-2">{(() => {
                  const Icon = getIcon(cat as FoodItem["categoria"]);
                  return <Icon size={16} className="text-accent-foreground" />;
                })()} {cat}</span></AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(f => <div key={f.id} role="button" onClick={() => toggleGosta(f.id)} className={`flex items-center gap-3 rounded-md border p-3 transition-colors cursor-pointer ${gosta.includes(f.id) ? "bg-secondary text-secondary-foreground border-transparent" : "bg-background text-accent-foreground border-accent/30 hover:bg-card"}`}>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{f.nome}</div>
                    <div className={`text-xs ${gosta.includes(f.id) ? "opacity-90" : "text-muted-foreground"}`}>
                      {f.price_label} {f.affordable_flag ? "• acessível" : ""}
                    </div>
                  </div>
                  <div className="w-20 rounded overflow-hidden">
                    <AspectRatio ratio={4 / 3}>
                      <img src={f.image_url} alt={f.alt} className="h-full w-full object-cover" loading="lazy" />
                    </AspectRatio>
                  </div>
                </div>)}
            </div>
          </AccordionContent>
        </AccordionItem>)}
    </Accordion>
  </CardContent>
    </Card>

    <div className="sticky bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 flex items-center justify-between gap-3">
  <p className="text-xs text-primary px-2">Sem estresse: você pode ajustar depois.</p>
  <Button variant="hero" size="lg" onClick={handleSave} className="hover-scale mr-2">Salvar e continuar</Button>
    </div>
    </div>;
}