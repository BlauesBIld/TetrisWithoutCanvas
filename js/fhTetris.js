let playField = [];
let playFieldElements = [];
let tilesNames = ["I", "T", "S", "Z", "L", "J", "O"];

let staticPlayFieldSave = [];

for (let i = 0; i < 20; i++) {
    playField.push([]);
    playFieldElements.push([]);
    for (let j = 0; j < 10; j++) {
        playField[i].push(0);
    }
}

let playFieldContainer = document.getElementById("playFieldContainer");
let timeStampTick;
let delayBetweenTicks = 500;
let currentTile = undefined;
let queue = [];
let spawnRow = 0, spawnColumn = 5;

for (let i = 0; i < 5; i++) {
    queue.push(getRandomTile());
}

document.addEventListener("keydown", ev => {
    switch (ev.key){
        case "ArrowLeft":
            currentTile.moveLeft();
            break;
        case "ArrowRight":
            currentTile.moveRight();
            break;
    }
})

console.log(queue);

initializeField();

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
    console.log(playField);
    staticPlayFieldSave = JSON.parse(JSON.stringify(playField));
    console.log(staticPlayFieldSave);
    currentTile = new Tile(queue.shift());
    queue.push(getRandomTile());
}

function doTetrisLogic() {
    if (currentTile === undefined) {
        setNewCurrentTileFromQueue();
    }

    currentTile.moveDown();
    clearPlayField();

    currentTile.updateBlocksOnPlayField();
}

function drawTetrisField() {
    for (let i = 0; i < playField.length; i++) {
        for (let j = 0; j < playField[i].length; j++) {
            switch (playField[i][j]){
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
                    playFieldElements[i][j].style.backgroundColor = "yellow";
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