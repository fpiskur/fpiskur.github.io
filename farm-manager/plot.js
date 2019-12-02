let gameTime = 0;
let plotArray = new Array();
let plotStatus = new Array();

function Plot(crop, price, fertilizePrice, growth, profit, isSelected = 0) {

    this.crop = crop;
    this.watered = 1;
    this.wateredTimeStamp;
    this.dryTimeStamp;
    this.price = price;
    this.fertilizePrice = fertilizePrice;
    this.growth = growth;
    this.profit = profit;
    this.isSelected = isSelected;
    this.fertilized = 0;
    this.readyToHarvest = 0;
    this.plantedTimeStamp;

    // Watered state expires in 150 sec (6 mo)
    this.timeoutWet = function(n) {
        this.watered = 0;
        this.dryTimeStamp = gameTime;
        let $wateredPlot = $('.grid-item.farm:eq(' + n + ')');
        $wateredPlot.removeClass('wet');
        $wateredPlot.removeClass('fertilized');
        $wateredPlot.addClass('dry');
        drySound.play();
    }

    this.timeoutHarvestable = function(n) {
        this.readyToHarvest = 1;
        let $harvestablePlot = $('.grid-item.farm:eq(' + n + ')');
        $harvestablePlot.addClass('harvest');
        readySound.play();
    }

    this.water = function(n) {
        this.watered = 1;
        this.wateredTimeStamp = gameTime;
        let $plotToWater = $('.grid-item.farm:eq(' + n + ')');
        $plotToWater.removeClass('dry');
        if (this.fertilized) {
            $plotToWater.addClass('wet');
            $plotToWater.addClass('fertilized');
        } else {
            $plotToWater.addClass('wet');
        }
        waterSound.play();
    }

    this.delete = function(n) {
        const $body = $('body');
        let $plotToDelete = $('.grid-item.farm:eq(' + n + ')');
        if ($plotToDelete.is(':focus')) {
            $body.click();
        }
        this.watered = 0;
        this.fertilized = 0;
        deleteSound.play();
        $plotToDelete.removeClass('dry');
        $plotToDelete.removeClass('wet');
        $plotToDelete.removeClass('harvest');
        $plotToDelete.removeClass('fertilized');
        $plotToDelete.html('');
    }

    // Fertalized state expires when harvested
    this.fertilize = function(n) {
        this.fertilized = 1;
        let $fertilizedPlot = $('.grid-item.farm:eq(' + n + ')');
        if (this.watered) {
            $fertilizedPlot.addClass('wet');
            $fertilizedPlot.addClass('fertilized');
        }
        fertilizeSound.play();
    }

    this.harvest = function(n) {
        let $plotToHarvest = $('.grid-item.farm:eq(' + n + ')');
        $plotToHarvest.removeClass('fertilized');
        $plotToHarvest.removeClass('harvest');
        // gerRnadomNumber(start, range, order)   order = 2 === 100
        let $myProfit = this.profit * getRandomNumber(91, 100, 2);
        if (this.fertilized) {
            cash += Math.ceil($myProfit * 1.2);
        } else {
            cash += Math.ceil($myProfit);
        }
        harvestSound.play();
        updateCash();
        this.readyToHarvest = 0;
        this.fertilized = 0;
        this.plantedTimeStamp = gameTime;
    }

}

function removeFromArray(element, array) {
    let index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
}