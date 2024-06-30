const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');
const tiesElement = document.getElementById('ties');
let oTurn;
let xWins = 0;
let oWins = 0;
let ties = 0;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
        updateScore(currentClass);
    } else if (isDraw()) {
        endGame(true);
        updateScore(null);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (oTurn) {
            setTimeout(makeAiMove, 500); 
        }
    }
}

function makeAiMove() {
    const bestMove = minimax([...cellElements], O_CLASS).index;
    placeMark(cellElements[bestMove], O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false);
        updateScore(O_CLASS);
    } else if (isDraw()) {
        endGame(true);
        updateScore(null);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function minimax(newBoard, player) {
    const availableCells = newBoard.filter(cell => 
        !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );

    if (checkWinWithBoard(newBoard, X_CLASS)) {
        return { score: -10 };
    } else if (checkWinWithBoard(newBoard, O_CLASS)) {
        return { score: 10 };
    } else if (availableCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    availableCells.forEach(cell => {
        const index = [...cellElements].indexOf(cell);
        const move = { index };
        newBoard[index].classList.add(player);
        const result = player === O_CLASS ? minimax(newBoard, X_CLASS) : minimax(newBoard, O_CLASS);
        move.score = result.score;
        newBoard[index].classList.remove(player);
        moves.push(move);
    });

    let bestMove;
    if (player === O_CLASS) {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function checkWinWithBoard(board, currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return board[index].classList.contains(currentClass);
        });
    });
}

function updateScore(winner) {
    if (winner === X_CLASS) {
        xWins++;
        xWinsElement.innerText = xWins;
    } else if (winner === O_CLASS) {
        oWins++;
        oWinsElement.innerText = oWins;
    } else {
        ties++;
        tiesElement.innerText = ties;
    }
}
