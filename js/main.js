'use strict';

/* ==========================================================================
   main.js
   Punto de entrada de la pagina principal. Aplica preferencias guardadas
   e inicializa los eventos de la pagina.
   ========================================================================== */

function aplicarPreferenciasGuardadas() {
    var temaGuardado = obtenerPreferenciaTema();
    var sonidoGuardado = obtenerPreferenciaSonido();
    aplicarTema(temaGuardado);
    aplicarEstadoBotonSonido(sonidoGuardado);
}

function inicializarAplicacion() {
    aplicarPreferenciasGuardadas();
    inicializarEventosPaginaJuego();
}

document.addEventListener('DOMContentLoaded', inicializarAplicacion);
