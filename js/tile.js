class Tile {

    blocksVisual;

    position = {
        row: 0,
        column: 0
    };

    tileName;

    constructor(tileName) {
        this.tileName = tileName;
        this.initializeBlocksForTile();
        this.position.row = spawnRow;
        this.position.column = Math.floor(spawnColumn-this.blocksVisual[0].length/2);
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
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]
                ]
                break;
            case "Z":
                this.blocksVisual = [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ]
                break;
            case "L":
                this.blocksVisual = [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
                break;
            case "J":
                this.blocksVisual = [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
                break;
            case "O":
                this.blocksVisual = [
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]
                ]
                break;
            case "I":
                this.blocksVisual = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
                break;
        }
    }

    rotateRight() {
        this.blocksVisual = this.blocksVisual[0].map((val, index) => this.blocksVisual.map(row => row[index]).reverse())
    }

    moveDown() {
        console.log(this.checkIfReachedBottom());
        if (!this.checkIfReachedBottom()) {
            this.position.row++;
        } else {
            setNewCurrentTileFromQueue();
        }
    }

    updateBlocksOnPlayField() {
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if (this.blocksVisual[i][j] !== 0) {
                    playField[this.position.row + i][this.position.column + j] = this.blocksVisual[i][j];
                }
            }
        }
    }

    checkIfReachedBottom() {
        for (let i = 0; i < this.blocksVisual.length; i++) {
            for (let j = 0; j < this.blocksVisual[i].length; j++) {
                if ((this.blocksVisual[i + 1] === undefined || this.blocksVisual[i + 1][j] === 0) && (this.blocksVisual[i][j] !== 0)) {
                    console.log(this.blocksVisual[i + 1]);
                    if(playField[this.position.row + i + 1] === undefined){
                        return true;
                    }
                    if (this.blocksVisual[i][j] === 1 && playField[this.position.row + i + 1][this.position.column + j] !== 0) {
                        return true;
                    }
                    if (this.blocksVisual[i][j] === 1 && this.position.row + i >= 20) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}