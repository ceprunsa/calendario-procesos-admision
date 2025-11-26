"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ExamData, Actividad } from "../lib/types";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExamData[];
  onAddEvent: (examIndex: number, actividad: Actividad) => void;
  onAddExam: (examen: string, actividad: Actividad) => void;
}

export function AddEventDialog({
  open,
  onOpenChange,
  data,
  onAddEvent,
  onAddExam,
}: AddEventDialogProps) {
  const [isNewExam, setIsNewExam] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [newExamName, setNewExamName] = useState("");
  const [actividadName, setActividadName] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [hasEndDate, setHasEndDate] = useState(false);

  const formatDateToString = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = () => {
    const actividad: Actividad = {
      actividad: actividadName,
      inicio: formatDateToString(inicio),
      fin: hasEndDate && fin ? formatDateToString(fin) : null,
    };

    if (isNewExam) {
      onAddExam(newExamName, actividad);
    } else {
      const examIndex = Number.parseInt(selectedExam);
      onAddEvent(examIndex, actividad);
    }

    resetForm();
  };

  const resetForm = () => {
    setIsNewExam(false);
    setSelectedExam("");
    setNewExamName("");
    setActividadName("");
    setInicio("");
    setFin("");
    setHasEndDate(false);
  };

  const isValid =
    actividadName && inicio && (isNewExam ? newExamName : selectedExam);

  if (!open) return null;

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
          Agregar Nuevo Evento
        </h2>

        <div className="space-y-4">
          {/* Toggle nuevo examen */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Crear nuevo examen
            </label>
            <button
              onClick={() => setIsNewExam(!isNewExam)}
              className={`w-11 h-6 rounded-full transition-colors ${
                isNewExam
                  ? "bg-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--muted))]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  isNewExam ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Selector de examen o nombre nuevo */}
          {isNewExam ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                Nombre del Examen
              </label>
              <input
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="Ej: EXAMEN CEPRUNSA III FASE 2027"
                className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                Seleccionar Examen
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              >
                <option value="">Selecciona un examen</option>
                {data.map((exam, index) => (
                  <option key={index} value={index.toString()}>
                    {exam.examen}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nombre de actividad */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Nombre de la Actividad
            </label>
            <input
              value={actividadName}
              onChange={(e) => setActividadName(e.target.value)}
              placeholder="Ej: Inscripciones"
              className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
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
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
