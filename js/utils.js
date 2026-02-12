
function shuffleArray(array) {

    for (var i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

function countMinesAround(board, row, col) {
    let count = 0

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i < 0 || i >= board.length ||
                j < 0 || j >= board[i].length) continue
            if (i === row && j === col) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}
