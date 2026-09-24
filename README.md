# Casas Rurales · TanStack Start

Laboratorio del Módulo 5 (Metaframeworks) del Máster Frontend de Lemoncode: portal de alquiler vacacional de casas rurales con listado y detalle, construido con **TanStack Start** (React) y **Tailwind CSS**.

## Cómo ejecutarlo

La aplicación consume la API mock de Lemoncode, que debe estar arrancada antes de lanzar la app (y también durante el `build`, ya que el listado se prerenderiza en ese momento).

1. Arrancar la API mock:

   ```bash
   git clone https://github.com/Lemoncode/master-frontend-metaframeworks-lab.git
   cd master-frontend-metaframeworks-lab/api-server
   npm install
   npm start
   ```

2. En este proyecto, crear un `.env` a partir de `.env.example`:

   ```
   API_URL=http://localhost:3001
   ```

3. Instalar y arrancar:

   ```bash
   npm install
   npm run dev
   ```

Para probar la versión de producción: `npm run build` y después `npm run preview`.

## Estrategia de rendering

| Página | Ruta | Rendering | Motivo |
|---|---|---|---|
| Listado | `/` | SSG (prerender en el build) | El catálogo de casas cambia poco, así que se genera como HTML estático. |
| Detalle | `/houses/$id` | SSR + cabeceras de caché HTTP | Las reviews cambian con más frecuencia. Se renderiza en servidor y se envía `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`, de modo que un CDN puede cachear la página 60 segundos y servir la versión cacheada mientras la regenera en segundo plano. |

El prerender se configura en `vite.config.ts` con `crawlLinks: false`, para que solo se genere el listado y no siga los enlaces a los detalles:

```
[prerender] Crawling: /
[prerender] Prerendered 1 pages:
[prerender] - /
```

### Comparación con la versión en Next.js

En Next.js ambas páginas usan ISR, que el framework gestiona internamente con `revalidate` y `generateStaticParams`. TanStack Start no tiene ISR integrado: el comportamiento equivalente se consigue con SSR y cabeceras `Cache-Control` estándar, delegando la caché en el CDN donde se despliegue.

## Desafíos implementados

- Pantalla de listado de casas rurales.
- Pantalla de detalle con descripción, dirección, habitaciones, camas, baños, precio por noche y reviews.
- Navegación entre listado y detalle con `<Link>` tipado: la ruta y sus parámetros se comprueban en tiempo de compilación.
- Datos obtenidos mediante **server functions** (`createServerFn`). Como los loaders de TanStack Start son isomórficos (se ejecutan en el servidor en la primera carga y en el navegador al navegar), las server functions garantizan que las peticiones a la API y la variable `API_URL` se quedan siempre en el servidor. La URL completa de las imágenes también se construye ahí.
- Página "no encontrada" para casas inexistentes: la API responde con un cuerpo vacío en lugar de un 404, así que la server function devuelve `null`, el loader lanza `notFound()` y la ruta muestra su `notFoundComponent`.
- Estilos con Tailwind CSS, compatibles con server-side rendering.