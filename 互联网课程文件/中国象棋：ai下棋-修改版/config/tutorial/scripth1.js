const chessboard = document.getElementById('chessboard');
const synth = window.speechSynthesis;
let board = [
    ['','','','🎈','','',''],
    ['','','🎈','','🎈','',''],
    ['','🎈','','','','🎈',''],
    ['🎈','','','馬','','','🎈'],
    ['','🎈','','','','🎈',''],
    ['','','🎈','','🎈','',''],
    ['','','','🎈','','',''],];
let originalBoard = board;
let qwertyBoardState = board;
let red_or_black = 1 ;
function tutorial () {
     window.location.href='./tutorial/tutorial.html';
}
function changeBoard(){
    if(board[3][3]=='馬'){
    board = [
        ['','','','🎈','','',''],
        ['','','🎈','','🎈','',''],
        ['','🎈','','','','🎈',''],
        ['🎈','','','騏','','','🎈'],
        ['','🎈','','','','🎈',''],
        ['','','🎈','','🎈','',''],
        ['','','','🎈','','',''],];
        updateChessboard();
    }else{
        board = [
            ['','','','🎈','','',''],
            ['','','🎈','','🎈','',''],
            ['','🎈','','','','🎈',''],
            ['🎈','','','馬','','','🎈'],
            ['','🎈','','','','🎈',''],
            ['','','🎈','','🎈','',''],
            ['','','','🎈','','',''],];
        updateChessboard();
    }
}
function createChessboard() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');     
            cell.classList.add('cell');
            if (board[i][j] !== '') {
                cell.textContent = board[i][j];
                if (board[i][j] === '傌' || board[i][j] === '馬') {
                    cell.classList.add('red');
                } else {
                    cell.classList.add('black');
                }
            }
            if (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[i][j])) {
                cell.classList.add('red');
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
            isGameOver(board);
            moveAllPieces(board);
            //aiTurn();
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
    if ((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[fromRow][fromCol]) && ['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[toRow][toCol]))||(((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明',''].includes(board[fromRow][fromCol]) == false) && (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明',''].includes(board[toRow][toCol]) == false)))) {
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
    if(piece === '🎈'){
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        if(dx <= 1 && dy <= 1 && board[toRow][toCol] === ''){
            return true;
        }
    }
    return false;
}
function isValidHorseMove(fromRow, fromCol, toRow, toCol) {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    if ((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[fromRow][fromCol]) && ['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[toRow][toCol]))||(((['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明',''].includes(board[fromRow][fromCol]) == false) && (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明',''].includes(board[toRow][toCol]) == false)))) {
        return false;
    }
    if (red_or_black === -1 && ['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[fromRow][fromCol])){
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
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';
    updateChessboard();
}
function updateChessboard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        cell.textContent = board[row][col];
        if (board[row][col] !== '') {
            if (['兵', '鋭', '炮', '馬', '仕', '截', '追', '熥', '車', '騏', '相', '明'].includes(board[row][col])||(['--'].includes(board[row][col])&&row>6)) {
                cell.classList.remove('black');
                cell.classList.add('red');
            }else {
                cell.classList.remove('red');
                cell.classList.add('black');
            }
        }
    });
}
createChessboard();

function isGameOver(board){
    let hasRedGeneral = false;
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === '🎈') {
                hasRedGeneral = true;
            }
        }
    }
    if (hasRedGeneral==false) {
        alert("你吃掉了所有的🎈，你赢了！");
        window.location.href = "./tutorial.html";
        return true;
    }
    return false;
}

function moveAllPieces(board) {
    let moves = [];
    for (let row = 0; row < 7 ; row++) {
        for (let col = 0; col < 7 ; col++) {
            const piece = board[row][col];
            if (piece == '🎈') {
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
    playerTurn();
}

function simulateMove(board, move) {
    const newBoard = deepCopyBoard(board);
    const { row, col, toRow, toCol } = move;
    newBoard[toRow][toCol] = newBoard[row][col];
    newBoard[row][col] = '';
    return newBoard;
}
function makeMove(board, move){
    const { row, col, toRow, toCol } = move;
    board[toRow][toCol] = board[row][col];
    board[row][col] = '';
    return board;   
}
function playerTurn() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick); 
        cell.addEventListener('click', handleCellClick);
    });
}
playerTurn();
