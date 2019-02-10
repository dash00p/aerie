function eventCtrl($http) {
    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    vm.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}
        ];

    vm.eventSources = [vm.events];

    vm.uiConfig = {
    calendar:{
        height: 750,
        editable: true,
        selectable: true,
        header:{
        left: 'month basicWeek basicDay agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
        },
        eventDrop: console.log("drop"),
        eventResize: console.log("resize"),
        select: function (start, end, jsEvent, view) {
            var abc = prompt('Enter Title');
            var allDay = !start.hasTime && !end.hasTime;
            var newEvent = new Object();
            newEvent.title = abc;
            newEvent.start = moment(start).format();
            newEvent.allDay = false;
            vm.events.push(newEvent);
            $('#calendar').fullCalendar('renderEvent', newEvent);

        }
    }
    };
};

app.controller("eventCtrl", eventCtrl);