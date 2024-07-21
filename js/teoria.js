document.addEventListener('DOMContentLoaded', () => {
    const messages = [
        { text: "Buen día, hoy aprenderemos matemáticas.", from: "teacher", audio: "../audios/audio1.mp3" },
        { text: "¡Genial! ¿Qué vamos a aprender?", from: "student", audio: "../audios/audio2.mp3" },
        { text: "Vamos a aprender sobre la suma.", from: "teacher", audio: "../audios/audio3.mp3" },
        { text: "¿Qué es la suma?", from: "student", audio: "../audios/audio4.mp3" },
        { text: "La suma es una operación matemática para encontrar la cantidad total cuando combinamos dos o más grupos de objetos.", from: "teacher", audio: "../audios/audio5.mp3" },
        { text: "Genial, me gustaría aprender más.", from: "student", audio: "../audios/audio6.mp3" },
        { text: "Aprenderemos más leyendo la teoría.", from: "teacher", audio: "../audios/audio7.mp3" },
        { text: "También quisiera hacer algo más que leer.", from: "student", audio: "../audios/audio8.mp3" },
        { text: "También podemos aprender jugando, ¡vamos!", from: "teacher", audio: "../audios/audio9.mp3" },
        { text: "Sí, vamos.", from: "student", audio: "../audios/audio10.mp3" }
    ];

    let currentMessageIndex = 0;

    const chatBox = document.getElementById('chat-box');
    const continuarBtn = document.getElementById('continuar-btn');

    const displayMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', message.from);

        const imgElement = document.createElement('img');
        imgElement.src = message.from === 'teacher' ? '../img/personaje1.webp' : '../img/personaje2.webp';
        messageElement.appendChild(imgElement);

        const textElement = document.createElement('p');
        textElement.textContent = message.text;
        messageElement.appendChild(textElement);

        const audioButton = document.createElement('button');
        audioButton.classList.add('audio-btn');
        audioButton.innerHTML = `<img src="../img/audio.png" alt="Audio">`;
        audioButton.addEventListener('click', () => {
            const audio = new Audio(message.audio);
            audio.play();
        });
        messageElement.appendChild(audioButton);

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Desplaza hacia abajo para mostrar el último mensaje
    };

    continuarBtn.addEventListener('click', () => {
        if (currentMessageIndex < messages.length) {
            displayMessage(messages[currentMessageIndex]);
            currentMessageIndex++;
        } else {
            currentMessageIndex = 0; // Reinicia el índice de mensajes
            chatBox.innerHTML = ''; // Limpia el chatbox
            displayMessage(messages[currentMessageIndex]);
            currentMessageIndex++;
        }
    });

    // Muestra el primer mensaje al cargar la página
    displayMessage(messages[currentMessageIndex]);
    currentMessageIndex++;
});