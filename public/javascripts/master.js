global.jQuery = require("jquery");
moment = require('moment');
require('angular');
require('angular-ui-calendar');
require('fullcalendar');
require('fullcalendar/dist/locale/fr');

var css = require('../stylesheets/master.css');
// Menu Toggle Script 2
$ = global.jQuery;
$(function() {
    $("#menu-toggle").click(e => {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $("#switchNightMode").click(() => {
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

document.addEventListener('DOMContentLoaded', () => {
    //https://christopheraue.net/design/fading-pages-on-load-and-unload
    var anchors = document.getElementsByTagName('a');

    for (var i=0; i<anchors.length; i++) {
        if (anchors[i].hostname !== window.location.hostname || anchors[i].classList.contains("utility"))
            continue;
        
        anchors[i].addEventListener('click', e => {
            $('#wrapper').removeClass("toggled");
            var sidebar = document.getElementById('sidebar-wrapper'),
            anchor = e.currentTarget;
        
            var listener = () => {
                window.location = anchor.href;
                sidebar.removeEventListener('transitionend', listener);
            };
            sidebar.addEventListener('transitionend', listener);
            
            e.preventDefault();
        });
    }       
});

app = angular.module("aerie", ['ui.calendar']); 