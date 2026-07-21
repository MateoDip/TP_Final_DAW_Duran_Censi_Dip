'use strict';

/* ==========================================================================
   storage.js
   Manejo de LocalStorage: preferencias de tema, sonido y ranking de partidas.
   ========================================================================== */

var CLAVE_STORAGE_TEMA = 'memotest_mundial_tema';
var CLAVE_STORAGE_SONIDO = 'memotest_mundial_sonido';
var CLAVE_STORAGE_RANKING = 'memotest_mundial_ranking';

function guardarValorEnStorage(clave, valor) {
    try {
        window.localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        return false;
    }
}

function leerValorDeStorage(clave, valorPorDefecto) {
    var valorGuardado = null;
    try {
        valorGuardado = window.localStorage.getItem(clave);
    } catch (error) {
        return valorPorDefecto;
    }
    if (valorGuardado === null) {
        return valorPorDefecto;
    }
    try {
        return JSON.parse(valorGuardado);
    } catch (errorParseo) {
        return valorPorDefecto;
    }
}

function guardarPreferenciaTema(tema) {
    guardarValorEnStorage(CLAVE_STORAGE_TEMA, tema);
}

function obtenerPreferenciaTema() {
    return leerValorDeStorage(CLAVE_STORAGE_TEMA, 'oscuro');
}

function guardarPreferenciaSonido(sonidoActivo) {
    guardarValorEnStorage(CLAVE_STORAGE_SONIDO, sonidoActivo);
}

function obtenerPreferenciaSonido() {
    return leerValorDeStorage(CLAVE_STORAGE_SONIDO, true);
}

function obtenerRanking() {
    return leerValorDeStorage(CLAVE_STORAGE_RANKING, []);
}

function guardarResultadoEnRanking(resultado) {
    var rankingActual = obtenerRanking();
    rankingActual.push(resultado);
    guardarValorEnStorage(CLAVE_STORAGE_RANKING, rankingActual);
}

function borrarRankingCompleto() {
    guardarValorEnStorage(CLAVE_STORAGE_RANKING, []);
}

function ordenarRanking(ranking, criterio) {
    var copiaRanking = ranking.slice();
    copiaRanking.sort(function compararResultados(resultadoA, resultadoB) {
        if (criterio === 'fecha') {
            return resultadoB.marcaTiempo - resultadoA.marcaTiempo;
        }
        if (criterio === 'duracion') {
            return resultadoA.duracionSegundos - resultadoB.duracionSegundos;
        }
        if (criterio === 'nivel') {
            return resultadoA.nivel.localeCompare(resultadoB.nivel);
        }
        return resultadoB.puntajeFinal - resultadoA.puntajeFinal;
    });
    return copiaRanking;
}
