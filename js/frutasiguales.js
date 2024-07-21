import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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

let userId;
let userName;

onAuthStateChanged(auth, user => {
    if (user) {
        userId = user.uid;
        const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
        userName = userInfo ? userInfo.usuario : "Anónimo"; // Obtener el nombre del usuario si está disponible
        cargarPuntaje();
    } else {
        // Redirigir al usuario al login si no está autenticado
        window.location.href = '../index.html';
    }
});

const imagenes = [
    '../../img/frutas_img/manzana2.png', // imagen 1 
    '../../img/frutas_img/manzana3.png', // imagen 2 
    '../../img/frutas_img/manzana4.png',   // imagen 3 
    '../../img/frutas_img/manzana5.png',  // imagen 4 
    '../../img/frutas_img/manzana6.png',   // imagen 5 
];

const preguntas = [
    "¿Cuántas manzanas hay?", // pregunta para imagen 1
    "¿Cuántas manzanas hay?", // pregunta para imagen 2
    "¿Cuántas manzanas hay?",    // pregunta para imagen 3
    "¿Cuántas manzanas hay?",   // pregunta para imagen 4
    "¿Cuántos manzanas hay?"   // pregunta para imagen 5
];

const respuestasCorrectas = [
    '2', // Respuesta correcta para imagen 1
    '3', // Respuesta correcta para imagen 2
    '4', // Respuesta correcta para imagen 3
    '5', // Respuesta correcta para imagen 4
    '6'  // Respuesta correcta para imagen 5
];

let nivelesCompletados = 0;
let imagenesUsadas = [];
let puntaje = 0;

function cargarPuntaje() {
    const userRef = ref(database, 'users/' + userId);
    get(userRef).then(snapshot => {
        if (snapshot.exists()) {
            puntaje = snapshot.val().puntaje || 0;
            document.getElementById("puntaje").innerText = "Puntaje: " + puntaje;
        }
    }).catch(error => {
        console.error("Error al cargar el puntaje:", error);
    });
}

function cargarNuevaImagen() {
    // Verificar si se han mostrado todas las imágenes
    if (imagenesUsadas.length === imagenes.length) {
        alert("¡Has completado todas las imágenes!");
        window.location.href = '../puntos/puntos_frutasiguales.html'; // Redirigir a la página de puntajes
        return;
    }

    // Seleccionar una imagen que no haya sido usada
    let indice;
    do {
        indice = Math.floor(Math.random() * imagenes.length);
    } while (imagenesUsadas.includes(indice));

    const imagen = imagenes[indice];
    const pregunta = preguntas[indice];

    imagenesUsadas.push(indice);

    // Mostrar la imagen y la pregunta
    document.getElementById("imagen").src = imagen;
    document.getElementById("pregunta").innerText = pregunta;
}

// Llamar a la función para cargar la primera imagen
cargarNuevaImagen();

document.getElementById("enviar").addEventListener("click", function () {
    const respuestaUsuario = document.getElementById("respuesta").value.trim();
    verificarRespuesta(respuestaUsuario);
});

function verificarRespuesta(respuesta) {
    const respuestaCorrecta = obtenerRespuestaCorrecta(); // Obtener la respuesta correcta según la imagen actual

    if (respuesta === respuestaCorrecta) {
        puntaje += 100; // Sumar 100 puntos si la respuesta es correcta
        alert("¡Respuesta correcta! Ganaste 100 puntos.");
    } else {
        puntaje = Math.max(0, puntaje - 100); // Restar 100 puntos si la respuesta es incorrecta, asegurando que el puntaje no sea negativo
        alert(`Respuesta incorrecta. Perdiste 100 puntos. La respuesta correcta es: ${respuestaCorrecta}`);
    }

    // Mostrar el puntaje actualizado
    document.getElementById("puntaje").textContent = `Puntaje: ${puntaje}`;

    // Incrementar niveles completados
    nivelesCompletados++;

    // Cargar una nueva imagen después de verificar la respuesta
    cargarNuevaImagen();

    // Guardar el puntaje en la base de datos
    if (userId) {
        update(ref(database, 'users/' + userId), {
            puntaje: puntaje,
            nombre: userName
        });
    }

    // Limpiar el campo de respuesta
    document.getElementById("respuesta").value = "";
}

function obtenerRespuestaCorrecta() {
    // Obtener el índice de la última imagen usada (que corresponde al último nivel completado)
    const index = imagenesUsadas[imagenesUsadas.length - 1];
    // Retornar la respuesta correcta correspondiente al índice
    return respuestasCorrectas[index];
}

