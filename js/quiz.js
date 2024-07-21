import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
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

document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "2+2",
            answers: [
                { text: 3, correct: false },
                { text: 4, correct: true },
                { text: 5, correct: false },
                { text: 6, correct: false }
            ]
        },
        {
            question: "4+2",
            answers: [
                { text: 7, correct: false },
                { text: 9, correct: false },
                { text: 8, correct: false },
                { text: 6, correct: true }
            ]
        },
        {
            question: "7+3",
            answers: [
                { text: 10, correct: true },
                { text: 11, correct: false },
                { text: 13, correct: false },
                { text: 14, correct: false }
            ]
        },
        {
            question: "2+5",
            answers: [
                { text: 12, correct: false },
                { text: 7, correct: true },
                { text: 9, correct: false },
                { text: 15, correct: false }
            ]
        },
        {
            question: "9+0",
            answers: [
                { text: 9, correct: true },
                { text: 10, correct: false },
                { text: 11, correct: false },
                { text: 12, correct: false }
            ]
        }
    ];

    const questionElement = document.getElementById("question");
    const answerbtn = document.getElementById("answer-btn");
    const nextbtn = document.getElementById("next-btn");

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextbtn.innerHTML = "Siguiente";
        showQuestion();
    }

    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
        questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            button.classList.add("btn");
            answerbtn.appendChild(button);
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click", selectAnswer);
        });
    }

    function resetState() {
        nextbtn.style.display = "none";
        while (answerbtn.firstChild) {
            answerbtn.removeChild(answerbtn.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectBtn = e.target;
        const isCorrect = selectBtn.dataset.correct === "true";
        if (isCorrect) {
            selectBtn.classList.add("correct");
            score += 20; // Suma 20 puntos por cada respuesta correcta
        } else {
            selectBtn.classList.add("incorrect");
        }
        Array.from(answerbtn.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        nextbtn.style.display = "block";
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    function showScore() {
        resetState();
        questionElement.innerHTML = `¡Resultados de los niveles ${score / 20} de ${questions.length}! Puntaje: ${score}`;
        nextbtn.innerHTML = "Jugar de nuevo";
        nextbtn.style.display = "block";

        // Save the score and username to the database
        const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
        const username = userInfo ? userInfo.usuario : "Anónimo";

        onAuthStateChanged(auth, user => {
            if (user) {
                const scoreRef = ref(database, 'score3/' + user.uid);
                set(scoreRef, {
                    username: username,
                    score: score
                }).catch(error => {
                    console.error("Error al guardar el puntaje:", error);
                });
            }
        });
    }

    nextbtn.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            startQuiz();
        }
    });

    startQuiz();
});
