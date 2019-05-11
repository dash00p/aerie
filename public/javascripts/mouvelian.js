const diffYears = 687;



let winterWeek = true;

let mouvelianCheck = false;

let now, datepicker;



$(function() {

	moment.locale('fr');

	now = moment().subtract(diffYears, 'year');



	$('[data-toggle="tooltip"]').tooltip();

	initDatepicker();

	$('#moment').text(convertDate(now));



	$( "#dateInput" ).change(function() {

		let date = (mouvelianCheck?this.value:moment(this.value, 'DD-MM-YYYY'));		

		let startDate = renderDate(date);

		datepicker.date = startDate.toDate();

	});



	$( "#winterCheck" ).change(function() {

		winterWeek = !winterWeek;

		let date = moment($('#dateInput').val()).subtract(diffYears, 'year');

		$('#inputResult').text(convertDate(date));

	});



	$( "#mouvelianCheck" ).change(function() {

		mouvelianCheck = !mouvelianCheck;

		initDatepicker(mouvelianCheck);

	});





	$( "#kryta" ).click(function() {

		$('body').toggleClass('kryta');

	});



	$('#closeTimeline').click(function() {

		$('#timeline-embed').slideToggle('swing', function(){

			$(this)

			.parent()

	        .find('.fas')

	        .toggleClass('fa-angle-double-down')

	        .toggleClass('fa-angle-double-up');

		});

	});

});



function convertDate(date){

	let output = "";

	if(!date.isValid())

		return output;



	output += ' '+convertDay(date);

	output += ' '+convertMonth(date.dayOfYear());

	output +=' '+(date.year() >= 0 ? date.year() + " Ap. E" : Math.abs(date.year())+ " Av. E");

	return output;

}



function convertMonth(day, indexOnly){

	let season = '';

	let indexOutput = indexOnly || false;

	let i = 0;



	switch(true){

		case day <= 90:

		i = 0;

		break;

		case day <= 180:

		i = 1;

		break;

		case day <= 270:

		i = 2;

		break;

		case day <= 365 && !winterWeek:

		case day <= 360 && winterWeek:

		i = 3;

		break;

		case day > 360 && winterWeek:

		i = 4;

		break;

	}



	season += (i<4?locales.fr.season_label:"")+locales.fr.seasons[i].name;

	if(indexOutput)

		return i+1;

	else

		return season;

}



function convertDay(date){

	/*let month = date.month();

	let output = {

		day: date.date(),

		nextSeason: false

	}



	if(month != 0 && month % 3 != 0){

		let nbMonths = month % 3;

		for(let i = 1; i <= nbMonths; i++){

			output.day += moment(date).subtract(i, 'month').endOf('month').date();

		}

	}



	if(output.day > 90 && (date.quarter() < 4 || winterWeek)){

		output.day -= 90;

		output.nextSeason = true;

	}*/



	let output = 0;

	output = date.dayOfYear() - (date.quarter()-1)*90;



	if(output > 90 && (date.quarter() < 4 || winterWeek)){

		output -= 90;

	}



	return output;

}



function durationToString(duration){

	let output = "";



	if(duration.years() > 0)

		output += duration.years()+" "+(Math.abs(duration.years())>1?'années':'année')+(duration.months() > 0?',':'');



	if(duration.months() > 0)

		output += " "+duration.months()+" mois"+(duration.days() > 0?',':'');



	if(Math.abs(duration.days()) > 0)

		output += " "+Math.abs(duration.days())+" "+(Math.abs(duration.days())>1?'jours':'jour');



	return output;

}



function initDatepicker(isMouvelian){

	let m = isMouvelian || false;



	let dateStart = ($('#dateInput').val()!==""?(mouvelianCheck?moment($('#dateInput').val(), 'DD-MM-YYYY').subtract(diffYears, 'year').toDate():convertMouvelianDate($('#dateInput').val()).add(diffYears, 'year').toDate()):(mouvelianCheck?now.toDate():new Date()));



	if(typeof datepicker !== 'undefined')

		datepicker.destroy();



	if(m){

		datepicker = $('#dateInput').datepicker({

			startDate: dateStart,

			classes:"dark",

			autoClose : true,

			language: {

				days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],

				daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

				daysMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],

				months: ['Zéphyr','Zéphyr','Zéphyr','Phénix','Phénix','Phénix', 'Scion','Scion','Scion','Colosse','Colosse','Colosse - Hivernel'],

				monthsShort: ['Zéph', 'Zéph', 'Zéph', 'Phé', 'Phé', 'Phé', 'Sci', 'Sci', 'Sci', 'Col', 'Col', 'Col'],

				today: 'Today',

				clear: 'Clear',

				dateFormat: 'dd/mm/yyyy',

				timeFormat: 'hh:ii aa',

				firstDay: 1

			},

			onRenderCell(d, c){

				if(c=="day"){

					let m = moment(d).add(diffYears, 'year');

					let t = moment(d).isSame(now.startOf('day'));

					let day = convertDay(m);

					return {

						html: day,

						classes: (t?'-current-':''),

						disabled: ''

					}

				}

			},

			onSelect: function(a,b,c){

				let date = moment(b).add(diffYears, 'year');

				let previousDate = moment(b);

				let days = convertDay(previousDate);

				let season = convertMonth(previousDate.dayOfYear(), true);

				$('#dateInput').val(days+"/"+season+"/"+previousDate.year());



				$('#inputResult').text(date.format('LL'));

				let duration = moment.duration(now.diff(previousDate)).abs();

				if(duration.isValid() && parseInt(duration.asDays()) > 0)

					$('#duration').text("Soit "+durationToString(duration)+" par rapport à aujourd'hui.");

				else

					$('#duration').text("");

			}

		}).data('datepicker');

	}

	else{

		datepicker = $('#dateInput').datepicker({

			startDate: dateStart,

			language: 'fr',

			autoClose : true,

			onSelect: function(a,b,c){

				let date = moment(b).subtract(diffYears, 'year');

				$('#inputResult').text(convertDate(date));

				let duration = moment.duration(now.diff(date)).abs();

				if(duration.isValid() && parseInt(duration.asDays()) > 0)

					$('#duration').text("Soit "+durationToString(duration)+" par rapport à aujourd'hui.");

				else

					$('#duration').text("");

			}

		}).data('datepicker');

	}

}



function convertMouvelianDate(date){

	let array = date.split("/");

	let nbDays = 0;

	nbDays += parseInt(array[0]);

	nbDays += parseInt((array[1]-1)*90);



	let output = moment(array[2]);

	output.add(nbDays, 'day');



	return output;

}



function renderDate(dateToCompare){

	let date = (mouvelianCheck?convertMouvelianDate(dateToCompare):dateToCompare);

	let dateOutput = moment(date);



	if(mouvelianCheck)

		$('#inputResult').text(moment(date).add(diffYears, 'year').format('LL'));

	else{

		date.subtract(diffYears, 'year');

		$('#inputResult').text(convertDate(date));

	}



	let duration = moment.duration(now.diff(date)).abs();



	if(duration.isValid() && parseInt(duration.asDays()) > 0)

		$('#duration').text("Soit "+durationToString(duration)+" par rapport à aujourd'hui.");

	else

		$('#duration').text("");



	return dateOutput;

}