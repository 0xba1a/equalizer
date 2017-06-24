window.connected = false;
window.frequencyCount = 128;
window.barPercent = 88;
window.barHeight = 200;

/**
 * Function to initiate music visualisation
 */
var loadAnim = function() {
    var context;

    if (typeof AudioContext !== "undefined") {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        context = new webkitAudioContext();
    } else {
        $(".hideIfNoApi").hide();
        $(".showIfNoApi").show();
        return;
    }

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] +
            'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = newDate().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime +
                    timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

    // Create the analyser
    var analyser = context.createAnalyser();
    analyser.fftSize = window.frequencyCount;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // Set up the visualisation elements
    var visualisation = $("#visualisation");
    var circles = $("#div-vis-round");

    /* Drawing only window.barPercent bars to hide 0 frequency bars */
    var barcount = Math.floor((window.barPercent * analyser.frequencyBinCount) / 100);
    if (barcount % 2 == 0) {
        barcount++;
    }

    var barSpacingPercent = 100 / ((barcount * 2) - 1);
    var i = 0;

    /* Draw barcount number of circles and barcount x 2 number of bars */
    for (i = 0; i < barcount - 1; i++) {
        $("<div/>").css("width", barSpacingPercent / 2 + "%").css("left", (i * barSpacingPercent) + "%").appendTo(visualisation);
        $("<div/>").attr("class", "vis-circle").appendTo(circles);
    }
    for (i; i < (barcount * 2) - 1; i++) {
        $("<div/>").css("width", barSpacingPercent / 2 + "%").css("left", (i * barSpacingPercent) + "%").appendTo(visualisation);
    }

    var bars = $("#visualisation > div");
    var circles = $("#div-vis-round > div");

    function update() {
        var offset = -1;
        requestAnimationFrame(update);
        analyser.getByteFrequencyData(frequencyData);

        circles.each(function(index, circle) {
            if (index == 0) {
                return;
            }

            var factor = (80 * frequencyData[index]) / 255;
            circle.style.top = (100 - (factor)) / 2 + "%";
            circle.style.left = (100 - (factor)) / 2 + "%";
            circle.style.height = factor + "%";
            circle.style.width = factor + "%";

            if (factor < 20) {
                circle.style.border = "solid 1px #bf1eaf";
            } else if (factor < 40) {
                circle.style.border = "solid 1px #bf1e5e";
            } else if (factor < 60) {
                circle.style.border = "solid 1px #3d92e3";
            } else {
                circle.style.border = "solid 1px #53c68c";
            }
        });

        bars.each(function(index, bar) {
            var height = 0;
            var barcount = (window.barPercent * window.frequencyCount) / 100;
            if (index < barcount / 2) {
                height = (window.barHeight * frequencyData[index] / 255);
                bar.style.height = height + 'px';
                offset++;
            } else if (index < barcount) {
                height = (window.barHeight * frequencyData[--offset] / 255);
                bar.style.height = height + 'px';
            } else {
                return;
            }

            if (height < 20) {
                bar.style.background = "linear-gradient(#53c68c,#d872b3, #bf1e5e)";
            } else if (height < 100) {
                bar.style.background = "linear-gradient(#53c68c,#63a8e9, #bf1e5e)";
            } else if (height < 150) {
                bar.style.background = "linear-gradient(#53c68c,#63a8e9, #bf1e5e)";
            } else {
                bar.style.background = "linear-gradient(#53c68c,#3d92e3, #bf1e5e)";
            }
        });
    };
    $("#player").bind('canplay canplaythrough', function() {
        connectAnalyzer();
    });

    if ($("#player").readyState > 3) {
        connectAnalyzer();
    }

    function
    connectAnalyzer() {
        if (window.connected == true) {
            return;
        }
        var source = context.createMediaElementSource($("audio")[0]);
        source.connect(analyser);
        analyser.connect(context.destination);
        window.connected = true;
    }
    update();
}

//TODO: change hard-coded values
var availableTags = ["siva", "balakumaran", "jayameena", "shanmugam"];

function auto_suggest() {
    $("#search-box").autocomplete({
        source: availableTags
    });
}

//event handler for onclick favourite icon
function favourited(element) {
    if ($(element).hasClass('favourited')) {
        $(element).removeClass('favourited')
    } else {
        $(element).addClass('favourited')
    }
}

function download(element) {
    //show download message box
    //show download started and fade it away 
}

function play_song(element) {
    if ($(element).hasClass('glyphicon-play')) {
        $(element).removeClass('glyphicon-play').addClass('glyphicon-pause')
        $(element).closest('.song-detail').animate({ background: 'rgba(0, 0, 0, 0)' });

    } else {
        $(element).removeClass('glyphicon-pause').addClass('glyphicon-play')
        $(element).closest('.song-detail').removeClass('song-playing');
    }

}