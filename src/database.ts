import { Pet, HorarioPaseo, Alimentacion, CitaVeterinaria, Actividad, Usuario, RegistroPeso, Notificacion, DashboardStats } from "./types";

class Database {
  private storagePrefix = "petcare_";

  private getCollection<T>(key: string): T[] {
    const data = localStorage.getItem(this.storagePrefix + key);
    return data ? JSON.parse(data) : [];
  }

  private setCollection<T>(key: string, data: T[]): void {
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Mascotas
  getAllPets(): Pet[] { return this.getCollection<Pet>("pets"); }
  getPetById(id: string): Pet | undefined { return this.getAllPets().find(p => p.id === id); }
  getPetsByDuenio(duenioId: string): Pet[] { return this.getAllPets().filter(p => p.duenioId === duenioId); }
  addPet(pet: Omit<Pet, "id" | "fechaRegistro">): Pet {
    const newPet: Pet = { ...pet, id: this.generateId(), fechaRegistro: new Date().toISOString() };
    const pets = this.getAllPets();
    pets.push(newPet);
    this.setCollection("pets", pets);
    return newPet;
  }
  updatePet(id: string, data: Partial<Pet>): Pet | null {
    const pets = this.getAllPets();
    const index = pets.findIndex(p => p.id === id);
    if (index === -1) return null;
    pets[index] = { ...pets[index], ...data };
    this.setCollection("pets", pets);
    return pets[index];
  }
  deletePet(id: string): boolean {
    const pets = this.getAllPets().filter(p => p.id !== id);
    this.setCollection("pets", pets);
    return true;
  }

  // Paseos
  getAllWalks(): HorarioPaseo[] { return this.getCollection<HorarioPaseo>("walks"); }
  getWalksByPet(mascotaId: string): HorarioPaseo[] { return this.getAllWalks().filter(w => w.mascotaId === mascotaId); }
  getWalksByDay(dia: string): HorarioPaseo[] { return this.getAllWalks().filter(w => w.diaSemana === dia && w.activo); }
  addWalk(walk: Omit<HorarioPaseo, "id">): HorarioPaseo {
    const newWalk: HorarioPaseo = { ...walk, id: this.generateId() };
    const walks = this.getAllWalks();
    walks.push(newWalk);
    this.setCollection("walks", walks);
    return newWalk;
  }
  updateWalk(id: string, data: Partial<HorarioPaseo>): boolean {
    const walks = this.getAllWalks();
    const index = walks.findIndex(w => w.id === id);
    if (index === -1) return false;
    walks[index] = { ...walks[index], ...data };
    this.setCollection("walks", walks);
    return true;
  }
  deleteWalk(id: string): boolean {
    this.setCollection("walks", this.getAllWalks().filter(w => w.id !== id));
    return true;
  }

  // Alimentación
  getAllFeeding(): Alimentacion[] { return this.getCollection<Alimentacion>("feeding"); }
  getFeedingByPet(mascotaId: string): Alimentacion[] { return this.getAllFeeding().filter(f => f.mascotaId === mascotaId); }
  addFeeding(feeding: Omit<Alimentacion, "id">): Alimentacion {
    const newFeeding: Alimentacion = { ...feeding, id: this.generateId() };
    const feedings = this.getAllFeeding();
    feedings.push(newFeeding);
    this.setCollection("feeding", feedings);
    return newFeeding;
  }
  updateFeeding(id: string, data: Partial<Alimentacion>): boolean {
    const feedings = this.getAllFeeding();
    const index = feedings.findIndex(f => f.id === id);
    if (index === -1) return false;
    feedings[index] = { ...feedings[index], ...data };
    this.setCollection("feeding", feedings);
    return true;
  }
  deleteFeeding(id: string): boolean {
    this.setCollection("feeding", this.getAllFeeding().filter(f => f.id !== id));
    return true;
  }

  // Citas Veterinarias
  getAllVetAppointments(): CitaVeterinaria[] { return this.getCollection<CitaVeterinaria>("vetAppointments"); }
  getVetAppointmentsByPet(mascotaId: string): CitaVeterinaria[] { return this.getAllVetAppointments().filter(a => a.mascotaId === mascotaId); }
  getPendingAppointments(): CitaVeterinaria[] { return this.getAllVetAppointments().filter(a => a.estado === "pendiente"); }
  addVetAppointment(apt: Omit<CitaVeterinaria, "id">): CitaVeterinaria {
    const newApt: CitaVeterinaria = { ...apt, id: this.generateId() };
    const apts = this.getAllVetAppointments();
    apts.push(newApt);
    this.setCollection("vetAppointments", apts);
    return newApt;
  }
  updateVetAppointment(id: string, data: Partial<CitaVeterinaria>): boolean {
    const apts = this.getAllVetAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index === -1) return false;
    apts[index] = { ...apts[index], ...data };
    this.setCollection("vetAppointments", apts);
    return true;
  }
  deleteVetAppointment(id: string): boolean {
    this.setCollection("vetAppointments", this.getAllVetAppointments().filter(a => a.id !== id));
    return true;
  }

  // Actividades
  getAllActivities(): Actividad[] { return this.getCollection<Actividad>("activities"); }
  getActivitiesByPet(mascotaId: string): Actividad[] { return this.getAllActivities().filter(a => a.mascotaId === mascotaId); }
  getActivitiesByDate(date: string): Actividad[] { return this.getAllActivities().filter(a => a.fecha === date); }
  addActivity(activity: Omit<Actividad, "id">): Actividad {
    const newAct: Actividad = { ...activity, id: this.generateId() };
    const acts = this.getAllActivities();
    acts.push(newAct);
    this.setCollection("activities", acts);
    return newAct;
  }
  deleteActivity(id: string): boolean {
    this.setCollection("activities", this.getAllActivities().filter(a => a.id !== id));
    return true;
  }

  // Usuarios
  getAllUsers(): Usuario[] { return this.getCollection<Usuario>("users"); }
  getUserById(id: string): Usuario | undefined { return this.getAllUsers().find(u => u.id === id); }
  addUser(user: Omit<Usuario, "id" | "fechaRegistro">): Usuario {
    const newUser: Usuario = { ...user, id: this.generateId(), fechaRegistro: new Date().toISOString() };
    const users = this.getAllUsers();
    users.push(newUser);
    this.setCollection("users", users);
    return newUser;
  }
  updateUser(id: string, data: Partial<Usuario>): boolean {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users[index] = { ...users[index], ...data };
    this.setCollection("users", users);
    return true;
  }

  // Registro de peso
  getAllWeightRecords(): RegistroPeso[] { return this.getCollection<RegistroPeso>("weightRecords"); }
  getWeightByPet(mascotaId: string): RegistroPeso[] { return this.getAllWeightRecords().filter(w => w.mascotaId === mascotaId); }
  addWeightRecord(record: Omit<RegistroPeso, "id">): RegistroPeso {
    const newRecord: RegistroPeso = { ...record, id: this.generateId() };
    const records = this.getAllWeightRecords();
    records.push(newRecord);
    this.setCollection("weightRecords", records);
    return newRecord;
  }

  // Notificaciones
  getAllNotifications(): Notificacion[] { return this.getCollection<Notificacion>("notifications"); }
  getUnreadNotifications(): Notificacion[] { return this.getAllNotifications().filter(n => !n.leida); }
  addNotification(notif: Omit<Notificacion, "id">): Notificacion {
    const newNotif: Notificacion = { ...notif, id: this.generateId() };
    const notifs = this.getAllNotifications();
    notifs.push(newNotif);
    this.setCollection("notifications", notifs);
    return newNotif;
  }
  markNotificationAsRead(id: string): boolean {
    const notifs = this.getAllNotifications();
    const index = notifs.findIndex(n => n.id === id);
    if (index === -1) return false;
    notifs[index].leida = true;
    this.setCollection("notifications", notifs);
    return true;
  }

  // Dashboard Stats
  getDashboardStats(): DashboardStats {
    const pets = this.getAllPets();
    const walks = this.getAllWalks().filter(w => w.activo);
    const now = new Date();
    const dayNames = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = dayNames[now.getDay()];
    const pendingApts = this.getPendingAppointments();
    const unreadNotifs = this.getUnreadNotifications();
    const activeFeedings = this.getAllFeeding().filter(f => f.activo);

    return {
      totalMascotas: pets.length,
      paseosHoy: walks.filter(w => w.diaSemana === today).length,
      citasPendientes: pendingApts.length,
      alertasActivas: unreadNotifs.length,
      alimentacionesPendientes: activeFeedings.length,
    };
  }

  // Seed demo data
  seedDemoData(): void {
    if (this.getAllPets().length > 0) return;

    const admin: Omit<Usuario, "id" | "fechaRegistro"> = {
      nombre: "Admin PetCare",
      email: "admin@petcare.com",
      telefono: "+52 55 1234 5678",
      rol: "admin",
      avatar: ""
    };
    this.addUser(admin);

    const petsData: Omit<Pet, "id" | "fechaRegistro">[] = [
      { nombre: "Max", especie: "perro", raza: "Labrador", edad: 3, peso: 30, tamano: "grande", genero: "macho", foto: "", color: "Dorado", estadoSalud: "saludable", notas: "Muy energico y amigable", duenioId: "", vacunas: [{ id: "v1", nombre: "Rabia", fechaAplicacion: "2025-01-15", proximaDosis: "2026-01-15", veterinario: "Dr. Garcia" }, { id: "v2", nombre: "Moquillo", fechaAplicacion: "2025-03-20", proximaDosis: "2026-03-20", veterinario: "Dr. Garcia" }] },
      { nombre: "Luna", especie: "gato", raza: "Siames", edad: 2, peso: 4, tamano: "pequeno", genero: "hembra", foto: "", color: "Crema y cafe", estadoSalud: "saludable", notas: "Independiente pero carinosa", duenioId: "", vacunas: [{ id: "v3", nombre: "Triple Felina", fechaAplicacion: "2025-06-10", proximaDosis: "2026-06-10", veterinario: "Dra. Lopez" }] },
      { nombre: "Rocky", especie: "perro", raza: "Bulldog Frances", edad: 5, peso: 12, tamano: "mediano", genero: "macho", foto: "", color: "Negro", estadoSalud: "en tratamiento", notas: "Problemas articulares, dieta especial", duenioId: "", vacunas: [] },
      { nombre: "Copo", especie: "conejo", raza: "Angora", edad: 1, peso: 2, tamano: "pequeno", genero: "macho", foto: "", color: "Blanco", estadoSalud: "saludable", notas: "Muy jugueton", duenioId: "", vacunas: [] },
      { nombre: "Nube", especie: "gato", raza: "Persa", edad: 4, peso: 5, tamano: "mediano", genero: "hembra", foto: "", color: "Gris", estadoSalud: "saludable", notas: "Le gusta dormir todo el dia", duenioId: "", vacunas: [{ id: "v4", nombre: "Calicivirus", fechaAplicacion: "2025-09-01", proximaDosis: "2026-09-01", veterinario: "Dr. Garcia" }] },
    ];

    const createdPets = petsData.map(p => this.addPet(p));

    const walksData: Omit<HorarioPaseo, "id">[] = [
      { mascotaId: createdPets[0].id, diaSemana: "lunes", horaInicio: "08:00", horaFin: "09:00", duracion: 60, ruta: "Parque Central", paseadorId: "", notas: "Tirar la pelota", activo: true },
      { mascotaId: createdPets[0].id, diaSemana: "miercoles", horaInicio: "17:00", horaFin: "18:00", duracion: 60, ruta: "Bosque de Chapultepec", paseadorId: "", notas: "Paseo largo", activo: true },
      { mascotaId: createdPets[0].id, diaSemana: "viernes", horaInicio: "08:00", horaFin: "09:00", duracion: 60, ruta: "Parque Central", paseadorId: "", notas: "", activo: true },
      { mascotaId: createdPets[2].id, diaSemana: "martes", horaInicio: "07:00", horaFin: "07:30", duracion: 30, ruta: "Cuadra de la casa", paseadorId: "", notas: "Caminata corta por articulos", activo: true },
      { mascotaId: createdPets[2].id, diaSemana: "jueves", horaInicio: "18:00", horaFin: "18:30", duracion: 30, ruta: "Parque cercano", paseadorId: "", notas: "No correr mucho", activo: true },
    ];
    walksData.forEach(w => this.addWalk(w));

    const feedingsData: Omit<Alimentacion, "id">[] = [
      { mascotaId: createdPets[0].id, tipoComida: "Croquetas premium", cantidad: "300g", horario: "07:00", frecuencia: "diaria", indicaciones: "Agua fresca siempre disponible", activo: true },
      { mascotaId: createdPets[0].id, tipoComida: "Pechuga de pollo", cantidad: "200g", horario: "18:00", frecuencia: "diaria", indicaciones: "Sin hueso, cocida", activo: true },
      { mascotaId: createdPets[1].id, tipoComida: "Pienso para gato", cantidad: "60g", horario: "08:00", frecuencia: "diaria", indicaciones: "Medir con cupa medidora", activo: true },
      { mascotaId: createdPets[1].id, tipoComida: "Atun en agua", cantidad: "30g", horario: "20:00", frecuencia: "diaria", indicaciones: "Solo como premio", activo: true },
      { mascotaId: createdPets[2].id, tipoComida: "Croquetas diet", cantidad: "150g", horario: "07:30", frecuencia: "diaria", indicaciones: "Dieta especial por articulos", activo: true },
      { mascotaId: createdPets[3].id, tipoComida: "Hay (heno)", cantidad: "Ilimitado", horario: "06:00", frecuencia: "diaria", indicaciones: "Siempre tener heno fresco", activo: true },
      { mascotaId: createdPets[3].id, tipoComida: "Zanahoria picada", cantidad: "50g", horario: "12:00", frecuencia: "diaria", indicaciones: "Variedad en verduras", activo: true },
      { mascotaId: createdPets[4].id, tipoComida: "Pienso persa", cantidad: "55g", horario: "09:00", frecuencia: "diaria", indicaciones: "Para pelaje largo", activo: true },
    ];
    feedingsData.forEach(f => this.addFeeding(f));

    const aptsData: Omit<CitaVeterinaria, "id">[] = [
      { mascotaId: createdPets[0].id, fecha: "2026-09-15", hora: "10:00", motivo: "Vacunacion anual", veterinario: "Dr. Garcia", clinica: "Veterinaria Patitas", estado: "pendiente" },
      { mascotaId: createdPets[2].id, fecha: "2026-08-25", hora: "11:30", motivo: "Revision articulos", veterinario: "Dra. Lopez", clinica: "Animal Care Plus", estado: "pendiente" },
      { mascotaId: createdPets[1].id, fecha: "2026-07-10", hora: "09:00", motivo: "Esterilizacion", veterinario: "Dr. Garcia", clinica: "Veterinaria Patitas", estado: "completada", diagnostico: "Cirugia exitosa", costo: 2500 },
    ];
    aptsData.forEach(a => this.addVetAppointment(a));

    const activitiesData: Omit<Actividad, "id">[] = [
      { mascotaId: createdPets[0].id, tipo: "paseo", fecha: "2026-08-18", hora: "08:00", descripcion: "Paseo por el Parque Central - 45 min", registradoPor: "Admin" },
      { mascotaId: createdPets[0].id, tipo: "alimentacion", fecha: "2026-08-18", hora: "07:00", descripcion: "Desayuno: Croquetas premium 300g", registradoPor: "Admin" },
      { mascotaId: createdPets[1].id, tipo: "alimentacion", fecha: "2026-08-18", hora: "08:00", descripcion: "Desayuno: Pienso 60g", registradoPor: "Admin" },
      { mascotaId: createdPets[2].id, tipo: "medicinas", fecha: "2026-08-18", hora: "09:00", descripcion: "Suplemento articular - Glucosamina", registradoPor: "Admin" },
      { mascotaId: createdPets[4].id, tipo: "banio", fecha: "2026-08-17", hora: "14:00", descripcion: "Banio completo con shampoo especial", registradoPor: "Admin" },
    ];
    activitiesData.forEach(a => this.addActivity(a));
  }
}

export const db = new Database();
