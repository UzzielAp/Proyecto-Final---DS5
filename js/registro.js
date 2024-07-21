// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); // Pass app here
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', (event) => {
    let usuario = document.getElementById('usuario');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let MainForm = document.getElementById('MainForm');

    if (MainForm) {
        MainForm.addEventListener('submit', function(evt) {
            evt.preventDefault();

            createUserWithEmailAndPassword(auth, email.value, password.value)
                .then((credentials) => {
                    console.log("User created successfully with payload-", credentials);
                    
                    set(ref(db, 'usuario/' + credentials.user.uid), {
                        usuario: usuario.value,
                        email: email.value,
                        password: password.value
                    })
                    .then(() => {
                        console.log("Data saved successfully to the database.");
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('Error al guardar los datos del usuario:', error);
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    console.error("Error during registration:", error);

                    if (errorCode === 'auth/email-already-in-use')
                        alert('El correo ya está en uso');
                    else if (errorCode === 'auth/invalid-email')
                        alert('El correo no es válido');
                    else if (errorCode === 'auth/weak-password')
                        alert('La contraseña debe tener al menos 6 caracteres');
                    else
                        console.error("Error durante el registro:", error);
                });
        });
    } else {
        console.error('MainForm no encontrado');
    }
});
