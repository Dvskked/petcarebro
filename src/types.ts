export type PetSpecies = "perro" | "gato" | "conejo" | "ave" | "otro";
export type PetSize = "pequeno" | "mediano" | "grande";
export type ActivityType = "paseo" | "alimentacion" | "medicinas" | "banio" | "juego" | "vacunacion";
export type HealthStatus = "saludable" | "en tratamiento" | "urgente";
export type Gender = "macho" | "hembra";

export interface Pet {
  id: string;
  nombre: string;
  especie: PetSpecies;
  raza: string;
  edad: number;
  peso: number;
  tamano: PetSize;
  genero: Gender;
  foto: string;
  color: string;
  estadoSalud: HealthStatus;
  notas: string;
  fechaRegistro: string;
  duenioId: string;
  vacunas: Vacuna[];
}

export interface Vacuna {
  id: string;
  nombre: string;
  fechaAplicacion: string;
  proximaDosis: string;
  veterinario: string;
}

export interface HorarioPaseo {
  id: string;
  mascotaId: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  ruta: string;
  paseadorId: string;
  notas: string;
  activo: boolean;
}

export interface Alimentacion {
  id: string;
  mascotaId: string;
  tipoComida: string;
  cantidad: string;
  horario: string;
  frecuencia: "diaria" | "cada 8h" | "cada 12h" | "semanal";
  indicaciones: string;
  activo: boolean;
}

export interface CitaVeterinaria {
  id: string;
  mascotaId: string;
  fecha: string;
  hora: string;
  motivo: string;
  veterinario: string;
  clinica: string;
  estado: "pendiente" | "completada" | "cancelada";
  diagnostico?: string;
  costo?: number;
}

export interface Actividad {
  id: string;
  mascotaId: string;
  tipo: ActivityType;
  fecha: string;
  hora: string;
  descripcion: string;
  registradoPor: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "admin" | "cuidador" | "duenio";
  fechaRegistro: string;
  avatar: string;
}

export interface RegistroPeso {
  id: string;
  mascotaId: string;
  peso: number;
  fecha: string;
  observaciones: string;
}

export interface Notificacion {
  id: string;
  tipo: "info" | "alerta" | "urgente";
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  mascotaId?: string;
}

export interface DashboardStats {
  totalMascotas: number;
  paseosHoy: number;
  citasPendientes: number;
  alertasActivas: number;
  alimentacionesPendientes: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}
