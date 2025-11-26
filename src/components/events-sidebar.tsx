"use client";

import {
  CalendarDays,
  Edit2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import type { ExamData, Actividad } from "../lib/types";
import { getExamColor, getActivityColor } from "../lib/calendar-utils";
import { useState } from "react";

interface EventsSidebarProps {
  data: ExamData[];
  onEventClick: (
    examIndex: number,
    actividadIndex: number,
    actividad: Actividad,
    examenNombre: string
  ) => void;
  visibleExams: Set<number>;
  onToggleVisibility: (examIndex: number) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onViewExam: (examIndex: number) => void;
}

export function EventsSidebar({
  data,
  onEventClick,
  visibleExams,
  onToggleVisibility,
  onShowAll,
  onHideAll,
  onViewExam,
}: EventsSidebarProps) {
  const [expandedExams, setExpandedExams] = useState<Set<number>>(
    () => new Set(data.map((_, i) => i))
  );

  const toggleExpanded = (examIndex: number) => {
    setExpandedExams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(examIndex)) {
        newSet.delete(examIndex);
      } else {
        newSet.add(examIndex);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] h-fit max-h-[calc(100vh-180px)] sticky top-24 overflow-hidden">
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
          <CalendarDays className="h-5 w-5" />
          Todos los Eventos
        </h2>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={onShowAll}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] rounded-md transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Mostrar todos
          </button>
          <button
            onClick={onHideAll}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] rounded-md transition-colors flex items-center justify-center gap-1"
          >
            <EyeOff className="h-3 w-3" />
            Ocultar todos
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-320px)] p-4">
        <div className="space-y-3">
          {data.map((exam, examIndex) => {
            const isVisible = visibleExams.has(examIndex);
            const isExpanded = expandedExams.has(examIndex);

            return (
              <div
                key={examIndex}
                className={`transition-opacity ${
                  isVisible ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => toggleExpanded(examIndex)}
                    className="p-0.5 hover:bg-[hsl(var(--muted))] rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    )}
                  </button>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getExamColor(examIndex) }}
                  />
                  <h3 className="font-semibold text-sm text-[hsl(var(--foreground))] line-clamp-1 flex-1">
                    {exam.examen}
                  </h3>
                  <button
                    onClick={() => onViewExam(examIndex)}
                    className="p-1.5 rounded-md bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
                    title="Ver solo este examen"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleVisibility(examIndex)}
                    className={`p-1.5 rounded-md transition-colors ${
                      isVisible
                        ? "bg-[hsl(var(--primary))] text-white hover:opacity-80"
                        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                    }`}
                    title={
                      isVisible
                        ? "Ocultar en calendario"
                        : "Mostrar en calendario"
                    }
                  >
                    {isVisible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                {exam.nota && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 ml-7">
                    {exam.nota}
                  </p>
                )}
                {isExpanded && (
                  <div className="space-y-1.5 ml-7">
                    {exam.actividades.map((actividad, actividadIndex) => (
                      <button
                        key={actividadIndex}
                        onClick={() =>
                          onEventClick(
                            examIndex,
                            actividadIndex,
                            actividad,
                            exam.examen
                          )
                        }
                        className="w-full text-left p-2 rounded-md bg-[hsl(var(--muted))] bg-opacity-50 hover:bg-opacity-100 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{
                              backgroundColor: getActivityColor(
                                examIndex,
                                actividadIndex
                              ),
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
                          <Edit2 className="h-3 w-3 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
