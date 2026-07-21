'use strict';

/* ==========================================================================
   events.js
   Delegacion de eventos, modales, tema claro/oscuro, sonido y ranking.
   Depende de: validations.js, storage.js, sound.js, game.js.
   ========================================================================== */

var nivelElegidoEnFormulario = '';
var criterioOrdenRankingActual = 'puntaje';

function mostrarModal(idModal) {
    document.getElementById(idModal).classList.add('capa-modal--visible');
}

function ocultarModal(idModal) {
    document.getElementById(idModal).classList.remove('capa-modal--visible');
}

function mostrarMensajeError(idElemento, mensaje) {
    document.getElementById(idElemento).textContent = mensaje;
}

function limpiarMensajeError(idElemento) {
    document.getElementById(idElemento).textContent = '';
}

function manejarClickBotonNivel(evento) {
    var botonPresionado = evento.currentTarget;
    var listaBotonesNivel = document.querySelectorAll('.boton-nivel');
    var indiceBoton = 0;

    for (indiceBoton = 0; indiceBoton < listaBotonesNivel.length; indiceBoton = indiceBoton + 1) {
        listaBotonesNivel[indiceBoton].classList.remove('boton-nivel--activo');
    }
    botonPresionado.classList.add('boton-nivel--activo');
    nivelElegidoEnFormulario = botonPresionado.getAttribute('data-nivel');
}

function manejarSubmitFormularioInicio(evento) {
    var nombreIngresado = document.getElementById('input-nombre-jugador').value;
    var resultadoValidacionNombre = validarNombreJugador(nombreIngresado);
    var resultadoValidacionNivel = validarNivelSeleccionado(nivelElegidoEnFormulario);

    evento.preventDefault();

    if (!resultadoValidacionNombre.esValido) {
        mostrarMensajeError('mensaje-error-inicio', resultadoValidacionNombre.mensaje);
        return;
    }
    if (!resultadoValidacionNivel.esValido) {
        mostrarMensajeError('mensaje-error-inicio', resultadoValidacionNivel.mensaje);
        return;
    }

    limpiarMensajeError('mensaje-error-inicio');
    iniciarPartida(quitarEspaciosSobrantes(nombreIngresado), nivelElegidoEnFormulario);
}

function manejarClickEnTablero(evento) {
    var elementoCartaClickeado = evento.target.closest('.carta');
    var indiceCarta = 0;

    if (elementoCartaClickeado === null) {
        return;
    }
    indiceCarta = parseInt(elementoCartaClickeado.getAttribute('data-indice-carta'), 10);
    manejarClickEnCarta(indiceCarta);
}

function manejarClickReiniciar() {
    reiniciarPartidaActual();
}

function manejarClickJugarNuevamente() {
    reiniciarPartidaActual();
}

function manejarClickVolverInicio() {
    volverAPantallaInicio();
}

function aplicarTema(nombreTema) {
    if (nombreTema === 'claro') {
        document.documentElement.setAttribute('data-tema', 'claro');
    } else {
        document.documentElement.removeAttribute('data-tema');
    }
    document.getElementById('boton-alternar-tema').textContent = nombreTema === 'claro' ? 'Modo oscuro' : 'Modo claro';
}

function alternarTema() {
    var temaActual = obtenerPreferenciaTema();
    var temaNuevo = temaActual === 'claro' ? 'oscuro' : 'claro';
    guardarPreferenciaTema(temaNuevo);
    aplicarTema(temaNuevo);
}

function aplicarEstadoBotonSonido(sonidoActivo) {
    document.getElementById('boton-alternar-sonido').textContent = sonidoActivo ? 'Sonido: activado' : 'Sonido: desactivado';
}

function alternarSonido() {
    var sonidoActivoActual = obtenerPreferenciaSonido();
    var sonidoNuevo = !sonidoActivoActual;
    guardarPreferenciaSonido(sonidoNuevo);
    aplicarEstadoBotonSonido(sonidoNuevo);
}

function crearCeldaTabla(texto) {
    var celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
}

function renderizarTablaRanking(criterioOrden) {
    var cuerpoTabla = document.getElementById('cuerpo-tabla-ranking');
    var rankingCompleto = obtenerRanking();
    var rankingOrdenado = ordenarRanking(rankingCompleto, criterioOrden);
    var indiceResultado = 0;
    var fila = null;
    var resultado = null;

    cuerpoTabla.innerHTML = '';

    if (rankingOrdenado.length === 0) {
        fila = document.createElement('tr');
        fila.appendChild(crearCeldaTabla('Todavia no hay partidas registradas.'));
        cuerpoTabla.appendChild(fila);
        return;
    }

    for (indiceResultado = 0; indiceResultado < rankingOrdenado.length; indiceResultado = indiceResultado + 1) {
        resultado = rankingOrdenado[indiceResultado];
        fila = document.createElement('tr');
        fila.appendChild(crearCeldaTabla(resultado.nombreJugador));
        fila.appendChild(crearCeldaTabla(String(resultado.puntajeFinal)));
        fila.appendChild(crearCeldaTabla(resultado.nivel));
        fila.appendChild(crearCeldaTabla(String(resultado.cantidadIntentos)));
        fila.appendChild(crearCeldaTabla(String(resultado.cantidadErrores)));
        fila.appendChild(crearCeldaTabla(formatearTiempo(resultado.duracionSegundos)));
        cuerpoTabla.appendChild(fila);
    }
}

function manejarClickAbrirRanking() {
    renderizarTablaRanking(criterioOrdenRankingActual);
    mostrarModal('modal-ranking');
}

function manejarCambioOrdenRanking(evento) {
    criterioOrdenRankingActual = evento.target.value;
    renderizarTablaRanking(criterioOrdenRankingActual);
}

function manejarClickBorrarRanking() {
    mostrarModal('modal-confirmar-borrado');
}

function manejarClickConfirmarBorrado() {
    borrarRankingCompleto();
    ocultarModal('modal-confirmar-borrado');
    renderizarTablaRanking(criterioOrdenRankingActual);
}

function manejarClickCancelarBorrado() {
    ocultarModal('modal-confirmar-borrado');
}

function inicializarBotonesDeNivel() {
    var listaBotonesNivel = document.querySelectorAll('.boton-nivel');
    var indiceBoton = 0;
    for (indiceBoton = 0; indiceBoton < listaBotonesNivel.length; indiceBoton = indiceBoton + 1) {
        listaBotonesNivel[indiceBoton].addEventListener('click', manejarClickBotonNivel);
    }
}

function inicializarEventosPaginaJuego() {
    document.getElementById('formulario-inicio').addEventListener('submit', manejarSubmitFormularioInicio);
    inicializarBotonesDeNivel();

    document.getElementById('tablero-juego').addEventListener('click', manejarClickEnTablero);
    document.getElementById('boton-reiniciar').addEventListener('click', manejarClickReiniciar);
    document.getElementById('boton-volver-inicio').addEventListener('click', manejarClickVolverInicio);
    document.getElementById('boton-jugar-nuevamente').addEventListener('click', manejarClickJugarNuevamente);
    document.getElementById('boton-ir-inicio-desde-resumen').addEventListener('click', manejarClickVolverInicio);

    document.getElementById('boton-alternar-tema').addEventListener('click', alternarTema);
    document.getElementById('boton-alternar-sonido').addEventListener('click', alternarSonido);

    document.getElementById('boton-abrir-ranking').addEventListener('click', manejarClickAbrirRanking);
    document.getElementById('boton-cerrar-ranking').addEventListener('click', function cerrarModalRanking() {
        ocultarModal('modal-ranking');
    });
    document.getElementById('selector-orden-ranking').addEventListener('change', manejarCambioOrdenRanking);
    document.getElementById('boton-borrar-ranking').addEventListener('click', manejarClickBorrarRanking);
    document.getElementById('boton-confirmar-borrado').addEventListener('click', manejarClickConfirmarBorrado);
    document.getElementById('boton-cancelar-borrado').addEventListener('click', manejarClickCancelarBorrado);
}
