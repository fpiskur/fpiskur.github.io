let gameClockID = -1;

// Output current time in YY / MM format
function getGameTime(currentTime) {
    let mo = Math.ceil(currentTime / 25);
    let yr = Math.ceil(mo / 12);
    let result;
    mo == 0 && yr == 0
        ? result = "<p>Y1 / M1</p>"
        : result = "<p>Y" + yr + " / " + "M" + (mo - ((yr-1) * 12)) + "</p>";
    return result;
}

function gameClock(speed) {

    if (gameClockID > 0) {
        clearInterval(gameClockID);
    }

    gameClockID = setInterval(function() {

        document.getElementById("game-clock").innerHTML = getGameTime(gameTime);

        // Check Plot status
        if (plotArray) {
            for (let singlePlot of plotArray) {

                let plotIndex = plot.indexOf(singlePlot);

                // Watered, begin the drying timer
                if (singlePlot.watered) {
                    if (gameTime >= singlePlot.wateredTimeStamp + 6*25) {
                        singlePlot.timeoutWet(plotIndex);
                    }
                }

                // Dry, begin the decay timer
                if (!singlePlot.watered) {
                    if (gameTime >= singlePlot.dryTimeStamp + 20) {
                        singlePlot.delete(plotIndex);
                        removeFromArray(singlePlot, plotArray);
                    }
                }

                // New, begin harvestable timer
                if (!singlePlot.readyToHarvest) {
                    if (gameTime >= singlePlot.plantedTimeStamp + singlePlot.growth*25) {
                        singlePlot.timeoutHarvestable(plotIndex);
                    }
                }

                if (singlePlot.isSelected) {
                    updateOptionsHeader();
                }

            }
        }

        gameTime++;

    }, speed);
}

gameClock(1000);

function stopGameClock() {
    if (gameClockID > 0) {
        clearInterval(gameClockID);
    }
}