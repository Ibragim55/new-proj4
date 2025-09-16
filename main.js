const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12;
const paddleHeight = 100;
const ballSize = 14;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Left paddle (player)
const leftPaddle = {
    x: 10,
    y: canvasHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#4CAF50'
};

// Right paddle (AI)
const rightPaddle = {
    x: canvasWidth - paddleWidth - 10,
    y: canvasHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#F44336',
    speed: 4
};

// Ball
const ball = {
    x: canvasWidth / 2 - ballSize / 2,
    y: canvasHeight / 2 - ballSize / 2,
    width: ballSize,
    height: ballSize,
    color: '#fff',
    speed: 5,
    velocityX: 5,
    velocityY: 5
};

// Game state
let animationId = null;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(ball) {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x + ball.width / 2, ball.y + ball.height / 2, ball.width / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Mouse control for player's paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    let mouseY = (e.clientY - rect.top) * scaleY;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp
    leftPaddle.y = Math.max(0, Math.min(canvasHeight - leftPaddle.height, leftPaddle.y));
});

// AI for right paddle
function moveAIPaddle() {
    // Move towards the ball center
    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    const ballCenter = ball.y + ball.height / 2;
    if (paddleCenter < ballCenter - 10) {
        rightPaddle.y += rightPaddle.speed;
    } else if (paddleCenter > ballCenter + 10) {
        rightPaddle.y -= rightPaddle.speed;
    }
    // Clamp
    rightPaddle.y = Math.max(0, Math.min(canvasHeight - rightPaddle.height, rightPaddle.y));
}

// Collision detection
function collision(paddle, ball) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.width > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.height > paddle.y
    );
}

// Reset ball to center
function resetBall() {
    ball.x = canvasWidth / 2 - ballSize / 2;
    ball.y = canvasHeight / 2 - ballSize / 2;
    // Randomize direction
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 3);
}

// Main game loop
function gameLoop() {
    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw paddles and ball
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);
    drawBall(ball);

    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Wall collision (top/bottom)
    if (ball.y <= 0 || ball.y + ball.height >= canvasHeight) {
        ball.velocityY = -ball.velocityY;
    }

    // Paddle collision
    if (collision(leftPaddle, ball)) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.velocityX = -ball.velocityX;
        // Add some "spin" based on where it hit the paddle
        let collidePoint = (ball.y + ball.height / 2) - (leftPaddle.y + leftPaddle.height / 2);
        collidePoint = collidePoint / (leftPaddle.height / 2);
        let angle = collidePoint * Math.PI / 4;
        ball.velocityY = ball.speed * Math.sin(angle);
    } else if (collision(rightPaddle, ball)) {
        ball.x = rightPaddle.x - ball.width;
        ball.velocityX = -ball.velocityX;
        let collidePoint = (ball.y + ball.height / 2) - (rightPaddle.y + rightPaddle.height / 2);
        collidePoint = collidePoint / (rightPaddle.height / 2);
        let angle = collidePoint * Math.PI / 4;
        ball.velocityY = ball.speed * Math.sin(angle);
    }

    // Move AI
    moveAIPaddle();

    // Ball out of bounds (score)
    if (ball.x < 0 || ball.x + ball.width > canvasWidth) {
        resetBall();
    }

    // Next frame
    animationId = requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();