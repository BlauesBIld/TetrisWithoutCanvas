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
            this.drawTileInField(this.displayElements[i], blocksVisualConfig[queue[i]]);
        }

        console.log(this.displayElements);
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

    drawTileInField(displayElement, tileVisual) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                displayElement[i][j].style.backgroundColor = "black";
            }
        }
        for (let i = 0; i < tileVisual.length; i++) {
            for (let j = 0; j < tileVisual[i].length; j++) {
                switch (tileVisual[i][j]) {
                    case 7:
                        displayElement[i][j].style.backgroundColor = "turquoise";
                        break;
                    case 6:
                        displayElement[i][j].style.backgroundColor = "yellow";
                        break;
                    case 5:
                        displayElement[i][j].style.backgroundColor = "royalblue";
                        break;
                    case 4:
                        displayElement[i][j].style.backgroundColor = "orange";
                        break;
                    case 3:
                        displayElement[i][j].style.backgroundColor = "red";
                        break;
                    case 2:
                        displayElement[i][j].style.backgroundColor = "greenyellow";
                        break;
                    case 1:
                        displayElement[i][j].style.backgroundColor = "blueviolet";
                        break;
                    case 0:
                        displayElement[i][j].style.backgroundColor = "black";
                        break;
                    default:
                        displayElement[i][j].style.opacity = invisibleTileOpacity;
                        displayElement[i][j].style.backgroundColor = "grey";
                        break;

                }
            }
        }
    }
}