// Game variables
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const messageEl = document.getElementById('message');
const moveCountEl = document.getElementById('moveCount');
const timeCountEl = document.getElementById('timeCount');
const resetBtn = document.getElementById('resetBtn');

// Game constants
const CELL_SIZE = 40;
const WALL_COLOR = '#ffb3c6';
const WALL_BORDER = '#ff4d6d';
const PATH_COLOR = '#f8f9fa';
const PLAYER_COLOR = '#ff4d6d';
const TARGET_COLOR = '#4cc9f0';

// Game state
let player = { x: 1, y: 1 };
let target = { x: 14, y: 12 }; // Now accessible!
let moves = 0;
let startTime = Date.now();
let gameWon = false;
let timerInterval;

// FIXED MAZE - Krishna is reachable!
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1]
];

// Initialize game
function initGame() {
    player = { x: 1, y: 1 };
    target = { x: 14, y: 12 };
    moves = 0;
    startTime = Date.now();
    gameWon = false;
    messageEl.textContent = "Use arrows to navigate Mitthi to Krishna!";
    messageEl.classList.remove('pulse');
    moveCountEl.textContent = '0';
    timeCountEl.textContent = '0s';
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    drawMaze();
    setupControls();
}

// Draw the maze
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            if (maze[row][col] === 1) {
                ctx.fillStyle = WALL_COLOR;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = WALL_BORDER;
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            } else {
                ctx.fillStyle = PATH_COLOR;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    
    drawCharacter(target.x, target.y, TARGET_COLOR, 'K');
    drawCharacter(player.x, player.y, PLAYER_COLOR, 'M');
}

function drawCharacter(x, y, color, letter) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 4;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.font = `bold ${radius}px 'Pacifico', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, centerX, centerY);
}

// Setup controls
function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (gameWon) return;
        
        let direction = null;
        switch(e.key) {
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
        }
        
        if (direction) {
            e.preventDefault();
            movePlayer(direction);
        }
    });
    
    document.getElementById('up-btn').onclick = () => movePlayer('up');
    document.getElementById('down-btn').onclick = () => movePlayer('down');
    document.getElementById('left-btn').onclick = () => movePlayer('left');
    document.getElementById('right-btn').onclick = () => movePlayer('right');
    
    resetBtn.onclick = initGame;
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
    
    if (newY >= 0 && newY < maze.length && 
        newX >= 0 && newX < maze[0].length && 
        maze[newY][newX] === 0) {
        
        player.x = newX;
        player.y = newY;
        moves++;
        moveCountEl.textContent = moves;
        drawMaze();
        
        if (player.x === target.x && player.y === target.y) {
            winGame();
        }
    } else {
        canvas.classList.add('shake');
        setTimeout(() => canvas.classList.remove('shake'), 300);
    }
}

function winGame() {
    gameWon = true;
    clearInterval(timerInterval);
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    messageEl.textContent = `🎉 You did it! Mitthi found Krishna! 🎉`;
    messageEl.classList.add('pulse');
    canvas.classList.add('shake');
    
    setTimeout(() => {
        canvas.classList.remove('shake');
        messageEl.innerHTML = `
            Perfect! 💖<br>
            <small>Moves: ${moves} | Time: ${timeTaken}s</small><br>
            <small>"No matter the maze, I'll always find you" ❤️</small>
        `;
    }, 1500);
}

function updateTimer() {
    if (!gameWon) {
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        timeCountEl.textContent = `${timeElapsed}s`;
    }
}

// Start the game
initGame();
