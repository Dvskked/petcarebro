// ===== TYPES =====
// (TypeScript types are compiled away - kept as reference)

// ===== DATABASE (Compiled from database.ts) =====
class Database {
  constructor() {
    this.storagePrefix = "petcare_";
  }

  getCollection(key) {
    const data = localStorage.getItem(this.storagePrefix + key);
    return data ? JSON.parse(data) : [];
  }

  setCollection(key, data) {
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(data));
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  getAllPets() { return this.getCollection("pets"); }
  getPetById(id) { return this.getAllPets().find(p => p.id === id); }
  getPetsByDuenio(duenioId) { return this.getAllPets().filter(p => p.duenioId === duenioId); }

  addPet(pet) {
    const newPet = { ...pet, id: this.generateId(), fechaRegistro: new Date().toISOString() };
    const pets = this.getAllPets();
    pets.push(newPet);
    this.setCollection("pets", pets);
    return newPet;
  }

  updatePet(id, data) {
    const pets = this.getAllPets();
    const index = pets.findIndex(p => p.id === id);
    if (index === -1) return null;
    pets[index] = { ...pets[index], ...data };
    this.setCollection("pets", pets);
    return pets[index];
  }

  deletePet(id) {
    this.setCollection("pets", this.getAllPets().filter(p => p.id !== id));
    return true;
  }

  getAllWalks() { return this.getCollection("walks"); }
  getWalksByPet(mascotaId) { return this.getAllWalks().filter(w => w.mascotaId === mascotaId); }
  getWalksByDay(dia) { return this.getAllWalks().filter(w => w.diaSemana === dia && w.activo); }

  addWalk(walk) {
    const newWalk = { ...walk, id: this.generateId() };
    const walks = this.getAllWalks();
    walks.push(newWalk);
    this.setCollection("walks", walks);
    return newWalk;
  }

  updateWalk(id, data) {
    const walks = this.getAllWalks();
    const index = walks.findIndex(w => w.id === id);
    if (index === -1) return false;
    walks[index] = { ...walks[index], ...data };
    this.setCollection("walks", walks);
    return true;
  }

  deleteWalk(id) {
    this.setCollection("walks", this.getAllWalks().filter(w => w.id !== id));
    return true;
  }

  getAllFeeding() { return this.getCollection("feeding"); }
  getFeedingByPet(mascotaId) { return this.getAllFeeding().filter(f => f.mascotaId === mascotaId); }

  addFeeding(feeding) {
    const newFeeding = { ...feeding, id: this.generateId() };
    const feedings = this.getAllFeeding();
    feedings.push(newFeeding);
    this.setCollection("feeding", feedings);
    return newFeeding;
  }

  updateFeeding(id, data) {
    const feedings = this.getAllFeeding();
    const index = feedings.findIndex(f => f.id === id);
    if (index === -1) return false;
    feedings[index] = { ...feedings[index], ...data };
    this.setCollection("feeding", feedings);
    return true;
  }

  deleteFeeding(id) {
    this.setCollection("feeding", this.getAllFeeding().filter(f => f.id !== id));
    return true;
  }

  getAllVetAppointments() { return this.getCollection("vetAppointments"); }
  getVetAppointmentsByPet(mascotaId) { return this.getAllVetAppointments().filter(a => a.mascotaId === mascotaId); }
  getPendingAppointments() { return this.getAllVetAppointments().filter(a => a.estado === "pendiente"); }

  addVetAppointment(apt) {
    const newApt = { ...apt, id: this.generateId() };
    const apts = this.getAllVetAppointments();
    apts.push(newApt);
    this.setCollection("vetAppointments", apts);
    return newApt;
  }

  updateVetAppointment(id, data) {
    const apts = this.getAllVetAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index === -1) return false;
    apts[index] = { ...apts[index], ...data };
    this.setCollection("vetAppointments", apts);
    return true;
  }

  deleteVetAppointment(id) {
    this.setCollection("vetAppointments", this.getAllVetAppointments().filter(a => a.id !== id));
    return true;
  }

  getAllActivities() { return this.getCollection("activities"); }
  getActivitiesByPet(mascotaId) { return this.getAllActivities().filter(a => a.mascotaId === mascotaId); }
  getActivitiesByDate(date) { return this.getAllActivities().filter(a => a.fecha === date); }

  addActivity(activity) {
    const newAct = { ...activity, id: this.generateId() };
    const acts = this.getAllActivities();
    acts.push(newAct);
    this.setCollection("activities", acts);
    return newAct;
  }

  deleteActivity(id) {
    this.setCollection("activities", this.getAllActivities().filter(a => a.id !== id));
    return true;
  }

  getAllUsers() { return this.getCollection("users"); }
  getUserById(id) { return this.getAllUsers().find(u => u.id === id); }

  addUser(user) {
    const newUser = { ...user, id: this.generateId(), fechaRegistro: new Date().toISOString() };
    const users = this.getAllUsers();
    users.push(newUser);
    this.setCollection("users", users);
    return newUser;
  }

  updateUser(id, data) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users[index] = { ...users[index], ...data };
    this.setCollection("users", users);
    return true;
  }

  getAllWeightRecords() { return this.getCollection("weightRecords"); }
  getWeightByPet(mascotaId) { return this.getAllWeightRecords().filter(w => w.mascotaId === mascotaId); }

  addWeightRecord(record) {
    const newRecord = { ...record, id: this.generateId() };
    const records = this.getAllWeightRecords();
    records.push(newRecord);
    this.setCollection("weightRecords", records);
    return newRecord;
  }

  getAllNotifications() { return this.getCollection("notifications"); }
  getUnreadNotifications() { return this.getAllNotifications().filter(n => !n.leida); }

  addNotification(notif) {
    const newNotif = { ...notif, id: this.generateId() };
    const notifs = this.getAllNotifications();
    notifs.push(newNotif);
    this.setCollection("notifications", notifs);
    return newNotif;
  }

  markNotificationAsRead(id) {
    const notifs = this.getAllNotifications();
    const index = notifs.findIndex(n => n.id === id);
    if (index === -1) return false;
    notifs[index].leida = true;
    this.setCollection("notifications", notifs);
    return true;
  }

  getDashboardStats() {
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

  seedDemoData() {
    if (this.getAllPets().length > 0) return;

    const admin = {
      nombre: "Admin PetCare",
      email: "admin@petcare.com",
      telefono: "+52 55 1234 5678",
      rol: "admin",
      avatar: ""
    };
    this.addUser(admin);

    const petsData = [
      { nombre: "Max", especie: "perro", raza: "Labrador", edad: 3, peso: 30, tamano: "grande", genero: "macho", foto: "", color: "Dorado", estadoSalud: "saludable", notas: "Muy energetico y amigable. Le encanta jugar con la pelota y nadar.", duenioId: "", vacunas: [
        { id: "v1", nombre: "Rabia", fechaAplicacion: "2025-01-15", proximaDosis: "2026-01-15", veterinario: "Dr. Garcia" },
        { id: "v2", nombre: "Moquillo", fechaAplicacion: "2025-03-20", proximaDosis: "2026-03-20", veterinario: "Dr. Garcia" }
      ]},
      { nombre: "Luna", especie: "gato", raza: "Siames", edad: 2, peso: 4, tamano: "pequeno", genero: "hembra", foto: "", color: "Crema y cafe", estadoSalud: "saludable", notas: "Independiente pero carinosa por las noches.", duenioId: "", vacunas: [
        { id: "v3", nombre: "Triple Felina", fechaAplicacion: "2025-06-10", proximaDosis: "2026-06-10", veterinario: "Dra. Lopez" }
      ]},
      { nombre: "Rocky", especie: "perro", raza: "Bulldog Frances", edad: 5, peso: 12, tamano: "mediano", genero: "macho", foto: "", color: "Negro", estadoSalud: "en tratamiento", notas: "Problemas articulares, necesita dieta especial y caminatas cortas.", duenioId: "", vacunas: [] },
      { nombre: "Copo", especie: "conejo", raza: "Angora", edad: 1, peso: 2, tamano: "pequeno", genero: "macho", foto: "", color: "Blanco", estadoSalud: "saludable", notas: "Muy jugueton, necesita espacio para correr.", duenioId: "", vacunas: [] },
      { nombre: "Nube", especie: "gato", raza: "Persa", edad: 4, peso: 5, tamano: "mediano", genero: "hembra", foto: "", color: "Gris", estadoSalud: "saludable", notas: "Le gusta dormir todo el dia, muy tranquila.", duenioId: "", vacunas: [
        { id: "v4", nombre: "Calicivirus", fechaAplicacion: "2025-09-01", proximaDosis: "2026-09-01", veterinario: "Dr. Garcia" }
      ]},
    ];

    const createdPets = petsData.map(p => this.addPet(p));

    const walksData = [
      { mascotaId: createdPets[0].id, diaSemana: "lunes", horaInicio: "08:00", horaFin: "09:00", duracion: 60, ruta: "Parque Central", paseadorId: "", notas: "Tirar la pelota y correr", activo: true },
      { mascotaId: createdPets[0].id, diaSemana: "miercoles", horaInicio: "17:00", horaFin: "18:30", duracion: 90, ruta: "Bosque de Chapultepec", paseadorId: "", notas: "Paseo largo,允许 nadar en el lago", activo: true },
      { mascotaId: createdPets[0].id, diaSemana: "viernes", horaInicio: "08:00", horaFin: "09:00", duracion: 60, ruta: "Parque Central", paseadorId: "", notas: "", activo: true },
      { mascotaId: createdPets[2].id, diaSemana: "martes", horaInicio: "07:00", horaFin: "07:30", duracion: 30, ruta: "Cuadra de la casa", paseadorId: "", notas: "Caminata lenta por temas articulares", activo: true },
      { mascotaId: createdPets[2].id, diaSemana: "jueves", horaInicio: "18:00", horaFin: "18:30", duracion: 30, ruta: "Parque cercano", paseadorId: "", notas: "No correr mucho", activo: true },
    ];
    walksData.forEach(w => this.addWalk(w));

    const feedingsData = [
      { mascotaId: createdPets[0].id, tipoComida: "Croquetas premium", cantidad: "300g", horario: "07:00", frecuencia: "diaria", indicaciones: "Agua fresca siempre disponible", activo: true },
      { mascotaId: createdPets[0].id, tipoComida: "Pechuga de pollo cocida", cantidad: "200g", horario: "18:00", frecuencia: "diaria", indicaciones: "Sin hueso, sin sal", activo: true },
      { mascotaId: createdPets[1].id, tipoComida: "Pienso premium gato", cantidad: "60g", horario: "08:00", frecuencia: "diaria", indicaciones: "Medir con taza medidora", activo: true },
      { mascotaId: createdPets[1].id, tipoComida: "Atun en agua", cantidad: "30g", horario: "20:00", frecuencia: "diaria", indicaciones: "Solo como premio, no diario", activo: true },
      { mascotaId: createdPets[2].id, tipoComida: "Croquetas diet articulares", cantidad: "150g", horario: "07:30", frecuencia: "diaria", indicaciones: "Dieta especial por problemas articulares. No dar nada mas.", activo: true },
      { mascotaId: createdPets[3].id, tipoComida: "Heno fresco", cantidad: "Ilimitado", horario: "06:00", frecuencia: "diaria", indicaciones: "Siempre tener heno fresco y limpio", activo: true },
      { mascotaId: createdPets[3].id, tipoComida: "Verduras mixtas", cantidad: "50g", horario: "12:00", frecuencia: "diaria", indicaciones: "Zanahoria, apio, perejil picado", activo: true },
      { mascotaId: createdPets[4].id, tipoComida: "Pienso para pelaje largo", cantidad: "55g", horario: "09:00", frecuencia: "diaria", indicaciones: "Control de bolas de pelo", activo: true },
    ];
    feedingsData.forEach(f => this.addFeeding(f));

    const aptsData = [
      { mascotaId: createdPets[0].id, fecha: "2026-09-15", hora: "10:00", motivo: "Vacunacion anual antirrabica", veterinario: "Dr. Garcia", clinica: "Veterinaria Patitas", estado: "pendiente" },
      { mascotaId: createdPets[2].id, fecha: "2026-08-25", hora: "11:30", motivo: "Revision de articulos - control", veterinario: "Dra. Lopez", clinica: "Animal Care Plus", estado: "pendiente" },
      { mascotaId: createdPets[1].id, fecha: "2026-07-10", hora: "09:00", motivo: "Esterilizacion", veterinario: "Dr. Garcia", clinica: "Veterinaria Patitas", estado: "completada", diagnostico: "Cirugia exitosa, recuperacion normal", costo: 2500 },
      { mascotaId: createdPets[4].id, fecha: "2026-10-01", hora: "15:00", motivo: "Desparasitacion semestral", veterinario: "Dr. Garcia", clinica: "Veterinaria Patitas", estado: "pendiente" },
    ];
    aptsData.forEach(a => this.addVetAppointment(a));

    const activitiesData = [
      { mascotaId: createdPets[0].id, tipo: "paseo", fecha: "2026-08-18", hora: "08:00", descripcion: "Paseo por el Parque Central - 45 min. Jugo con otros perros.", registradoPor: "Admin" },
      { mascotaId: createdPets[0].id, tipo: "alimentacion", fecha: "2026-08-18", hora: "07:00", descripcion: "Desayuno: Croquetas premium 300g + agua fresca", registradoPor: "Admin" },
      { mascotaId: createdPets[0].id, tipo: "juego", fecha: "2026-08-17", hora: "16:00", descripcion: "Sesion de juego con pelota en el jardin - 30 min", registradoPor: "Admin" },
      { mascotaId: createdPets[1].id, tipo: "alimentacion", fecha: "2026-08-18", hora: "08:00", descripcion: "Desayuno: Pienso premium 60g", registradoPor: "Admin" },
      { mascotaId: createdPets[1].id, tipo: "banio", fecha: "2026-08-15", hora: "10:00", descripcion: "Banio completo con shampoo hypoallergenic", registradoPor: "Admin" },
      { mascotaId: createdPets[2].id, tipo: "medicinas", fecha: "2026-08-18", hora: "09:00", descripcion: "Suplemento articular - Glucosamina 500mg", registradoPor: "Admin" },
      { mascotaId: createdPets[2].id, tipo: "paseo", fecha: "2026-08-18", hora: "07:00", descripcion: "Caminata corta 20 min - ritmo lento", registradoPor: "Admin" },
      { mascotaId: createdPets[4].id, tipo: "vacunacion", fecha: "2026-08-10", hora: "11:00", descripcion: "Vacuna Calicivirus aplicada por Dr. Garcia", registradoPor: "Admin" },
      { mascotaId: createdPets[4].id, tipo: "banio", fecha: "2026-08-17", hora: "14:00", descripcion: "Banio completo con shampoo especial para pelaje largo", registradoPor: "Admin" },
    ];
    activitiesData.forEach(a => this.addActivity(a));

    db.addNotification({ tipo: "info", titulo: "Bienvenido a PetCare Pro", mensaje: "Sistema inicializado con datos de ejemplo. Puedes agregar, editar y eliminar mascotas.", fecha: new Date().toISOString(), leida: false });
    db.addNotification({ tipo: "alerta", titulo: "Cita proxima", mensaje: "Rocky tiene una revision de articulos el 25/08. No olvides asistir.", fecha: new Date().toISOString(), leida: false });
  }
}

const db = new Database();
