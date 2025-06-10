document.addEventListener('click', function(event) {
    const target = event.target;
    if (target.tagName === 'TD' && target.textContent === '马') {
        const row = parseInt(target.dataset.row, 10);
        const col = parseInt(target.dataset.col, 10);
        const possibleMoves = getKnightMoves(row, col);

        // 显示可能的移动
        possibleMoves.forEach(([moveRow, moveCol]) => {
            const cell = document.querySelector(`td[data-row="${moveRow}"][data-col="${moveCol}"]`);
            cell.style.backgroundColor = 'yellow';
        });

        // 当点击其他地方时，重置背景颜色
        document.addEventListener('click', function reset(event) {
            possibleMoves.forEach(([moveRow, moveCol]) => {
                const cell = document.querySelector(`td[data-row="${moveRow}"][data-col="${moveCol}"]`);
                cell.style.backgroundColor = cell.classList.contains('black') ? '#b58863' : '#eddca2';
            });
            document.removeEventListener('click', reset);
        }, { once: true });
    }
});

function getKnightMoves(row, col) {
    const moves = [
        [row - 2, col + 1], [row - 2, col - 1],
        [row - 1, col + 2], [row - 1, col - 2],
        [row + 1, col + 2], [row + 1, col - 2],
        [row + 2, col + 1], [row + 2, col - 1]
    ];

    // 检查移动是否在棋盘内
    return moves.filter(([moveRow, moveCol]) => moveRow >= 0 && moveRow < 10 && moveCol >= 0 && moveCol < 9);
}
