import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBfFyy_bc3-cN15uNtOtqrtTtX72nvIA-w",
    authDomain: "des5-547e9.firebaseapp.com",
    databaseURL: "https://des5-547e9-default-rtdb.firebaseio.com",
    projectId: "des5-547e9",
    storageBucket: "des5-547e9.appspot.com",
    messagingSenderId: "427136347004",
    appId: "1:427136347004:web:98d88295fcebe8deb192f9",
    measurementId: "G-SXRPVQHQHY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const imagenes = [
    '../../img/frutas_img/2manzanas.jpg',
    '../../img/frutas_img/3bananas.jpg',
    '../../img/frutas_img/7peras.png',
    '../../img/frutas_img/3fresas.png',
    '../../img/frutas_img/2limon.png',
];

const preguntas = [
    "¿Cuántas manzanas hay?",
    "¿Cuántas bananas hay?",
    "¿Cuántas peras hay?",
    "¿Cuántas fresas hay?",
    "¿Cuántos limones hay?"
];

let nivelesCompletados = 0;
let imagenesUsadas = [];
let puntaje = 0;

function cargarNuevaImagen() {
    if (imagenesUsadas.length === imagenes.length) {
        alert("Has completado todos los niveles. ¡Bien hecho!");
        window.location.href = '../puntos/puntos_frutasdif.html';
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * imagenes.length);
    } while (imagenesUsadas.includes(randomIndex));

    imagenesUsadas.push(randomIndex);

    const imgElement = document.getElementById('imagen');
    const preguntaElement = document.getElementById('pregunta');
    const botonOpcion1 = document.getElementById('opcion1');
    const botonOpcion2 = document.getElementById('opcion2');
    const botonOpcion3 = document.getElementById('opcion3');
    const puntajeElement = document.getElementById('puntaje');

    imgElement.src = imagenes[randomIndex];
    preguntaElement.textContent = preguntas[randomIndex];

    let opciones = generarOpciones(randomIndex);
    botonOpcion1.querySelector('span').textContent = opciones[0];
    botonOpcion2.querySelector('span').textContent = opciones[1];
    botonOpcion3.querySelector('span').textContent = opciones[2];

    puntajeElement.textContent = `Puntaje: ${puntaje}`;
}

function generarOpciones(index) {
    let opciones = [];
    switch (index) {
        case 0:
            opciones = ['2', '3', '7'];
            break;
        case 1:
            opciones = ['2', '3', '7'];
            break;
        case 2:
            opciones = ['2', '3', '7'];
            break;
        case 3:
            opciones = ['2', '3', '7'];
            break;
        case 4:
            opciones = ['2', '3', '7'];
            break;
        default:
            break;
    }
    return opciones;
}

window.onload = function() {
    cargarNuevaImagen();
};

document.getElementById('opcion1').addEventListener('click', () => {
    verificarRespuesta(document.getElementById('opcion1'));
});

document.getElementById('opcion2').addEventListener('click', () => {
    verificarRespuesta(document.getElementById('opcion2'));
});

document.getElementById('opcion3').addEventListener('click', () => {
    verificarRespuesta(document.getElementById('opcion3'));
});

function verificarRespuesta(boton) {
    const respuestaSeleccionada = boton.querySelector('span').textContent;
    const respuestaCorrecta = obtenerRespuestaCorrecta();

    if (respuestaSeleccionada === respuestaCorrecta) {
        puntaje += 100;
        alert("¡Respuesta correcta! Ganaste 100 puntos.");
    } else {
        puntaje = Math.max(0, puntaje - 100);
        alert("Respuesta incorrecta. Perdiste 100 puntos. La respuesta correcta es: " + respuestaCorrecta);
    }

    document.getElementById('puntaje').textContent = `Puntaje: ${puntaje}`;
    nivelesCompletados++;

    onAuthStateChanged(auth, user => {
        if (user) {
            const userInfo = JSON.parse(sessionStorage.getItem('user-info')); // Retrieve the username from session storage
            const username = userInfo.usuario;
            set(ref(database, 'score2/' + username), {
                username: username,
                score: puntaje
            });
        }
    });

    cargarNuevaImagen();
}

function obtenerRespuestaCorrecta() {
    const index = imagenesUsadas[imagenesUsadas.length - 1];
    switch (index) {
        case 0: return '2';
        case 1: return '3';
        case 2: return '7';
        case 3: return '3';
        case 4: return '2';
        default: return '';
    }
}
