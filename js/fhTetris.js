let playField = [];
let playFieldElements = [];
let tilesNames = ["I", "T", "S", "Z", "L", "J", "O"];

let staticPlayFieldSave = [];

let isGameActive = false;
let middleWindow = document.getElementById("gameOverContainer");
middleWindow.style.display = "block";

let score = 0;
let scoreDisplay = document.getElementById("scoreDisplay");

for (let i = 0; i < 22; i++) {
    playField.push([]);
    playFieldElements.push([]);
    playField[i].push(-1);
    for (let j = 1; j < 11; j++) {
        if (i < 21) {
            playField[i].push(0);
        } else {
            playField[i].push(-3);
        }
    }
    playField[i].push(-2);
}

let playFieldContainer = document.getElementById("playFieldContainer");
let timeStampTick;
let delayBetweenTicks = 1000;
let currentTile = undefined;
let queue = [];
let spawnRow = 0, spawnColumn = 5;
let elapsed = Number.MAX_SAFE_INTEGER;

let invisibleTileOpacity = "0%";

function initializeQueue() {
    for (let i = 0; i < 5; i++) {
        queue.push(getRandomTile());
    }
}

initializeQueue();
console.log(queue);

initializeField();
drawTetrisField();

window.requestAnimationFrame(gameLoop);

function initializeField() {
    for (let i = 0; i < playField.length; i++) {
        let rowElement = document.createElement("div");
        rowElement.className = "row";
        rowElement.id = "row" + i;
        playFieldContainer.appendChild(rowElement);
        for (let j = 0; j < playField[i].length; j++) {
            let emptyBlock = document.createElement("div");
            emptyBlock.className = "field";
            emptyBlock.id = "field" + i + "" + j;
            emptyBlock.style.backgroundColor = "black";
            rowElement.appendChild(emptyBlock);
            playFieldElements[i].push(emptyBlock);
        }
    }
}

function gameLoop(timestamp) {
    if (isGameActive) {
        if (timeStampTick === undefined) {
            timeStampTick = timestamp;
        }

        if (currentTile === undefined) {
            setNewCurrentTileFromQueue();
        } else {
            elapsed = timestamp - timeStampTick;
        }

        if (elapsed > delayBetweenTicks) {
            doTetrisLogic();
            drawTetrisField();
            timeStampTick = timestamp;
        }

        window.requestAnimationFrame(gameLoop);
    }
}

function setNewCurrentTileFromQueue() {
    setStaticFieldToPlayField();
    currentTile = new Tile(queue.shift());
    queue.push(getRandomTile());
    setElapsedTimeBetweenTicksToMax();
    setPlayFieldToStaticField();
}

function addNewEmptyLineToFieldInTheFront(fieldElement) {
    fieldElement.unshift([])
    fieldElement[0].push(-1);
    for (let j = 1; j < 11; j++) {
        fieldElement[0].push(0);
    }
    fieldElement[0].push(-2);
}

function calculateAndAddPoints(amountLinesCleared) {
    switch (amountLinesCleared) {
        case 1:
            score += 40;
            break;
        case 2:
            score += 100;
            break;
        case 3:
            score += 300;
            break;
        case 4:
            score += 1200;
            break;
    }
    scoreDisplay.innerHTML = "Score: " + score;

}

function checkAndDeleteIfLinesCleared() {
    let linesCleared = [];
    for (let i = 0; i < staticPlayFieldSave.length - 1; i++) {
        let singleLineCleared = true;
        for (let j = 0; j < staticPlayFieldSave[i].length; j++) {
            if (staticPlayFieldSave[i][j] === 0) {
                singleLineCleared = false;
                break;
            }
        }
        if (singleLineCleared) {
            linesCleared.push(i);
        }
    }

    let newStaticField = [];
    for (let i = 0; i < staticPlayFieldSave.length; i++) {
        if (!linesCleared.includes(i)) {
            newStaticField.push(staticPlayFieldSave[i]);
        } else {
            addNewEmptyLineToFieldInTheFront(newStaticField);
        }
    }

    staticPlayFieldSave = newStaticField;
    setPlayFieldToStaticField();
    drawTetrisField();
    calculateAndAddPoints(linesCleared.length);
}

function doTetrisLogic() {
    currentTile.move("down");
}

function drawTetrisField() {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < playField[i].length; j++) {
            playFieldElements[i][j].style.opacity = invisibleTileOpacity;
        }
    }

    for (let i = 2; i < playField.length; i++) {
        for (let j = 0; j < playField[i].length; j++) {
            switch (playField[i][j]) {
                case 7:
                    playFieldElements[i][j].style.backgroundColor = "turquoise";
                    break;
                case 6:
                    playFieldElements[i][j].style.backgroundColor = "yellow";
                    break;
                case 5:
                    playFieldElements[i][j].style.backgroundColor = "royalblue";
                    break;
                case 4:
                    playFieldElements[i][j].style.backgroundColor = "orange";
                    break;
                case 3:
                    playFieldElements[i][j].style.backgroundColor = "red";
                    break;
                case 2:
                    playFieldElements[i][j].style.backgroundColor = "greenyellow";
                    break;
                case 1:
                    playFieldElements[i][j].style.backgroundColor = "blueviolet";
                    break;
                case 0:
                    playFieldElements[i][j].style.backgroundColor = "black";
                    break;
                default:
                    playFieldElements[i][j].style.opacity = invisibleTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "grey";
                    break;

            }
        }
    }
}

function getRandomTile() {
    let randoTile = tilesNames[Math.floor(Math.random() * tilesNames.length)];
    while (queue.includes(randoTile)) {
        randoTile = tilesNames[Math.floor(Math.random() * tilesNames.length)];
    }
    return randoTile;
}

function setPlayFieldToStaticField() {
    playField = JSON.parse(JSON.stringify(staticPlayFieldSave));
}

function setStaticFieldToPlayField() {
    staticPlayFieldSave = JSON.parse(JSON.stringify(playField));
}

function setElapsedTimeBetweenTicksToZero() {
    elapsed = 0;
}

function setElapsedTimeBetweenTicksToMax() {
    elapsed = Number.MAX_SAFE_INTEGER;
}

function gameOver() {
    middleWindow.style.display = "block";
    middleWindow.children[0].innerHTML = "Game over!";
    middleWindow.children[1].innerHTML = "Press [R] to \n restart!";
    isGameActive = false;
}

function startGame() {
    middleWindow.style.display = "none";
    resetPlayField();
    requestAnimationFrame(gameLoop);
    isGameActive = true;
}

function resetPlayField() {
    playField = [];
    staticPlayFieldSave = [];
    queue = [];
    currentTile = undefined;

    for (let i = 0; i < 22; i++) {
        playField.push([]);
        playField[i].push(-1);
        for (let j = 1; j < 11; j++) {
            if (i < 21) {
                playField[i].push(0);
            } else {
                playField[i].push(-3);
            }
        }
        playField[i].push(-2);
    }

    initializeQueue();
    drawTetrisField();
}

