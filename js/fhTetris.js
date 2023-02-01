let playField = [];
let playFieldElements = [];
let tilesNames = ["I", "T", "S", "Z", "L", "J", "O"];

let staticPlayFieldSave = [];

for (let i = 0; i < 22; i++) {
    playField.push([]);
    playFieldElements.push([]);
    playField[i].push(-1);
    playField[i].push(-1);
    for (let j = 2; j < 12; j++) {
        if (i < 20) {
            playField[i].push(0);
        } else {
            playField[i].push(-3);
        }
    }
    playField[i].push(-2);
    playField[i].push(-2);
}

let playFieldContainer = document.getElementById("playFieldContainer");
let timeStampTick;
let delayBetweenTicks = 1000;
let currentTile = undefined;
let queue = [];
let spawnRow = 0, spawnColumn = 5;

let score = 0;

for (let i = 0; i < 5; i++) {
    queue.push(getRandomTile());
}

document.addEventListener("keydown", ev => {
    switch (ev.key.toUpperCase()) {
        case "ARROWLEFT":
        case "A":
            currentTile.move("left");
            break;
        case "ARROWRIGHT":
        case "D":
            currentTile.move("right");
            break;
        case "ARROWUP":
        case "W":
            currentTile.rotate(1);
            break;
        case "Q":
            currentTile.rotate(-1);
            break;
        case "ARROWDOWN":
        case "S":
            currentTile.move("down");
            break;
        case " ":
            currentTile.moveDownUntilItCannotAnymore();
    }
})

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
    if (timeStampTick === undefined) {
        timeStampTick = timestamp;
    }
    const elapsed = timestamp - timeStampTick;

    if (elapsed > delayBetweenTicks) {
        doTetrisLogic();
        drawTetrisField();
        timeStampTick = timestamp;
    }

    window.requestAnimationFrame(gameLoop);
}

function setNewCurrentTileFromQueue() {
    staticPlayFieldSave = JSON.parse(JSON.stringify(playField));
    currentTile = new Tile(queue.shift());
    queue.push(getRandomTile());
}

function addNewEmptyLineToFieldInTheFront(fieldElement) {
    fieldElement.unshift([])
    fieldElement[0].push(-1);
    fieldElement[0].push(-1);
    for (let j = 2; j < 12; j++) {
        fieldElement[0].push(0);
    }
    fieldElement[0].push(-2);
    fieldElement[0].push(-2);
}

function checkAndDeleteIfLinesCleared() {
    let linesCleared = [];
    for (let i = 0; i < staticPlayFieldSave.length - 2; i++) {
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
    console.log(linesCleared);
    let newStaticField = [];
    for (let i = 0; i < staticPlayFieldSave.length; i++) {
        if (!linesCleared.includes(i)) {
            newStaticField.push(staticPlayFieldSave[i]);
        } else {
            addNewEmptyLineToFieldInTheFront(newStaticField);
        }
    }
    staticPlayFieldSave = newStaticField;
    clearPlayField();
    drawTetrisField();
}

function doTetrisLogic() {
    if (currentTile === undefined) {
        setNewCurrentTileFromQueue();
    }
    currentTile.move("down");
}

function drawTetrisField() {
    for (let i = 0; i < playField.length; i++) {
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
                    playFieldElements[i][j].style.opacity = "0%";
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

function clearPlayField() {
    playField = JSON.parse(JSON.stringify(staticPlayFieldSave));
}