import { db } from './firebase.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

function cargarPuntos() {
    const puntosListElement = document.getElementById('puntos-list');
    const puntuacionesRef = ref(db, 'puntuaciones/');

    get(puntuacionesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (const key in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `Usuario: ${key}, Puntaje: ${data[key].puntaje}`;
                puntosListElement.appendChild(listItem);
            }
        } else {
            puntosListElement.textContent = "No hay puntos registrados.";
        }
    }).catch((error) => {
        console.error(error);
        puntosListElement.textContent = "Error al cargar los puntos.";
    });
}

// Cargar los puntos cuando se carga la página
window.onload = function() {
    cargarPuntos();
};