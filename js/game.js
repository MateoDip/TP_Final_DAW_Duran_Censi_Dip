'use strict';

/* ==========================================================================
   game.js
   Logica principal del memotest: generacion de tablero, mecanica de juego,
   puntaje, temporizador y finalizacion de partida.
   Depende de: sound.js, storage.js.
   ========================================================================== */

var RUTA_CARPETA_BANDERAS = 'assets/images/flags/';
var MILISEGUNDOS_OCULTAR_CARTAS = 900;

var LISTA_BANDERAS_DISPONIBLES = [
    { codigo: 'argentina', nombre: 'Argentina' },
    { codigo: 'brasil', nombre: 'Brasil' },
    { codigo: 'francia', nombre: 'Francia' },
    { codigo: 'alemania', nombre: 'Alemania' },
    { codigo: 'espana', nombre: 'Espana' },
    { codigo: 'inglaterra', nombre: 'Inglaterra' },
    { codigo: 'italia', nombre: 'Italia' },
    { codigo: 'uruguay', nombre: 'Uruguay' },
    { codigo: 'portugal', nombre: 'Portugal' },
    { codigo: 'paises-bajos', nombre: 'Paises Bajos' },
    { codigo: 'belgica', nombre: 'Belgica' },
    { codigo: 'croacia', nombre: 'Croacia' },
    { codigo: 'marruecos', nombre: 'Marruecos' },
    { codigo: 'japon', nombre: 'Japon' },
    { codigo: 'corea-del-sur', nombre: 'Corea del Sur' },
    { codigo: 'mexico', nombre: 'Mexico' },
    { codigo: 'estados-unidos', nombre: 'Estados Unidos' },
    { codigo: 'canada', nombre: 'Canada' }
];

var OBJETO_CONFIGURACION_NIVELES = {
    facil: { columnas: 4, totalPares: 8, penalizacionError: 10 },
    medio: { columnas: 5, totalPares: 10, penalizacionError: 20 },
    dificil: { columnas: 6, totalPares: 18, penalizacionError: 30 }
};

var estadoJuego = {
    nombreJugador: '',
    nivelSeleccionado: '',
    mazoCartas: [],
    indicePrimeraCarta: null,
    indiceSegundaCarta: null,
    tableroBloqueado: false,
    cantidadIntentos: 0,
    cantidadErrores: 0,
    cantidadParesEncontrados: 0,
    totalParesDelNivel: 0,
    puntajeActual: 0,
    rachaAciertosSeguidos: 0,
    rachaErroresSeguidos: 0,
    segundosTranscurridos: 0,
    idIntervaloTemporizador: null,
    temporizadorIniciado: false
};

function obtenerConfiguracionNivel(nivel) {
    return OBJETO_CONFIGURACION_NIVELES[nivel];
}

function mezclarArregloFisherYates(arreglo) {
    var indiceActual = arreglo.length;
    var indiceAleatorio = 0;
    var valorTemporal = null;
    while (indiceActual !== 0) {
        indiceAleatorio = Math.floor(Math.random() * indiceActual);
        indiceActual = indiceActual - 1;
        valorTemporal = arreglo[indiceActual];
        arreglo[indiceActual] = arreglo[indiceAleatorio];
        arreglo[indiceAleatorio] = valorTemporal;
    }
    return arreglo;
}

function generarMazoCartas(nivel) {
    var configuracionNivel = obtenerConfiguracionNivel(nivel);
    var banderasSeleccionadas = LISTA_BANDERAS_DISPONIBLES.slice(0, configuracionNivel.totalPares);
    var mazoSinMezclar = [];
    var indiceBandera = 0;
    for (indiceBandera = 0; indiceBandera < banderasSeleccionadas.length; indiceBandera = indiceBandera + 1) {
        mazoSinMezclar.push({
            codigo: banderasSeleccionadas[indiceBandera].codigo,
            nombre: banderasSeleccionadas[indiceBandera].nombre,
            estaDescubierta: false,
            estaResuelta: false
        });
        mazoSinMezclar.push({
            codigo: banderasSeleccionadas[indiceBandera].codigo,
            nombre: banderasSeleccionadas[indiceBandera].nombre,
            estaDescubierta: false,
            estaResuelta: false
        });
    }
    return mezclarArregloFisherYates(mazoSinMezclar);
}

function crearElementoCarta(datosCarta, indiceCarta) {
    var botonCarta = document.createElement('button');
    var contenedorInterior = document.createElement('span');
    var caraDorso = document.createElement('span');
    var caraFrente = document.createElement('span');
    var imagenBandera = document.createElement('img');

    botonCarta.className = 'carta';
    botonCarta.setAttribute('type', 'button');
    botonCarta.setAttribute('data-indice-carta', String(indiceCarta));
    botonCarta.setAttribute('aria-label', 'Carta oculta numero ' + (indiceCarta + 1));

    contenedorInterior.className = 'carta__interior';

    caraDorso.className = 'carta__cara carta__cara--dorso';
    caraDorso.textContent = 'MUNDIAL 2026';

    caraFrente.className = 'carta__cara carta__cara--frente';
    imagenBandera.className = 'carta__imagen';
    imagenBandera.setAttribute('src', RUTA_CARPETA_BANDERAS + datosCarta.codigo + '.svg');
    imagenBandera.setAttribute('alt', 'Bandera de ' + datosCarta.nombre);
    caraFrente.appendChild(imagenBandera);

    contenedorInterior.appendChild(caraDorso);
    contenedorInterior.appendChild(caraFrente);
    botonCarta.appendChild(contenedorInterior);

    return botonCarta;
}

function renderizarTablero() {
    var contenedorTablero = document.getElementById('tablero-juego');
    var indiceCarta = 0;
    var elementoCarta = null;

    contenedorTablero.innerHTML = '';

    for (indiceCarta = 0; indiceCarta < estadoJuego.mazoCartas.length; indiceCarta = indiceCarta + 1) {
        elementoCarta = crearElementoCarta(estadoJuego.mazoCartas[indiceCarta], indiceCarta);
        contenedorTablero.appendChild(elementoCarta);
    }
}

function obtenerElementoCartaPorIndice(indiceCarta) {
    var contenedorTablero = document.getElementById('tablero-juego');
    return contenedorTablero.querySelector('[data-indice-carta="' + indiceCarta + '"]');
}

function bloquearTablero() {
    estadoJuego.tableroBloqueado = true;
}

function desbloquearTablero() {
    estadoJuego.tableroBloqueado = false;
}

function manejarClickEnCarta(indiceCarta) {
    var datosCarta = estadoJuego.mazoCartas[indiceCarta];

    if (estadoJuego.tableroBloqueado) {
        return;
    }
    if (datosCarta.estaResuelta || datosCarta.estaDescubierta) {
        return;
    }
    if (indiceCarta === estadoJuego.indicePrimeraCarta) {
        return;
    }

    if (!estadoJuego.temporizadorIniciado) {
        iniciarTemporizador();
    }

    voltearCarta(indiceCarta);
    reproducirSonidoSeleccion();

    if (estadoJuego.indicePrimeraCarta === null) {
        estadoJuego.indicePrimeraCarta = indiceCarta;
        return;
    }

    estadoJuego.indiceSegundaCarta = indiceCarta;
    estadoJuego.cantidadIntentos = estadoJuego.cantidadIntentos + 1;
    bloquearTablero();
    actualizarMarcadorEnPantalla();
    window.setTimeout(verificarParSeleccionado, 260);
}

function voltearCarta(indiceCarta) {
    var datosCarta = estadoJuego.mazoCartas[indiceCarta];
    var elementoCarta = obtenerElementoCartaPorIndice(indiceCarta);
    datosCarta.estaDescubierta = true;
    elementoCarta.classList.add('carta--volteada');
}

function ocultarCarta(indiceCarta) {
    var datosCarta = estadoJuego.mazoCartas[indiceCarta];
    var elementoCarta = obtenerElementoCartaPorIndice(indiceCarta);
    datosCarta.estaDescubierta = false;
    elementoCarta.classList.remove('carta--volteada');
}

function verificarParSeleccionado() {
    var primeraCarta = estadoJuego.mazoCartas[estadoJuego.indicePrimeraCarta];
    var segundaCarta = estadoJuego.mazoCartas[estadoJuego.indiceSegundaCarta];

    if (primeraCarta.codigo === segundaCarta.codigo) {
        procesarParCorrecto();
    } else {
        procesarParIncorrecto();
    }
}

function procesarParCorrecto() {
    var elementoPrimeraCarta = obtenerElementoCartaPorIndice(estadoJuego.indicePrimeraCarta);
    var elementoSegundaCarta = obtenerElementoCartaPorIndice(estadoJuego.indiceSegundaCarta);
    var bonusPorRacha = 0;

    estadoJuego.mazoCartas[estadoJuego.indicePrimeraCarta].estaResuelta = true;
    estadoJuego.mazoCartas[estadoJuego.indiceSegundaCarta].estaResuelta = true;
    elementoPrimeraCarta.classList.add('carta--correcta');
    elementoSegundaCarta.classList.add('carta--correcta');
    elementoPrimeraCarta.setAttribute('disabled', 'disabled');
    elementoSegundaCarta.setAttribute('disabled', 'disabled');

    estadoJuego.cantidadParesEncontrados = estadoJuego.cantidadParesEncontrados + 1;
    estadoJuego.rachaAciertosSeguidos = estadoJuego.rachaAciertosSeguidos + 1;
    estadoJuego.rachaErroresSeguidos = 0;

    bonusPorRacha = (estadoJuego.rachaAciertosSeguidos - 1) * 20;
    actualizarPuntaje(100 + bonusPorRacha);
    reproducirSonidoPar();

    limpiarSeleccionActual();
    desbloquearTablero();
    actualizarMarcadorEnPantalla();
    verificarFinDePartida();
}

function procesarParIncorrecto() {
    var indicePrimeraCartaLocal = estadoJuego.indicePrimeraCarta;
    var indiceSegundaCartaLocal = estadoJuego.indiceSegundaCarta;
    var elementoPrimeraCarta = obtenerElementoCartaPorIndice(indicePrimeraCartaLocal);
    var elementoSegundaCarta = obtenerElementoCartaPorIndice(indiceSegundaCartaLocal);
    var penalizacionBase = calcularPenalizacionError(estadoJuego.nivelSeleccionado);
    var penalizacionProgresiva = 0;

    elementoPrimeraCarta.classList.add('carta--incorrecta');
    elementoSegundaCarta.classList.add('carta--incorrecta');

    estadoJuego.cantidadErrores = estadoJuego.cantidadErrores + 1;
    estadoJuego.rachaErroresSeguidos = estadoJuego.rachaErroresSeguidos + 1;
    estadoJuego.rachaAciertosSeguidos = 0;

    penalizacionProgresiva = (estadoJuego.rachaErroresSeguidos - 1) * 5;
    actualizarPuntaje(-1 * (penalizacionBase + penalizacionProgresiva));
    reproducirSonidoError();
    actualizarMarcadorEnPantalla();

    window.setTimeout(function ocultarParIncorrecto() {
        elementoPrimeraCarta.classList.remove('carta--incorrecta');
        elementoSegundaCarta.classList.remove('carta--incorrecta');
        ocultarCarta(indicePrimeraCartaLocal);
        ocultarCarta(indiceSegundaCartaLocal);
        limpiarSeleccionActual();
        desbloquearTablero();
    }, MILISEGUNDOS_OCULTAR_CARTAS);
}

function limpiarSeleccionActual() {
    estadoJuego.indicePrimeraCarta = null;
    estadoJuego.indiceSegundaCarta = null;
}

function calcularPenalizacionError(nivel) {
    var configuracionNivel = obtenerConfiguracionNivel(nivel);
    return configuracionNivel.penalizacionError;
}

function actualizarPuntaje(delta) {
    estadoJuego.puntajeActual = estadoJuego.puntajeActual + delta;
    if (estadoJuego.puntajeActual < 0) {
        estadoJuego.puntajeActual = 0;
    }
}

function actualizarMarcadorEnPantalla() {
    document.getElementById('marcador-intentos').textContent = String(estadoJuego.cantidadIntentos);
    document.getElementById('marcador-errores').textContent = String(estadoJuego.cantidadErrores);
    document.getElementById('marcador-pares').textContent = estadoJuego.cantidadParesEncontrados + ' / ' + estadoJuego.totalParesDelNivel;
    document.getElementById('marcador-puntaje').textContent = String(estadoJuego.puntajeActual);
}

function iniciarTemporizador() {
    estadoJuego.temporizadorIniciado = true;
    estadoJuego.idIntervaloTemporizador = window.setInterval(tickTemporizador, 1000);
}

function tickTemporizador() {
    estadoJuego.segundosTranscurridos = estadoJuego.segundosTranscurridos + 1;
    actualizarPuntaje(-1);
    document.getElementById('marcador-tiempo').textContent = formatearTiempo(estadoJuego.segundosTranscurridos);
    document.getElementById('marcador-puntaje').textContent = String(estadoJuego.puntajeActual);
}

function detenerTemporizador() {
    window.clearInterval(estadoJuego.idIntervaloTemporizador);
    estadoJuego.idIntervaloTemporizador = null;
}

function formatearTiempo(segundosTotales) {
    var minutos = Math.floor(segundosTotales / 60);
    var segundosRestantes = segundosTotales % 60;
    var textoMinutos = minutos < 10 ? '0' + minutos : String(minutos);
    var textoSegundos = segundosRestantes < 10 ? '0' + segundosRestantes : String(segundosRestantes);
    return textoMinutos + ':' + textoSegundos;
}

function verificarFinDePartida() {
    if (estadoJuego.cantidadParesEncontrados === estadoJuego.totalParesDelNivel) {
        finalizarPartida();
    }
}

function finalizarPartida() {
    detenerTemporizador();
    actualizarPuntaje(300);
    actualizarMarcadorEnPantalla();
    reproducirSonidoVictoria();
    guardarResultadoEnRanking({
        nombreJugador: estadoJuego.nombreJugador,
        puntajeFinal: estadoJuego.puntajeActual,
        nivel: estadoJuego.nivelSeleccionado,
        cantidadIntentos: estadoJuego.cantidadIntentos,
        cantidadErrores: estadoJuego.cantidadErrores,
        duracionSegundos: estadoJuego.segundosTranscurridos,
        marcaTiempo: Date.now()
    });
    mostrarResumenFinal();
}

function mostrarResumenFinal() {
    var listaResumen = document.getElementById('resumen-final-lista');
    listaResumen.innerHTML = '';
    agregarFilaResumen(listaResumen, 'Jugador', estadoJuego.nombreJugador);
    agregarFilaResumen(listaResumen, 'Nivel', estadoJuego.nivelSeleccionado);
    agregarFilaResumen(listaResumen, 'Intentos', String(estadoJuego.cantidadIntentos));
    agregarFilaResumen(listaResumen, 'Errores', String(estadoJuego.cantidadErrores));
    agregarFilaResumen(listaResumen, 'Tiempo total', formatearTiempo(estadoJuego.segundosTranscurridos));
    agregarFilaResumen(listaResumen, 'Puntaje final', String(estadoJuego.puntajeActual));
    mostrarModal('modal-resumen-final');
}

function agregarFilaResumen(listaResumen, etiqueta, valor) {
    var filaResumen = document.createElement('p');
    filaResumen.textContent = etiqueta + ': ' + valor;
    listaResumen.appendChild(filaResumen);
}

function iniciarPartida(nombreJugador, nivelSeleccionado) {
    var configuracionNivel = obtenerConfiguracionNivel(nivelSeleccionado);

    estadoJuego.nombreJugador = nombreJugador;
    estadoJuego.nivelSeleccionado = nivelSeleccionado;
    estadoJuego.mazoCartas = generarMazoCartas(nivelSeleccionado);
    estadoJuego.indicePrimeraCarta = null;
    estadoJuego.indiceSegundaCarta = null;
    estadoJuego.tableroBloqueado = false;
    estadoJuego.cantidadIntentos = 0;
    estadoJuego.cantidadErrores = 0;
    estadoJuego.cantidadParesEncontrados = 0;
    estadoJuego.totalParesDelNivel = configuracionNivel.totalPares;
    estadoJuego.puntajeActual = 0;
    estadoJuego.rachaAciertosSeguidos = 0;
    estadoJuego.rachaErroresSeguidos = 0;
    estadoJuego.segundosTranscurridos = 0;
    estadoJuego.temporizadorIniciado = false;

    renderizarTablero();
    document.getElementById('marcador-tiempo').textContent = formatearTiempo(0);
    actualizarMarcadorEnPantalla();

    document.getElementById('pantalla-inicio').classList.add('oculto');
    document.getElementById('pantalla-juego').classList.remove('oculto');
    document.getElementById('nombre-jugador-actual').textContent = nombreJugador;
}

function reiniciarPartidaActual() {
    detenerTemporizador();
    ocultarModal('modal-resumen-final');
    iniciarPartida(estadoJuego.nombreJugador, estadoJuego.nivelSeleccionado);
}

function volverAPantallaInicio() {
    detenerTemporizador();
    ocultarModal('modal-resumen-final');
    document.getElementById('pantalla-juego').classList.add('oculto');
    document.getElementById('pantalla-inicio').classList.remove('oculto');
}
