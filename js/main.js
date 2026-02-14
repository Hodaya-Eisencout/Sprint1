

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


function placeMines(board, totalMines) {

    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            emptyCells.push({ i, j })
        }
    }
    console.log('emptyCells : ', emptyCells)
    shuffleArray(emptyCells)

    console.log('emptyCells after shuff: ', emptyCells)

    for (var i = 0; i < totalMines; i++) {
        const cellPos = emptyCells[i]

        console.log('cellPos: ', cellPos)

        board[cellPos.i][cellPos.j].isMine = true
    }
}

gBoard = buildBoard()
console.table(gBoard)
console.log(gBoard)

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]

            const cellId = getCellId(i, j)

            strHTML += `<td id= "${cellId}" class="cell"
                        onclick="cellClicked(${i},${j})">
                        </td>`
        }
        strHTML += `</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

renderBoard(gBoard)
console.clear()
console.table(gBoard)

function cellClicked(i, j) {

    const cell = gBoard[i][j]
    const cellId = getCellId(i, j)

    if (cell.isMine) {
        document.getElementById(cellId).innerText = '💣'
        alert('boom, game over!')
        return
    }

    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, i, j)
    } else {
        cell.isShown = true
        document.getElementById(cellId).innerHTML = cell.minesAroundCount 
   }
}
console.table(gBoard)


function expandShown(board, rowIdx, colIdx) {

    const cell = board[rowIdx][colIdx]
    if (cell.isShown || cell.isMarked) return

    cell.isShown = true
    const cellId = getCellId(rowIdx, colIdx)
    
    if (cell.minesAroundCount === 0) {
        document.getElementById(cellId).innerHTML = ''
    } else {
        document.getElementById(cellId).innerHTML = cell.minesAroundCount
    }

    if (cell.minesAroundCount === 0) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j < + colIdx + 1; j++) {
                if (j < 0 || j > + board[i].length) continue
                if (i === rowIdx && j === colIdx) continue

                expandShown(board, i, j)
            }
        }
    }
}

