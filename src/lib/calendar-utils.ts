export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export function getMonthName(month: number): string {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[month];
}

const examBaseColors = [
  {
    base: "#3b82f6",
    variants: [
      "#3b82f6",
      "#60a5fa",
      "#93c5fd",
      "#2563eb",
      "#1d4ed8",
      "#172554",
    ], // blue mejorado
  },
  {
    base: "#10b981",
    variants: [
      "#10b981",
      "#34d399",
      "#6ee7b7",
      "#059669",
      "#047857",
      "#064e3b",
    ], // emerald mejorado
  },
  {
    base: "#f59e0b",
    variants: [
      "#f59e0b",
      "#fbbf24",
      "#fcd34d",
      "#d97706",
      "#b45309",
      "#78350f",
    ], // amber mejorado
  },
  {
    base: "#ef4444",
    variants: [
      "#ef4444",
      "#f87171",
      "#fca5a5",
      "#dc2626",
      "#b91c1c",
      "#7f1d1d",
    ], // red mejorado
  },
  {
    base: "#8b5cf6",
    variants: [
      "#8b5cf6",
      "#a78bfa",
      "#c4b5fd",
      "#7c3aed",
      "#6d28d9",
      "#4c1d95",
    ], // violet mejorado
  },
  {
    base: "#06b6d4",
    variants: [
      "#06b6d4",
      "#22d3ee",
      "#67e8f9",
      "#0891b2",
      "#0e7490",
      "#164e63",
    ], // cyan mejorado
  },
  {
    base: "#ec4899",
    variants: [
      "#ec4899",
      "#f472b6",
      "#f9a8d4",
      "#db2777",
      "#be185d",
      "#831843",
    ], // pink mejorado
  },
  {
    base: "#84cc16",
    variants: [
      "#84cc16",
      "#a3e635",
      "#bef264",
      "#65a30d",
      "#4d7c0f",
      "#365314",
    ], // lime mejorado
  },

  // ⭐ Nuevo color agregado (teal)
  {
    base: "#14b8a6",
    variants: [
      "#14b8a6",
      "#2dd4bf",
      "#99f6e4",
      "#0d9488",
      "#0f766e",
      "#064e49",
    ], // teal
  },
];

export function getExamColor(index: number): string {
  return examBaseColors[index % examBaseColors.length].base;
}

export function getActivityColor(
  examIndex: number,
  activityIndex: number
): string {
  const exam = examBaseColors[examIndex % examBaseColors.length];
  return exam.variants[activityIndex % exam.variants.length];
}
