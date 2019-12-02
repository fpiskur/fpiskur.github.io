"use strict";

let cash = 300;
let plot = new Array();
let updateOptionsHeader;

let waterSound = new Audio('sounds/vodica.mp3');        waterSound.volume = 0.35;
let fertilizeSound = new Audio('sounds/zemljica.mp3');  fertilizeSound.volume = 0.3;
let readySound = new Audio('sounds/kad-sazrije.mp3');   readySound.volume = 0.25;
let drySound = new Audio('sounds/suvo.mp3');            drySound.volume = 0.2;
let deleteSound = new Audio('sounds/brisanje.mp3');     deleteSound.volume = 0.9;
let harvestSound = new Audio('sounds/novcici.mp3');     harvestSound.volume = 0.7;
let selectSound = new Audio('sounds/kljik.mp3');        selectSound.volume = 0.2;
let buySound = new Audio('sounds/kljik-2.mp3');         buySound.volume = 0.25;
let nopeSound = new Audio('sounds/nemoze.mp3');         nopeSound.volume = 0.2;

let setPlot = function(cropType, n) {

    let crop;
    let price;
    let fertilizePrice;
    let growth;
    let profit;

    switch (cropType) {
        case "wheat":
            crop = "Wheat";
            price = 100;
            fertilizePrice = 14;
            growth = 6;
            profit = 55;
            break;
        case "carrot":
            crop = "Carrot";
            price = 370;
            fertilizePrice = 20;
            growth = 6;
            profit = 95;
            break;
        case "potato":
            crop = "Potato";
            price = 750;
            fertilizePrice = 37;
            growth = 7;
            profit = 169;
            break;
        case "tomato":
            crop = "Tomato";
            price = 1500;
            fertilizePrice = 88;
            growth = 9;
            profit = 338;
            break;
        case "apple":
            crop = "Apple";
            price = 6300;
            fertilizePrice = 183;
            growth = 12;
            profit = 720;
            break;
    }

    plot[n] = new Plot(crop, price, fertilizePrice, growth, profit);

}

// jQuery
$(document).ready(function(){

    // Select / Deselect plots
    let $plot = $('.grid-item.farm');
    let $selectedPlot;
    let $n;
    let $optionsMenu = $('.grid-container.options');
    let $buyMenu = $('.grid-container.buy');
    let $buyOption = $('.buy-btn');
    let $optionsHeader = $('#options-header');

    let $showOptions = function() {
        $buyMenu.addClass('hidden');
        $optionsMenu.removeClass('hidden');
    };

    let $showBuy = function() {
        $optionsMenu.addClass('hidden');
        $buyMenu.removeClass('hidden');
    };

    // Select plot
    $plot.click(function(e) {
        e.stopPropagation();
        $selectedPlot = $(this);
        $plot.removeClass('selected');

        // if house not selected
        if ($selectedPlot.index() != 20) {

            $(this).addClass('selected');
            $n = $selectedPlot.index();

            // Show Options menu if plot with crop
            if ($(this).html()) {

                for (let singlePlot of plot) {
                    if (singlePlot) {
                        singlePlot.isSelected = 0;
                    }
                }

                // Harvest
                if ($(this).hasClass('harvest')) {
                    plot[$n].harvest($n);
                } else {
                    selectSound.play();
                }
                
                plot[$n].isSelected = 1;
                $showOptions();
                updateOptionsHeader();
                updateOptionsInfo();

                $('#fertilize-price').html('-' + plot[$n].fertilizePrice + '$');

            }
            // Show Buy menu if empty
            else {
                for (let singlePlot of plot) {
                    if (singlePlot) {
                        singlePlot.isSelected = 0;
                    }
                }
                $showBuy();
                selectSound.play();
            }

        } else { $hideMenus(); }

    });

    // Deselect plot
    let $hideMenus = function() {
        $optionsMenu.addClass('hidden');
        $buyMenu.addClass('hidden');
    };

    $('body,html').click(function(){
        $hideMenus();
        if ($selectedPlot) {
            $selectedPlot.removeClass('selected');
        }
        for (let singlePlot of plot) {
            if (singlePlot) {
                singlePlot.isSelected = 0;
            }
        }
    });

    // Buy Crop
    $buyOption.click(function() {

        // Create Plot object
        let $crop = $(this).attr("value");
        setPlot($crop, $n);

        if(canAfford(plot[$n].price)) {
            plotArray.push(plot[$n]);
            $selectedPlot.html('<img src="imgs/' + $crop + '.png" ondragstart="return false;" />');
            $selectedPlot.addClass('wet');
            plot[$n].wateredTimeStamp = gameTime;
            plot[$n].plantedTimeStamp = gameTime;
            cash -= plot[$n].price;
            updateCash();
            buySound.play();
        } else {
            // "Delete" Plot object
            plot[$n] = null;
            nopeSound.play();
        }
        
    });

    // Game Speed btns
    let $gameSpeedBtn = $('.grid-item.top.speed p a');
    $gameSpeedBtn.click(function() {

        // Get value
        let $btnSpeedValue = $(this).attr('value');

        // Set all btns to inactive
        $('[value="pause"]').html('<img src="imgs/pause-inactive-sm.png" />');
        $('[value="play"]').html('<img src="imgs/play-inactive-sm.png" />');
        $('[value="2xspeed"]').html('<img src="imgs/2xspeed-inactive-sm.png" />');
        $('[value="4xspeed"]').html('<img src="imgs/4xspeed-inactive-sm.png" />');

        // Set clicked btn to active
        $('[value="' + $btnSpeedValue + '"]').html('<img src="imgs/' + $btnSpeedValue + '-active-sm.png" />');

    });

    // Plot options
    // Water
    let $waterCrop = $('#water-crop');
    $waterCrop.click(function() {
        if (!plot[$n].watered) {
            plot[$n].water($n);
        } else {
            nopeSound.play();
        }
    });

    // Fertilize
    let $fertilizeCrop = $('#fertilize-crop');
    $fertilizeCrop.click(function() {
        if (canAfford(plot[$n].fertilizePrice) &&  !plot[$n].readyToHarvest && !plot[$n].fertilized) {
            plot[$n].fertilize($n);
            cash -= plot[$n].fertilizePrice;
            updateCash();
        } else {
            nopeSound.play();
        }
    });

    // Delete
    let $deleteCrop = $('#delete-crop');
    $deleteCrop.click(function() {
        plot[$n].delete($n);
        removeFromArray(plot[$n], plotArray);
    });


    updateOptionsHeader = function () {
        // is watered?
        if (plot[$n].watered) {
            if (!plotStatus.includes('wet')) {
                plotStatus.unshift('wet');
            }
            removeFromArray('dry', plotStatus);
        } else {
            if (!plotStatus.includes('dry')) {
                plotStatus.unshift('dry');
            }
            removeFromArray('wet', plotStatus);
        }
        // is fertilized?
        if (plot[$n].fertilized) {
            if(!plotStatus.includes('fertilized')) {
                plotStatus.push('fertilized');
            }
        } else {
            removeFromArray('fertilized', plotStatus);
        }

        $optionsHeader.html(plot[$n].crop + ' - ' + plotStatus.join(', '));

    };

    function updateOptionsInfo() {

        let $plotInfoPrice = $('#plot-info-price');
        let $plotInfoGrowth = $('#plot-info-growth');
        let $plotInfoHarvest = $('#plot-info-harvest');

        let $minProfit = Math.ceil(0.91 * plot[$n].profit);
        let $approxHarvest = `${$minProfit} - ${plot[$n].profit}`;

        $plotInfoPrice.html(plot[$n].price);
        $plotInfoGrowth.html(plot[$n].growth);
        $plotInfoHarvest.html($approxHarvest);

    }

});

let updateCash = function () {
    $('#cash').html('$ ' + cash);
};

let canAfford = function(amount) {
    if (amount > cash) {
        return false;
    } else {
        return true;
    }
};

let getRandomNumber = function(start, range, order = 0) {
    let randomNumber = Math.ceil(Math.random() * (range - start) + start);
    return randomNumber / Math.pow(10, order);
};