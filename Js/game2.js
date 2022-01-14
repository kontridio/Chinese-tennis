const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');


let myImage = new Image();
myImage.src = '../Img/field.jpg';

let cinan = new Image();
cinan.src = '../Img/cinan.png';

let american = new Image();
american.src = '../Img/american.png';


let hit = new Audio();
let doit = new Audio();
let song1 = new Audio();
let song2 = new Audio();
let end = new Audio();


hit.src = "../Audio/Bamboo hit.mp3";
doit.src = "../Audio/DOIT.mp3";
song1.src = "../Audio/song1.mp3";
song2.src = "../Audio/song2.mp3";
end.src = "../Audio/ending-opening.mp3";


const user = {
    x: 10,
    y: canvas.height / 2 - 100 / 2,
    width: 50,
    height: 100,
    color: "WHITE",
    score: 0
}

const AI = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 100 / 2,
    width: 60,
    height: 100,
    color: "WHITE",
    score: 0
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

const gameover = {
    x: 0,
    y: canvas.height / 2 - 250 / 2,
    width: 1000,
    height: 250,
    color: "RED",
    text: "Game Over"
}

function drawImage(){
    ctx.drawImage(img,sX, sY, sW, sH);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    /*img = loadImage('Img/ricefield.jpg'); */
}


function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}


function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

function render() {

    ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    /*drawRect(0, 0, canvas.width, canvas.height, myImage);*/

    drawNet();

    drawText(user.score, canvas.width / 4, canvas.height / 8, "WHITE");
    drawText(AI.score, 3 * canvas.width / 4, canvas.height / 8, "WHITE");

    ctx.drawImage(cinan, user.x, user.y, user.width, user.height);
    ctx.drawImage(american, AI.x - AI.width, AI.y, AI.width, AI.height);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    if (user.score == 15 || AI.score == 15) {
        console.log("Game Over");
        end.play();
        /*window.location.href = "../gamover.html";*/
        ball.velocityX = 0;
        ball.velocityY = 0;
        drawRect(gameover.x, gameover.y, gameover.width, gameover.height, gameover.color);
        drawText(gameover.text, (canvas.width - 200) / 2, canvas.height / 2, "WHITE");
    }
}


let moveBy = 10;
const keys = [];
setInterval(move, 35);


window.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
    delete keys[e.keyCode];
});

function move() {
    if (keys[38] && user.y > 10) {
        console.log("nahoru");
        user.y -= moveBy;
    }
    if (keys[40] && user.y > 0) {
        console.log("dolu");
        user.y += moveBy;
    }
    user.y = Math.max(Math.min(user.y, canvas.height - user.height), 0);
}

function songwin1() {
    if (user.score == 5) song1.play();
}

function songwin2() {
    if (user.score == 10) song2.play();
}


// Detekce kolize (když míček narazí do "hráče")
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.speed = 5;
    ball.velocityX = - ball.velocityX;
}

function update() {
    // rychlost míčku
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // funkce počítače
    let computerLevel = 0.1;
    AI.y += (ball.y - (AI.y + AI.height / 2)) * computerLevel;

    // pokdu se míček dotkne vrchni nebo dolní strany, obrátíme rychlost v ose Y
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 10) {
        ball.velocityY = - ball.velocityY;
    }

    // zjistíme, jestli míček zasáhl hráče nebo počítač
    let player = (ball.x < canvas.width / 2) ? user : AI;

    if (collision(ball, player)) {
        hit.play();
        // zjistíme, kde dopadl míček na raketu
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        // Podle toho, kde dopadne míček na "raketu", se změní jeho úhel odrazu o 45, 0, -45 stupňů
        let angleRad = collidePoint * Math.PI / 4;

        // změna ryhlosti v X a Y
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Po každém odbití se míček zrychlí
        ball.speed += 1;
    }

    // Pokud se míček nedotkne hráče přičte se bod buď hráči, nebo počítači
    if (ball.x - ball.radius < 0) {
        AI.score++;
        doit.play();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        songwin1();
        songwin2();
        resetBall();
    }

}

function game() {
    update();
    render();
}

const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
