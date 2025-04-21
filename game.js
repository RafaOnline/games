const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: canvas.width / 2, y: canvas.height - 50, width: 30, height: 30, speed: 5 };
let bullets = [];
let zombies = [];
let score = 0;
let gameOver = false;

function spawnZombie() {
    const x = Math.random() * (canvas.width - 30);
    zombies.push({ x: x, y: 0, width: 30, height: 30, speed: 2 });
}

function update() {
    if (gameOver) return;

    // Mover zumbis
    zombies.forEach((zombie, index) => {
        zombie.y += zombie.speed;
        if (zombie.y > canvas.height) {
            zombies.splice(index, 1);
        }
        // Verificar colisão com o jogador
        if (zombie.x < player.x + player.width &&
            zombie.x + zombie.width > player.x &&
            zombie.y < player.y + player.height &&
            zombie.y + zombie.height > player.y) {
            gameOver = true;
        }
    });

    // Mover balas
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
        // Verificar colisão com zumbis
        zombies.forEach((zombie, zIndex) => {
            if (bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y) {
                bullets.splice(index, 1);
                zombies.splice(zIndex, 1);
                score++;
            }
        });
    });

    // Atualizar a tela
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar jogador
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Desenhar balas
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Desenhar zumbis
    ctx.fillStyle = 'green';
    zombies.forEach(zombie => {
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    });

    // Mostrar pontuação
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, 20);

    // Mostrar Game Over
    if (gameOver) {
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
    }
}

function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 5, height: 10, speed: 5 });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (event.key === ' ') {
        shoot();
    }
});

function gameLoop() {
    if (!gameOver) {
        update();
        requestAnimationFrame(gameLoop);
    }
}

setInterval(spawnZombie, 1000);
gameLoop();
