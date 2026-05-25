# CyberTok Planner (v1)

Aplicación web local y simple para planificar videos diarios de TikTok sobre ciberseguridad para principiantes.

## Funcionalidades incluidas
- Lista de ideas de videos.
- Crear, editar y eliminar videos.
- Campos por video:
  - fecha de publicación
  - tema
  - público objetivo
  - gancho inicial
  - guion corto
  - ejemplo práctico
  - llamada a la acción
  - estado
  - notas
- Estados soportados: Idea, Guion listo, Grabado, Editado, Publicado.
- Filtro por estado.
- Búsqueda por tema.
- Exportar a CSV.
- Exportar a Markdown.
- Botón **Crear desde plantilla** con estructura:
  - Gancho
  - Explicación
  - Ejemplo práctico
  - Llamada a la acción

## Stack técnico
- Next.js + React
- Almacenamiento local con `localStorage` (JSON en el navegador)
- Sin APIs externas
- Sin login

## Instalación y ejecución local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador:
   - `http://localhost:3000`

## Cómo probar rápido
1. Crear un video nuevo completando tema y estado.
2. Usar **Crear desde plantilla** para autocompletar la estructura de guion.
3. Editar y eliminar un registro desde la tabla.
4. Aplicar filtro por estado y buscar por tema.
5. Probar botones de exportación (CSV y Markdown).

## Notas
- Los datos se guardan en el navegador (localStorage), por eso persisten entre recargas.
- Si limpiás los datos del navegador, también se borra el contenido del planner.
