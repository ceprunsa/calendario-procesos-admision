"use client";

import { useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { EventsSidebar } from "./events-sidebar";
import { AddEventDialog } from "./add-event-dialog";
import { EditEventDialog } from "./edit-event-dialog";
import { ExamViewDialog } from "./exam-view-dialog";
import type { ExamData, Actividad } from "../lib/types";
import { initialData } from "../lib/exam-data";
import {
  GraduationCap,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function CalendarLanding() {
  const [data, setData] = useState<ExamData[]>(initialData);
  const [viewMonths, setViewMonths] = useState<6 | 12>(12);
  const [startOffset, setStartOffset] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{
    examIndex: number;
    actividadIndex: number;
    actividad: Actividad;
    examenNombre: string;
  } | null>(null);
  const [visibleExams, setVisibleExams] = useState<Set<number>>(
    () => new Set(initialData.map((_, i) => i))
  );
  const [examViewOpen, setExamViewOpen] = useState(false);
  const [viewingExamIndex, setViewingExamIndex] = useState<number | null>(null);

  const toggleExamVisibility = (examIndex: number) => {
    setVisibleExams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(examIndex)) {
        newSet.delete(examIndex);
      } else {
        newSet.add(examIndex);
      }
      return newSet;
    });
  };

  const showAllExams = () => {
    setVisibleExams(new Set(data.map((_, i) => i)));
  };

  const hideAllExams = () => {
    setVisibleExams(new Set());
  };

  const handleEditEvent = (
    examIndex: number,
    actividadIndex: number,
    actividad: Actividad,
    examenNombre: string
  ) => {
    setEditingEvent({ examIndex, actividadIndex, actividad, examenNombre });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (inicio: string, fin: string | null) => {
    if (!editingEvent) return;
    setData((prev) => {
      const newData = [...prev];
      newData[editingEvent.examIndex].actividades[editingEvent.actividadIndex] =
        {
          ...newData[editingEvent.examIndex].actividades[
            editingEvent.actividadIndex
          ],
          inicio,
          fin,
        };
      return newData;
    });
    setEditDialogOpen(false);
    setEditingEvent(null);
  };

  const handleAddEvent = (examIndex: number, actividad: Actividad) => {
    setData((prev) => {
      const newData = [...prev];
      newData[examIndex].actividades.push(actividad);
      return newData;
    });
    setVisibleExams((prev) => new Set(prev).add(examIndex));
    setAddDialogOpen(false);
  };

  const handleAddExam = (examen: string, actividad: Actividad) => {
    setData((prev) => [...prev, { examen, actividades: [actividad] }]);
    setVisibleExams((prev) => new Set(prev).add(data.length));
    setAddDialogOpen(false);
  };

  const handlePreviousMonths = () => {
    setStartOffset((prev) => prev - viewMonths);
  };

  const handleNextMonths = () => {
    setStartOffset((prev) => prev + viewMonths);
  };

  const handleToday = () => {
    setStartOffset(0);
  };

  const handleViewExam = (examIndex: number) => {
    setViewingExamIndex(examIndex);
    setExamViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="border-b bg-[hsl(var(--card))] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(var(--primary))] rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
                  UNSA Admision 2027
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Calendario de Examenes de Admisión
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
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
              <button
                onClick={() => setAddDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Agregar Evento
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Calendar Grid */}
          <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />
                <h2 className="font-semibold text-[hsl(var(--foreground))]">
                  Vista de {viewMonths} meses
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousMonths}
                  className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                  title="Meses anteriores"
                >
                  <ChevronLeft className="h-5 w-5 text-[hsl(var(--foreground))]" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-sm font-medium bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] rounded-lg transition-colors text-[hsl(var(--foreground))]"
                >
                  Hoy
                </button>
                <button
                  onClick={handleNextMonths}
                  className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                  title="Meses siguientes"
                >
                  <ChevronRight className="h-5 w-5 text-[hsl(var(--foreground))]" />
                </button>
              </div>
            </div>
            <CalendarGrid
              data={data}
              viewMonths={viewMonths}
              onEventClick={handleEditEvent}
              visibleExams={visibleExams}
              startOffset={startOffset}
            />
          </div>

          {/* Events Sidebar */}
          <EventsSidebar
            data={data}
            onEventClick={handleEditEvent}
            visibleExams={visibleExams}
            onToggleVisibility={toggleExamVisibility}
            onShowAll={showAllExams}
            onHideAll={hideAllExams}
            onViewExam={handleViewExam}
          />
        </div>
      </main>

      {/* Dialogs */}
      <AddEventDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        data={data}
        onAddEvent={handleAddEvent}
        onAddExam={handleAddExam}
      />

      <EditEventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={editingEvent}
        onSave={handleSaveEdit}
      />

      <ExamViewDialog
        open={examViewOpen}
        onOpenChange={setExamViewOpen}
        exam={viewingExamIndex !== null ? data[viewingExamIndex] : null}
        examIndex={viewingExamIndex ?? 0}
        onEventClick={handleEditEvent}
      />
    </div>
  );
}
