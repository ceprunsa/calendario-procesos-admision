export interface Actividad {
  actividad: string;
  inicio: string;
  fin: string | null;
}

export interface ExamData {
  examen: string;
  nota?: string;
  actividades: Actividad[];
}
