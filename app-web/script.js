let score = 0;
let time = 30;
let record = 0;
let combo = 0;

let gameRunnig = false;
let timer;
let bombaAtivada = false;

const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const recordElement = document.getElementById("record");

const startButton = document.getElementById("startButton");

const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const bomba = document.getElementById("bomba")
const message = document.getElementById("message");
const messageCombo = document.getElementById("combo")

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
    chooseTarget();
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


function virarBomba() {
    target.classList.add("bomba");
    bombaAtivada = true;
    moveTarget();

    setTimeout(chooseTarget, 800);
}

function voltarAoNormal() {
    target.classList.remove("bomba");
    bombaAtivada = false;
    moveTarget();
}

function chooseTarget() {
    const sorteio = Math.random();

    if (sorteio < 0.2) {
        virarBomba();
    } else {         
        voltarAoNormal();   
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
        if (bombaAtivada) {
            score -= 15;
            combo = 0 ;
        
            scoreElement.textContent = score;  
        
            chooseTarget();
        } else {      
            combo++;
        
            const multiplicador = 1 + Math.floor(combo / 5);

            score += multiplicador
            scoreElement.textContent = score;
            messageCombo.textContent = "Combo X" + multiplicador;

            messageCombo.classList.remove('pular');
            void messageCombo.offsetWidth; // truque pra "resetar" a animação
            messageCombo.classList.add('pular');

            chooseTarget();
        } 
    }
});

// Clique na área do jogo (erro)
gameArea.addEventListener("click", function () {
    if (gameRunnig) {
        // Diminui 1 ponto, garantindo que não fique abaixo de 0
        combo = 0;
        score = score - 1
        scoreElement.textContent = score;
        messageCombo.textContent= ''

        const maxX = gameArea.clientWidth - target.clientWidth;
        const maxY = gameArea.clientHeight - target.clientHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        target.style.left = randomX + "px";
        target.style.top = randomY + "px";
    }
});