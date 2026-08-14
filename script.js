let score = 0;
let time = 30;
let record = 0;

let gameRunnig = false;
let timer;

const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const recordElement = document.getElementById("record");

const startButton = document.getElementById("startButton");

const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const message = document.getElementById("message");

record = Number(localStorage.getItem("record")) || 0;
recordElement.textContent = record;

// Adiciona velocidade/transição suave na bolinha
target.style.transition = "all 0.15s ease";

startButton.addEventListener("click", startGame);

function startGame () {
    score = 0;
    time = 30;
    gameRunnig = true;
    scoreElement.textContent = score;
    timeElement.textContent = time;
    target.style.display = "block";
    message.style.display = "none";
    startButton.textContent = "Reiniciar";
    moveTarget();
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    time--;
    timeElement.textContent = time;
    
    if (time <= 0) {
        clearInterval(timer);
        gameRunnig = false;

        target.style.display = "none";
        message.style.display = "flex";
        message.textContent = "Fim de Jogo! Pontuação : " + score;

        startButton.textContent = "Jogar novamente";

        if (score > record) {
            record = score;
            recordElement.textContent = record;
            localStorage.setItem("record", record);
        }
    }
}

function moveTarget() {
    const maxX = gameArea.clientWidth - target.clientWidth;
    const maxY = gameArea.clientHeight - target.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
}

// Clique na bolinha (acerto)
target.addEventListener("click", function (event) {
    // Evita que o clique na bolinha também conte como erro na gameArea
    event.stopPropagation(); 

    if (gameRunnig) {
        score++;
        scoreElement.textContent = score;
        moveTarget();
    }
});

// Clique na área do jogo (erro)
gameArea.addEventListener("click", function () {
    if (gameRunnig) {
        // Diminui 1 ponto, garantindo que não fique abaixo de 0
        score = score - 1
        scoreElement.textContent = score;

        const maxX = gameArea.clientWidth - target.clientWidth;
        const maxY = gameArea.clientHeight - target.clientHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        target.style.left = randomX + "px";
        target.style.top = randomY + "px";
    }
});