/***
 * Class to handle the Queue frontend functionality.
 */
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

    /***
     * After the site is loaded, 5 4x4 field are added on the right side to display each tile in the queue.
     * @param index
     */
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