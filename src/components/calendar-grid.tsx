"use client";

import { useMemo, useState } from "react";
import type { ExamData, Actividad } from "../lib/types";
import {
  parseDate,
  getMonthName,
  getActivityColor,
} from "../lib/calendar-utils";

interface CalendarGridProps {
  data: ExamData[];
  viewMonths: 6 | 12;
  onEventClick: (
    examIndex: number,
    actividadIndex: number,
    actividad: Actividad,
    examenNombre: string
  ) => void;
  visibleExams: Set<number>;
  startOffset: number;
  filterExamIndex?: number | null;
  originalExamIndex?: number | null;
}

export function CalendarGrid({
  data,
  viewMonths,
  onEventClick,
  visibleExams,
  startOffset,
  filterExamIndex,
  originalExamIndex,
}: CalendarGridProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    month: number;
    year: number;
    day: number;
  } | null>(null);

  const months = useMemo(() => {
    const baseStartMonth = 2;
    const baseStartYear = 2026;
    const result = [];

    const totalMonthsFromBase = baseStartMonth + startOffset;
    const adjustedStartMonth = ((totalMonthsFromBase % 12) + 12) % 12;
    const adjustedStartYear =
      baseStartYear + Math.floor(totalMonthsFromBase / 12);

    for (let i = 0; i < viewMonths; i++) {
      const month = (adjustedStartMonth + i) % 12;
      const year =
        adjustedStartYear + Math.floor((adjustedStartMonth + i) / 12);
      result.push({ month, year });
    }
    return result;
  }, [viewMonths, startOffset]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day: number, month: number, year: number) => {
    const events: {
      examIndex: number;
      actividadIndex: number;
      actividad: Actividad;
      examenNombre: string;
      isStart: boolean;
      isEnd: boolean;
      isInRange: boolean;
      color: string;
    }[] = [];

    const currentDate = new Date(year, month, day);

    data.forEach((exam, examIndex) => {
      if (
        filterExamIndex !== undefined &&
        filterExamIndex !== null &&
        examIndex !== filterExamIndex
      )
        return;
      if (filterExamIndex === undefined || filterExamIndex === null) {
        if (!visibleExams.has(examIndex)) return;
      }

      exam.actividades.forEach((actividad, actividadIndex) => {
        const inicio = parseDate(actividad.inicio);
        const fin = actividad.fin ? parseDate(actividad.fin) : inicio;

        if (!inicio) return;

        const isStart =
          inicio.getDate() === day &&
          inicio.getMonth() === month &&
          inicio.getFullYear() === year;
        const isEnd = !!(
          fin &&
          fin.getDate() === day &&
          fin.getMonth() === month &&
          fin.getFullYear() === year
        );
        const isInRange = !!(
          inicio &&
          fin &&
          currentDate >= inicio &&
          currentDate <= fin
        );

        if (isStart || isEnd || isInRange) {
          const colorExamIndex =
            originalExamIndex !== undefined && originalExamIndex !== null
              ? originalExamIndex
              : examIndex;
          events.push({
            examIndex,
            actividadIndex,
            actividad,
            examenNombre: exam.examen,
            isStart,
            isEnd,
            isInRange,
            color: getActivityColor(colorExamIndex, actividadIndex),
          });
        }
      });
    });

    return events;
  };

  return (
    <div
      className={`grid gap-4 ${
        viewMonths === 6
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {months.map(({ month, year }) => (
        <div
          key={`${month}-${year}`}
          className="border border-[hsl(var(--border))] rounded-lg p-3 bg-[hsl(var(--muted))] bg-opacity-30"
        >
          <h3 className="font-medium text-center mb-2 text-[hsl(var(--foreground))] text-sm">
            {getMonthName(month)} {year}
          </h3>
          <div className="grid grid-cols-7 gap-0.5 text-xs">
            {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
              <div
                key={i}
                className="text-center font-medium text-[hsl(var(--muted-foreground))] py-1"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: getFirstDayOfMonth(month, year) }).map(
              (_, i) => (
                <div key={`empty-${i}`} />
              )
            )}
            {Array.from({ length: getDaysInMonth(month, year) }).map(
              (_, dayIndex) => {
                const day = dayIndex + 1;
                const events = getEventsForDate(day, month, year);
                const hasEvents = events.length > 0;
                const isHovered =
                  hoveredDay?.day === day &&
                  hoveredDay?.month === month &&
                  hoveredDay?.year === year;

                return (
                  <div key={day} className="relative">
                    <button
                      className={`
                      aspect-square w-full flex items-center justify-center rounded text-xs
                      transition-all relative
                      ${
                        hasEvents
                          ? "font-bold cursor-pointer hover:ring-2 hover:ring-[hsl(var(--primary))]"
                          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                      }
                    `}
                      style={
                        hasEvents
                          ? {
                              backgroundColor: events[0].color,
                              color: "white",
                            }
                          : {}
                      }
                      onClick={() => {
                        if (hasEvents && events[0]) {
                          onEventClick(
                            events[0].examIndex,
                            events[0].actividadIndex,
                            events[0].actividad,
                            events[0].examenNombre
                          );
                        }
                      }}
                      onMouseEnter={() => setHoveredDay({ month, year, day })}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {day}
                      {events.length > 1 && (
                        <span className="absolute -top-1 -right-1 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                          {events.length}
                        </span>
                      )}
                    </button>
                    {hasEvents && isHovered && (
                      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg p-2 pointer-events-none">
                        <div className="space-y-1.5">
                          {events.map((e, i) => (
                            <div
                              key={i}
                              className="text-xs flex items-start gap-2"
                            >
                              <div
                                className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: e.color }}
                              />
                              <div>
                                <p className="font-semibold text-[hsl(var(--foreground))] line-clamp-1">
                                  {e.examenNombre}
                                </p>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                  {e.actividad.actividad}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[hsl(var(--border))]" />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
