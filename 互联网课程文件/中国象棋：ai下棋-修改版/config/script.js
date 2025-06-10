const chessboard = document.getElementById('chessboard');
const synth = window.speechSynthesis;
let board = [
   ['俥','傌','驥','','象','','满','','象','','驥','傌','俥'],
    ['','','锥','','铳','','','','铳','','锥','',''],
    ['','','傌','','','士','竭','士','','','傌','',''],
    ['卒','','','砲','','','','','','砲','','','卒'],
    ['','','卒','','卒','鋒','卒','鋒','卒','','卒','',''],
    ['--','--','--','--','--','--','--','--','--','--','--','--','--'],
    ['','','','','','','','','','','','',''],
    ['--','--','--','--','--','--','--','--','--','--','--','--','--'],
    ['','','兵','','兵','鋭','兵','鋭','兵','','兵','',''],
    ['兵','','','炮','','','','','','炮','','','兵'],
    ['','','馬','','','仕','截','仕','','','馬','',''],
    ['','','追','','熥','','','','熥','','追','',''],
    ['車','馬','騏','','相','','明','','相','','騏','馬','車']
];
let originalBoard = board;
let qwertyBoardState = board;
let red_or_black = 1 ;
function tutorial () {
     window.location.href='./tutorial/tutorial.html';
}
function createChessboard() {
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            const cell = document.createElement('div');     
            cell.classList.add('cell');
            if (board[i][j] !== '') {
                cell.textContent = board[i][j];
                if (i >= 6) {
                    cell.classList.add('red');
                } else {
                    cell.classList.add('black');
                }
            }
            if (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[i][j])) {
                cell.classList.add('red');
            }
            if (board[i][j] === '氓') {
                cell.classList.remove('red');
                cell.classList.remove('black');
                cell.classList.add('purple');
            }
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            chessboard.appendChild(cell);
        }
    }
}
let selectedCell = null;
function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (selectedCell) {
        const selectedRow = parseInt(selectedCell.dataset.row);
        const selectedCol = parseInt(selectedCell.dataset.col);
        if (canMove(selectedRow, selectedCol, row, col)) {
            movePiece(selectedRow, selectedCol, row, col);
            originalBoard = board;
            selectedCell = null;
            moveAllPieces(board);
            if(isGameOver(board)){
                alert("游戏结束！");
                return;
            }
            showplayerScore();
            //////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////
            updateChessboard();
            aiTurn();
        } else {
            selectedCell = cell;
        }
    } else {
        selectedCell = cell;
    }
}
function canMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if(fromRow === toRow && fromCol === toCol){
        return false;
    }
    if(fromRow === toRow &&(board[toRow][toCol]==='追'||board[toRow][toCol]==='锥'))return false;
    if ((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[fromRow][fromCol]) && ['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[toRow][toCol]))||(((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援','援','','--','氓'].includes(board[fromRow][fromCol]) == false) && (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援','援','','--','氓'].includes(board[toRow][toCol]) == false)))) {
        return false;
    }
    if (piece === '傌' || piece === '馬') {
        return isValidHorseMove(fromRow, fromCol, toRow, toCol);
    }
    if (piece === '驥' || piece === '騏') {
        return isValidHorooseMove(fromRow, fromCol, toRow, toCol);
    }
    if (piece === '車'||piece === '俥') {
        return isValidCarMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '象'||piece === '相') {
        return isValidElephantMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '炮'||piece === '砲') {
        return isValidPaoMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '熥'||piece === '铳') {
        return isValidChongMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '兵'||piece === '卒'||piece === '满'||piece === '明') {
        return isValidZuMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '仕'||piece === '士'||piece === '鋭'||piece === '鋒') {
        return isValidShiMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '锥'||piece === '追') {
        return isValidChaseMove(fromRow, fromCol, toRow, toCol, board);
    }
    if (piece === '竭'||piece === '截') {
        return isValidCutMove(fromRow, fromCol, toRow, toCol, board);
    }
    if(piece === '氓'){
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        if(dx <= 1 && dy <= 1 && board[toRow][toCol] === ''){
            return true;
        }
    }
    if(piece === '援'||piece === '擭'){
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        if (dy === 1 && dx === 0 && board[toRow][toCol] === '')return true;
        if (dy === 1 && dx === 1 && board[toRow][toCol] != '')return true;
    }
    if(piece === '坦克'){
        if (fromRow !== toRow && fromCol !== toCol) {
            return false;
        }
        let count = 0; 
        if (fromRow === toRow) {
        const start = Math.min(fromCol, toCol);
        const end = Math.max(fromCol, toCol);
        for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col] !== '') {
                count++; 
            }
        }
        } else {
            const start = Math.min(fromRow, toRow);
            const end = Math.max(fromRow, toRow);
            for (let row = start + 1; row < end; row++) {
                if (board[row][fromCol] !== '') {
                    count++;
                }
            }
        }
        if (board[toRow][toCol] === '') {
            return isValidCarMove(fromRow, fromCol, toRow, toCol, board)||count === 0;
        } else {
            if(isValidCarMove(fromRow, fromCol, toRow, toCol, board)){
                return true;
            }else if (isValidCarMove(fromRow, fromCol, toRow, toCol, board)==false && count === 1) {
                board[fromRow][fromCol] = '砲';
                board[fromRow-1][fromCol] = '俥';
            }
            return isValidCarMove(fromRow, fromCol, toRow, toCol, board)||count === 1;
        }
    }
    if(piece === '飞机'){
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        if(board[toRow][toCol] === '') {return true;}
        if((dx === 1 && dy === 0)|| (dx === 0 && dy === 1)) {return true;}
    }
    return false;
}
function isValidHorseMove(fromRow, fromCol, toRow, toCol) {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    if ((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[fromRow][fromCol]) && ['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[toRow][toCol]))||(((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援','援',''].includes(board[fromRow][fromCol]) == false) && (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援','援',''].includes(board[toRow][toCol]) == false)))) {
        return false;
    }
    if (red_or_black === -1 && ['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[fromRow][fromCol])){
        return false;
    }
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        const midX = (fromCol + toCol) / 2;
        const midY = (fromRow + toRow) / 2;
        if (dx === 2) {
            return board[fromRow][midX] === '';
        } else {
            return board[midY][fromCol] === '';
        }
    }else if ((dx === 3 && dy === 0)||(dx === 0 && dy === 3)) {
        const mid1X = (2*fromCol + toCol) / 3;
        const mid2X = (fromCol + 2*toCol) / 3;
        const mid1Y = (2*fromRow + toRow) / 3;
        const mid2Y = (fromRow + 2*toRow) / 3;
        if (dx === 3) {
            return board[fromRow][mid1X] === '' && board[fromRow][mid2X] === '';
        } else {
            return board[mid1Y][fromCol] === '' && board[mid2Y][fromCol] === '';
        }
    }
    return false;
}
function isValidHorooseMove(fromRow, fromCol, toRow, toCol) {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        return true;
    }else if ((dx === 3 && dy === 0)||(dx === 0 && dy === 3)) {
        return true;
    }
    return false;
}
function isValidCarMove(fromRow, fromCol, toRow, toCol, board) {
    if (fromRow !== toRow && fromCol !== toCol) {
        return false;
    }
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if (fromRow === toRow) {
        const start = Math.min(fromCol, toCol);
        const end = Math.max(fromCol, toCol);
        for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col] !== '') {
                return false;
            }
        }
    } else {
        const start = Math.min(fromRow, toRow);
        const end = Math.max(fromRow, toRow);
        for (let row = start + 1; row < end; row++) {
            if (board[row][fromCol] !== '') {
                return false;
            }
        }
    }
    return true;
}
function isValidElephantMove(fromRow, fromCol, toRow, toCol, board) {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if (dx >= 2 && dy === dx) {
        let midRow = ((dx-1)*fromRow + toRow) / (dx);
        let midCol = ((dx-1)*fromCol + toCol) / (dx);
        for (let i = 1; i < dx ; i++) {
             midRow = ((dx-i)*fromRow + i*toRow) / (dx);
             midCol = ((dx-i)*fromCol + i*toCol) / (dx);
            if (board[midRow][midCol] !== '') {
                return false;
            }
        }
        if (board[fromRow][fromCol] === '相' && board[toRow][toCol] === '满') {
            return false;
        }
        if (board[fromRow][fromCol] === '象' && board[toRow][toCol] === '明') {
            return false;
        }
            return true;
    }
    return false;
}
function isValidPaoMove(fromRow, fromCol, toRow, toCol, board) {
    if (fromRow !== toRow && fromCol !== toCol) {
        return false;
    }
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    let count = 0; 
    if (fromRow === toRow) {
        const start = Math.min(fromCol, toCol);
        const end = Math.max(fromCol, toCol);
        for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col] !== '') {
                count++; 
            }
        }
    } else {
        const start = Math.min(fromRow, toRow);
        const end = Math.max(fromRow, toRow);
        for (let row = start + 1; row < end; row++) {
            if (board[row][fromCol] !== '') {
                count++;
            }
        }
    }
    if (board[toRow][toCol] === '') {
        return count === 0;
    } else {
        return count === 1;
    }
}
function isValidChongMove(fromRow, fromCol, toRow, toCol, board) {
    if (fromRow !== toRow && fromCol !== toCol) {
        return false;
    }
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    let count = 0; 
    if (fromRow === toRow) {
        const start = Math.min(fromCol, toCol);
        const end = Math.max(fromCol, toCol);
        for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col] !== '') {
                count++;
            }
        }
    } else {
        const start = Math.min(fromRow, toRow);
        const end = Math.max(fromRow, toRow);
        for (let row = start + 1; row < end; row++) {
            if (board[row][fromCol] !== '') {
                count++;
            }
        }
    }
    if (board[toRow][toCol] === '') {
        return count === 1;
    } else {
        return count === 0;
    }
}
function isValidZuMove(fromRow, fromCol, toRow, toCol, board) {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if (board[fromRow][fromCol] === '卒') {
        if (fromRow <= 7) { 
            if (dy === 1 && dx === 0 && toRow === fromRow + 1) {
                return true;
            }
            if (dy === 2 && dx === 0&& toRow === fromRow + 2 && board[fromRow + 1][fromCol] === '') {
                return true;
            }
        } else { 
            if (dy === 1 && dx === 0 && toRow === fromRow + 1) {
                return true;
            }
            if (dy === 0 && dx === 1) {
                return true;
            }
            if (dy === 2 && dx === 0&& toRow === fromRow + 2 && board[fromRow + 1][fromCol] === '') {
                return true;
            }
        }
    }
    if (board[fromRow][fromCol] === '兵') {
        if (fromRow >= 5) { 
            if (dy === 1 && dx === 0 && toRow === fromRow - 1) {
                return true;
            }
            if (dy === 2 && dx === 0 && toRow === fromRow - 2 && board[fromRow - 1][fromCol] === '') {
                return true;
            }
        } else {
            if (dy === 1 && dx === 0 && toRow === fromRow - 1) {
                return true;
            }
            if (dy === 0 && dx === 1) {
                return true;
            }
            if (dy === 2 && dx === 0&& toRow === fromRow - 2 && board[fromRow - 1][fromCol] === '') {
                return true;
            }
        }
    }
    if (board[fromRow][fromCol] === '明') {
        if (fromRow >= 5) { 
            if (dy === 1 && dx === 0) {
                return true;
            }
            if (dy === 0 && dx === 1) {
                return true;
            }
        } else {
            return true;
        }
    }
    if (board[fromRow][fromCol] === '满') {
        if (fromRow <= 7) { 
            if (dy === 1 && dx === 0) {
                return true;
            }
            if (dy === 0 && dx === 1) {
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
}
function isValidShiMove(fromRow, fromCol, toRow, toCol, board) {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if (dx === 1 && dy === 1) {
        return true;
    }
    if (dx === 2 && dy === 2 && board[(fromRow + toRow) / 2][(fromCol + toCol) / 2] === '') {
        return true;
    }
    return false;
}
function isValidChaseMove(fromRow, fromCol, toRow, toCol, board) {
    if (fromRow !== toRow && fromCol !== toCol) {
        return false;
    }
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if (fromRow === toRow) {
        const start = Math.min(fromCol, toCol);
        const end = Math.max(fromCol, toCol);
        for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col] !== '') {
                return false;
            }
        }
    } else {
        const start = Math.min(fromRow, toRow);
        const end = Math.max(fromRow, toRow);
        for (let row = start + 1; row < end; row++) {
            if (board[row][fromCol] !== '') {
                return false;
            }
        }
    }
    if (board[fromRow][fromCol] === '追' && toRow-fromRow >= 0 && board[toRow][toCol] !== '') {
        return false;
    }
    if (board[fromRow][fromCol] === '追' && toRow-fromRow > 0 && Math.abs(toRow-fromRow)>=3) {
        return false;
    }
    if (board[fromRow][fromCol] === '锥' && toRow-fromRow <= 0 && board[toRow][toCol] !== '') {
        return false;
    }
    if (board[fromRow][fromCol] === '锥' && toRow-fromRow < 0 && Math.abs(toRow-fromRow)>=3) {
        return false;
    }
    return true;
}
function isValidCutMove(fromRow, fromCol, toRow, toCol, board) {
    if (board[toRow][toCol]!=='' && (Math.abs(toRow-fromRow)>=2 || Math.abs(toCol-fromCol)>=2)){
        return false;
    }
    if (fromRow !== toRow && fromCol !== toCol) {
        return false;
    }
    if (toRow-fromRow > 0 && board[toRow][toCol] === '截') {
        return false;
    }
    if (toRow-fromRow < 0 && board[toRow][toCol] === '竭') {
        return false;
    }
    if (fromRow === toRow) {
        const start = Math.min(fromCol, toCol);
        const end = Math.max(fromCol, toCol);
        for (let col = start + 1; col < end; col++) {
            if (board[fromRow][col] !== '') {
                return false;
            }
        }
    } else {
        const start = Math.min(fromRow, toRow);
        const end = Math.max(fromRow, toRow);
        for (let row = start + 1; row < end; row++) {
            if (board[row][fromCol] !== '') {
                return false;
            }
        }
    }
    if (board[fromRow][fromCol] === '截' && toRow-fromRow < 0 && Math.abs(toRow-fromRow)>=3) {
        return false;
    }
    if (board[fromRow][fromCol] === '竭' && toRow-fromRow > 0 && Math.abs(toRow-fromRow)>=3) {
        return false;
    }
    return true;
}
function movePiece(fromRow, fromCol, toRow, toCol) {
    evaluateScore(fromRow, fromCol, toRow, toCol);
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';
    updateChessboard();
}
function updateChessboard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 13);
        const col = index % 13;
        cell.textContent = board[row][col];
        if (board[row][col] !== '') {
            if (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(board[row][col])||(['--'].includes(board[row][col])&&row>6)) {
                cell.classList.remove('black');
                cell.classList.remove('purple');
                cell.classList.add('red');
            }else if (board[row][col] !== '氓') {
                cell.classList.remove('red');
                cell.classList.remove('purple');
                cell.classList.add('black');
            }else {
                cell.classList.remove('red');
                cell.classList.remove('black');
                cell.classList.add('purple');
            }
        }
    });
}
createChessboard();
function AIbrain(board, depth, alpha, beta, isMaximizingPlayer) {
    if (depth === 0 || isGameOver(board)) {
        return evaluateBoard(board); 
    }
    let best1Move = null;
    let best2Move = null;
    if (isMaximizingPlayer) {
        let value = -Infinity;
        const moves = generateMoves2_1(board);
        for (const move of moves) {
            const newBoard = simulateMove(board, move);
            const childValue = AIbrain(newBoard, depth - 1, alpha, beta, false);
            if (childValue > value) {
                value = childValue;
                best1Move = move;
            }
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break; 
            }
        }
    } else {
        let value = Infinity;
        const moves = generateMoves2_2(board);
        for (const move of moves) {
            const newBoard = simulateMove(board, move);
            const childValue = AIbrain(newBoard, depth - 1, alpha, beta, true);
            if (childValue < value) {
                value = childValue;
                best1Move = move;
            }
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break; 
            }
        }
    }
    return best1Move;
}
function isGameOver(board){
    let hasRedGeneral = false;
    let hasBlackGeneral = false;
    for (let row = 0; row < 13; row++) {
        for (let col = 0; col < 13; col++) {
            if (board[row][col] === '明') {
                hasRedGeneral = true;
            } else if (board[row][col] === '满') {
                hasBlackGeneral = true;
            }
        }
    }
    if (hasRedGeneral==false || hasBlackGeneral==false) {
        return true;
    }
    return false;
}



function evaluateBoard(board = 'default'){
    let score = 0;
    const pieceValues = {
        '满': 100000,
        '俥': 900,
        '傌': 400,
        '驥': 600,
        '象': 450,
        '锥': 450,
        '铳': 450,
        '竭': 450,
        '砲': 450,
        '卒': 150,
        '鋒': 150,
        '士': 150,
        '坦克':1500,
        '飞机': 1500,
        '明':-100000,
        '車': -900,
        '騏': -600,
        '相': -450,
        '兵': -150,
        '炮': -450,
        '馬': -400,
        '仕': -150,
        '截': -450,
        '追': -450,
        '熥': -450,
        '鋭': -150,
        '--': -20,
        '氓':-100,
        '援': -100,
    };
    if (board === 'default') alert("意外的游戏结束，由于不规范的行棋：将军不应/移动对手的棋子/自己吃自己！在处理后，游戏将继续进行。");
    for (let row = 0; row < 13; row++) {
        for (let col = 0; col <13; col++) {
            const piece = board[row][col];
            if (piece !== '') {
                if (piece in pieceValues) {
                    score += pieceValues[piece];
                }
            }
        }
    }
    return score;
}
function evaluateBoard2(board){
    const pieceValues = evaluateBoard(board);
    const pieceValues2 = evaluateBoard(simulateMove(board, AIbrain(board, 1, -Infinity, Infinity, false)))
    return 3*pieceValues2 + pieceValues;
}
function evaluateBoard3(board){
    const pieceValues = evaluateBoard2(board);
    const pieceValues2 = evaluateBoard2(simulateMove(board, AIbrain2(board, 1, -Infinity, Infinity, false)))
    return pieceValues2 + pieceValues;
}
function AIbrain2(board, depth, alpha, beta, isMaximizingPlayer) {
    let best1Move = null;
    if (depth === 0 ) {//|| isGameOver(board)
        return evaluateBoard2(board); 
    }
    if (isMaximizingPlayer) {
        let value = -Infinity;
        const moves = generateMoves2_1(board);
        for (const move of moves) {
            const newBoard = simulateMove(board, move);
            const childValue = AIbrain2(newBoard, depth - 1, alpha, beta, false);
            if (childValue > value) { 
                value = childValue;
                best1Move = move;
            }
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break; 
            }
        }
    } else {
        let value = Infinity;
        const moves = generateMoves2_2(board);
        for (const move of moves) {
            const newBoard = simulateMove(board, move);
            const childValue = AIbrain2(newBoard, depth - 1, alpha, beta, true);
            if (childValue < value) {
                value = childValue;
                best1Move = move;
            }
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break; 
            }
        }
    }
    return best1Move;
}
function AIbrain3(board, depth, alpha, beta) {
    let best1Move = null;
    if (depth === 0 || isGameOver(board)) {
        return evaluateBoard2(board); 
    }
    if (depth < 1 && depth !== 0) {
        board = simulateMove(board, AIbrain2(board, 1, -Infinity,Infinity, false));
    }
        let value = -Infinity;
        const moves = generateMoves2_1(board);
        for (const move of moves) {
            const newBoard = simulateMove(board, move);
            const childValue = AIbrain3(newBoard, depth - 1, alpha, beta);
            if (childValue > value) { 
                value = childValue;
                best1Move = move;
            }
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break; 
            }
        }
    return best1Move;
}
function generateMoves(board) {
    let moves = [];
    let i=0;
    let j=0;
    for (let row = 0; row < 13 && j<5; row++) {
        for (let col = 0; col < 13 && j<5; col++) {
            const piece = board[row][col];
            if (piece !== '') {
                i=0;
                for (let toRow = 0; toRow < 13&& i<1; toRow++) {
                    for (let toCol = 0; toCol < 13 && i<1; toCol++) {
                        if (canMove(row, col, toRow, toCol)) {
                            console.log("AI 思考中..." + piece + toRow + toCol);
                            moves.push({ row, col, toRow, toCol });
                        }
                    }
                }
            }
        }
    }
    return moves;
}
//黑方
function generateMoves2_1(board) {
    let moves = [];
    let i=0;
    let j=0;
    for (let row = 0; row < 13 && j<20; row++) {
        for (let col = 0; col < 13 && j<20; col++) {
            const piece = board[row][col];
            if (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援','援','','--','氓'].includes(piece) == false) {
                i=0;
                if (piece == '卒'||piece == '士'||piece == '满'||piece == '鋒'||piece == '擭'){
                    for (let toRow = 0; toRow < 13&& i<8 ; toRow++){
                        for (let toCol = 0; toCol < 13 && i<8; toCol++) {
                            if (Math.abs(toRow - row)<=2&&Math.abs(toRow - row)<=2&&canMove(row, col, toRow, toCol)) {
                                console.log("AI 思考中..." + piece + '到'+toRow + toCol);
                                moves.push({ row, col, toRow, toCol });
                                i++;
                            }
                        }
                    }   
                }else if (piece =='傌'||piece == '驥'){
                    for (let toRow = 0; toRow < 13&& i<8 ; toRow++){
                        for (let toCol = 0; toCol < 13 && i<8; toCol++) {
                            if (Math.abs(toRow - row)<=3 &&  Math.abs(toCol - col)<=3&&canMove(row, col, toRow, toCol)) {
                                moves.push({ row, col, toRow, toCol });
                                i++;
                            }
                        }
                    }
                }else {
                    for (let toRow = 0; toRow < 13&& i<8; toRow++) {
                        for (let toCol = 0; toCol < 13 && i<8; toCol++) {
                            if ((Math.min(Math.abs(toRow - row),Math.abs(toCol - col))==0)&& canMove(row, col, toRow, toCol)) {
                            moves.push({ row, col, toRow, toCol });   
                            i++;
                            }
                        }
                    }
                }
            }
        }
    }
    return moves;
}
function generateMoves2_2(board) {
    let moves = [];
    let i=0;
    let j=0;
    for (let row = 0; row < 13 && j<5; row++) {
        for (let col = 0; col < 13 && j<5; col++) {
            const piece = board[row][col];
            if (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(piece) == true && piece !== '') {
                i=0;
                if (piece == '兵'||piece == '鋭'||piece == '仕'||piece == '明'){
                    for (let toRow = 0; toRow < 13&& i<8; toRow++){
                        for (let toCol = 0; toCol < 13 && i<8; toCol++) {
                            if (Math.abs(toRow - row)<=2&&Math.abs(toRow - row)<=2&&canMove(row, col, toRow, toCol)) {
                                moves.push({ row, col, toRow, toCol });
                                i++;
                            }
                        }
                    }   
                }else if (piece =='馬'||piece == '騏'){
                    for (let toRow = 0; toRow < 13&& i<8 ; toRow++){
                        for (let toCol = 0; toCol < 13 && i<8; toCol++) {
                            if (Math.abs(toRow - row)<=3&&Math.abs(toRow - row)<=3&&canMove(row, col, toRow, toCol)) {
                                moves.push({ row, col, toRow, toCol });
                                i++;
                            }
                        }
                    }
                }else {
                    for (let toRow = 0; toRow < 13&& i<8; toRow++) {
                        for (let toCol = 0; toCol < 13 && i<8; toCol++) {
                            if ((Math.min(Math.abs(toRow - row),Math.abs(toCol - col))==0)&& canMove(row, col, toRow, toCol)) {
                                i++;
                                moves.push({ row, col, toRow, toCol });
                            }
                        }
                    }
                }
            }
        }
    }
    return moves;
}
function deepCopyBoard(board) {
    return board.map(row => row.slice());
}
function simulateMove(board, move) {
    const newBoard = deepCopyBoard(board);
    const { row, col, toRow, toCol } = move;
    if(row!== null && row!== undefined){
    newBoard[toRow][toCol] = newBoard[row][col];
    newBoard[row][col] = '';
    return newBoard;
    }
}
function pretendtomakeMove(move){
    const { row, col, toRow, toCol } = move;
    qwertyBoardState[toRow][toCol] = qwertyBoardState[row][col];
    qwertyBoardState[row][col] = '';
    return qwertyBoardState;   
}


////////////////////////////////////////////////////////////////////////////////////////
function makeMove(board, move){
    const { row, col, toRow, toCol } = move;
    evaluateScore(row, col, toRow, toCol);
    board[toRow][toCol] = board[row][col];
    board[row][col] = '';
    return board;   
}
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
function aiTurn() {
    if(Math.random() > 1-aiScore/3000){
        AIgainTalent();
    }
    const bestMove =AIbrain2(board, 1, -Infinity, Infinity,true);
    board = originalBoard; 
    if (bestMove!== null && bestMove!== undefined){//
        makeMove(board,bestMove);
        updateChessboard();
    }else{
        const moves = generateMoves2_1(board);
        alert('发生了意外的情况，AI启用了备用策略，思考数：'+moves.length+'深度：2');
        let betterMove = null;
        let a,b=-Infinity;
        for (const move of moves) {
            const newBoard = simulateMove(board, move);
            const moves2 = generateMoves2_1(newBoard);
            for (const move2 of moves2) {
                const new2Board = simulateMove(board, move2);
                a = evaluateBoard(new2Board);
                if (a >= b){
                    b=a;
                    betterMove = move2;
                }
            }
        }
        makeMove(board,betterMove);
        updateChessboard();        
    }
    
    console.log("AI 走棋：" + bestMove.row + "行" + bestMove.col + "列 到 " + bestMove.toRow + "行" + bestMove.toCol+"列");
    if(isGameOver(board)){
        alert("游戏结束！");
        return;
    }
    moveAllPieces(board);
    playerTurn();
}
function playerTurn() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick); 
        cell.addEventListener('click', handleCellClick);
    });
}
playerTurn();
function moveAllPieces(board) {
    let valuables = [];
    if(Math.floor(Math.random()*100)<30){
        for (let row = 0; row < 13; row++) {
            for (let col = 0; col < 13; col++) {
                const piece = board[row][col];
                if (piece === '') {
                    valuables.push({ row, col });
                }
            }
        }
        let i=valuables[Math.floor(Math.random()*valuables.length)];
        board [i.row][i.col] = '氓';
        updateChessboard();
    }
    let moves = [];
    for (let row = 0; row < 7 ; row++) {
        for (let col = 0; col < 7 ; col++) {
            const piece = board[row][col];
            if (piece == '氓') {
                for (let toRow = 0; toRow < 7; toRow++) {
                    for (let toCol = 0; toCol < 7; toCol++) {
                        if (canMove(row, col, toRow, toCol)) {
                            moves.push({ row, col, toRow, toCol });
                        }
                    }
                }
                makeMove(board,moves[Math.floor(Math.random()*moves.length)]);//Math.floor(Math.random()*moves.length)随机选择一个move
                updateChessboard();
            }
        }
    }
}

let playerScore = 0;
let aiScore = 200;
function showplayerScore(){
    document.getElementById("playerScore").innerHTML = "玩家分数：" + playerScore;//+ ' ai分数：'+aiScore;// + ' ai分数：'+aiScore;
    console.log(' ai分数：'+aiScore);//+ ' ai分数：'+aiScore);// + ' ai分数：'+aiScore;
}

function evaluateScore(row, col, toRow, toCol){
    const pieceValues = {
        '满': 100000,
        '俥': 900,
        '傌': 400,
        '驥': 600,
        '象': 450,
        '锥': 450,
        '铳': 450,
        '竭': 450,
        '砲': 450,
        '卒': 150,
        '鋒': 150,
        '士': 150,
        '擭':150,
        '坦克':1500,
        '飞机': 1500,
        '明':-100000,
        '車': -900,
        '騏': -600,
        '相': -450,
        '兵': -150,
        '炮': -450,
        '馬': -400,
        '仕': -150,
        '截': -450,
        '追': -450,
        '熥': -450,
        '鋭': -150,
        '--': -20,
        '氓':-100,
        '援':-150,
        '':0
    };
    const piece = board[row][col];
    const targetPiece = board[toRow][toCol];
    if(['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援','--','氓'].includes(targetPiece) ){
        aiScore -= pieceValues[targetPiece]*0.6;
    }
    if(['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明','援'].includes(piece)){
        if(targetPiece == '氓'||targetPiece =='--'){
        playerScore -= pieceValues[targetPiece]*0.5;
        }else{
            playerScore += pieceValues[targetPiece]*0.5;
        }
    }
}

function gainTalent(){
    let valuableTalents = [];
    const pieceValues = {
        '满': 100000,
        '俥': 900,
        '傌': 400,
        '驥': 600,
        '象': 450,
        '锥': 450,
        '铳': 450,
        '竭': 450,
        '砲': 450,
        '卒': 150,
        '鋒': 150,
        '士': 150,
        '明':-100000,
        '車': -900,
        '騏': -600,
        '相': -450,
        '兵': -150,
        '炮': -450,
        '馬': -400,
        '仕': -150,
        '截': -450,
        '追': -450,
        '熥': -450,
        '鋭': -150,
        '--': -20,
        '氓':-100,
        '':0,
        '援':-150,
    };
    for (const pieceValue in pieceValues){//遍历所有棋子价值
        if((0-pieceValues[pieceValue]) <= playerScore && (0-pieceValues[pieceValue]) > 0 && pieceValue!='氓' && pieceValue!='--'){
            valuableTalents.push(pieceValue);
        }
    }
    if(valuableTalents.length == 0){
        alert("玩家没有足够的分数！");
        return;
    }
    let talent = valuableTalents[Math.floor(Math.random()*valuableTalents.length)];
    let vacantCells = [];
    for (let row = 8; row < 13; row++) {
        for (let col = 0; col < 13; col++) {
            const piece = board[row][col];
            if (piece === '') {
                vacantCells.push({ row, col });
            }
        }
    }
    if(vacantCells.length == 0){
        alert("没有空位可以放置棋子！");
        return;
    }
    let i=vacantCells[Math.floor(Math.random()*vacantCells.length)];
    board [i.row][i.col] = talent;
    updateChessboard();
    playerScore -= (0-pieceValues[talent]);
    showplayerScore();
    alert("玩家从"+valuableTalents.length+"件有价值的棋子："+valuableTalents.join(" ")+' 中获得了：'+talent +'！');
}

function AIgainTalent(){
    let valuableTalents = [];
    const pieceValues = {
        '满': 100000,
        '俥': 600,
        '傌': 400,
        '驥': 600,
        '象': 450,
        '锥': 450,
        '铳': 450,
        '竭': 450,
        '砲': 450,
        '卒': 150,
        '鋒': 150,
        '士': 150,
        '擭':150,
        '坦克':600,
        '飞机': 600,
        '明':-100000,
        '車': -900,
        '騏': -600,
        '相': -450,
        '兵': -150,
        '炮': -450,
        '馬': -400,
        '仕': -150,
        '截': -450,
        '追': -450,
        '熥': -450,
        '鋭': -150,
        '--': -20,
        '氓':-100,
        '':0
    };
    for (const pieceValue in pieceValues){//遍历所有棋子价值
        if(pieceValues[pieceValue] <= aiScore && pieceValues[pieceValue] > 0 && pieceValue!='氓' && pieceValue!='--'){
            valuableTalents.push(pieceValue);
        }
    }
    if(valuableTalents.length == 0){
        alert("AI没有足够的分数！");
        return;
    }
    let talent = valuableTalents[Math.floor(Math.random()*valuableTalents.length)];
    let vacantCells = [];
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 13; col++) {
            const piece = board[row][col];
            if (piece === '') {
                vacantCells.push({ row, col });
            }
        }
    }
    if(vacantCells.length == 0){
        alert("AI试图在棋盘上放置棋子，但没有空位可以放置棋子！");
        return;
    }
    let i=vacantCells[Math.floor(Math.random()*vacantCells.length)];
    board [i.row][i.col] = talent;
    updateChessboard();
    aiScore -= (pieceValues[talent]);
    showplayerScore();
    alert("AI从"+valuableTalents.length+"件有价值的棋子："+valuableTalents.join(" ")+' 中获得了：'+talent +'！');
}



















// 在脚本中定期检查分数
setInterval(() => {
    const btn = document.getElementById('gainTalent');
    btn.style.display = playerScore > 150 ? 'block' : 'none';
}, 100); // 每100毫秒检查一次

// 或者当分数改变时触发（推荐）
// 需要确保所有修改playerScore的地方都调用这个函数
function updateScore(newScore) {
    playerScore = newScore;
    const btn = document.getElementById('gainTalent');
    btn.style.display = playerScore > 150 ? 'block' : 'none';
}
