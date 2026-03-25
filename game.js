// pixelArtGame.js

// Simple pixel art exploration game logic

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let player = { x: 50, y: 50, width: 32, height: 32, speed: 5 };
let keys = {};

const objects = [
    { x: 200, y: 200, width: 32, height: 32 }, // Example interactive object
];

function handleInput() {
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
}

function checkCollision() {
    objects.forEach(obj => {
        if (player.x < obj.x + obj.width &&
            player.x + player.width > obj.x &&
            player.y < obj.y + obj.height &&
            player.y + player.height > obj.y) {
            console.log('Collision with object!');
            // Handle collision
        }
    });
}

function update() {
    handleInput();
    checkCollision();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'blue'; // Player color
    context.fillRect(player.x, player.y, player.width, player.height);

    objects.forEach(obj => {
        context.fillStyle = 'red'; // Object color
        context.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

gameLoop();