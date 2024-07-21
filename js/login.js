import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";

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
const db = getDatabase(app);
const auth = getAuth(app);
const dbref = ref(db);

document.addEventListener('DOMContentLoaded', (event) => {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let MainForm = document.getElementById('MainForm');

    if (MainForm) {
        MainForm.addEventListener('submit', function(evt) {
            evt.preventDefault();
            
            signInWithEmailAndPassword(auth, email.value, password.value)
                .then((credentials) => {
                    get(child(dbref, 'usuario/' + credentials.user.uid)).then((snapshot) => {
                        if (snapshot.exists()) {
                            sessionStorage.setItem("user-info", JSON.stringify({
                                usuario: snapshot.val().usuario
                            }));
                            sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
                            window.location.href = '../pages/main.html';
                        } else {
                            alert('No se encontraron datos de usuario');
                        }
                    }).catch((error) => {
                        console.error('Error al obtener datos del usuario:', error);
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-email')
                        alert('El correo no es válido');
                    else if (errorCode === 'auth/user-disabled')
                        alert('El usuario ha sido deshabilitado');
                    else if (errorCode === 'auth/user-not-found')
                        alert('El usuario no existe');
                    else if (errorCode === 'auth/wrong-password')
                        alert('Contraseña incorrecta');
                    else
                        console.error('Error al iniciar sesión:', error);
                });
        });
    } else {
        console.error('MainForm no encontrado');
    }
});
