import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
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

function cargarLeaderboard() {
    const usersRef = ref(database, 'users');
    get(usersRef).then(snapshot => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            const leaderboard = Object.values(users).sort((a, b) => b.puntaje - a.puntaje);

            const tableBody = document.querySelector("#leaderboard tbody");
            tableBody.innerHTML = ''; // Limpiar la tabla

            leaderboard.forEach(user => {
                const row = document.createElement("tr");
                const nameCell = document.createElement("td");
                const scoreCell = document.createElement("td");

                nameCell.innerText = user.nombre || "Anónimo";
                scoreCell.innerText = user.puntaje;

                row.appendChild(nameCell);
                row.appendChild(scoreCell);
                tableBody.appendChild(row);
            });
        }
    }).catch(error => {
        console.error("Error al cargar el leaderboard:", error);
    });
}

onAuthStateChanged(auth, user => {
    if (user) {
        cargarLeaderboard(); // Cargar el leaderboard si el usuario está autenticado
    } else {
        // Redirigir al usuario al login si no está autenticado
        window.location.href = '../index.html';
    }
});
