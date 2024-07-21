import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Variables globales para las pruebas y puntajes
let currentTest = 1;
const totalTests = 5;
let score = 0;
let username = '';

// Respuestas correctas para cada prueba
const correctAnswers = [
    [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    [21, 23, 25, 27, 29],
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    { 22: "par", 15: "impar", 8: "par", 17: "impar" },
    [3, 5]
];

// Inicializa la aplicación y obtiene el nombre de usuario
document.addEventListener('DOMContentLoaded', (event) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            username = user.displayName || 'Usuario';
            document.getElementById('username').textContent = username;
            initEvenNumberSelection();
            initParImparQuestions();
        } else {
            window.location.href = "../login.html"; // Redirige al inicio de sesión si no está autenticado
        }
    });
});

window.checkEvenNumbers = function checkEvenNumbers() {
    let userAnswer = document.getElementById('evenNumbers').value.split(',').map(Number);
    let correctAnswer = correctAnswers[0];

    if (arraysEqual(userAnswer, correctAnswer)) {
        score += 20;
    }

    showResultsOrNextTest();
};

window.checkOddNumbers = function checkOddNumbers() {
    let userAnswer = document.getElementById('oddNumbers').value.split(',').map(Number);
    let correctAnswer = correctAnswers[1];

    if (arraysEqual(userAnswer, correctAnswer)) {
        score += 20;
    }

    showResultsOrNextTest();
};

function initEvenNumberSelection() {
    let numberContainer = document.getElementById('even-buttons');
    correctAnswers[2].forEach(number => {
        let button = document.createElement('button');
        button.textContent = number;
        button.classList.add('number-button');
        button.onclick = function() {
            if (!button.classList.contains('clicked')) {
                button.classList.add('clicked');
                button.style.backgroundColor = 'green';
            } else {
                button.classList.remove('clicked');
                button.style.backgroundColor = '';
            }
        };
        numberContainer.appendChild(button);
    });
    shuffleButtons(numberContainer);
}

function shuffleButtons(container) {
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}

window.checkEvenSelection = function checkEvenSelection() {
    let selectedButtons = document.querySelectorAll('.number-button.clicked');
    let selectedNumbers = Array.from(selectedButtons).map(button => parseInt(button.textContent));
    let correctAnswer = correctAnswers[2];

    selectedNumbers.sort((a, b) => a - b);

    if (arraysEqual(selectedNumbers, correctAnswer)) {
        score += 20;
    }

    showResultsOrNextTest();
};

function initParImparQuestions() {
    let questionsContainer = document.getElementById('par-impar-questions');
    Object.keys(correctAnswers[3]).forEach(number => {
        let questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        let questionText = document.createElement('p');
        questionText.textContent = `¿${number} es par o impar?`;
        questionDiv.appendChild(questionText);

        let select = document.createElement('select');
        let optionPar = document.createElement('option');
        optionPar.value = 'par';
        optionPar.textContent = 'Par';
        let optionImpar = document.createElement('option');
        optionImpar.value = 'impar';
        optionImpar.textContent = 'Impar';

        select.appendChild(optionPar);
        select.appendChild(optionImpar);
        questionDiv.appendChild(select);

        questionsContainer.appendChild(questionDiv);
    });
}

window.checkParImpar = function checkParImpar() {
    let questionDivs = document.querySelectorAll('.question');
    let correctAnswer = correctAnswers[3];
    let isCorrect = true;

    questionDivs.forEach((div, index) => {
        let number = Object.keys(correctAnswer)[index];
        let userAnswer = div.querySelector('select').value;

        if (userAnswer !== correctAnswer[number]) {
            isCorrect = false;
        }
    });

    if (isCorrect) {
        score += 20;
    }

    showResultsOrNextTest();
};

window.selectImage = function selectImage(image) {
    if (!image.classList.contains('selected')) {
        image.classList.add('selected');
        image.style.border = '2px solid green';
    } else {
        image.classList.remove('selected');
        image.style.border = 'none';
    }
};

window.checkOddImages = function checkOddImages() {
    let selectedImages = document.querySelectorAll('.count-image.selected');
    let selectedNumbers = Array.from(selectedImages).map(image => parseInt(image.alt));
    let correctAnswer = correctAnswers[4];

    if (arraysEqual(selectedNumbers, correctAnswer)) {
        score += 20;
    }

    showResultsOrNextTest();
};

function showResultsOrNextTest() {
    if (currentTest < totalTests) {
        document.getElementById(`test${currentTest}`).style.display = 'none';
        currentTest++;
        document.getElementById(`test${currentTest}`).style.display = 'block';
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('tests-container').style.display = 'none';
    let resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'block';

    let resultsDiv = document.getElementById('test-results');
    resultsDiv.innerHTML = `<h2>Resultados de los niveles</h2>
                            <p>Puntaje final: ${score} puntos</p>
                            <p>¡Felicidades!</p>
                            <img src="../../img/felicidades.png" style="max-width: 100%;">`;

    console.log(`Puntaje final: ${score} puntos`);

    saveScoreToDatabase();
}

function saveScoreToDatabase() {
    const user = auth.currentUser;
    if (user) {
        const storedUsername = sessionStorage.getItem("user-info") ? JSON.parse(sessionStorage.getItem("user-info")).usuario : 'Usuario';
        set(ref(db, 'score5/' + user.uid), {
            score: score,
            username: storedUsername
        }).then(() => {
            console.log('Puntaje guardado exitosamente en Firebase.');
        }).catch((error) => {
            console.error('Error al guardar el puntaje en Firebase: ', error);
        });
    } else {
        console.error('Usuario no autenticado. No se puede guardar el puntaje.');
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
