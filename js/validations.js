'use strict';

/* ==========================================================================
   validations.js
   Funciones de validacion de datos ingresados por el jugador.
   No dependen de otros modulos.
   ========================================================================== */

var LONGITUD_MINIMA_NOMBRE_JUGADOR = 3;
var LONGITUD_MINIMA_MENSAJE_CONTACTO = 5;
var EXPRESION_REGULAR_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var EXPRESION_REGULAR_ALFANUMERICO = /^[a-zA-Z0-9\u00C0-\u017F ]+$/;

function quitarEspaciosSobrantes(texto) {
    return texto.replace(/^\s+|\s+$/g, '');
}

function validarNombreJugador(nombre) {
    var nombreLimpio = quitarEspaciosSobrantes(nombre || '');
    if (nombreLimpio.length === 0) {
        return { esValido: false, mensaje: 'Ingresa tu nombre para comenzar.' };
    }
    if (nombreLimpio.length < LONGITUD_MINIMA_NOMBRE_JUGADOR) {
        return { esValido: false, mensaje: 'El nombre debe tener al menos ' + LONGITUD_MINIMA_NOMBRE_JUGADOR + ' caracteres.' };
    }
    return { esValido: true, mensaje: '' };
}

function validarNivelSeleccionado(nivel) {
    if (nivel !== 'facil' && nivel !== 'medio' && nivel !== 'dificil') {
        return { esValido: false, mensaje: 'Selecciona un nivel de dificultad.' };
    }
    return { esValido: true, mensaje: '' };
}

function validarNombreContacto(nombre) {
    var nombreLimpio = quitarEspaciosSobrantes(nombre || '');
    if (nombreLimpio.length === 0) {
        return { esValido: false, mensaje: 'Ingresa tu nombre.' };
    }
    if (!EXPRESION_REGULAR_ALFANUMERICO.test(nombreLimpio)) {
        return { esValido: false, mensaje: 'El nombre solo puede contener letras y numeros.' };
    }
    return { esValido: true, mensaje: '' };
}

function validarEmailContacto(email) {
    var emailLimpio = quitarEspaciosSobrantes(email || '');
    if (emailLimpio.length === 0) {
        return { esValido: false, mensaje: 'Ingresa tu correo electronico.' };
    }
    if (!EXPRESION_REGULAR_EMAIL.test(emailLimpio)) {
        return { esValido: false, mensaje: 'Ingresa un correo electronico valido.' };
    }
    return { esValido: true, mensaje: '' };
}

function validarMensajeContacto(mensaje) {
    var mensajeLimpio = quitarEspaciosSobrantes(mensaje || '');
    if (mensajeLimpio.length <= LONGITUD_MINIMA_MENSAJE_CONTACTO) {
        return { esValido: false, mensaje: 'El mensaje debe tener mas de ' + LONGITUD_MINIMA_MENSAJE_CONTACTO + ' caracteres.' };
    }
    return { esValido: true, mensaje: '' };
}
