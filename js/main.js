
var gLevel = {
    SIZE: 8,
    MINES: 14
}

var gBoard

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    timerInterval: null
}

var gLives = 3
var gHints = [true, true, true]
var gIsHintActive = false
var gSafeClicks = 3

function setLevel(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInit()
}

function onInit() {

    gGame.isOn = true
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    gLives = 3
    gHints = [true, true, true]
    gSafeClicks = 3

    document.getElementById('smiley').innerText = '😃'
    updateLivesDisplay()
    updateSafeClickBtn()

    gBoard = buildBoard()
    renderBoard(gBoard)

    showBestScore()
}

function startTimer() {
    clearInterval(gGame.timerInterval)
    gGame.secsPassed = 0
    document.getElementById('timer').innerText = `Time: 0s`

    gGame.timerInterval = setInterval(() => {
        gGame.secsPassed++
        document.getElementById('timer').innerText = `Time: ${gGame.secsPassed}s`
    }, 1000)
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
    console.log(strHTML)
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function cellClicked(i, j) {

    if (!gGame.isOn) return

    const cell = gBoard[i][j]
    
    if (cell.isRevealed || cell.isMarked) return

    if (gIsHintActive) {
        revealHintCells(i, j)
        return
    }

    if (gGame.revealedCount === 0) {
        placeMines(gBoard, gLevel.MINES, i, j)
        setMinesNegsCount(gBoard)
        startTimer()
    }

    if (cell.isMine) {
        gLives--
        updateLivesDisplay()

        if (gLives === 0) {
            revealAllMines()
            gGame.isOn = false
            clearInterval(gGame.timerInterval)
            document.getElementById('smiley').innerText = '🤯'
            alert('Boom! You lost your last life. Game over!')
            return
        } else {
            alert('Oops! You lost a life. Live left: ' + gLives)
            document.getElementById('smiley').innerText = '😧'
            setTimeout(() => {
                if (gGame.isOn) document.getElementById('smiley').innerText = '😃'
            }, 1000)
            return
        }
    }
    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, i, j)
    } else {
        revealCell(cell, i, j)
    }
    checkGameOver()
}

function revealCell(cell, i, j) {

    if (cell.isRevealed) return

    cell.isRevealed = true
    gGame.revealedCount++

    const elCell = document.getElementById(getCellId(i, j))
    elCell.classList.add('revealed')

    if (cell.minesAroundCount === 0) {
        elCell.innerHTML = ''
    } else {
        elCell.innerHTML = cell.minesAroundCount
    }
}

function expandShown(board, rowIdx, colIdx) {

    const cell = board[rowIdx][colIdx]
    if (cell.isRevealed || cell.isMarked) return

    revealCell(cell, rowIdx, colIdx)

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

    if (gGame.revealedCount !== safeCells) return

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            const cell = gBoard[i][j]
            if (cell.isMine && !cell.isMarked) return
        }
    }

    gGame.isOn = false
    clearInterval(gGame.timerInterval)
    document.getElementById('smiley').innerText = '😎'
    alert('Victory!')
    saveBestScore()
}

function saveBestScore() {
    const best = localStorage.getItem('bestScore')
    if (!best || gGame.secsPassed < best) {
        localStorage.setItem('bestScore', gGame.secsPassed)
    }
}

function showBestScore() {
    const best = localStorage.getItem('bestScore') || 0
    document.getElementById('best-score').innerText = `Best: ${best}s`
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

function updateLivesDisplay() {
    for (var i = 1; i <= 3; i++) {
        document.getElementById('life' + i).style.visibility = (i <= gLives) ? 'visible' : 'hidden'
    }
}

function useHint(hintIdx) {
    if (!gHints[hintIdx] || gIsHintActive || !gGame.isOn) return

    gHints[hintIdx] = false
    gIsHintActive = true

    document.querySelectorAll('.hints-container .hint')[hintIdx].style.visibility = 'hidden'
    alert('Hint activated! Click a cell to reveal temporarily')
}

function revealHintCells(rowIdx, colIdx) {
    const cellsToReveal = []

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const cell = gBoard[i][j]

            if (!cell.isRevealed) {
                cellsToReveal.push({ i, j, content: cell.isMine ? '💣' : cell.minesAroundCount })
                const elCell = document.getElementById(getCellId(i, j))
                elCell.innerHTML = cell.isMine ? '💣' : cell.minesAroundCount
                elCell.classList.add('hint-reveal')
            }
        }
    }

    setTimeout(() => {
        cellsToReveal.forEach(c => {
            const elCell = document.getElementById(getCellId(c.i, c.j));
            elCell.innerHTML = '';
            elCell.classList.remove('hint-reveal');
        });
        gIsHintActive = false;

        if (gGame.isOn) document.getElementById('smiley').innerText = '😃';
    }, 1500);
}

function useSafeClick(){

    if(!gGame.isOn || gSafeClicks === 0) return

    const safeCells = []
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j< gBoard[i].length; j++){
            const cell = gBoard[i][j]
            if(!cell.isMine && !cell.isRevealed){
                safeCells.push({i, j})
            }
        }
    }
    if(safeCells.length === 0) return

    const randomIdx = Math.floor(Math.random()* safeCells.length)
      const safeCell = safeCells[randomIdx]
    const elCell = document.getElementById(getCellId(safeCell.i, safeCell.j))

        elCell.classList.add('safe-click-reveal');

    setTimeout(() => {
        elCell.classList.remove('safe-click-reveal');
    }, 1500);

    gSafeClicks--
   updateSafeClickBtn()
}

function updateSafeClickBtn() {
    document.getElementById('safe-click-btn').innerText = `🛡️ Safe Click (${gSafeClicks})`;
}


