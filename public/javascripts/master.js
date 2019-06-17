global.jQuery = require("jquery");
moment = require('moment');
require('angular');
require('angular-ui-calendar');
require('fullcalendar');
require('fullcalendar/dist/locale/fr');

var css = require('../stylesheets/master.css');
// Menu Toggle Script 2
$ = global.jQuery;
$(function () {
    $("#menu-toggle").click(e => {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $("#switchNightMode").click(() => {
        if ($('#switchNightMode').is(':checked')) {
            setCookie('nightmode', 1, 365);
        }
        else {
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

    for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].hostname !== window.location.hostname || anchors[i].classList.contains("utility"))
            continue;

        anchors[i].addEventListener('click', e => {
            let wrapper = document.getElementById('wrapper');
            if (wrapper.classList.contains('toggled')) {
                wrapper.classList.remove("toggled");
                var sidebar = document.getElementById('sidebar-wrapper'),
                    anchor = e.currentTarget;

                var listener = () => {
                    window.location = anchor.href;
                    sidebar.removeEventListener('transitionend', listener);
                };
                sidebar.addEventListener('transitionend', listener);

                e.preventDefault();
            }
        });
    }
});

//https://medium.com/@gilfink/quick-tip-creating-an-xmlhttprequest-interceptor-1da23cf90b76
let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    // do something with the method, url and etc.
    this.addEventListener('load', function () {
        // do something with the response text
        if (this.status === 401) {
            alert("Vous avez été déconnecté en raison d'un délai d'inactivité trop important. Si vous cliquez sur OK, vous allez être redirigé vers la page de connexion.\nVous avez pas trop le choix, en fait. 😘");
            window.location.replace(window.location.protocol + '//' + window.location.host + '/login');
        }
    });

    return oldXHROpen.apply(this, arguments);
}

const services = angular.module('services', []);

// services.factory('openLink', function(link) {
//     //
// });

app = angular.module("aerie", ['ui.calendar', 'services'])
    .run(function ($rootScope) {
        $rootScope.openLink = link => {
            if (link.includes('/')){
                let url = window.location.href;
                if(url.slice(-1) === "/")
                    url = url.slice(0, -1);
                window.location.href = url + link;
            }
            else
                window.location.href = link;
        };
    })