// ===== PetCare Pro - Main Application =====
class PetCareApp {
  constructor() {
    this.currentSection = "dashboard";
    this.editingPetId = null;
    this.editingWalkId = null;
    this.editingFeedingId = null;
    this.editingAptId = null;
  }

  init() {
    db.seedDemoData();
    this.bindNavigation();
    this.bindNotifications();
    this.renderDashboard();
    this.updateNotificationBadge();
    this.checkScheduledTasks();
    this.setupMobileMenu();
    setInterval(() => this.checkScheduledTasks(), 60000);
  }

  setupMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    toggle?.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("hidden");
    });
    overlay?.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.add("hidden");
    });
  }

  bindNavigation() {
    document.querySelectorAll("[data-section]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        this.navigateTo(section);
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebar-overlay");
        sidebar?.classList.remove("open");
        overlay?.classList.add("hidden");
      });
    });
  }

  bindNotifications() {
    const btn = document.getElementById("notif-btn");
    btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = document.getElementById("notif-panel");
      panel?.classList.toggle("hidden");
      this.renderNotifications();
    });
    document.addEventListener("click", (e) => {
      const panel = document.getElementById("notif-panel");
      const btn = document.getElementById("notif-btn");
      if (panel && !panel.contains(e.target) && !btn?.contains(e.target)) {
        panel.classList.add("hidden");
      }
    });
  }

  navigateTo(section) {
    this.currentSection = section;
    document.querySelectorAll(".content-section").forEach(s => s.classList.add("hidden"));
    document.querySelectorAll("[data-section]").forEach(el => el.closest("li")?.classList.remove("active"));
    const target = document.getElementById(`section-${section}`);
    target?.classList.remove("hidden");
    document.querySelector(`[data-section="${section}"]`)?.closest("li")?.classList.add("active");
    const titles = {
      dashboard: "Dashboard", pets: "Mascotas", walks: "Paseos",
      feeding: "Alimentacion", vet: "Veterinaria", activities: "Actividades"
    };
    document.getElementById("section-title").textContent = titles[section] || section;

    switch (section) {
      case "dashboard": this.renderDashboard(); break;
      case "pets": this.renderPets(); break;
      case "walks": this.renderWalks(); break;
      case "feeding": this.renderFeeding(); break;
      case "vet": this.renderVetAppointments(); break;
      case "activities": this.renderActivities(); break;
    }
  }

  // ========== DASHBOARD ==========
  renderDashboard() {
    const stats = db.getDashboardStats();
    const pets = db.getAllPets();
    const statsGrid = document.getElementById("stats-grid");
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="stat-card"><div class="stat-icon" style="background:var(--primary-light);color:var(--primary)"><i class="fa-solid fa-paw"></i></div>
          <div class="stat-info"><span class="stat-number">${stats.totalMascotas}</span><span class="stat-label">Mascotas</span></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:#e8f5e9;color:#2e7d32"><i class="fa-solid fa-shoe-prints"></i></div>
          <div class="stat-info"><span class="stat-number">${stats.paseosHoy}</span><span class="stat-label">Paseos Hoy</span></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:#fff3e0;color:#e65100"><i class="fa-solid fa-calendar-check"></i></div>
          <div class="stat-info"><span class="stat-number">${stats.citasPendientes}</span><span class="stat-label">Citas Pendientes</span></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:#fce4ec;color:#c62828"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <div class="stat-info"><span class="stat-number">${stats.alertasActivas}</span><span class="stat-label">Alertas</span></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:#e3f2fd;color:#1565c0"><i class="fa-solid fa-bowl-food"></i></div>
          <div class="stat-info"><span class="stat-number">${stats.alimentacionesPendientes}</span><span class="stat-label">Alimentaciones</span></div></div>`;
    }

    const recentPetsEl = document.getElementById("recent-pets");
    if (recentPetsEl) {
      recentPetsEl.innerHTML = pets.slice(0, 4).map(p => `
        <div class="recent-pet-card" onclick="app.showPetDetail('${p.id}')">
          <div class="recent-pet-avatar">${this.getSpeciesEmoji(p.especie)}</div>
          <div class="recent-pet-info">
            <strong>${p.nombre}</strong>
            <span>${p.raza} &bull; ${p.edad} ${p.edad === 1 ? 'ano' : 'anos'}</span>
            <span class="status-badge status-${p.estadoSalud}">${p.estadoSalud}</span>
          </div>
        </div>`).join("");
    }

    this.renderUpcomingWalks();
    this.renderUpcomingAppointments();
  }

  renderUpcomingWalks() {
    const el = document.getElementById("upcoming-walks");
    if (!el) return;
    const dayNames = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = dayNames[new Date().getDay()];
    const walks = db.getWalksByDay(today);
    el.innerHTML = walks.length === 0
      ? '<p class="empty-state-small">No hay paseos programados para hoy</p>'
      : walks.map(w => {
        const pet = db.getPetById(w.mascotaId);
        return `<div class="upcoming-item"><div class="upcoming-time">${w.horaInicio}</div>
          <div class="upcoming-info"><strong>${pet?.nombre || 'N/A'}</strong><span>${w.ruta} - ${w.duracion} min</span></div></div>`;
      }).join("");
  }

  renderUpcomingAppointments() {
    const el = document.getElementById("upcoming-apts");
    if (!el) return;
    const apts = db.getPendingAppointments().sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 5);
    el.innerHTML = apts.length === 0
      ? '<p class="empty-state-small">No hay citas pendientes</p>'
      : apts.map(a => {
        const pet = db.getPetById(a.mascotaId);
        return `<div class="upcoming-item"><div class="upcoming-time">${a.fecha.slice(5)}</div>
          <div class="upcoming-info"><strong>${pet?.nombre || 'N/A'}</strong><span>${a.motivo} - ${a.hora}</span></div></div>`;
      }).join("");
  }

  // ========== PETS ==========
  renderPets() {
    const pets = db.getAllPets();
    const grid = document.getElementById("pets-grid");
    if (!grid) return;
    grid.innerHTML = pets.map(p => `
      <div class="pet-card">
        <div class="pet-card-header">
          <div class="pet-avatar">${this.getSpeciesEmoji(p.especie)}</div>
          <div class="pet-card-actions">
            <button class="btn-icon" onclick="app.showPetDetail('${p.id}')" title="Ver"><i class="fa-solid fa-eye"></i></button>
            <button class="btn-icon" onclick="app.editPet('${p.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon btn-icon-danger" onclick="app.deletePet('${p.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <div class="pet-card-body">
          <h3>${p.nombre}</h3>
          <p class="pet-breed">${p.raza}</p>
          <div class="pet-meta">
            <span><i class="fa-solid fa-cake-candles"></i> ${p.edad} ${p.edad === 1 ? 'ano' : 'anos'}</span>
            <span><i class="fa-solid fa-weight-hanging"></i> ${p.peso}kg</span>
            <span><i class="fa-solid fa-venus-mars"></i> ${p.genero}</span>
          </div>
          <span class="status-badge status-${p.estadoSalud}">${p.estadoSalud}</span>
        </div>
      </div>`).join("");
  }

  showPetDetail(id) {
    const pet = db.getPetById(id);
    if (!pet) return;
    const walks = db.getWalksByPet(id);
    const feedings = db.getFeedingByPet(id);
    const activities = db.getActivitiesByPet(id).slice(-5).reverse();
    const apts = db.getVetAppointmentsByPet(id);
    const weightRecords = db.getWeightByPet(id).slice(-5);

    const modal = document.getElementById("detail-modal");
    const content = document.getElementById("detail-modal-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="detail-header">
        <div class="detail-avatar">${this.getSpeciesEmoji(pet.especie)}</div>
        <div class="detail-title">
          <h2>${pet.nombre}</h2>
          <p>${pet.raza} &bull; ${pet.color} &bull; ${pet.tamano}</p>
          <span class="status-badge status-${pet.estadoSalud}">${pet.estadoSalud}</span>
        </div>
      </div>
      <div class="detail-tabs">
        <button class="tab-btn active" data-tab="info">Informacion</button>
        <button class="tab-btn" data-tab="walks-pet">Paseos (${walks.length})</button>
        <button class="tab-btn" data-tab="feed-pet">Alimentacion (${feedings.length})</button>
        <button class="tab-btn" data-tab="health-pet">Salud (${apts.length})</button>
        <button class="tab-btn" data-tab="activity-pet">Actividad</button>
      </div>
      <div class="detail-tab-content active" id="tab-info">
        <div class="info-grid">
          <div class="info-item"><label>Edad</label><span>${pet.edad} ${pet.edad === 1 ? 'ano' : 'anos'}</span></div>
          <div class="info-item"><label>Peso</label><span>${pet.peso} kg</span></div>
          <div class="info-item"><label>Genero</label><span>${pet.genero}</span></div>
          <div class="info-item"><label>Especie</label><span>${pet.especie}</span></div>
          <div class="info-item"><label>Color</label><span>${pet.color}</span></div>
          <div class="info-item"><label>Registro</label><span>${new Date(pet.fechaRegistro).toLocaleDateString()}</span></div>
        </div>
        <div class="info-notes"><label>Notas:</label><p>${pet.notas || 'Sin notas'}</p></div>
        ${pet.vacunas.length > 0 ? `
        <div class="info-section">
          <h4><i class="fa-solid fa-syringe"></i> Vacunas</h4>
          <table class="data-table"><thead><tr><th>Vacuna</th><th>Aplicada</th><th>Proxima</th><th>Veterinario</th></tr></thead>
          <tbody>${pet.vacunas.map(v => `<tr><td>${v.nombre}</td><td>${v.fechaAplicacion}</td><td>${v.proximaDosis}</td><td>${v.veterinario}</td></tr>`).join("")}</tbody></table>
        </div>` : ''}
        ${weightRecords.length > 0 ? `
        <div class="info-section">
          <h4><i class="fa-solid fa-weight-hanging"></i> Historial de Peso</h4>
          <div class="weight-chart">${weightRecords.map(w => `
            <div class="weight-bar-container"><span class="weight-label">${w.peso}kg</span>
            <div class="weight-bar" style="width: ${Math.min(w.peso * 3, 100)}%"></div><span class="weight-date">${w.fecha}</span></div>
          `).join("")}</div>
        </div>` : ''}
      </div>
      <div class="detail-tab-content" id="tab-walks-pet">
        ${walks.length === 0 ? '<p class="empty-state-small">Sin paseos programados</p>' :
          `<table class="data-table"><thead><tr><th>Dia</th><th>Hora</th><th>Duracion</th><th>Ruta</th><th>Notas</th></tr></thead>
          <tbody>${walks.map(w => `<tr><td>${w.diaSemana}</td><td>${w.horaInicio} - ${w.horaFin}</td><td>${w.duracion}min</td><td>${w.ruta}</td><td>${w.notas}</td></tr>`).join("")}</tbody></table>`}
      </div>
      <div class="detail-tab-content" id="tab-feed-pet">
        ${feedings.length === 0 ? '<p class="empty-state-small">Sin alimentacion configurada</p>' :
          `<table class="data-table"><thead><tr><th>Comida</th><th>Cantidad</th><th>Horario</th><th>Frecuencia</th><th>Indicaciones</th></tr></thead>
          <tbody>${feedings.map(f => `<tr><td>${f.tipoComida}</td><td>${f.cantidad}</td><td>${f.horario}</td><td>${f.frecuencia}</td><td>${f.indicaciones}</td></tr>`).join("")}</tbody></table>`}
      </div>
      <div class="detail-tab-content" id="tab-health-pet">
        ${apts.length === 0 ? '<p class="empty-state-small">Sin registros de salud</p>' :
          `<table class="data-table"><thead><tr><th>Fecha</th><th>Motivo</th><th>Veterinario</th><th>Estado</th><th>Costo</th></tr></thead>
          <tbody>${apts.map(a => `<tr><td>${a.fecha}</td><td>${a.motivo}</td><td>${a.veterinario}</td><td><span class="status-badge status-${a.estado === 'completada' ? 'saludable' : a.estado === 'cancelada' ? 'urgente' : 'en tratamiento'}">${a.estado}</span></td><td>${a.costo ? '$' + a.costo.toLocaleString() : '-'}</td></tr>`).join("")}</tbody></table>`}
      </div>
      <div class="detail-tab-content" id="tab-activity-pet">
        ${activities.length === 0 ? '<p class="empty-state-small">Sin actividad reciente</p>' :
          `<div class="activity-timeline">${activities.map(a => `
            <div class="timeline-item"><div class="timeline-dot dot-${a.tipo}"></div>
            <div class="timeline-content"><span class="timeline-date">${a.fecha} ${a.hora}</span>
            <p><strong>${this.getActivityLabel(a.tipo)}</strong> - ${a.descripcion}</p></div></div>
          `).join("")}</div>`}
      </div>`;
    modal.classList.remove("hidden");

    content.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        content.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        content.querySelectorAll(".detail-tab-content").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add("active");
      });
    });

    document.getElementById("close-detail-modal")?.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
  }

  showAddPetModal() {
    this.editingPetId = null;
    const form = document.getElementById("pet-form");
    if (form) form.reset();
    document.getElementById("pet-modal-title").textContent = "Agregar Mascota";
    document.getElementById("pet-modal")?.classList.remove("hidden");
    this.bindPetForm();
  }

  editPet(id) {
    const pet = db.getPetById(id);
    if (!pet) return;
    this.editingPetId = id;
    document.getElementById("pet-modal-title").textContent = "Editar Mascota";
    const form = document.getElementById("pet-form");
    if (!form) return;
    form.querySelector('[name="nombre"]').value = pet.nombre;
    form.querySelector('[name="especie"]').value = pet.especie;
    form.querySelector('[name="raza"]').value = pet.raza;
    form.querySelector('[name="edad"]').value = pet.edad;
    form.querySelector('[name="peso"]').value = pet.peso;
    form.querySelector('[name="tamano"]').value = pet.tamano;
    form.querySelector('[name="genero"]').value = pet.genero;
    form.querySelector('[name="color"]').value = pet.color;
    form.querySelector('[name="estadoSalud"]').value = pet.estadoSalud;
    form.querySelector('[name="notas"]').value = pet.notas;
    document.getElementById("pet-modal")?.classList.remove("hidden");
    this.bindPetForm();
  }

  bindPetForm() {
    const form = document.getElementById("pet-form");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        nombre: fd.get("nombre"), especie: fd.get("especie"), raza: fd.get("raza"),
        edad: Number(fd.get("edad")), peso: Number(fd.get("peso")), tamano: fd.get("tamano"),
        genero: fd.get("genero"), foto: "", color: fd.get("color"), estadoSalud: fd.get("estadoSalud"),
        notas: fd.get("notas"), duenioId: "", vacunas: []
      };
      if (this.editingPetId) {
        db.updatePet(this.editingPetId, data);
        this.showToast("Mascota actualizada correctamente", "success");
      } else {
        db.addPet(data);
        this.showToast("Mascota agregada correctamente", "success");
      }
      document.getElementById("pet-modal")?.classList.add("hidden");
      this.renderPets();
    };
  }

  deletePet(id) {
    if (!confirm("Seguro que quieres eliminar esta mascota? Se eliminaran todos sus datos asociados.")) return;
    db.deletePet(id);
    this.showToast("Mascota eliminada", "success");
    this.renderPets();
  }

  // ========== WALKS ==========
  renderWalks() {
    const walks = db.getAllWalks();
    const tbody = document.getElementById("walks-tbody");
    if (!tbody) return;
    tbody.innerHTML = walks.map(w => {
      const pet = db.getPetById(w.mascotaId);
      return `<tr>
        <td><span class="td-pet">${this.getSpeciesEmoji(pet?.especie)} ${pet?.nombre || 'N/A'}</span></td>
        <td>${w.diaSemana}</td><td>${w.horaInicio} - ${w.horaFin}</td>
        <td>${w.duracion} min</td><td>${w.ruta}</td><td>${w.notas || '-'}</td>
        <td><span class="status-badge ${w.activo ? 'status-saludable' : 'status-urgente'}">${w.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="app.editWalk('${w.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-icon-danger" onclick="app.deleteWalk('${w.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </td></tr>`;
    }).join("");
  }

  showAddWalkModal() {
    this.editingWalkId = null;
    const form = document.getElementById("walk-form");
    if (form) form.reset();
    this.populatePetSelect("walk-pet-select");
    document.getElementById("walk-modal-title").textContent = "Agregar Paseo";
    document.getElementById("walk-modal")?.classList.remove("hidden");
    this.bindWalkForm();
  }

  editWalk(id) {
    const walk = db.getAllWalks().find(w => w.id === id);
    if (!walk) return;
    this.editingWalkId = id;
    this.populatePetSelect("walk-pet-select");
    const form = document.getElementById("walk-form");
    form.querySelector('[name="mascotaId"]').value = walk.mascotaId;
    form.querySelector('[name="diaSemana"]').value = walk.diaSemana;
    form.querySelector('[name="horaInicio"]').value = walk.horaInicio;
    form.querySelector('[name="horaFin"]').value = walk.horaFin;
    form.querySelector('[name="duracion"]').value = walk.duracion;
    form.querySelector('[name="ruta"]').value = walk.ruta;
    form.querySelector('[name="notas"]').value = walk.notas;
    document.getElementById("walk-modal-title").textContent = "Editar Paseo";
    document.getElementById("walk-modal")?.classList.remove("hidden");
    this.bindWalkForm();
  }

  bindWalkForm() {
    const form = document.getElementById("walk-form");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        mascotaId: fd.get("mascotaId"), diaSemana: fd.get("diaSemana"),
        horaInicio: fd.get("horaInicio"), horaFin: fd.get("horaFin"),
        duracion: Number(fd.get("duracion")), ruta: fd.get("ruta"),
        paseadorId: "", notas: fd.get("notas"), activo: true,
      };
      if (this.editingWalkId) {
        db.updateWalk(this.editingWalkId, data);
        this.showToast("Paseo actualizado", "success");
      } else {
        db.addWalk(data);
        this.showToast("Paseo agregado", "success");
      }
      document.getElementById("walk-modal")?.classList.add("hidden");
      this.renderWalks();
    };
  }

  deleteWalk(id) {
    if (!confirm("Eliminar este paseo?")) return;
    db.deleteWalk(id);
    this.showToast("Paseo eliminado", "success");
    this.renderWalks();
  }

  // ========== FEEDING ==========
  renderFeeding() {
    const feedings = db.getAllFeeding();
    const tbody = document.getElementById("feeding-tbody");
    if (!tbody) return;
    tbody.innerHTML = feedings.map(f => {
      const pet = db.getPetById(f.mascotaId);
      return `<tr>
        <td><span class="td-pet">${this.getSpeciesEmoji(pet?.especie)} ${pet?.nombre || 'N/A'}</span></td>
        <td>${f.tipoComida}</td><td>${f.cantidad}</td><td>${f.horario}</td>
        <td>${f.frecuencia}</td><td>${f.indicaciones || '-'}</td>
        <td><span class="status-badge ${f.activo ? 'status-saludable' : 'status-urgente'}">${f.activo ? 'Activa' : 'Inactiva'}</span></td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="app.editFeeding('${f.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-icon-danger" onclick="app.deleteFeeding('${f.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </td></tr>`;
    }).join("");
  }

  showAddFeedingModal() {
    this.editingFeedingId = null;
    const form = document.getElementById("feeding-form");
    if (form) form.reset();
    this.populatePetSelect("feeding-pet-select");
    document.getElementById("feeding-modal-title").textContent = "Agregar Alimentacion";
    document.getElementById("feeding-modal")?.classList.remove("hidden");
    this.bindFeedingForm();
  }

  editFeeding(id) {
    const feeding = db.getAllFeeding().find(f => f.id === id);
    if (!feeding) return;
    this.editingFeedingId = id;
    this.populatePetSelect("feeding-pet-select");
    const form = document.getElementById("feeding-form");
    form.querySelector('[name="mascotaId"]').value = feeding.mascotaId;
    form.querySelector('[name="tipoComida"]').value = feeding.tipoComida;
    form.querySelector('[name="cantidad"]').value = feeding.cantidad;
    form.querySelector('[name="horario"]').value = feeding.horario;
    form.querySelector('[name="frecuencia"]').value = feeding.frecuencia;
    form.querySelector('[name="indicaciones"]').value = feeding.indicaciones;
    document.getElementById("feeding-modal-title").textContent = "Editar Alimentacion";
    document.getElementById("feeding-modal")?.classList.remove("hidden");
    this.bindFeedingForm();
  }

  bindFeedingForm() {
    const form = document.getElementById("feeding-form");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        mascotaId: fd.get("mascotaId"), tipoComida: fd.get("tipoComida"),
        cantidad: fd.get("cantidad"), horario: fd.get("horario"),
        frecuencia: fd.get("frecuencia"), indicaciones: fd.get("indicaciones"), activo: true,
      };
      if (this.editingFeedingId) {
        db.updateFeeding(this.editingFeedingId, data);
        this.showToast("Alimentacion actualizada", "success");
      } else {
        db.addFeeding(data);
        this.showToast("Alimentacion agregada", "success");
      }
      document.getElementById("feeding-modal")?.classList.add("hidden");
      this.renderFeeding();
    };
  }

  deleteFeeding(id) {
    if (!confirm("Eliminar esta alimentacion?")) return;
    db.deleteFeeding(id);
    this.showToast("Alimentacion eliminada", "success");
    this.renderFeeding();
  }

  // ========== VET APPOINTMENTS ==========
  renderVetAppointments() {
    const apts = db.getAllVetAppointments();
    const tbody = document.getElementById("vet-tbody");
    if (!tbody) return;
    tbody.innerHTML = apts.map(a => {
      const pet = db.getPetById(a.mascotaId);
      const statusClass = a.estado === "completada" ? "saludable" : a.estado === "cancelada" ? "urgente" : "en tratamiento";
      return `<tr>
        <td><span class="td-pet">${this.getSpeciesEmoji(pet?.especie)} ${pet?.nombre || 'N/A'}</span></td>
        <td>${a.fecha}</td><td>${a.hora}</td><td>${a.motivo}</td>
        <td>${a.veterinario}</td><td>${a.clinica}</td>
        <td><span class="status-badge status-${statusClass}">${a.estado}</span></td>
        <td>${a.costo ? '$' + a.costo.toLocaleString() : '-'}</td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="app.editVetAppointment('${a.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-icon-danger" onclick="app.deleteVetAppointment('${a.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </td></tr>`;
    }).join("");
  }

  showAddVetModal() {
    this.editingAptId = null;
    const form = document.getElementById("vet-form");
    if (form) form.reset();
    this.populatePetSelect("vet-pet-select");
    document.getElementById("vet-modal-title").textContent = "Agendar Cita Veterinaria";
    document.getElementById("vet-modal")?.classList.remove("hidden");
    this.bindVetForm();
  }

  editVetAppointment(id) {
    const apt = db.getAllVetAppointments().find(a => a.id === id);
    if (!apt) return;
    this.editingAptId = id;
    this.populatePetSelect("vet-pet-select");
    const form = document.getElementById("vet-form");
    form.querySelector('[name="mascotaId"]').value = apt.mascotaId;
    form.querySelector('[name="fecha"]').value = apt.fecha;
    form.querySelector('[name="hora"]').value = apt.hora;
    form.querySelector('[name="motivo"]').value = apt.motivo;
    form.querySelector('[name="veterinario"]').value = apt.veterinario;
    form.querySelector('[name="clinica"]').value = apt.clinica;
    form.querySelector('[name="estado"]').value = apt.estado;
    form.querySelector('[name="costo"]').value = apt.costo || "";
    form.querySelector('[name="diagnostico"]').value = apt.diagnostico || "";
    document.getElementById("vet-modal-title").textContent = "Editar Cita";
    document.getElementById("vet-modal")?.classList.remove("hidden");
    this.bindVetForm();
  }

  bindVetForm() {
    const form = document.getElementById("vet-form");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        mascotaId: fd.get("mascotaId"), fecha: fd.get("fecha"), hora: fd.get("hora"),
        motivo: fd.get("motivo"), veterinario: fd.get("veterinario"), clinica: fd.get("clinica"),
        estado: fd.get("estado"),
      };
      const costo = fd.get("costo");
      if (costo) data.costo = Number(costo);
      const diag = fd.get("diagnostico");
      if (diag) data.diagnostico = diag;

      if (this.editingAptId) {
        db.updateVetAppointment(this.editingAptId, data);
        this.showToast("Cita actualizada", "success");
      } else {
        db.addVetAppointment(data);
        this.showToast("Cita agendada", "success");
      }
      document.getElementById("vet-modal")?.classList.add("hidden");
      this.renderVetAppointments();
    };
  }

  deleteVetAppointment(id) {
    if (!confirm("Eliminar esta cita?")) return;
    db.deleteVetAppointment(id);
    this.showToast("Cita eliminada", "success");
    this.renderVetAppointments();
  }

  // ========== ACTIVITIES ==========
  renderActivities() {
    const activities = db.getAllActivities().reverse();
    const container = document.getElementById("activities-list");
    if (!container) return;
    container.innerHTML = activities.length === 0
      ? '<p class="empty-state">No hay actividades registradas</p>'
      : `<div class="activity-timeline">${activities.map(a => {
        const pet = db.getPetById(a.mascotaId);
        return `<div class="timeline-item"><div class="timeline-dot dot-${a.tipo}"></div>
        <div class="timeline-content"><span class="timeline-date">${a.fecha} ${a.hora} &bull; ${this.getSpeciesEmoji(pet?.especie)} ${pet?.nombre || 'N/A'}</span>
        <p><strong>${this.getActivityLabel(a.tipo)}</strong> - ${a.descripcion}</p>
        <span class="activity-by">Registrado por: ${a.registradoPor}</span></div></div>`;
      }).join("")}</div>`;
  }

  showAddActivityModal() {
    this.populatePetSelect("activity-pet-select");
    const form = document.getElementById("activity-form");
    if (form) form.reset();
    document.getElementById("activity-modal")?.classList.remove("hidden");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      db.addActivity({
        mascotaId: fd.get("mascotaId"), tipo: fd.get("tipo"),
        fecha: fd.get("fecha"), hora: fd.get("hora"),
        descripcion: fd.get("descripcion"), registradoPor: "Admin",
      });
      document.getElementById("activity-modal")?.classList.add("hidden");
      this.showToast("Actividad registrada", "success");
      this.renderActivities();
    };
  }

  // ========== NOTIFICATIONS ==========
  renderNotifications() {
    const notifs = db.getAllNotifications().reverse().slice(0, 20);
    const list = document.getElementById("notif-list");
    if (!list) return;
    list.innerHTML = notifs.length === 0
      ? '<p class="notif-empty">Sin notificaciones</p>'
      : notifs.map(n => `
        <div class="notif-item notif-${n.tipo} ${n.leida ? 'notif-read' : ''}" onclick="app.markNotifRead('${n.id}')">
          <div class="notif-icon"><i class="fa-solid ${n.tipo === 'urgente' ? 'fa-circle-exclamation' : n.tipo === 'alerta' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i></div>
          <div class="notif-body"><strong>${n.titulo}</strong><p>${n.mensaje}</p><span class="notif-time">${new Date(n.fecha).toLocaleString()}</span></div>
        </div>`).join("");
  }

  markNotifRead(id) {
    db.markNotificationAsRead(id);
    this.updateNotificationBadge();
    this.renderNotifications();
  }

  updateNotificationBadge() {
    const count = db.getUnreadNotifications().length;
    const badge = document.getElementById("notif-badge");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  // ========== HELPERS ==========
  populatePetSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const pets = db.getAllPets();
    select.innerHTML = '<option value="">Seleccionar mascota</option>' + pets.map(p => `<option value="${p.id}">${this.getSpeciesEmoji(p.especie)} ${p.nombre}</option>`).join("");
  }

  getSpeciesEmoji(species) {
    const emojis = { perro: "🐕", gato: "🐱", conejo: "🐇", ave: "🦜", otro: "🐾" };
    return emojis[species] || "🐾";
  }

  getActivityLabel(type) {
    const labels = { paseo: "Paseo", alimentacion: "Alimentacion", medicinas: "Medicina", banio: "Bano", juego: "Juego", vacunacion: "Vacunacion" };
    return labels[type] || type;
  }

  showToast(message, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-show"));
    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  checkScheduledTasks() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const dayNames = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = dayNames[now.getDay()];

    db.getAllFeeding().filter(f => f.activo && f.horario === currentTime).forEach(f => {
      const pet = db.getPetById(f.mascotaId);
      if (pet) {
        db.addNotification({ tipo: "info", titulo: "Hora de alimentar", mensaje: `Es hora de alimentar a ${pet.nombre}: ${f.tipoComida} (${f.cantidad})`, fecha: new Date().toISOString(), leida: false, mascotaId: f.mascotaId });
        this.showToast(`Hora de alimentar a ${pet.nombre}`, "info");
      }
    });

    db.getWalksByDay(today).filter(w => w.horaInicio === currentTime).forEach(w => {
      const pet = db.getPetById(w.mascotaId);
      if (pet) {
        db.addNotification({ tipo: "info", titulo: "Hora de paseo", mensaje: `Es hora de pasear a ${pet.nombre} en ${w.ruta}`, fecha: new Date().toISOString(), leida: false, mascotaId: w.mascotaId });
        this.showToast(`Hora de pasear a ${pet.nombre}`, "info");
      }
    });

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    db.getAllVetAppointments().filter(a => a.estado === "pendiente" && a.fecha === tomorrowStr).forEach(a => {
      const pet = db.getPetById(a.mascotaId);
      db.addNotification({ tipo: "alerta", titulo: "Cita manana", mensaje: `${pet?.nombre || 'Mascota'} tiene cita con ${a.veterinario} manana a las ${a.hora}`, fecha: new Date().toISOString(), leida: false, mascotaId: a.mascotaId });
    });

    this.updateNotificationBadge();
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.add("hidden");
  }
}

const app = new PetCareApp();
document.addEventListener("DOMContentLoaded", () => app.init());
