"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Actividad } from "../lib/types";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    examIndex: number;
    actividadIndex: number;
    actividad: Actividad;
    examenNombre: string;
  } | null;
  onSave: (inicio: string, fin: string | null) => void;
}

export function EditEventDialog({
  open,
  onOpenChange,
  event,
  onSave,
}: EditEventDialogProps) {
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [hasEndDate, setHasEndDate] = useState(false);

  const parseStringToDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const formatDateToString = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (event) {
      setInicio(parseStringToDate(event.actividad.inicio));
      setFin(event.actividad.fin ? parseStringToDate(event.actividad.fin) : "");
      setHasEndDate(!!event.actividad.fin);
    }
  }, [event]);

  const handleSave = () => {
    onSave(
      formatDateToString(inicio),
      hasEndDate && fin ? formatDateToString(fin) : null
    );
  };

  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-[hsl(var(--card))] rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
          Editar Evento
        </h2>

        <div className="space-y-4">
          {/* Info del evento */}
          <div>
            <label className="text-xs text-[hsl(var(--muted-foreground))]">
              Examen
            </label>
            <p className="font-medium text-sm text-[hsl(var(--foreground))]">
              {event.examenNombre}
            </p>
          </div>

          <div>
            <label className="text-xs text-[hsl(var(--muted-foreground))]">
              Actividad
            </label>
            <p className="font-medium text-sm text-[hsl(var(--foreground))]">
              {event.actividad.actividad}
            </p>
          </div>

          {/* Fecha inicio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>

          {/* Toggle fecha fin */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Tiene fecha de fin
            </label>
            <button
              onClick={() => setHasEndDate(!hasEndDate)}
              className={`w-11 h-6 rounded-full transition-colors ${
                hasEndDate
                  ? "bg-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--muted))]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  hasEndDate ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Fecha fin */}
          {hasEndDate && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
