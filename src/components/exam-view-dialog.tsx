"use client";

import { X, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { ExamData, Actividad } from "../lib/types";
import { getExamColor, getActivityColor } from "../lib/calendar-utils";
import { CalendarGrid } from "./calendar-grid";
import { useState, useMemo } from "react";

interface ExamViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: ExamData | null;
  examIndex: number;
  onEventClick: (
    examIndex: number,
    actividadIndex: number,
    actividad: Actividad,
    examenNombre: string
  ) => void;
}

function calculateInitialOffset(exam: ExamData): number {
  let earliestDate: Date | null = null;

  for (const actividad of exam.actividades) {
    if (actividad.inicio) {
      const [day, month, year] = actividad.inicio.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      if (!earliestDate || date < earliestDate) {
        earliestDate = date;
      }
    }
  }

  if (!earliestDate) return 0;

  // Calculate offset from March 2026 (base date)
  const baseDate = new Date(2026, 2, 1); // March 2026
  const monthsDiff =
    (earliestDate.getFullYear() - baseDate.getFullYear()) * 12 +
    (earliestDate.getMonth() - baseDate.getMonth());

  return monthsDiff;
}

export function ExamViewDialog({
  open,
  onOpenChange,
  exam,
  examIndex,
  onEventClick,
}: ExamViewDialogProps) {
  const [viewMonths, setViewMonths] = useState<6 | 12>(6);

  const initialOffset = useMemo(() => {
    if (!exam) return 0;
    return calculateInitialOffset(exam);
  }, [exam]);

  const [startOffset, setStartOffset] = useState(initialOffset);

  useMemo(() => {
    if (exam) {
      setStartOffset(calculateInitialOffset(exam));
    }
  }, [exam]);

  if (!open || !exam) return null;

  const handlePreviousMonths = () => {
    setStartOffset((prev) => prev - viewMonths);
  };

  const handleNextMonths = () => {
    setStartOffset((prev) => prev + viewMonths);
  };

  const handleGoToExamStart = () => {
    setStartOffset(initialOffset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-[hsl(var(--card))] rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div
          className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between"
          style={{ backgroundColor: getExamColor(examIndex) }}
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">{exam.examen}</h2>
              {exam.nota && (
                <p className="text-sm text-white/80">{exam.nota}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-1 bg-[hsl(var(--muted))] rounded-lg p-1">
              <button
                onClick={() => setViewMonths(6)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMonths === 6
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                }`}
              >
                6 meses
              </button>
              <button
                onClick={() => setViewMonths(12)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMonths === 12
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                }`}
              >
                12 meses
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousMonths}
                className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-[hsl(var(--foreground))]" />
              </button>
              <button
                onClick={handleGoToExamStart}
                className="px-3 py-1.5 text-sm font-medium bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] rounded-lg transition-colors text-[hsl(var(--foreground))]"
              >
                Inicio
              </button>
              <button
                onClick={handleNextMonths}
                className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-[hsl(var(--foreground))]" />
              </button>
            </div>
          </div>

          {/* Calendar for this exam only */}
          <CalendarGrid
            data={[exam]}
            viewMonths={viewMonths}
            onEventClick={(_, actIdx, act, name) =>
              onEventClick(examIndex, actIdx, act, name)
            }
            visibleExams={new Set([0])}
            startOffset={startOffset}
            filterExamIndex={0}
            originalExamIndex={examIndex}
          />

          {/* Legend of activities */}
          <div className="mt-6 p-4 bg-[hsl(var(--muted))] rounded-lg">
            <h3 className="font-semibold text-sm text-[hsl(var(--foreground))] mb-3">
              Actividades de este examen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exam.actividades.map((actividad, actIdx) => (
                <div
                  key={actIdx}
                  className="flex items-center gap-2 p-2 bg-[hsl(var(--card))] rounded-md"
                >
                  <div
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{
                      backgroundColor: getActivityColor(examIndex, actIdx),
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[hsl(var(--foreground))] line-clamp-1">
                      {actividad.actividad}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {actividad.inicio}
                      {actividad.fin && ` - ${actividad.fin}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
