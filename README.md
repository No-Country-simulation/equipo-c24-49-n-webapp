# 📌 Gestor de Tareas Colaborativo

## 📖 Descripción
Este es un **MVP** de un gestor de tareas colaborativo, donde los usuarios pueden:
- Registrarse e iniciar sesión.
- Crear, asignar y gestionar tareas.
- Cambiar el estado de las tareas (Pendiente, En Progreso, Completada).
- Visualizar el progreso y las tareas asignadas.

El proyecto está diseñado para **3 semanas** y cuenta con un equipo de:
- **3 Frontend Developers** (React.js, JavaScript, Zustand/Redux).
- **2 Backend Developers** (Node.js, Express.js, Sequelize, PostgreSQL).
- **3 UX/UI Designers** (Figma, diseño de experiencia e interfaz).
- **2 QA Testers** (Pruebas manuales y automatizadas con Cypress).

## 🚀 Tecnologías Utilizadas
### **Frontend**
- React.js + JavaScript
- Zustand o Redux para manejo de estado
- CSS para estilos

### **Backend**
- Node.js con Express.js
- PostgreSQL con Sequelize ORM
- Autenticación con JWT

### **Testing**
- Cypress para pruebas end-to-end
- Jest para pruebas unitarias

## 📁 Estructura del Proyecto
```bash
📦 EQUIPO-C24-49-N-WEBAPP
├── back/              # API con Node.js + Express
├── front/             # UI con Reac.js
├── test/              # testing con Jest
├── ux-ui/             # Documentación y wireframes
└── README.md          # Este archivo
```

## 🔧 Instalación y Configuración
### **1️⃣ Clonar el repositorio**
```sh
git clone https://github.com/No-Country-simulation/equipo-c24-49-n-webapp.git
cd equipo-c24-49-n-webapp
```
### **2️⃣ Configurar el Backend**
```sh
cd backend
npm install
cp .env.example .env  # Configurar las variables de entorno
npm run dev  # Iniciar servidor
```
### **3️⃣ Configurar el Frontend**
```sh
cd frontend
npm install
npm run dev  # Iniciar el cliente
```

## 🔗 Endpoints Principales (Backend)
| Método  | Ruta                        | Descripción |
|---------|-----------------------------|-------------|
| **POST**   | `/auth/register`            | Registrar usuario |
| **POST**   | `/auth/login`               | Iniciar sesión |
| **GET**    | `/tasks`                    | Obtener todas las tareas |
| **POST**   | `/tasks`                    | Crear una nueva tarea |
| **PATCH**  | `/tasks/status/:id`         | Cambiar estado de tarea |

## 📌 Roles y Responsabilidades
### **Frontend (3 personas)**
- Implementar UI con React.js
- Integrar API
- Manejo de estado global

### **Backend (2 personas)**
- Implementar API y base de datos
- Seguridad y autenticación

### **UX/UI (3 personas)**
- Diseñar prototipos en Figma
- Crear sistema de diseño

### **QA (2 personas)**
- Pruebas manuales y automatizadas
- Reporte de errores y mejoras

## 📅 Roadmap de Desarrollo (3 Semanas)
### **Semana 1**
✅ Backend: Configuración API y DB  
✅ UX/UI: Wireframes y validación  
✅ Frontend: Setup de React.js y diseño inicial  

### **Semana 2**
✅ Frontend: Desarrollo de vistas  
✅ Backend: Integración con API  
✅ QA: Pruebas iniciales  

### **Semana 3**
✅ Mejoras de UI/UX  
✅ QA: Pruebas automatizadas  
✅ Despliegue en Vercel y Railway  

## 📢 Contribuciones
¡Cualquier contribución es bienvenida! Por favor, sigue estos pasos:
1. **Fork** este repositorio
2. Crea una **rama** (`feature/nueva-funcionalidad`)
3. **Commitea** tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a tu fork (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.

---
Hecho con ❤️ por el equipo de desarrollo 🚀
