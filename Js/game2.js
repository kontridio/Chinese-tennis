const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');


let myImage = new Image();
myImage.src = '../Img/field.jpg';

let cinan = new Image();
cinan.src = '../Img/cinan.png';

let american = new Image();
american.src = '../Img/american.png';


let theme = new Audio();
let hit = new Audio();
let doit = new Audio();
let song1 = new Audio();
let song2 = new Audio();
let end = new Audio();
let winsong = new Audio();


theme.src = "../Audio/theme.mp3";
hit.src = "../Audio/Bamboo hit.mp3";
doit.src = "../Audio/DOIT.mp3";
song1.src = "../Audio/song1.mp3";
song2.src = "../Audio/song2.mp3";
end.src = "../Audio/ending-opening.mp3";
winsong.src = "../Audio/win.mp3";


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

const win = {
    x: 0,
    y: canvas.height / 2 - 300 / 2,
    width: 1000,
    height: 250,
    color: "GREEN",
    text: "Win"
}

const repeat = {
    x: 0,
    y: canvas.height / 2,
    text: "If you want to try again, press F5 :D"
}

function drawImage() {
    ctx.drawImage(img, sX, sY, sW, sH);
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
    ctx.font = "55px fantasy";
    ctx.fillText(text, x, y);
}

function drawRepeat(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "20px arial";
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

    if (AI.score == 11) {
        console.log("Game Over");
        end.play();
        /*window.location.href = "../gamover.html";*/
        ball.velocityX = 0;
        ball.velocityY = 0;
        drawRect(gameover.x, gameover.y, gameover.width, gameover.height, gameover.color);
        drawText(gameover.text, (canvas.width - 250) / 2, canvas.height / 2, "WHITE");
        drawRepeat(repeat.text, (canvas.width -290) / 2, (canvas.height + 100) / 2, "WHITE");
    } else if(user.score == 11){
        console.log("Win");
        winsong.play();
        /*window.location.href = "../gamover.html";*/
        ball.velocityX = 0;
        ball.velocityY = 0;
        drawRect(win.x, win.y, win.width, win.height, win.color);
        drawText(win.text, (canvas.width - 90) / 2, canvas.height / 2, "WHITE");
        drawRepeat(repeat.text, (canvas.width -290) / 2, (canvas.height + 100) / 2, "WHITE");
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


// Detekce kolize (kdy?? m????ek naraz?? do "hr????e")
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
    theme.play();
    // rychlost m????ku
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // funkce po????ta??e
    let computerLevel = 0.1;
    AI.y += (ball.y - (AI.y + AI.height / 2)) * computerLevel;

    // pokdu se m????ek dotkne vrchni nebo doln?? strany, obr??t??me rychlost v ose Y
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 10) {
        ball.velocityY = - ball.velocityY;
    }

    // zjist??me, jestli m????ek zas??hl hr????e nebo po????ta??
    let player = (ball.x < canvas.width / 2) ? user : AI;

    if (collision(ball, player)) {
        hit.play();
        // zjist??me, kde dopadl m????ek na raketu
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        // Podle toho, kde dopadne m????ek na "raketu", se zm??n?? jeho ??hel odrazu o 45, 0, -45 stup????
        let angleRad = collidePoint * Math.PI / 4;

        // zm??na ryhlosti v X a Y
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Po ka??d??m odbit?? se m????ek zrychl??
        ball.speed += 1;
    }

    // Pokud se m????ek nedotkne hr????e p??i??te se bod bu?? hr????i, nebo po????ta??i
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
