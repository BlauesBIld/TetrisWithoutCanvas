class QueueDisplay {
    rightContainer = document.getElementById("containerRight");
    displayElements = [];

    constructor() {
        for (let i = 0; i < 5; i++) {
            this.addNewQueueDisplayBlock(i);
        }
    }

    refreshQueueView() {

        for (let i = 0; i < queue.length; i++) {
            drawTileInField(this.displayElements[i], blocksVisualConfig[queue[i]]);
        }
    }

    addNewQueueDisplayBlock(index) {
        let newQueueElement = document.createElement("div");
        newQueueElement.className = "queueTileElement";

        let suffix = "";
        if(index === 0){
            suffix = "First";
        }

        let fieldsVisual = [];

        for (let i = 0; i < 4; i++) {
            let rowElement = document.createElement("div");
            rowElement.className = "queueRow" + suffix;
            newQueueElement.appendChild(rowElement);
            fieldsVisual.push([]);
            for (let j = 0; j < 4; j++) {
                let fieldElement = document.createElement("div");
                fieldElement.className = "queueField" + suffix;
                rowElement.appendChild(fieldElement);
                fieldsVisual[i].push(fieldElement);
            }
        }

        this.displayElements.push(fieldsVisual);
        this.rightContainer.appendChild(newQueueElement);
    }
}