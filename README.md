# INDENCENTS CEC
## Sistema de Reporte de Incidentes - Universidad de la Amazonia

Aplicación web desarrollada con React que permite a los usuarios de la Universidad de la Amazonia reportar incidentes ocurridos dentro de las instalaciones (fugas de agua, daños eléctricos, problemas de infraestructura, entre otros). Consume Supabase como backend para autenticación, base de datos y almacenamiento de archivos.

---

## Tecnologías utilizadas

- **React** — Librería principal para la construcción de la interfaz de usuario.
- **Vite** — Herramienta de desarrollo y empaquetado del proyecto.
- **Tailwind CSS** — Framework de estilos utilitarios para el diseño responsivo.
- **Supabase** — Backend como servicio. Se usa para autenticación de usuarios, base de datos (PostgreSQL), almacenamiento de imágenes y notificaciones en tiempo real mediante Realtime.
- **React Router DOM** — Manejo de rutas y navegación entre páginas.
- **Recharts** — Librería de gráficos para la visualización de estadísticas.
- **React Hot Toast** — Librería para mostrar notificaciones tipo toast en la interfaz.
- **React Icons** — Iconos usados en componentes de la interfaz.

---

## Pasos para ejecutar el proyecto

1. Clona el repositorio:
```bash
   git clone https://github.com/Camila-1706/ProyectoFinalWeb_INDENCENTS_CEC
``` 

2. Ingresa a la carpeta del proyecto:
```bash
   cd Indencents CEC
```

3. Instala las dependencias: 
```bash
   npm install
```

4. Inicia el servidor de desarrollo:
```bash
   npm run dev
```

5. Abrir en el navegador: `http://localhost:5173`

---

## Despliegue

https://indencents-cec.vercel.app/


## Credenciales de prueba

Para facilitar la evaluación y prueba del sistema, se encuentran disponibles las siguientes cuentas de ejemplo:

### Administrador

**Correo:** :  jaac812@gmail.com
**Contraseña:**  araque81

### Usuario de prueba 1

**Correo:** azpepe223@gmail.com
**Contraseña:** pepe.123


## Funcionalidades principales

- Registro e inicio de sesión con correo y contraseña.
- Roles de usuario: usuario normal y administrador.
- Registro de incidentes con tipo, descripción, ubicación, fotografía obligatoria y fecha automática.
- Almacenamiento de imágenes en Supabase Storage.
- Listado de incidentes con filtros por estado.
- Vista detallada de cada incidente.
- Gestión de estados por parte del administrador: Reportado, En proceso, Resuelto.
- Agrupación de incidentes relacionados; el cambio de estado en un grupo se propaga a todos.
- Estadísticas globales: total de incidentes, por estado y por tipo, con gráficos de barras y torta.
- Exportación e impresión del reporte de estadísticas.
- Notificaciones en tiempo real: el administrador recibe una notificación al crearse un nuevo incidente, y el usuario es notificado cuando cambia el estado de su reporte.
- Página 404 con redirección automática.
- Interfaz completamente responsiva.

---

## Autores

- Andrés Camilo Araque Suarez
- Emanuel Armando Sterling Jara
- Laura Camila Alvarez Rojas
---
Proyecto final — Programación Web  
Ingeniería de Sistemas, 2026-I  
Universidad de la Amazonia
