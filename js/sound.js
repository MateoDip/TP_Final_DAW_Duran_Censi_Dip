'use strict';

/* ==========================================================================
   sound.js
   Sonidos sintetizados con la Web Audio API (no requieren archivos externos).
   Depende de storage.js para saber si el sonido esta activado.
   ========================================================================== */

var contextoAudioGlobal = null;

function obtenerContextoAudio() {
    var ConstructorAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!ConstructorAudioContext) {
        return null;
    }
    if (contextoAudioGlobal === null) {
        contextoAudioGlobal = new ConstructorAudioContext();
    }
    return contextoAudioGlobal;
}

function reproducirTono(frecuencia, duracionSegundos, tipoOnda) {
    var sonidoActivo = obtenerPreferenciaSonido();
    if (!sonidoActivo) {
        return;
    }
    var contexto = obtenerContextoAudio();
    if (contexto === null) {
        return;
    }
    var oscilador = contexto.createOscillator();
    var nodoGanancia = contexto.createGain();
    oscilador.type = tipoOnda;
    oscilador.frequency.setValueAtTime(frecuencia, contexto.currentTime);
    nodoGanancia.gain.setValueAtTime(0.15, contexto.currentTime);
    nodoGanancia.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + duracionSegundos);
    oscilador.connect(nodoGanancia);
    nodoGanancia.connect(contexto.destination);
    oscilador.start();
    oscilador.stop(contexto.currentTime + duracionSegundos);
}

function reproducirSonidoSeleccion() {
    reproducirTono(440, 0.12, 'sine');
}

function reproducirSonidoPar() {
    reproducirTono(660, 0.18, 'triangle');
}

function reproducirSonidoError() {
    reproducirTono(180, 0.25, 'sawtooth');
}

function reproducirSonidoVictoria() {
    reproducirTono(523, 0.15, 'triangle');
    window.setTimeout(function reproducirSegundaNota() {
        reproducirTono(659, 0.15, 'triangle');
    }, 150);
    window.setTimeout(function reproducirTerceraNota() {
        reproducirTono(784, 0.3, 'triangle');
    }, 300);
}
