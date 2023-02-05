/***
 * Used to draw a field with tetris blocks inside of it.
 * Primarly used to draw the queue on the right side and the hold tile on the left side.
 * Not used to draw the playField since the first 2 rows are invisible and the playField has previewColors from 8 to 14.
 * @param displayElement the field where a tetris tiles are inside.
 * @param tileVisual the tile which needs to be drawn.
 */
function drawTileInField(displayElement, tileVisual) {
    for (let i = 0; i < displayElement.length; i++) {
        for (let j = 0; j < displayElement[i].length; j++) {
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