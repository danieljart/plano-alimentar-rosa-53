export type TimeWindow = { nome: string; inicio: string; fim: string };
export type DayTemplate = { dia: string; janelas: TimeWindow[] };
export type WeeklyTemplate = { id: string; nome: string; work?: string; dias: DayTemplate[] };

const baseDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function makeDias(janelasPorDia: Record<string, TimeWindow[]>): DayTemplate[] {
  return baseDias.map((dia) => ({ dia, janelas: janelasPorDia[dia] || janelasPorDia["Seg"] }));
}

export const TEMPLATES: WeeklyTemplate[] = [
  {
    id: "A",
    nome: "Expediente curto (08:00–17:00)",
    work: "Seg–Sex 08:00–17:00",
    dias: makeDias({
      Seg: [
        { nome: "Café da manhã", inicio: "06:30", fim: "07:30" },
        { nome: "Colação", inicio: "09:30", fim: "10:30" },
        { nome: "Almoço", inicio: "12:00", fim: "13:30" },
        { nome: "Lanche tarde", inicio: "15:30", fim: "16:30" },
        { nome: "Jantar", inicio: "18:30", fim: "19:30" },
        { nome: "Ceia", inicio: "21:00", fim: "22:00" },
      ],
    }),
  },
  {
    id: "B",
    nome: "Expediente longo (08:00–21:00)",
    work: "Seg–Sex 08:00–21:00",
    dias: makeDias({
      Seg: [
        { nome: "Café", inicio: "06:00", fim: "06:45" },
        { nome: "Lanche manhã", inicio: "09:30", fim: "10:15" },
        { nome: "Almoço (prático)", inicio: "12:30", fim: "13:15" },
        { nome: "Lanche tarde", inicio: "16:30", fim: "17:15" },
        { nome: "Jantar", inicio: "21:15", fim: "22:00" },
        { nome: "Ceia (leve)", inicio: "23:00", fim: "23:30" },
      ],
    }),
  },
  {
    id: "C",
    nome: "Turno diurno cedo (06:00–14:00)",
    dias: makeDias({
      Seg: [
        { nome: "Café", inicio: "05:00", fim: "05:30" },
        { nome: "Lanche manhã", inicio: "08:30", fim: "09:00" },
        { nome: "Almoço", inicio: "11:30", fim: "12:30" },
        { nome: "Lanche tarde", inicio: "14:30", fim: "15:00" },
        { nome: "Jantar", inicio: "18:30", fim: "19:30" },
      ],
    }),
  },
  {
    id: "D",
    nome: "Turno vespertino (12:00–21:00)",
    dias: makeDias({
      Seg: [
        { nome: "Café", inicio: "08:00", fim: "09:00" },
        { nome: "Lanche manhã", inicio: "11:00", fim: "11:45" },
        { nome: "Almoço leve", inicio: "11:30", fim: "12:00" },
        { nome: "Lanche tarde", inicio: "15:00", fim: "15:45" },
        { nome: "Jantar", inicio: "21:15", fim: "22:00" },
        { nome: "Ceia", inicio: "23:00", fim: "23:30" },
      ],
    }),
  },
  {
    id: "E",
    nome: "Fins de semana / dias livres",
    dias: makeDias({
      Seg: [
        { nome: "Café", inicio: "08:00", fim: "09:30" },
        { nome: "Lanche manhã", inicio: "10:30", fim: "11:30" },
        { nome: "Almoço", inicio: "12:30", fim: "14:00" },
        { nome: "Lanche tarde", inicio: "16:00", fim: "17:30" },
        { nome: "Jantar", inicio: "19:00", fim: "21:00" },
      ],
    }),
  },
];
