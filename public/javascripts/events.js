function eventCtrl($http) {

    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    vm.events = [/*
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}*/
    ];

    vm.eventSource = {
        url: "/event/fetch",
        //cache: true
    };

    vm.eventSources = [vm.events, vm.eventSource];
    vm.newEvent = {};
    vm.editEvent = false;

    // $http.get(`/event/fetch`).then( res => {
    //     vm.events.length = 0;
    //     for(e of res.data){
    //         vm.events.push({
    //             title : e.title,
    //             start : new Date(e.start),
    //             end : new Date(e.end)
    //         });
    //     }
    //     //$('#calendar').fullCalendar('renderEvents', vm.events);
    // });

    vm.saveEvent = () => {
        if(vm.editEvent){
            $http.patch(`/event`, {event: vm.newEvent}).then( res => {

            });
        }
        else{
            $http.post(`/event`, {newEvent : vm.newEvent}).then(res => {
                //$('#calendar').fullCalendar('renderEvent', event);
            });
        }
    }

    vm.uiConfig = {
    calendar:{
        height: 750,
        editable: true,
        selectable: true,
        header:{
        left: '',//'month basicWeek basicDay agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
        },
        closeText:"Fermer",
        prevText:"Précédent",
        nextText:"Suivant",
        currentText:"Aujourd'hui",
        monthNames:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
        monthNamesShort:["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
        dayNames:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
        dayNamesShort:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],
        dayNamesMin:["D","L","M","M","J","V","S"],
        weekHeader:"Sem.",
        dateFormat:"dd/mm/yy",
        firstDay:1,
        isRTL:!1,
        showMonthAfterYear:!1,
        yearSuffix:"",
        eventDrop: console.log("drop"),
        eventResize: console.log("resize"),
        select: function (start, end, jsEvent, view) {
            vm.newEvent.start = start.local().toDate();
            vm.newEvent.end = end.local().toDate();
            vm.editEvent = false;
            $('#newEventModal').modal();
            return;
            var abc = prompt('Enter Title');
            if(abc === null)//Abort
                return;
            var allDay = !start.hasTime && !end.hasTime;
            var newEvent = new Object();
            newEvent.title = abc;
            newEvent.start = moment(start).format();
            newEvent.end = moment(end).format();
            newEvent.allDay = false;
            vm.events.push(newEvent);
            vm.saveEvent(newEvent);
            //$('#calendar').fullCalendar('renderEvent', newEvent);

        },
        eventClick: function(calEvent, jsEvent, view) {
            vm.editEvent = true;
            vm.newEvent = vm.calendarToEvent(calEvent);
            $('#newEventModal').modal();
        }
    }
    };

    vm.renderCalender = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      };

      vm.calendarToEvent = calEvent =>{
        let offset = moment(calEvent.start.toDate()).utcOffset()
          return {
            title : calEvent.title,
            description : calEvent.description,
            start : calEvent.start.minute(-offset).toDate(),
            end : calEvent.end.minute(-offset).toDate(),
            id : calEvent.id
          }
      }
};

app.controller("eventCtrl", eventCtrl);