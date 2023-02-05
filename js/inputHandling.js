document.addEventListener("keydown", ev => {
    if (isGameActive) {
        switch (ev.key.toUpperCase()) {
            case "ARROWLEFT":
            case "A":
                currentTile.move("left");
                break;
            case "ARROWRIGHT":
            case "D":
                currentTile.move("right");
                break;
            case "ARROWUP":
            case "W":
                currentTile.rotate(1);
                break;
            case "Q":
                currentTile.rotate(-1);
                break;
            case "ARROWDOWN":
            case "S":
                if (!currentTile.checkIfReachedBottom()) {
                    currentTile.move("down");
                    setElapsedTimeBetweenTicksToZero();
                }
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
})
