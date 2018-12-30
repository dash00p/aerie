require('angular');

// Menu Toggle Script 2
$(function() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $("#switchNightMode").click( e => {
        if($('#switchNightMode').is(':checked')){
            setCookie('nightmode', 1, 365);
        }
        else{
            eraseCookie('nightmode');
        }
        $('body').toggleClass('nightmode');
    });
});

app = angular.module("aerie", []); 