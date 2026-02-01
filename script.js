// =================== GAME CONFIGURATION ===================
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const messageEl = document.getElementById('message');
const moveCountEl = document.getElementById('moveCount');
const timeCountEl = document.getElementById('timeCount');
const resetBtn = document.getElementById('resetBtn');

// Game constants
const CELL_SIZE = 40;
const GRID_SIZE = 15;
const WALL_COLOR = '#ffb3c6';
const WALL_BORDER = '#ff4d6d';
const PATH_COLOR = '#f8f9fa';
const PLAYER_COLOR = '#ff4d6d';
const TARGET_COLOR = '#4cc9f0';

// =================== MAZE DEFINITION ===================
// GUARANTEED SOLVABLE MAZE - 1 = wall, 0 = path
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,1]
];

// Game state
let player = { x: 1, y: 1 };
let target = { x: 13, y: 13 };
let moves = 0;
let startTime = Date.now();
let gameWon = false;
let timerInterval;

// =================== INITIALIZE GAME ===================
function initGame() {
    player = { x: 1, y: 1 };
    target = { x: 13, y: 13 };
    moves = 0;
    startTime = Date.now();
    gameWon = false;
    
    messageEl.textContent = "Guide Mitthi (❤️) to Krishna (💙) using arrows!";
    messageEl.classList.remove('pulse');
    moveCountEl.textContent = '0';
    timeCountEl.textContent = '0s';
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    drawMaze();
    setupControls();
}

// =================== DRAWING FUNCTIONS ===================
function drawMaze() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = PATH_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw walls and paths
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            if (maze[row][col] === 1) {
                drawWall(x, y);
            }
        }
    }
    
    // Draw grid lines
    drawGridLines();
    
    // Draw characters
    drawCharacter(target.x, target.y, TARGET_COLOR, '💙');
    drawCharacter(player.x, player.y, PLAYER_COLOR, '❤️');
    
    // Draw markers
    drawMarker(1, 1, '#ff4d6d', 'START');
    drawMarker(13, 13, '#4cc9f0', 'END');
}

function drawWall(x, y) {
    ctx.fillStyle = WALL_COLOR;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    
    ctx.strokeStyle = WALL_BORDER;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    
    // Wall texture
    ctx.fillStyle = WALL_BORDER;
    for (let i = 0; i < 4; i++) {
        const dotX = x + 10 + (i % 2) * 20;
        const dotY = y + 10 + Math.floor(i / 2) * 20;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGridLines() {
    ctx.strokeStyle = 'rgba(255, 77, 109, 0.2)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawCharacter(x, y, color, emoji) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 4;
    
    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Emoji
    ctx.font = `${radius * 1.2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, centerX, centerY);
}

function drawMarker(x, y, color, text) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY - 25);
}

// =================== CONTROLS ===================
function setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Button controls
    document.getElementById('up-btn').onclick = () => movePlayer('up');
    document.getElementById('down-btn').onclick = () => movePlayer('down');
    document.getElementById('left-btn').onclick = () => movePlayer('left');
    document.getElementById('right-btn').onclick = () => movePlayer('right');
    
    // Reset button
    resetBtn.onclick = initGame;
}

function handleKeyPress(e) {
    if (gameWon) return;
    
    let direction = null;
    switch(e.key) {
        case 'ArrowUp': direction = 'up'; break;
        case 'ArrowDown': direction = 'down'; break;
        case 'ArrowLeft': direction = 'left'; break;
        case 'ArrowRight': direction = 'right'; break;
        case 'w': case 'W': direction = 'up'; break;
        case 's': case 'S': direction = 'down'; break;
        case 'a': case 'A': direction = 'left'; break;
        case 'd': case 'D': direction = 'right'; break;
    }
    
    if (direction) {
        e.preventDefault();
        movePlayer(direction);
    }
}

function movePlayer(direction) {
    if (gameWon) return;
    
    let newX = player.x;
    let newY = player.y;
    
    switch(direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
    }
    
    // Check if move is valid
    if (newY >= 0 && newY < GRID_SIZE && 
        newX >= 0 && newX < GRID_SIZE && 
        maze[newY][newX] === 0) {
        
        player.x = newX;
        player.y = newY;
        moves++;
        moveCountEl.textContent = moves;
        drawMaze();
        
        // Check for win
        if (player.x === target.x && player.y === target.y) {
            winGame();
        }
    } else {
        // Invalid move feedback
        canvas.classList.add('shake');
        setTimeout(() => canvas.classList.remove('shake'), 300);
        
        messageEl.textContent = "Can't move there!";
        messageEl.style.color = '#ff0000';
        
        setTimeout(() => {
            messageEl.textContent = "Guide Mitthi (❤️) to Krishna (💙) using arrows!";
            messageEl.style.color = '#ff006e';
        }, 500);
    }
}

// =================== WIN CONDITION ===================
function winGame() {
    gameWon = true;
    clearInterval(timerInterval);
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    messageEl.textContent = "🎉 YOU DID IT! Mitthi found Krishna! 🎉";
    messageEl.classList.add('pulse');
    canvas.classList.add('shake');
    
    drawCelebration();
    
    setTimeout(() => {
        messageEl.innerHTML = `
            Perfect! 💖<br>
            <small>Moves: ${moves} | Time: ${timeTaken}s</small><br>
            <small>"No matter the maze, I'll always find you" ❤️</small>
        `;
    }, 2000);
}

function drawCelebration() {
    const centerX = player.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = player.y * CELL_SIZE + CELL_SIZE / 2;
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 60;
            const heartX = centerX + Math.cos(angle) * radius;
            const heartY = centerY + Math.sin(angle) * radius;
            
            ctx.save();
            ctx.translate(heartX, heartY);
            ctx.scale(0.8, 0.8);
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = i % 2 === 0 ? '#ff4d6d' : '#4cc9f0';
            ctx.fillText('❤️', 0, 0);
            ctx.restore();
        }, i * 100);
    }
}

function updateTimer() {
    if (!gameWon) {
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        timeCountEl.textContent = `${timeElapsed}s`;
    }
}

// =================== START GAME ===================
// Initialize when page loads
window.addEventListener('DOMContentLoaded', initGame);

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && !gameWon) {
        drawMaze();
    }
});
