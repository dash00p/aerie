require('angular');
// Menu Toggle Script 2
$(function() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

app = angular.module("aerie", []); 