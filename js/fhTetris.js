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

/***
 * Clears and initializes the leaderboard with a HTTP GET Request to my server, where a backend webservices is running.
 */
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

/***
 * Just adding random tile-names to the queue, which are not already in the queue.
 */
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

/***
 * Initializes the front end tetris field, which consists of 20 div-rows and each row consists of 10 div-fields which represent a tetris block.
 */
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

/***
 * swaps the currentTile with the tile in the hold-space
 */
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

/***
 * Displays the time since start of the game on the left side of the screen
 * @param time time since start in ms
 */
function setTextOfTimeOnTheLeftContainer(time) {
    timeElement.innerHTML = Math.floor(time / 1000 / 60) + ":" + ("0" + Math.floor(time / 1000) % 60).slice(-2) + ":" + ("0" + Math.floor(time / 10) % 100).slice(-2);
}

/***
 * Displays how many lines u need to clear to end the game.
 */
function setTextOfLinesLeftToBeClearedOnTheLeftContainer() {
    linesLeftToBeClearedElement.innerHTML = (linesNeededToFinish - countClearedLines < 0 ? 0 : linesNeededToFinish - countClearedLines) + "L";
}

/***
 * logic to handle movement sideways and down input
 * @param timestamp used to set a delay between moving down and between sideways movements.
 */
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

/***
 * The gameloop.
 * @param timestamp when the gameloop is called in ms since the website is opened. (same as window.performance.now())
 */
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

/***
 * Sets the new currentTile from one of the names in the queue.
 * Skips also to the next tick, so the tile gets instantly drawn.
 */
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

/***
 * Adds a new empty line at the top of the field. Is used when a line gets cleared.
 * @param fieldElement either playField or staticField
 */
function addNewEmptyLineToFieldInTheFront(fieldElement) {
    fieldElement.unshift([])
    fieldElement[0].push(-1);
    for (let j = 1; j < 11; j++) {
        fieldElement[0].push(0);
    }
    fieldElement[0].push(-2);
}

/***
 * For the amount of linesCleared corresponding number is added to the score and then displayed on the website:
 * 1 Line  : 40 points;
 * 2 Lines : 100 points;
 * 3 Lines : 300 points;
 * 4 Lines : 1200 points;
 * @param amountLinesCleared
 */
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

/***
 * Each time the currentTile is newly set, this method is called to check if there are full lines which need to be cleared.
 * Therefore, the staticfield needs to be adjusted for the next currentTile.
 * At the end it also checks if the amountOfClearedLines is higher than the neededAmountOfClearedLines to check if the game has ended.
 */
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

/***
 * Just moves the currentTile down by 1.
 * Previously had more functionality but I refactored the code and let it stay like this.
 */
function doTetrisLogic() {
    currentTile.move("down");
}

/***
 * Set the color of each div in the playfield corresponding to the number in each field.
 * The first to 2 rows are invisble and needed to be able to spawn the currentTile above the visible playField
 */
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

/***
 * Gets a random name of a tile which is not already in the queue.
 * @returns {string}
 */
function getRandomTile() {
    let randoTile = tilesNames[Math.floor(Math.random() * tilesNames.length)];
    while (queue.includes(randoTile)) {
        randoTile = tilesNames[Math.floor(Math.random() * tilesNames.length)];
    }
    return randoTile;
}

/***
 * Everything that is on the staticField will now be saved in the playField.
 */
function setPlayFieldToStaticField() {
    playField = JSON.parse(JSON.stringify(staticPlayFieldSave));
}

/***
 * The current playField with the currentTile will be saved to the staticField so when the next Tile spawns the previous currentTile now counts the staticField.
 */
function setStaticFieldToPlayField() {
    staticPlayFieldSave = JSON.parse(JSON.stringify(playField));
}

/***
 * Used to reset the delay of the currentTick when the player moves a piece down.
 */
function setElapsedTimeBetweenTicksToZero() {
    timeStampTick = undefined;
}

/***
 * Used to skip a tick.
 */
function setElapsedTimeBetweenTicksToMax() {
    elapsedSinceLastTick = Number.MAX_SAFE_INTEGER;
}

/***
 * Displays the middleWindow after a game is finished (either lost or won)
 * @param died check if the player died when a piece spawned inside another piece or if the player has cleared enough lines.
 */
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

/***
 * Starts the game and sets all necessary values back to default values at the beginning of the round.
 * Also sets all windows to invisible.
 */
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

/***
 * Resets all the necessary values of the game, used in startGame();
 */
function resetPlayField() {
    iterationOfTiles = 0;
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

    setStaticFieldToPlayField();
    drawTetrisField();
}

/***
 * Functionality to hold a tile.
 */
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

/***
 * When the needed amount of lines are cleared the player can enter a nickname and his time will be sent to the server.
 */
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
            refreshLeaderBoard();
            gameOver(true);
        })
}

/***
 * Refreshes the leaderboard entries.
 */
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

/***
 * Called in the gameloop to see if the player is currently pressing a sideways move button.
 */
function handleSideWaysInput() {
    if (isGameActive) {
        if (currentTile !== undefined && sideWaysInput !== "") {
            currentTile.move(sideWaysInput);
        }
    }
}

/***
 * Called in the gameloop to see if the player is currently pressing the move down button.
 */
function handleDownInput() {
    if (isGameActive) {
        if (downInput > 0) {
            if (currentTile !== undefined && !currentTile.checkIfReachedBottom()) {
                currentTile.move("down");
                setElapsedTimeBetweenTicksToZero();
            }
        }
    }
}
