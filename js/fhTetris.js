let playField = [];
let playFieldElements = [];
const tilesNames = ["I", "T", "S", "Z", "L", "J", "O"];

let staticPlayFieldSave = [];
let queue = [];

let isGameActive = false;
const gameOverWindow = document.getElementById("gameOverContainer");
gameOverWindow.style.display = "block";

let score = 0;
const scoreDisplay = document.getElementById("scoreDisplay");

const queueDisplay = new QueueDisplay();

const holdDisplay = new HoldDisplay();
let usedHold = false;
let usedHoldOnIteration = -1;
let iterationOfTiles = 0;
let itemNameBeforeSwapping = undefined;

let leaderBoardEntries = [];
const leaderBoardContainer = document.getElementById("leaderBoardContainer");

let timeStampGameStarted = 0;
let finalTimeGameEnded = 0;
const timeElement = document.getElementById("timeText");
const timeElementOnMiddleWindow = document.getElementById("timeDisplayOnMiddleWindow");
let countClearedLines = 0;
const linesNeededToFinish = 40;
const linesLeftToBeClearedElement = document.getElementById("linesLeftText");
linesLeftToBeClearedElement.innerHTML = linesNeededToFinish + "L";
const submitTimeWindow = document.getElementById("submitTimeContainer");
submitTimeWindow.style.display = "none";
const nameInput = document.getElementById("leaderBoardNameInput");

refreshLeaderBoard();

function initializeLeaderBoard() {
    $('.leaderBoardEntry').remove();
    for (let i = 0; i < leaderBoardEntries.length; i++) {
        let elementLeaderBoardEntry = document.createElement("div");
        elementLeaderBoardEntry.className = "leaderBoardEntry";
        let elementText = document.createElement("p");
        elementText.innerHTML = leaderBoardEntries[i].name + "<br>" + leaderBoardEntries[i].getTimeFromMilliSecondsToString();

        elementLeaderBoardEntry.appendChild(elementText);

        let widthInPercent = 100 - (i * 6) < 80 ? 80 : 100 - (i * 6);
        let heightInPercent = 12 - (i) < 8 ? 8 : 12 - (i);
        let fontSizeInPx = 32 - (i * 3) < 20 ? 20 : 32 - (i * 3);
        elementLeaderBoardEntry.style.width = widthInPercent + "%";
        elementLeaderBoardEntry.style.height = heightInPercent + "%";
        elementLeaderBoardEntry.style.fontSize = fontSizeInPx + "px";

        leaderBoardContainer.appendChild(elementLeaderBoardEntry);
    }
}

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
let timeStampInputDown;
let timeStampInputSide;
let delayBetweenInputDown = 60;
let delayBetweenInputSide = 40;
let currentTile = undefined;
let spawnRow = 0, spawnColumn = 6;
let elapsedSinceLastTick = Number.MAX_SAFE_INTEGER;

let invisibleTileOpacity = "0%";
let previewTileOpacity = "50%";

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

function swapCurrentTileWithTileInHoldSpot() {
    if (!usedHold) {
        setStaticFieldToPlayField();
    }
    currentTile = new Tile(itemNameBeforeSwapping);
    itemNameBeforeSwapping = undefined;
    setElapsedTimeBetweenTicksToMax();
    setPlayFieldToStaticField();
    queueDisplay.refreshQueueView();
}

function setTextOfTimeOnTheLeftContainer(time) {
    timeElement.innerHTML = Math.floor(time / 1000 / 60) + ":" + ("0" + Math.floor(time / 1000) % 60).slice(-2) + ":" + ("0" + Math.floor(time / 10) % 100).slice(-2);
}

function setTextOfLinesLeftToBeClearedOnTheLeftContainer() {
    linesLeftToBeClearedElement.innerHTML = (linesNeededToFinish - countClearedLines < 0 ? 0 : linesNeededToFinish - countClearedLines) + "L";
}

function handleInputs(timestamp) {
    if (timeStampInputDown === undefined) {
        timeStampInputDown = timestamp;
    }
    if (timeStampInputSide === undefined) {
        timeStampInputSide = timestamp;
    }

    if (timestamp - timeStampInputDown > delayBetweenInputDown) {
        handleDownInput();
        timeStampInputDown = timestamp;
    }

    if (timestamp - timeStampInputSide > delayBetweenInputSide) {
        timeStampInputSide = timestamp;
        handleSideWaysInput();
    }
}

function gameLoop(timestamp) {
    if (isGameActive) {
        handleInputs(timestamp);

        setTextOfTimeOnTheLeftContainer(Date.now() - timeStampGameStarted);

        if (timeStampTick === undefined) {
            timeStampTick = timestamp;
        }

        if (currentTile === undefined) {
            if (itemNameBeforeSwapping !== undefined && holdDisplay.holdingTileName !== undefined) {
                swapCurrentTileWithTileInHoldSpot();
            } else {
                setNewCurrentTileFromQueue();
            }

            iterationOfTiles++;
            console.log(usedHoldOnIteration + " - " + iterationOfTiles);

            if (usedHoldOnIteration + 1 < iterationOfTiles) {
                usedHold = false;
            }
        } else {
            elapsedSinceLastTick = timestamp - timeStampTick;
        }

        if (elapsedSinceLastTick > delayBetweenTicks) {
            timeStampTick = timestamp;
            doTetrisLogic();
            drawTetrisField();
        }


        window.requestAnimationFrame(gameLoop);
    }
}

function setNewCurrentTileFromQueue() {
    if (!usedHold) {
        setStaticFieldToPlayField();
    }
    currentTile = new Tile(queue.shift());
    queue.push(getRandomTile());
    setElapsedTimeBetweenTicksToMax();
    setPlayFieldToStaticField();
    queueDisplay.refreshQueueView();
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

    countClearedLines += linesCleared.length;
    setTextOfLinesLeftToBeClearedOnTheLeftContainer();

    staticPlayFieldSave = newStaticField;
    setPlayFieldToStaticField();
    drawTetrisField();
    calculateAndAddPoints(linesCleared.length);
    if (countClearedLines >= linesNeededToFinish) {
        gameOver(false);
    }
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
            playFieldElements[i][j].style.opacity = "100%";
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
                    playFieldElements[i][j].style.backgroundColor = "rgba(0,0,0,0)";
                    break;
                default:
                    playFieldElements[i][j].style.opacity = invisibleTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "grey";
                    break;
                case 8:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "blueviolet";
                    break;
                case 9:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "greenyellow";
                    break;
                case 10:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "red";
                    break;
                case 11:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "orange";
                    break;
                case 12:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "royalblue";
                    break;
                case 13:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "yellow";
                    break;
                case 14:
                    playFieldElements[i][j].style.opacity = previewTileOpacity;
                    playFieldElements[i][j].style.backgroundColor = "turquoise";
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
    timeStampTick = undefined;
}

function setElapsedTimeBetweenTicksToMax() {
    elapsedSinceLastTick = Number.MAX_SAFE_INTEGER;
}

function gameOver(died) {
    if (died) {
        submitTimeWindow.style.display = "none";
        gameOverWindow.style.display = "block";
        gameOverWindow.children[0].innerHTML = "Game over!";
        gameOverWindow.children[1].innerHTML = "Press [R] to <br> restart!";
        isGameActive = false;
    } else {
        finalTimeGameEnded = Date.now() - timeStampGameStarted;
        setTextOfTimeOnTheLeftContainer(finalTimeGameEnded);
        timeElementOnMiddleWindow.innerHTML = Math.floor(finalTimeGameEnded / 1000 / 60) + ":" + ("0" + Math.floor(finalTimeGameEnded / 1000) % 60).slice(-2) + ":" + ("0" + Math.floor(finalTimeGameEnded / 10) % 100).slice(-2);
        gameOverWindow.style.display = "none";
        submitTimeWindow.style.display = "block";
        isGameActive = false;
    }
}

function startGame() {
    gameOverWindow.style.display = "none";
    submitTimeWindow.style.display = "none";
    resetPlayField();
    requestAnimationFrame(gameLoop);
    isGameActive = true;
    timeStampGameStarted = Date.now();
    countClearedLines = 0;
    setTextOfLinesLeftToBeClearedOnTheLeftContainer();
    refreshLeaderBoard();
}

function resetPlayField() {
    playField = [];
    staticPlayFieldSave = [];
    queue = [];
    initializeQueue();
    currentTile = undefined;
    holdDisplay.setHoldingTileName(undefined);

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

    drawTetrisField();
}

function holdTile() {
    if (!usedHold) {
        if (holdDisplay.holdingTileName !== undefined) {
            itemNameBeforeSwapping = holdDisplay.holdingTileName;
        }
        holdDisplay.setHoldingTileName(currentTile.tileName);
        usedHold = true;
        usedHoldOnIteration = iterationOfTiles;
        currentTile = undefined;
        setElapsedTimeBetweenTicksToMax();
    }
}

function sendLeaderBoardEntryToServer() {
    fetch("https://detschn.ddns.net/leaderboardT", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({'entry': nameInput.value + "/" + finalTimeGameEnded + "/" + Date.now()})
    })
        .then((response) => response.text())
        .then((data) => {
            console.log('Send Leaderboard entry!');
            refreshLeaderBoard();
            gameOver(true);
        })
}

function refreshLeaderBoard() {
    fetch('https://detschn.ddns.net/leaderboard')
        .then(response => response.json())
        .then(data => {
            leaderBoardEntries = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== null) {
                    leaderBoardEntries.push(new LeaderBoardEntry(data[i].name, data[i].time, data[i].timeStampCreated));
                }
            }
            initializeLeaderBoard();
        });
}

function handleSideWaysInput() {
    if (isGameActive) {
        if (sideWaysInput !== "") {
            currentTile.move(sideWaysInput);
        }
    }
}

function handleDownInput() {
    if (isGameActive) {
        if (downInput > 0) {
            if (!currentTile.checkIfReachedBottom()) {
                currentTile.move("down");
                setElapsedTimeBetweenTicksToZero();
            }
        }
    }
}
