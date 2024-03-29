var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
let winner = null;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame() {
    document.getElementById('win').style.display = 'none';
    document.getElementById('lost').style.display = 'none';
    document.getElementById('tie').style.display = 'none';
    winner = null;
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; ++i) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        if (winner == null && !checkTie()) {
            turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    console.log(squareId);
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? 'blue' : 'red';
        winner = gameWon.player === huPlayer ? 'human' : 'ai';
        declareWinner(winner);

    }
    for (var i = 0; i < cells.length; ++i) {
        cells[i].removeEventListener('click', turnClick, false);
    }
}

function declareWinner(winner) {
    switch (winner) {
        case 'tie': document.getElementById('tie').style.display = 'block';
            break;
        case 'human': document.getElementById('win').style.display = 'block';
            break;
        case 'ai': document.getElementById('lost').style.display = 'block';
            break;
    }
}

function emptySquares() {
    return origBoard.filter(s => typeof s === 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (var i = 0; i < cells.length; ++i) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('tie');
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; ++i) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -100000;
        for (var i = 0; i < moves.length; ++i) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 100000;
        for (var i = 0; i < moves.length; ++i) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
