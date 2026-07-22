# Memotest Mundial 2026 - Banderas

Proyecto final de la asignatura **Desarrollo y Arquitecturas Web** (Ingeniería en Sistemas Informáticos, UAI - 2026).

## Descripción del juego

Memotest (juego de memoria/pares) donde el jugador debe encontrar las banderas repetidas del tablero en la menor cantidad de intentos, con la menor cantidad de errores y en el menor tiempo posible.

## Temática elegida

**Banderas de los países del Mundial de Fútbol 2026.** Cada carta muestra la bandera de uno de los 18 países participantes seleccionados para este juego (Argentina, Brasil, Francia, Alemania, España, Inglaterra, Italia, Uruguay, Portugal, Países Bajos, Bélgica, Croacia, Marruecos, Japón, Corea del Sur, México, Estados Unidos y Canadá). La temática se mantiene coherente en colores, tipografía (estilo "marcador de estadio") y en el vocabulario usado en toda la interfaz.

## Reglas del juego

1. El jugador ingresa su nombre (mínimo 3 caracteres) y elige un nivel de dificultad.
2. El tablero se arma con cartas boca abajo, mezcladas aleatoriamente.
3. En cada turno el jugador selecciona dos cartas.
4. Si coinciden, quedan descubiertas de forma permanente y suman puntos.
5. Si no coinciden, se ocultan nuevamente luego de un breve intervalo y se aplica una penalización.
6. La partida termina cuando se encuentran todos los pares del tablero.
7. Se puede reiniciar la partida en cualquier momento sin recargar la página.

### Niveles

| Nivel   | Cartas | Pares | Penalización por error |
|---------|--------|-------|-------------------------|
| Fácil   | 16     | 8     | -10 puntos              |
| Medio   | 20     | 10    | -20 puntos              |
| Difícil | 36     | 18    | -30 puntos              |

## Sistema de puntaje

- Par correcto: **+100 puntos**.
- Bono por racha de aciertos consecutivos: **+20 puntos** por cada acierto consecutivo adicional (2do acierto seguido +20, 3ro +40, etc.).
- Error: se descuenta según el nivel (**-10 / -20 / -30**).
- Penalización progresiva por errores consecutivos: **-5 puntos adicionales** por cada error seguido adicional.
- Penalización por tiempo: **-1 punto por cada segundo transcurrido**, aplicada en vivo mientras corre el cronómetro.
- Bono por finalizar la partida: **+300 puntos**.
- El puntaje nunca baja de 0 durante la partida.

El cronómetro inicia al dar vuelta la primera carta y se detiene al completar todos los pares.

## Funcionalidades implementadas

### Obligatorias
- Formulario de inicio con validación de nombre (JavaScript) y selección de nivel obligatoria.
- Tablero generado dinámicamente con JavaScript, cartas mezcladas en cada partida.
- Mecánica completa de selección, verificación de pares, bloqueo de tablero mientras se resuelve un intento fallido.
- Marcador visible con intentos, errores, pares encontrados, tiempo y puntaje en tiempo real.
- Mensaje final con nombre, nivel, intentos, errores, tiempo total y puntaje, mostrado en un modal (sin `alert`).
- Reinicio de partida sin recargar la página.
- Página de contacto con formulario validado por JavaScript (nombre alfanumérico, email con formato válido, mensaje de más de 5 caracteres) que abre el cliente de correo predeterminado mediante un enlace `mailto:`.
- Navegación entre el juego y la página de contacto, enlaces a GitHub y a GitHub Pages.
- Diseño responsive con Flexbox, sin `alert`/`prompt`/`confirm`.

### Deseadas (implementadas)
- **Ranking con LocalStorage**: guarda nombre, puntaje, nivel, intentos, errores, fecha y duración de cada partida. Modal con ranking ordenable por puntaje, fecha, duración o nivel, y opción de borrado con modal de confirmación propio.
- **Modo oscuro / modo claro** con persistencia en LocalStorage.
- **Sonido**: efectos sintetizados con la Web Audio API (sin archivos externos) para selección de carta, par correcto, error y victoria, con opción de activar/desactivar.
- **Sistema avanzado de puntaje**: bono por racha de aciertos y penalización progresiva por errores consecutivos (detallado arriba).

### No implementadas
- Modo progresivo (avance automático de nivel al ganar). Se priorizó dejar sólida y bien probada la mecánica base antes de sumar esta función opcional.

## Estructura de carpetas

```
/assets
  /images/flags   -> banderas en SVG usadas por las cartas
/css
  reset.css
  styles.css
/js
  validations.js  -> validaciones de formularios
  storage.js      -> LocalStorage (tema, sonido, ranking)
  sound.js        -> sonidos sintetizados con Web Audio API
  game.js         -> logica del memotest
  events.js       -> eventos, modales, tema, sonido, ranking
  main.js         -> inicializacion de la pagina principal
  contacto.js     -> logica de la pagina de contacto
/pages
  contacto.html
index.html
README.md
.gitignore
```

## Tecnologías y buenas prácticas

- HTML5 semántico (`header`, `nav`, `main`, `section`, `footer`).
- CSS3 con Flexbox, variables CSS y una única convención de color (hexadecimal).
- JavaScript ES5 estricto (`'use strict'`), sin `let`/`const`/arrow functions/template literals, sin frameworks ni librerías externas para la lógica del juego.
- Eventos manejados exclusivamente con `addEventListener`.
- Nomenclatura: **kebab-case** para archivos, carpetas, ids y clases; **camelCase** para variables y funciones de JavaScript.
- Proyecto y comentarios escritos íntegramente en español.

## Cómo jugar

1. Abrir `index.html` (o la versión publicada en GitHub Pages).
2. Ingresar un nombre de al menos 3 caracteres.
3. Elegir un nivel de dificultad.
4. Presionar "Comenzar partida" y encontrar todos los pares de banderas.

