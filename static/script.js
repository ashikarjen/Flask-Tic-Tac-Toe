const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const winnerElement = document.getElementById('winner');
const gameBoard = document.getElementById('game-board');

let currentTurn = 'X';

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', restartGame);

function handleClick(e) {
    const cell = e.target;
    cell.textContent = currentTurn;
    cell.style.pointerEvents = 'none';
    
    if (checkWin(currentTurn)) {
        showWinningLine(currentTurn);
        showWinningMessage(currentTurn);
        endGame();
    } else if (isDraw()) {
        showDrawMessage();
        endGame();
    } else {
        currentTurn = currentTurn === 'X' ? 'O' : 'X';
    }
}

function checkWin(currentTurn) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return cells[index].textContent === currentTurn;
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function showWinningMessage(winner) {
    winnerElement.textContent = winner;
    messageElement.classList.remove('hidden');
    alert('Player ' + winner + ' wins!');
}

function showDrawMessage() {
    alert('Draw!');
}

function showWinningLine(winner) {
    const winPatterns = [
        { pattern: [0, 1, 2], type: 'horizontal', index: 0 }, // Rows
        { pattern: [3, 4, 5], type: 'horizontal', index: 1 },
        { pattern: [6, 7, 8], type: 'horizontal', index: 2 },
        { pattern: [0, 3, 6], type: 'vertical', index: 0 },   // Columns
        { pattern: [1, 4, 7], type: 'vertical', index: 1 },
        { pattern: [2, 5, 8], type: 'vertical', index: 2 },
        { pattern: [0, 4, 8], type: 'diagonal-right' },       // Diagonals
        { pattern: [2, 4, 6], type: 'diagonal-left' }
    ];

    const winningPattern = winPatterns.find(({ pattern }) => {
        return pattern.every(index => {
            return cells[index].textContent === winner;
        });
    });

    if (winningPattern) {
        const line = document.createElement('div');
        line.classList.add('winning-line', winningPattern.type);
        if (winningPattern.type === 'horizontal') {
            line.style.top = `${winningPattern.index * 33.33 + 16.67}%`;
        } else if (winningPattern.type === 'vertical') {
            line.style.left = `${winningPattern.index * 33.33 + 16.67}%`;
        } else if (winningPattern.type === 'diagonal-right') {
            line.style.top = '50%';
            line.style.left = '50%';
            line.style.transform = 'translate(-50%, -50%) rotate(45deg)';
        } else if (winningPattern.type === 'diagonal-left') {
            line.style.top = '50%';
            line.style.left = '50%';
            line.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        }
        gameBoard.appendChild(line);
    }
}

function endGame() {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function restartGame() {
    currentTurn = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
        cell.addEventListener('click', handleClick, { once: true });
    });
    messageElement.classList.add('hidden');
    const lines = document.querySelectorAll('.winning-line');
    lines.forEach(line => line.remove());
}
