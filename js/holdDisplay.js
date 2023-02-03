class HoldDisplay {
    holdingTileName = undefined;
    leftContainer = document.getElementById("holdContainer");
    holdingField = undefined;

    constructor() {
        this.addNewHoldDisplayBlock();
    }

    addNewHoldDisplayBlock() {
        let newHoldElement = document.createElement("div");
        let fieldsVisual = [];

        for (let i = 0; i < 4; i++) {
            let rowElement = document.createElement("div");
            rowElement.className = "holdRow";
            newHoldElement.appendChild(rowElement);
            fieldsVisual.push([]);
            for (let j = 0; j < 4; j++) {
                let fieldElement = document.createElement("div");
                fieldElement.className = "holdField";
                rowElement.appendChild(fieldElement);
                fieldsVisual[i].push(fieldElement);
            }
        }

        this.holdingField = fieldsVisual;
        this.leftContainer.appendChild(newHoldElement);
    }

    setHoldingTileName(tileName){
        this.holdingTileName = tileName;
        if(tileName !== undefined) {
            drawTileInField(this.holdingField, blocksVisualConfig[this.holdingTileName]);
        } else {
            drawTileInField(this.holdingField, []);
        }
    }
}