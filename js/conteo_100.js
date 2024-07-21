import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Variables globales para las pruebas y puntajes
let currentTest = 1;
const totalTests = 5;
let score = 0;
let auth; // Declaramos variables globales para auth y db
let db;

// Respuestas correctas para cada prueba
const correctAnswers = [
    20,        // Prueba 1
    "10",      // Prueba 2
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Prueba 3
    { before: "29", after: "31" },  // Prueba 4
    [3, 4, 6]  // Prueba 5
];

// Inicializa la prueba 3 de selección de números
export function initNumberSelection() {
    let numberContainer = document.getElementById('number-buttons');
    correctAnswers[2].forEach(number => {
        let button = document.createElement('button');
        button.textContent = number;
        button.classList.add('number-button');
        button.onclick = function() {
            if (!button.classList.contains('clicked')) {
                button.classList.add('clicked');
                button.style.backgroundColor = 'green'; // Cambia el color al hacer clic
            }
        };
        numberContainer.appendChild(button);
    });
    shuffleButtons(numberContainer); // Mezcla visualmente los botones
}

// Función para mezclar visualmente los botones
export function shuffleButtons(container) {
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}

// Función para verificar la selección de números
export function checkSelection() {
    let selectedButtons = document.querySelectorAll('.number-button.clicked');
    if (selectedButtons.length === 10) {
        score += 20; // Incrementar puntaje si se seleccionan todos los números correctamente
        showResultsOrNextTest();
    }
    else{
        showResultsOrNextTest();
    }
}

// Función para actualizar el valor del deslizador en la prueba 1
export function updateSliderValue(displayElementId, sliderElementId) {
    let sliderValue = document.getElementById(sliderElementId).value;
    document.getElementById(displayElementId).textContent = sliderValue;
}

// Función para verificar la respuesta del deslizador en la prueba 1
export function checkSlider(testNumber) {
    let sliderValue = document.getElementById('slider1').value;
    if (parseInt(sliderValue) === correctAnswers[testNumber - 1]) {
        score += 20; // Incrementar puntaje si la respuesta es correcta
        showResultsOrNextTest();
    }
    else{
        showResultsOrNextTest();
    }
}

// Función para verificar la respuesta en la prueba 2
export function checkAnswer(testNumber) {
    let selectedAnswer = document.querySelector(`input[name="answer${testNumber}"]:checked`);
    if (selectedAnswer && selectedAnswer.value === correctAnswers[testNumber - 1]) {
        score += 20; // Incrementar puntaje si la respuesta es correcta
        showResultsOrNextTest();
    }
    else{
        showResultsOrNextTest();
    }
}

// Función para verificar las respuestas antes y después en la prueba 4
export function checkBeforeAfter(number, testNumber) {
    let beforeValue = document.getElementById('before30').value;
    let afterValue = document.getElementById('after30').value;
    if (beforeValue === correctAnswers[testNumber - 1].before && afterValue === correctAnswers[testNumber - 1].after) {
        score += 20; // Incrementar puntaje si ambas respuestas son correctas
        showResultsOrNextTest();
    }
    else{
        showResultsOrNextTest();
    }
}

// Función para verificar las respuestas de conteo de imágenes en la prueba 5
export function checkImageCounts() {
    let count1 = document.getElementById('count1').value;
    let count2 = document.getElementById('count2').value;
    let count3 = document.getElementById('count3').value;
    
    if (parseInt(count1) === correctAnswers[4][0] && parseInt(count2) === correctAnswers[4][1] && parseInt(count3) === correctAnswers[4][2]) {
        score += 20; // Incrementar puntaje si todas las respuestas son correctas
    }
    showResultsOrNextTest(); // Mostrar resultados o siguiente prueba
}

document.getElementById('checkImageCounts').addEventListener('click', checkImageCounts);

// Función para mostrar los resultados o la siguiente prueba
export function showResultsOrNextTest() {
    currentTest++;
    if (currentTest > totalTests) {
        showResults();
    } else {
        document.getElementById(`test${currentTest - 1}`).style.display = 'none';
        document.getElementById(`test${currentTest}`).style.display = 'block';
    }
}

// Función para mostrar los resultados finales
// Función para mostrar los resultados finales
export function showResults() {
    document.getElementById('tests-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    let resultsDiv = document.getElementById('test-results');
    resultsDiv.innerHTML = `<h2>Resultados de los niveles</h2>
                            <p>Puntaje final: ${score} puntos</p>
                            <p>¡Felicidades!</p>
                            <img src="../../img/felicidades.png" style="max-width: 100%;">`;
    saveScoreToDatabase(score);
}


// Función para guardar el puntaje en la base de datos
export function saveScoreToDatabase(score) {
    if (auth && db) { // Asegúrate de que auth y db están inicializados
        const userInfo = sessionStorage.getItem('user-info'); // Obtener el nombre de usuario del sessionStorage
        if (userInfo) {
            const user = JSON.parse(userInfo);
            const username = user.usuario;
            const scoresRef = ref(db, 'score4');
            push(scoresRef, {
                username: username,
                score: score,
            });
        } else {
            console.error('No username found in sessionStorage');
        }
    } else {
        console.error('Auth or Database not initialized');
    }
}


// Exportar las instancias para que puedan ser configuradas desde el archivo HTML
export function setFirebaseDependencies(firebaseAuth, firebaseDb) {
    auth = firebaseAuth;
    db = firebaseDb;
}
