$(function() {

    if (navigator.appVersion.indexOf("Chrome/") != -1) {
        $('input, select').css({
            'border-radius': '5px',
            'padding': '5px 8px',
            'background-color': '#f0f0f0'
        });
    }

    let clickSound = new Audio('sounds/click.mp3');          clickSound.volume = 1;
    let firstSound = new Audio('sounds/1st-rhythm.mp3');     firstSound.volume = 0.6;
    let secondSound = new Audio('sounds/2nd-rhythm.mp3');    secondSound.volume = 0.6;
    let thirdSound = new Audio('sounds/3rd-rhythm.mp3');     thirdSound.volume = 0.8;
    let togetherSound = new Audio('sounds/together.mp3');    togetherSound.volume = 1;

    // Randomizer

    $('#randomizer').click(getRandom);

    const mjere = ['4/4', '3/4', '5/4', '2/4', '6/8', '7/8', '9/8', '10/8', '12/8', '11/8'];

    const dyn_progresije = ['I - V - vi - IV', 'vi - V - IV - V', 'I - vi - IV - V',
        'I - IV - vi - V', 'I - V - IV - V', 'vi6 - ii - v6 - I', 'I - vi - ii - V',
        'vi - IV - I - V', 'i - VI - III - VII', 'I - IV - ii - V', 'V - IV - iii',
        'I - V - vi - iii - IV - I - IV - V', 'IV - I - V - iv', 'I - ii - vi - IV',
        'I - iii - vi - IV', 'I - V - ii - IV', 'ii - IV - I - V'];

    let getRandomNumber = function(range) {
        let randomNumber = Math.ceil(Math.random() * range);
        return randomNumber;
    };

    function getRandom() {
        let randomMjera = getRandomNumber(mjere.length - 1);
        let randomDynProgresija = getRandomNumber(dyn_progresije.length - 1);

        const mjera = document.getElementById('mjera');
        const progresija = document.getElementById('progresija');

        mjera.innerHTML = mjere[randomMjera];
        progresija.innerHTML = dyn_progresije[randomDynProgresija];
    }

    // Polirhythm metronome

    let intervalID = -1;
    let indentation = 0;

    $('#rhythm-3').append('<option value="0">0</option>');

    for (i = 2; i <= 9; i++) {
        $('#rhythm-1').append('<option value="' + i + '">' + i + '</option>');
        $('#rhythm-2').append('<option value="' + i + '">' + i + '</option>');
        $('#rhythm-3').append('<option value="' + i + '">' + i + '</option>');
      }

    $('#render-btn').click(render);
    $('#start-btn').click(start);
    $('#stop-btn').click(stop);
    $('#mute-btn').click(mute);

    function render() {

        $('#result').empty();

        let rhythm1 = Number($('#rhythm-1').val());
        let rhythm2 = Number($('#rhythm-2').val());
        let rhythm3 = Number($('#rhythm-3').val());

        for (i = 0; i <= 200; i++) {

            if (i % rhythm1 == 0 && i % rhythm2 == 0 && i > 0) {
                break; //stops the loop once we start repeating
            }
            if (i % rhythm1 == 0) {
                $('#result').append($('<div class="line"></div>'));
            }
            if (i % rhythm2 != 0) {
                $('#result').find('.line').last().append('<div class="circle"></div>'); //regular beat
            } else {
                $('#result').find('.line').last().append('<div class="circle red-bg"></div>'); //accented beat
            }

            if (rhythm3 != 0 && i % rhythm3 == 0) {
                if($('#result').find('.line').last().find('.circle').last().hasClass('red-bg')) {
                    $('#result').find('.line').last().find('.circle').last().addClass('yellow-shadow');
                } else {
                    $('#result').find('.line').last().find('.circle').last().addClass('yellow-bg');
                }
            }

        }

        let lineWidth = (rhythm1 - 1) * 70;
        $('.line').css('width', lineWidth)

        for (let oneLine of $('.line')) {
            for(let circle of $(oneLine).find('.circle')) {
                $(circle).css('left', `${ indentation }px`);
                indentation += 70;
            }
            indentation = 0;
        }

    }

    function start() {

        if($('.line').hasClass('line')) {

            let tempo = Number($('#tempo').val());

            if (tempo) {

                let time = 60000 / tempo;
                if(intervalID > 0) {
                    clearInterval(intervalID);
                }

                let circlesNum = $('.circle').length;
                let counter = 0;
                intervalID = setInterval(function() {
                    for (let circle of $('.circle')) {
                        $(circle).removeClass('big');
                    }
                    counter = counter < circlesNum ? counter : 0;
                    $($('.circle')[counter]).addClass('big');
                    playSound($($('.circle')[counter]));
                    counter++;
                }, time);

            }
        }
    }

    function stop() {
        if(intervalID > 0) {
            clearInterval(intervalID);
        }
        for (let circle of $('.circle')) {
            $(circle).removeClass('big');
        }
    }

    function playSound(currentObject) {

        if (currentObject.is(':first-child') && !currentObject.hasClass('yellow-bg') && !currentObject.hasClass('red-bg')) {
            firstSound.play();
        } else if (currentObject.hasClass('yellow-shadow')) {
            togetherSound.play();
        } else if (currentObject.hasClass('yellow-bg')) {
            thirdSound.play();
        } else if (currentObject.hasClass('red-bg')) {
            secondSound.play();
        } else {
            clickSound.play();
        }

    }

    function mute() {
        if (clickSound.muted === false) {
            clickSound.muted = true;
            firstSound.muted = true;
            secondSound.muted = true;
            thirdSound.muted = true;
            togetherSound.muted = true;
            $('#mute-btn').css('text-decoration', 'line-through');
        } else {
            clickSound.muted = false;
            firstSound.muted = false;
            secondSound.muted = false;
            thirdSound.muted = false;
            togetherSound.muted = false;
            $('#mute-btn').css('text-decoration', 'none');
        }
    }


});