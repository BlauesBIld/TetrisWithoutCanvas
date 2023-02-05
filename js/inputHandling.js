let sideWaysInput = "",
    downInput = 0;
let pressingRight = false,
    pressingLeft = false;
document.addEventListener("keydown", ev => {
    if (isGameActive) {
        switch (ev.key.toUpperCase()) {
            case "ARROWLEFT":
            case "A":
                currentTile.move("left");
                pressingLeft = true;
                setTimeout(function () {
                    if (pressingLeft) {
                        sideWaysInput = "left";
                    }
                }, 170);
                break;
            case "ARROWRIGHT":
            case "D":
                currentTile.move("right");
                pressingRight = true;
                setTimeout(function () {
                    if (pressingRight) {
                        sideWaysInput = "right";
                    }
                }, 170);
                break;
            case "ARROWUP":
            case "X":
                currentTile.rotate(1);
                break;
            case "Y":
                currentTile.rotate(-1);
                break;
            case "ARROWDOWN":
            case "S":
                downInput = 1;
                break;
            case "C":
                holdTile();
                break;
            case " ":
                currentTile.moveDownUntilItCannotAnymore();
        }
    }
    if (ev.key.toUpperCase() === "R") {
        startGame();
    }
});

document.addEventListener("keyup", ev => {
    if (isGameActive) {
        switch (ev.key.toUpperCase()) {
            case "ARROWLEFT":
            case "A":
                if (sideWaysInput === "left") {
                    sideWaysInput = "";
                }
                pressingLeft = false;
                break;
            case "ARROWRIGHT":
            case "D":
                if (sideWaysInput === "right") {
                    sideWaysInput = "";
                }
                pressingRight = false;
                break;
            case "ARROWDOWN":
            case "S":
                downInput = 0;
                break;
        }
    }
});
