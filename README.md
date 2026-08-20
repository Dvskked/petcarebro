# PetCare Pro

Sistema de gestión y cuidado de mascotas con interfaz moderna, animaciones fluidas y funciones de desarrollo integradas.

## Características

### Módulos
- **Dashboard** — Vista general con estadísticas, mascotas recientes, paseos del día y próximas citas
- **Mascotas** — CRUD completo con tarjetas animadas, detalle con tabs y score de salud
- **Paseos** — Programación semanal de paseos por mascota con horarios y rutas
- **Alimentación** — Control de dietas, horarios, cantidades e indicaciones por mascota
- **Veterinaria** — Citas veterinarias con seguimiento de estado, costo y diagnóstico
- **Calendario** — Vista mensual con paseos y citas marcados
- **Actividades** — Timeline del historial completo de actividades

### Funcionalidades de Desarrollo
- **Dark/Light Mode** — Toggle con persistencia en localStorage
- **Búsqueda global** — Filtra mascotas, paseos, citas y alimentación en tiempo real
- **Exportar a CSV** — Descarga datos de cualquier sección en formato CSV
- **Score de Salud** — Indicador visual circular calculado por estado, vacunas y citas
- **Confetti** — Animación al agregar una mascota nueva
- **Contadores animados** — Números del dashboard con animación de conteo

### Diseño
- Glassmorphism con `backdrop-filter: blur()` en tarjetas, sidebar y topbar
- Gradientes animados en fondo, botones, avatares y badges
- Sombras con glow para profundidad visual
- 3D transforms en hover de tarjetas y elementos interactivos
- 17+ animaciones CSS keyframes
- Responsive completo (mobile, tablet, desktop)

## Tecnologías

- HTML5
- CSS3 (variables, gradientes, glassmorphism, animaciones)
- JavaScript vanilla (clases ES6)
- Font Awesome 6.5 (iconos)
- Google Fonts (Inter)
- localStorage como base de datos local

## Estructura

```
PetCarePro/
├── index.html          # Archivo principal
├── css/
│   └── styles.css      # Estilos completos con dark mode
├── js/
│   ├── database.js     # Capa de datos con localStorage
│   └── app.js          # Lógica de la aplicación
└── src/                # Fuentes TypeScript (referencia)
    ├── app.ts
    ├── database.ts
    ├── types.ts
    └── tsconfig.json
```

## Uso

Abrir `index.html` en cualquier navegador moderno. Los datos se almacenan en localStorage del navegador, no requiere servidor ni instalación.

Al primer carga se generan datos de demostración automáticamente (5 mascotas, paseos, alimentación, citas y actividades de ejemplo).
