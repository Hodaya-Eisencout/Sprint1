
var gLevel = {
    SIZE: 8,
    MINES: 14
}

var gBoard

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function setLevel(size, mines){
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInit()
}

function onInit() {

    gGame.isOn = true
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isMine: false,
                isRevealed: false,
                isMarked: false
            }
            console.log('board[i][j]:', board[i][j])
        }
    }
    return board
}


function placeMines(board, totalMines, firstI, firstJ) {

    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            if (i === firstI && j === firstJ) continue

            emptyCells.push({ i, j })
        }
    }

    shuffleArray(emptyCells)

    console.log('emptyCells after shuff: ', emptyCells)

    for (var i = 0; i < totalMines; i++) {
        const cellPos = emptyCells[i]
        console.log('cellPos: ', cellPos)
        board[cellPos.i][cellPos.j].isMine = true
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            if (!cell.isMine) {
                cell.minesAroundCount = countMinesAround(board, i, j)
            }
        }
    }
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {

            const cellId = getCellId(i, j)

            strHTML += `<td id="${cellId}" class="cell"
                        onclick="cellClicked(${i},${j})"
                        oncontextmenu="onCellMarked(event, ${i},${j})">
                        </td>`
        }
        strHTML += `</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


console.clear()
console.table(gBoard)

function cellClicked(i, j) {

    if (!gGame.isOn) return

    const cell = gBoard[i][j]
    const cellId = getCellId(i, j)

    if (cell.isRevealed || cell.isMarked) return

    if (gGame.revealedCount === 0) {
        placeMines(gBoard, gLevel.MINES, i, j)
        setMinesNegsCount(gBoard)
    }

    if (cell.isMine) {
        revealAllMines()
        gGame.isOn = false
        alert('boom, game over!')
        return
    }

    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, i, j)
    } else {
        cell.isRevealed = true
        gGame.revealedCount++

        const elCell = document.getElementById(cellId)
        elCell.classList.add('revealed')

        elCell.innerHTML = cell.minesAroundCount
    }
    checkGameOver()
}
console.table(gBoard)


function expandShown(board, rowIdx, colIdx) {

    const cell = board[rowIdx][colIdx]
    if (cell.isRevealed || cell.isMarked) return

    cell.isRevealed = true
    gGame.revealedCount++

    const cellId = getCellId(rowIdx, colIdx)
    const elCell = document.getElementById(cellId)

    elCell.classList.add('revealed')

    if (cell.minesAroundCount === 0) {
        elCell.innerHTML = ''
    } else {
        elCell.innerHTML = cell.minesAroundCount
    }

    if (cell.minesAroundCount === 0) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= board[i].length) continue
                if (i === rowIdx && j === colIdx) continue

                expandShown(board, i, j)
            }
        }
    }
}

function onCellMarked(event, i, j) {

    if (!gGame.isOn) return

    event.preventDefault()

    const cell = gBoard[i][j]
    const cellId = getCellId(i, j)

    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        gGame.markedCount++
    } else {
        gGame.markedCount--

    }
    document.getElementById(cellId).innerHTML = cell.isMarked ? '🚩' : ''
    checkGameOver()

    console.log('Marked cell: ', i, j, 'isMarked: ', cell.isMarked)
    console.log('Total marked flags: ', gGame.markedCount)
}

function checkGameOver() {

    const totalCells = gLevel.SIZE * gLevel.SIZE
    const safeCells = totalCells - gLevel.MINES

    if (gGame.revealedCount === safeCells && 
        gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        alert('Victory!')
    }
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]

            if (cell.isMine) {
                const cellId = getCellId(i, j)
                const elCell = document.getElementById(cellId)

                elCell.classList.add('revealed')
                elCell.innerHTML = '💣'
            }
        }
    }
}