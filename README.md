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

## Archivos

- `index.html` - Estructura HTML
- `styles.css` - Estilos y diseño responsive
- `script.js` - Lógica de la aplicación y gestión de estado

