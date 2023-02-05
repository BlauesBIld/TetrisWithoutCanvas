class Tile {

    blocksVisual;
    previewBlocksVisual;

    position = {
        row: 0,
        column: 0
    };

    tileName;

    placed = false;

    rotation = 0;

    constructor(tileName) {
        this.tileName = tileName;
        this.initializeBlocksForTile();
        this.position.row = spawnRow;
        this.position.column = spawnColumn - Math.ceil(this.blocksVisual[0].length / 2);
        if (this.checkIfRotationIsBlockByOtherBlock(this.blocksVisual, this.position.row + 1, this.position.column)) {
            gameOver(true);
        }
    }


    initializeBlocksForTile() {
        this.blocksVisual = blocksVisualConfig[this.tileName];
        this.previewBlocksVisual = [];
        for (let i = 0; i < this.blocksVisual.length; i++) {
            this.previewBlocksVisual.push([]);
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                this.previewBlocksVisual[i].push(this.blocksVisual[i][j]===0?this.blocksVisual[i][j]:this.blocksVisual[i][j]+7);
            }
        }
    }

    moveDown() {
        if (!this.checkIfReachedBottom()) {
            this.position.row++;
        } else {
            setStaticFieldToPlayField();
            this.placed = true;
            currentTile = undefined;
            checkAndDeleteIfLinesCleared();
        }
    }

    move(direction) {
        if (direction === "right") {
            this.moveRight();
        } else if (direction === "left") {
            this.moveLeft();
        } else if (direction === "down") {
            this.moveDown();
        }
        if (!this.placed) {
            setPlayFieldToStaticField();
            this.updateBlocksOnPlayField();
            drawTetrisField();
        }
    }

    moveRight(checkForBorder = true) {
        if (!checkForBorder || !this.touchingRightBorder()) {
            this.position.column++;
        }
    }

    moveLeft(checkForBorder = true) {
        if (!checkForBorder || !this.touchingLeftBorder()) {
            this.position.column--
        }
    }

    moveUp() {
        this.position.row--
    }

    updateBlocksOnPlayField() {
        this.setNumbersOfPreviewOnPlayfield();
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if (this.blocksVisual[i][j] !== 0 && playField[this.position.row + i][this.position.column + j] !== undefined) {
                    playField[this.position.row + i][this.position.column + j] = this.blocksVisual[i][j];
                }
            }
        }
    }

    checkIfReachedBottom() {
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if ((this.blocksVisual[i + 1] === undefined || this.blocksVisual[i + 1][j] === 0) && (this.blocksVisual[i][j] !== 0)) {
                    if (playField[this.position.row + i + 1] === undefined) {
                        return true;
                    }
                    if (this.blocksVisual[i][j] !== 0 && playField[this.position.row + i + 1][this.position.column + j] > 0 && playField[this.position.row + i + 1][this.position.column + j] <= 7) {
                        return true;
                    }
                    if (this.blocksVisual[i][j] !== 0 && this.position.row + i >= 20) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    touchingLeftBorder() {
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if ((this.blocksVisual[i][j - 1] === undefined || this.blocksVisual[i][j - 1] === 0) && this.blocksVisual[i][j] > 0) {
                    if (playField[this.position.row][this.position.column + j - 1] === -1 || playField[this.position.row + i][this.position.column + j - 1] > 0 && playField[this.position.row + i + 1][this.position.column + j] <= 7) {
                        return true;
                    }
                }
            }
        }
    }

    touchingRightBorder() {
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if ((this.blocksVisual[i][j + 1] === undefined || this.blocksVisual[i][j + 1] === 0) && this.blocksVisual[i][j] > 0) {
                    if (playField[this.position.row][this.position.column + j + 1] === -2 || playField[this.position.row + i][this.position.column + j + 1] > 0) {
                        return true;
                    }
                }
            }
        }
    }

    moveDownUntilItCannotAnymore() {
        while (this.placed === false) {
            this.move("down");
        }
    }


    rotate(direction) {
        if (this.tileName !== "O") {
            let placeHolderForBlocksVisual = this.getRotatedTile(direction),
                placerHolderRotation = this.rotation + direction;

            if (placerHolderRotation < 0) {
                placerHolderRotation = 3;
            } else if (placerHolderRotation > 3) {
                placerHolderRotation = 0;
            }

            if (!this.checkIfRotationIsBlockByOtherBlock(placeHolderForBlocksVisual, this.position.row, this.position.column)) {
                this.blocksVisual = placeHolderForBlocksVisual;
                this.rotation = placerHolderRotation;
            } else {
                if (this.tileName === "I") {
                    let rotationName = this.rotation + "." + placerHolderRotation;
                    for (let i = 0; i < rotationChecksForI[rotationName].length; i++) {
                        if (!this.checkIfRotationIsBlockByOtherBlock(placeHolderForBlocksVisual, this.position.row + rotationChecksForI[rotationName][i][1], this.position.column + rotationChecksForI[rotationName][i][0])) {
                            this.blocksVisual = placeHolderForBlocksVisual;
                            this.rotation = placerHolderRotation;
                            this.position.row += rotationChecksForI[rotationName][i][1];
                            this.position.column += rotationChecksForI[rotationName][i][0];
                            break;
                        }
                    }
                } else {
                    let rotationName = this.rotation + "." + placerHolderRotation;
                    for (let i = 0; i < rotationChecks[rotationName].length; i++) {
                        if (!this.checkIfRotationIsBlockByOtherBlock(placeHolderForBlocksVisual, this.position.row + rotationChecks[rotationName][i][1], this.position.column + rotationChecks[rotationName][i][0])) {
                            this.blocksVisual = placeHolderForBlocksVisual;
                            this.rotation = placerHolderRotation;
                            this.position.row += rotationChecks[rotationName][i][1];
                            this.position.column += rotationChecks[rotationName][i][0];
                            break;
                        }
                    }
                }
            }

            setPlayFieldToStaticField();
            this.updateBlocksOnPlayField();
            drawTetrisField();
        }
    }

    getRotatedTile(direction) {
        if (direction === 1) {
            return this.blocksVisual[0].map((val, index) => this.blocksVisual.map(row => row[index]).reverse());
        } else if (direction === -1) {
            return this.blocksVisual[0].map((val, index) => this.blocksVisual.map(row => row[row.length - 1 - index]));
        }
    }

    checkIfRotationIsBlockByOtherBlock(placeHolderForBlocksVisual, row, column) {
        for (let i = 0; i < placeHolderForBlocksVisual.length; i++) {
            for (let j = 0; j < placeHolderForBlocksVisual[i].length; j++) {
                if (placeHolderForBlocksVisual[i][j] > 0 && staticPlayFieldSave[row + i][column + j] !== 0) {
                    return true;
                }
            }
        }
    }

    setNumbersOfPreviewOnPlayfield() {
        let row = this.position.row;
        while(!this.checkIfRotationIsBlockByOtherBlock(this.blocksVisual, row, this.position.column)){
            row++;
        }
        row--;

        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if (this.blocksVisual[i][j] !== 0 && playField[row + i][this.position.column + j] !== undefined) {
                    playField[row + i][this.position.column + j] = this.blocksVisual[i][j]===0?this.blocksVisual[i][j]:this.blocksVisual[i][j]+7;
                }
            }
        }
    }
}