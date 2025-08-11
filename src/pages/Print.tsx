import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { generateDay, portionLabel } from "@/lib/plan/generator";
import { Button } from "@/components/ui/button";

function getPrefs() {
  const p = localStorage.getItem("onboardingPrefs");
  return p ? JSON.parse(p) : null;
}


export default function PrintPage() {
  const [sp] = useSearchParams();
  const [prefs, setPrefs] = useState<any>(null);
  const dia = sp.get("dia") || "Seg";

  useEffect(() => { setPrefs(getPrefs()); }, []);

const plan = useMemo(() => {
  if (!prefs) return null as any;
  return generateDay(prefs.caloriasDiarias, prefs.gostaIds, dia);
}, [prefs, dia]);

  const userName = localStorage.getItem("authEmail")?.split("@")[0] || "Usuária";

  return (
    <div className="p-4">
      <Helmet>
        <title>Impressão | Plano alimentar</title>
        <meta name="description" content="Versão imprimível do seu plano em A4 landscape" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <style>{`@media print { @page { size: A4 landscape; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>

      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Plano do dia — {dia}</h1>
        <Button variant="hero" onClick={() => window.print()}>Exportar PDF</Button>
      </div>

      {plan && (
        <div className="grid grid-cols-3 gap-3 print:grid-cols-3">
          <div className="col-span-3 flex justify-between text-sm">
            <div><strong>Nome:</strong> {userName}</div>
            <div><strong>Data:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Total do dia:</strong> {plan.totalKcal} kcal</div>
          </div>
          {plan.refeicoes.map((m, i) => (
            <section key={i} className="border rounded-md p-2">
<header className="flex items-center gap-2 mb-1">
  <img src={m.image} alt={`${m.nome}`} className="h-10 w-14 object-cover rounded" />
  <div className="text-sm font-semibold">{m.hora} — {m.nome}</div>
  <div className="ml-auto text-xs text-muted-foreground">{m.calorias} kcal</div>
</header>
              <ul className="text-xs list-disc pl-4">
                {m.itens.map((i) => (
                  <li key={i.id}>{i.nome} — {portionLabel(i)}</li>
                ))}
              </ul>
              <div className="mt-1 text-[11px] text-muted-foreground">Substituições: ver app (±10% kcal)</div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
