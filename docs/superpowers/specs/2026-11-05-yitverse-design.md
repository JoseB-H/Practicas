# YitVerse — primera versión

El usuario delega las decisiones del producto y la tecnología y pide empezar ya. No se dispone del contenido de su ZIP, por lo que esta es una propuesta original, no una implementación de esos documentos. Olympus es una referencia solicitada, pero su web devuelve HTTP 403 desde el entorno.

## Alcance

Un espacio personal en español para crear y gestionar proyectos, organizar tareas y guardar recursos. Dashboard con métricas calculadas de los datos reales, navegación, búsqueda, filtros, creación y edición, exportación JSON y perfil editable. Datos iniciales de ejemplo identificados en la interfaz. Aplicación de un solo usuario para desarrollo local, sin autenticación ni servicios externos.

## Tecnología y límites

React + TypeScript + Vite; servidor HTTP de Node.js 24 y SQLite integrado. Almacenamiento persistente en `.data/`, excluido de Git. API con validación de campos, estado y relaciones. El servidor usa 127.0.0.1 por defecto. Estética editorial de fondos claros, tinta oscura, lima y una ilustración orbital original. Interfaz responsive y controles accesibles.

## Contrato

GET `/api/workspace` → `{projects, tasks, resources, profile}`. Project: `{id,title,description,category,color,status,createdAt}`; categorías Producto/Diseño/Desarrollo/Comunidad, colores lime/purple/blue/orange, estado active/completed. Task: `{id,title,projectId,status,priority,dueDate,createdAt}`; estado todo/in-progress/done, prioridad low/medium/high, fecha YYYY-MM-DD o null. Resource: `{id,title,url,category,description,createdAt}`; categorías Diseño/Desarrollo/Aprendizaje/Inspiración, URL http/https. Profile: `{name,role,bio,email}`. POST `/api/projects`, PATCH/DELETE `/api/projects/:id`, POST `/api/tasks`, PATCH/DELETE `/api/tasks/:id`, POST/DELETE `/api/resources[/:id]`, PATCH `/api/profile`. Crear devuelve 201; actualizar 200; eliminar 204; validación 400; inexistente 404; errores JSON `{error}`. Eliminar proyecto elimina sus tareas. ID y createdAt los genera el servidor.

## Verificación

Pruebas API reales: CRUD, validación, cascada y persistencia. Build y TypeScript. Pruebas de navegador: navegación, creación persistente, tareas, búsqueda y móvil. No subir cambios a GitHub ni publicar el entorno: se respeta la última instrucción del usuario.
