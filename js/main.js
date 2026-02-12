

const SIZE = 8
const MINES = 14
var gBoard
var gGame = {
    showCount: 0,
    markedCount: 0
}


function buildBoard() {
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board[i] = []
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                isMine: false,
                minesAroundCount: 0,
                isShown: false,
                isMarked: false
            }
            console.log('board[i][j]:', board[i][j])
        }
    }
    placeMines(board, MINES)

    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++)
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countMinesAround(board, i, j)
            }
    }
    return board
}


function placeMines(board, minesCount) {

    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            emptyCells.push({ i, j })
        }
    }
    console.log('emptyCells : ', emptyCells)
    shuffleArray(emptyCells)

    console.log('emptyCells after shuff: ', emptyCells)

    for (var i = 0; i < minesCount; i++) {
        const cellPos = emptyCells[i]

        console.log('cellPos: ', cellPos)
        
        board[cellPos.i][cellPos.j].isMine = true
    }
}

gBoard = buildBoard()
console.table(gBoard)
console.log(gBoard)