
function shuffleArray(array) {

    for (var i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

function countMinesAround(board, rowIdx, colIdx) {
    var minesAround = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (board[i][j].isMine) {
                minesAround++
            }
        }
    }
    return minesAround
}

function getCellId(i, j) {
    return `cell-${i}-${j}`
}
