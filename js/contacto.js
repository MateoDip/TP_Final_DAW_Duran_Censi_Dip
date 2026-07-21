'use strict';

/* ==========================================================================
   contacto.js
   Logica de la pagina de contacto: validacion y apertura del cliente
   de correo predeterminado mediante un enlace mailto.
   Depende de: validations.js.
   ========================================================================== */

var CORREO_DESTINO_CONTACTO = 'contacto.memotest.mundial@ejemplo.com';

function construirUrlMailto(nombreRemitente, correoRemitente, mensajeRemitente) {
    var asuntoCodificado = encodeURIComponent('Contacto desde Memotest Mundial 2026 - ' + nombreRemitente);
    var cuerpoCodificado = encodeURIComponent(mensajeRemitente + '\n\nResponder a: ' + correoRemitente);
    return 'mailto:' + CORREO_DESTINO_CONTACTO + '?subject=' + asuntoCodificado + '&body=' + cuerpoCodificado;
}

function manejarSubmitFormularioContacto(evento) {
    var nombreIngresado = document.getElementById('input-nombre-contacto').value;
    var emailIngresado = document.getElementById('input-email-contacto').value;
    var mensajeIngresado = document.getElementById('input-mensaje-contacto').value;

    var resultadoValidacionNombre = validarNombreContacto(nombreIngresado);
    var resultadoValidacionEmail = validarEmailContacto(emailIngresado);
    var resultadoValidacionMensaje = validarMensajeContacto(mensajeIngresado);

    evento.preventDefault();
    document.getElementById('mensaje-confirmacion-contacto').classList.add('oculto');

    if (!resultadoValidacionNombre.esValido) {
        mostrarMensajeErrorContacto(resultadoValidacionNombre.mensaje);
        return;
    }
    if (!resultadoValidacionEmail.esValido) {
        mostrarMensajeErrorContacto(resultadoValidacionEmail.mensaje);
        return;
    }
    if (!resultadoValidacionMensaje.esValido) {
        mostrarMensajeErrorContacto(resultadoValidacionMensaje.mensaje);
        return;
    }

    limpiarMensajeErrorContacto();
    window.location.href = construirUrlMailto(nombreIngresado, emailIngresado, mensajeIngresado);
    document.getElementById('mensaje-confirmacion-contacto').classList.remove('oculto');
}

function mostrarMensajeErrorContacto(mensaje) {
    document.getElementById('mensaje-error-contacto').textContent = mensaje;
}

function limpiarMensajeErrorContacto() {
    document.getElementById('mensaje-error-contacto').textContent = '';
}

function inicializarEventosPaginaContacto() {
    document.getElementById('formulario-contacto').addEventListener('submit', manejarSubmitFormularioContacto);
}

document.addEventListener('DOMContentLoaded', inicializarEventosPaginaContacto);
