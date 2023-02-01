class Tile {

    blocksVisual;

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
        this.position.column = Math.floor(spawnColumn - this.blocksVisual[0].length / 2);
    }

    initializeBlocksForTile() {
        switch (this.tileName) {
            case "T":
                this.blocksVisual = [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
                break;
            case "S":
                this.blocksVisual = [
                    [0, 2, 2],
                    [2, 2, 0],
                    [0, 0, 0]
                ]
                break;
            case "Z":
                this.blocksVisual = [
                    [3, 3, 0],
                    [0, 3, 3],
                    [0, 0, 0]
                ]
                break;
            case "L":
                this.blocksVisual = [
                    [0, 0, 4],
                    [4, 4, 4],
                    [0, 0, 0]
                ]
                break;
            case "J":
                this.blocksVisual = [
                    [5, 0, 0],
                    [5, 5, 5],
                    [0, 0, 0]
                ]
                break;
            case "O":
                this.blocksVisual = [
                    [6, 6],
                    [6, 6],
                ]
                break;
            case "I":
                this.blocksVisual = [
                    [0, 0, 0, 0],
                    [7, 7, 7, 7],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                break;
        }
    }

    moveDown() {
        if (!this.checkIfReachedBottom()) {
            this.position.row++;
        } else {
            this.placed = true;
            setNewCurrentTileFromQueue();
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
        clearPlayField();
        this.updateBlocksOnPlayField();
        drawTetrisField();
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
                    if (this.blocksVisual[i][j] !== 0 && playField[this.position.row + i + 1][this.position.column + j] !== 0) {
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
                    if (playField[this.position.row][this.position.column + j - 1] === -1 || playField[this.position.row + i][this.position.column + j - 1] > 0) {
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

    correctPositionIfOutsideOfPlayingField() {
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < Math.floor(this.blocksVisual[i].length / 2); j++) {
                if (this.blocksVisual[i][j] > 0 && playField[this.position.row + i][this.position.column + j] === -1) {
                    this.moveRight(false);
                }
            }
        }
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = this.blocksVisual[i].length - 1; j >= Math.floor(this.blocksVisual[i].length / 2); j--) {
                if (this.blocksVisual[i][j] > 0 && playField[this.position.row + i][this.position.column + j] === -2) {
                    this.moveLeft(false);
                }
            }
        }
        for (let i = Math.floor(this.blocksVisual.length / 2); i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if (this.blocksVisual[i][j] > 0 && playField[this.position.row + i][this.position.column + j] === -3) {
                    this.moveUp();
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

        clearPlayField();
        this.updateBlocksOnPlayField();
        drawTetrisField();
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
}