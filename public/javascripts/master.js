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

    // $(window).bind('beforeunload', function() {
    //     $.ajax({
    //         type: 'POST',
    //         contentType: 'application/json; charset=utf-8',
    //         url: '/timeout',
    //         dataType: "json",
    //         data: JSON.stringify({ delay: 550 }),
    //         success: function(result) {
    //             console.log("success");
    //         },
    //         async: false
    //     });  
    // });
});

document.addEventListener('DOMContentLoaded', function() {
    //https://christopheraue.net/design/fading-pages-on-load-and-unload
    var anchors = document.getElementsByTagName('a');

    for (var i=0; i<anchors.length; i++) {
        if (anchors[i].hostname !== window.location.hostname || anchors[i].classList.contains("utility"))
            continue;
        
        anchors[i].addEventListener('click', function(event) {
            $('#wrapper').removeClass("toggled");
            var sidebar = document.getElementById('sidebar-wrapper'),
            anchor = event.currentTarget;
        
            var listener = function() {
                window.location = anchor.href;
                sidebar.removeEventListener('transitionend', listener);
            };
            sidebar.addEventListener('transitionend', listener);
            
            event.preventDefault();
        });
    }       
});

app = angular.module("aerie", []); 