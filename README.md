# 📌 PANAL TASK

## 📖 Descripción
Este es un **MVP** de un gestor de tareas colaborativo, donde los usuarios pueden:
- Registrarse e iniciar sesión.
- Crear, asignar y gestionar tareas.
- Mover tareas entre categorías predefinidas ("En Proceso", "Hecho", "En Pausa").
- Visualizar el progreso y las tareas asignadas.

El proyecto está diseñado para **3 semanas** y cuenta con un equipo de:
- **2 Desarrolladores Full Stack** (Next.js y MongoDB).
- **1 Desarrollador Frontend** (React.js, Tailwind CSS, DaisyUI).
- **2 Diseñadores UX/UI** (Figma, diseño de experiencia e interfaz).
- **1 QA Tester** (Pruebas manuales).

**Miembros del equipo:**
- Geraldine Cardozo – UX/UI=
- Gabriela Reyes – UX/UI
- Julio Condor – Frontend, Backend
- Diego Mateus – Frontend
- Mailen Fonseca – QA Tester



## 🚀 Tecnologías Utilizadas
### **UX/UI**
- Figma
- Adobe Photoshop
- Adobe Firefly
- Adobe After Effects
  
### **Frontend**
- Next.js (React)
- Tailwind CSS + DaisyUI
- React Hot Toast para notificaciones

### **Backend**
- API Routes de Next.js
- MongoDB con Mongoose
- Autenticación con NextAuth.js (Google OAuth y credenciales)
- Bcryptjs para hashing de contraseñas

## 🚀 Tecnologías Utilizadas

## 📁 Estructura del Proyecto
```bash
📦 task-manager
├── models/            # Modelos de datos con Mongoose
├── components/        # Componentes reutilizables
├── utils/             # Funciones auxiliares
├── public/            # Recursos estáticos
├── pages/api/         # API Routes con Next.js
├── pages/             # UI con Next.js (React)
└── README.md          # Este archivo
```

## 🔧 Instalación y Configuración
### **1️⃣ Clonar el repositorio**
```sh
git clone https://github.com/No-Country-simulation/equipo-c24-49-n-webapp
```
### **2️⃣ Configurar el entorno**
```sh
cp .env.example .env  # Configurar variables de entorno
```
### **3️⃣ Instalar dependencias y ejecutar**
```sh
npm install
npm run dev  # Iniciar servidor en modo desarrollo
```

## 🔗 Endpoints Principales (API Routes en Next.js)
| Método  | Ruta                        | Descripción |
|---------|-----------------------------|-------------|
| **POST**   | `/api/auth/signup`        | Registrar usuario |
| **POST**   | `/api/auth/login`           | Iniciar sesión |
| **GET**    | `/api/projects`             | Obtener proyectos del usuario |
| **POST**   | `/api/projects`             | Crear un nuevo proyecto |
| **GET**    | `/api/tasks`                | Obtener todas las tareas |
| **POST**   | `/api/tasks`                | Crear una nueva tarea |

## 📌 Roles y Responsabilidades
### **Desarrolladores Full Stack (2 personas)**
- Implementar API Routes en Next.js
- Desarrollar funcionalidades en MongoDB y Mongoose
- Integrar el frontend con el backend

### **Desarrollador Frontend (1 persona)**
- Implementar UI con Next.js y Tailwind CSS
- Integración con API

### **Diseñadores UX/UI (2 personas)**
- Diseñar prototipos en Figma
- Crear sistema de diseño y experiencia de usuario

### **QA Tester (1 persona)**
- Pruebas manuales
- Reporte de errores y mejoras

## 📅 Roadmap de Desarrollo (3 Semanas)
### **Semana 1**
✅ Backend: Configuración API y DB  
✅ UX/UI: Wireframes y validación  
✅ Frontend: Setup de Next.js y diseño inicial  

### **Semana 2**
✅ Frontend: Desarrollo de vistas  
✅ Backend: Integración con API  
✅ QA: Pruebas iniciales  

### **Semana 3**
✅ Mejoras de UI/UX  
✅ QA: Pruebas adicionales  
✅ Despliegue en Vercel y MongoDB Atlas  


## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.

---
Hecho con ❤️ por el equipo de desarrollo 🚀

