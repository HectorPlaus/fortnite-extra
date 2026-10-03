# Control de Espíritus - Fortnite Season 7 Chapter 3

Rastreador web interactivo para gestionar los 11 espíritus de la nueva temporada de Fortnite con variantes especiales.

## Características

✨ **Gestión de Espíritus**
- 11 espíritus base (agua, tierra, fuego, pato, demonio, fantasma, rey, punk, sueño, cacahuete quemado, punto cero)
- 4 variantes especiales por espíritu (Gold, Gummy, Galaxy, Special) 
- Sistema de niveles 1-5 con estado "Dominado" en nivel 5
- Corona dorada que persiste hasta reiniciar

🎮 **Controles**
- **+/-**: Subir/bajar nivel
- **Marcar perdido**: Reinicia nivel a 1; subir nivel lo desmarca automáticamente
- **↺**: Botón de reinicio (icono pequeño)
- **Reiniciar todo**: Resetea todos los espíritus

🎨 **Diseño**
- Tema oscuro moderno
- Responsive para móviles y escritorio
- Bordes de color para variantes especiales (Gold dorado, Gummy rosa, Galaxy púrpura, Special arcoíris)
- Rareza visual con badges

## Almacenamiento de Datos

📱 **¿Dónde se guardan los datos?**

Los datos se guardan en **localStorage del navegador** (en tu dispositivo), no en servidores externos.

- ✅ El estado persiste entre sesiones en el mismo navegador/dispositivo
- ✅ Funciona totalmente offline después de la primera carga
- ✅ En GitHub Pages (o cualquier host estático), los datos se guardan localmente
- ❌ No se sincronizan entre dispositivos
- ❌ Se pierden si limpias el caché/cookies del navegador

**Para GitHub Pages:**
- Deploy en `https://username.github.io/fortnite-extra/`
- Los datos se guardan en tu navegador bajo ese dominio
- Puedes acceder desde cualquier navegador en tu dispositivo
- Al cambiar a otro dispositivo, los datos no se transfieren

## Cómo usar

1. Abre `index.html` en tu navegador
2. Sube los niveles de cada espíritu (max. nivel 5 = dominado)
3. Marca como "Perdido" si lo encontraste pero no lo capturaste
4. Reinicia individuales o todos con los botones respectivos

## Catálogo y colecciones

La sección Catálogo de cosméticos consulta el catálogo público de Fortnite-API.com. Permite buscar, filtrar por varios tipos a la vez, conjunto y rareza, ordenar por nombre y añadir elementos manualmente a colecciones propias. El botón de acción masiva añade todos los resultados de los filtros a la colección seleccionada, no solo las tarjetas de la página cargada. Las colecciones admiten crear, renombrar, eliminar y quitar elementos; un cosmético puede estar en varias colecciones.

El catálogo ordena inicialmente del más reciente al más antiguo usando la fecha `added` de la API. También se puede ordenar por antigüedad, nombre, rareza, tipo o conjunto.

Al pulsar una tarjeta se abre su detalle, con descripción y metadatos disponibles, galería de imágenes (incluidos assets LEGO/Bean y fondos cuando existan) y opciones de estilo con sus imágenes. Los recursos que la API no proporciona para un cosmético se omiten.

Las colecciones se guardan bajo la clave independiente `fortnite-espiritus-collections`. No se modifica `fortnite-espiritus-state`. Como cualquier dato de `localStorage`, las colecciones solo están disponibles en el mismo navegador y dispositivo; no se sincronizan entre dispositivos o navegadores.

La petición probada a `?language=es-ES` devuelve HTTP 400 porque ese locale no está disponible en la API; `?language=es` responde correctamente. La petición directa desde el navegador también funciona con CORS, por lo que no se necesita backend ni clave API. El catálogo se descarga una vez por carga de página y los resultados se muestran por páginas para limitar el trabajo de renderizado.

La pestaña Tienda consulta `/v2/shop?language=es` y permite buscar, filtrar por categoría, actualizar manualmente y ordenar por orden de la API, precio ascendente/descendente, nombre, fecha de salida, fecha de llegada, descuento absoluto en paVos, categoría o lotes primero. El detalle de un cosmético muestra su precio cuando está en la tienda; si forma parte de un lote u oferta con varios cosméticos, se indica que el importe corresponde a esa oferta y no al artículo individual.

## Archivos

- `index.html` - Estructura HTML
- `styles.css` - Estilos y diseño responsive
- `script.js` - Lógica de la aplicación y gestión de estado

