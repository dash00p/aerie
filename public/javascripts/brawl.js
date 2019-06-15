(function ($) {
	var tf1 = tf2 = 0;
	var me = c_1 = c_2 = a_1 = a_2 = d_1 = d_2 = false;

	var fighter1 = "Combattant 1";
	var fighter2 = "Combattant 2";
	var bonus_1;
	var bonus_2;
	var random1;
	var random2;
	var result;
	var previous;

	$('[data-toggle="tooltip"]').tooltip()

	function init() {
		fighter1 = "Combattant 1";
		fighter2 = "Combattant 2";
		bonus_1 = bonus_2 = tf1 = tf2 = 0;
		$('#fighter1, #fighter2').val('');
		updateInput(1);
		updateInput(2);
		$('#listActions, #roll_fighter_1, #roll_fighter_2').html('');
		$('#roll_result, #roll_dif, #roll_previous').removeClass('show');
	}

	if (me) {
		$("button.btn_roll").attr("disabled", "disabled");
		$("#f1_touch").text(tf1);
		$("#f2_touch").text(tf2);
		if (tf1 > 2)
			$("#f1_touch").after('<span class="icon-injury"></span');
		else
			$("#f2_touch").after('<span class="icon-injury"></span');
	}
	else {
		//init();
		updateButtons();
	}

	$("#new_fight").click(function (e) {
		var x = confirm("Voulez-vous abandonner le match en cours?");
		if (x) {
			init();
		}
	});
	// $( "#faq").click(function(e) {
	//     e.preventDefault();
	//     $("#faq-modal").addClass("show");
	//     $("#content").addClass("blur");
	//     $("#header").addClass("blur");
	// 	setTimeout(function () { 
	// 	    $("#faq-modal").addClass('active');
	// 	}, 300);        
	//    $("#overlay").fadeIn(700).show('slow',function(){});
	//     $("#overlay").width('100%');
	//     $("#overlay").height('100%');
	// });

	// $("#overlay").click(function(e) {
	//     $(this).fadeOut(1000);
	//     closeModal($(".close"));
	// });

	// $( ".close").click(function(e) {
	//     e.preventDefault();
	//     closeModal(this);
	//     $("#overlay").fadeOut(1000);
	// });

	// $(".modal").click(function(e) {
	//     closeModal($(".close"));
	//     $("#overlay").fadeOut(1000);
	// });

	//$(".modal .modal-content").click(function(e) {e.stopPropagation();});

	/*document.getElementById('fighter1').addEventListener('invalid', function() {
		message=this.validationMessage;
		this.setCustomValidity(message);
		console.log("pewet");
	}, false);*/

	$("#submit_attack_1").click(function (e) {
		e.preventDefault();
		$form = document.getElementById('roll_form');
		if (false) {//if (!$form.checkValidity()) {
			$('<input type="submit">').hide().appendTo($form).click().remove();
		}
		else {
			getPostValue();
			previous = "Attaque de " + fighter1;
			if (result < 0 && result > -5) {//Minor fail for fighter 1
				sentence = fighter2 + " se défend avec succès.";
				a_2 = true;//Fighter 2 will attack on next roll.
			}
			else if (result <= -5) {//Critical fail for fighter 1
				sentence = fighter2 + " réussit un coup critique et contre-attaque !<span class='right icon-shield'></span>";
				c_2 = true;//Fighter 2 strikebacks.
			}
			else if (result > 0 && result < 5) {//Minor win for fighter 1
				sentence = fighter1 + " attaque avec succès.";
				d_2 = true;
			}
			else if (result >= 5) {//Major win for fighter 1
				sentence = fighter1 + " réussit un coup critique et brise la garde de son adversaire, remportant ainsi une touche !<span title='Humiliation publique' class='icon-slap'></span>";
				a_2 = true;//Fighter 2 will attack on next roll.
				tf2++;
				RollTouch();
			}
			else {
				sentence = "Egalité";
				a_2 = true;//Fighter 2 will attack on next roll.
			}
			updateButtons();
			displayRollResults(sentence, random1, random2);
		}
	});

	$("#submit_attack_2").click(function (e) {
		e.preventDefault();
		$form = document.getElementById('roll_form');
		if (false) {//if (!$form.checkValidity()) {
			$('<input type="submit">').hide().appendTo($form).click().remove();
		}
		else {
			getPostValue();
			previous = "Attaque de " + fighter2;
			if (result < 0 && result > -5) {//Minor fail for fighter 1
				sentence = fighter2 + " attaque avec succès.";
				d_1 = true;//Fighter 1 will defend on next roll.
			}
			else if (result <= -5) {//Critical fail for fighter 1
				sentence = fighter2 + " réussit un coup critique et brise la garde de son adversaire, remportant ainsi une touche !<span title='Humiliation publique' class='right icon-slap'></span>";
				a_1 = true;//Fighter 1 will attack on next roll.
				tf1++;
				RollTouch();
			}
			else if (result > 0 && result < 5) {//Minor win for fighter 1
				sentence = fighter1 + " se défend avec succès.";
				a_1 = true;
			}
			else if (result >= 5) {//Major win for fighter 1
				sentence = fighter1 + " réussit un coup critique et contre-attaque !<span class='icon-shield'></span>";
				c_1 = true;//Fighter 2 will defend on next roll.
			}
			else {
				sentence = "Egalité";
				a_1 = true;//Fighter 1 will attack on next roll.
			}
			updateButtons();
			displayRollResults(sentence, random1, random2);
		}
	});

	$("#submit_defense_1").click(function (e) {
		e.preventDefault();
		$form = document.getElementById('roll_form');
		if (false) {//if (!$form.checkValidity()) {
			$('<input type="submit">').hide().appendTo($form).click().remove();
		}
		else {
			getPostValue();
			previous = "Défense de " + fighter1;
			if (result < 0 && result > -5) {//Minor fail for fighter 1
				sentence = fighter2 + " brise la défense de " + fighter1 + " et remporte une touche !";
				a_1 = true;//Fighter 1 will attack on next roll.
				tf1++;
				RollTouch();
			}
			else if (result <= -5) {//Critical fail for fighter 1
				sentence = fighter2 + " réussit un coup critique et s'acharne avec violence sur son adversaire. Entre deux effluves sanguines, il/elle remporte une touche !<span class='right icon-blood-splash'></span>";
				a_2 = true;
				tf1++;
				RollTouch();
			}
			else if (result > 0 && result < 5) {//Minor win for fighter 1
				sentence = fighter1 + " s'est défendu avec brio.";
				a_1 = true;
			}
			else if (result >= 5) {//Major win for fighter 1
				sentence = fighter1 + " réussit une défense critique et profite d'une ouverture pour prendre d'assaut " + fighter2 + ".<span class='icon-shield'></span>";
				c_1 = true;//Fighter 2 will defend on next roll.
			}
			else {
				sentence = "Egalité, " + fighter1 + ' se prépare à riposter.';
				a_1 = true;//Fighter 1 will attack on next roll.
			}
			updateButtons();
			displayRollResults(sentence, random1, random2);
		}
	});

	$("#submit_defense_2").click(function (e) {
		e.preventDefault();
		$form = document.getElementById('roll_form');
		if (false) {//if (!$form.checkValidity()) {
			$('<input type="submit">').hide().appendTo($form).click().remove();
		}
		else {
			getPostValue();
			previous = "Défense de " + fighter2;
			if (result < 0 && result > -5) {//Minor fail for fighter 1
				sentence = fighter2 + " s'est défendu avec brio.";
				a_2 = true;//Fighter 2 will attack on next roll.
			}
			else if (result <= -5) {//Critical fail for fighter 1
				sentence = fighter2 + " réussit une défense critique et profite d'une ouverture pour prendre d'assaut " + fighter1 + ".<span class='right icon-shield'></span>";
				c_2 = true;
			}
			else if (result > 0 && result < 5) {//Minor win for fighter 1
				sentence = fighter1 + " brise la défense de " + fighter2 + " et remporte une touche !";
				a_2 = true;
				tf2++;
				RollTouch();
			}
			else if (result >= 5) {//Major win for fighter 1
				sentence = fighter1 + " réussit un coup critique et s'acharne avec violence sur son adversaire. Entre deux effluves sanguines, il/elle remporte une touche !<span class='icon-blood-splash'></span>";
				a_1 = true;//Fighter 1 will attack on next roll.
				tf2++;
				RollTouch();
			}
			else {
				sentence = "Egalité, " + fighter2 + ' se prépare à riposter.';
				a_2 = true;//Fighter 2 will attack on next roll.
			}
			updateButtons();
			displayRollResults(sentence, random1, random2);
		}
	});

	$("#fighter1").change(function () {
		updateInput(1);
	});

	$("#fighter2").change(function () {
		updateInput(2);
	});

	function updateInput(fighterID) {
		var val = $("#fighter" + fighterID).val();
		if (val === "")
			val = "Combattant " + fighterID;

		$("#submit_attack_" + fighterID).fadeOut(200, function () {
			$("#submit_attack_" + fighterID).text("Attaque de " + val).fadeIn(200);
		});
		$("#submit_defense_" + fighterID).fadeOut(200, function () {
			$("#submit_defense_" + fighterID).text("Défense de " + val).fadeIn(200);
		});
	}

	$('#faq-modal').on('show.bs.modal', function (e) {
		$("#content, #header, footer.footer, #menu-toggle").addClass("blur");
	});

	$('#faq-modal').on('hide.bs.modal', function (e) {
		$("#content, #header, footer.footer, #menu-toggle").removeClass("blur");
	});

	// function closeModal(object) {
	//    $(object).parents().removeClass('active');
	// 	setTimeout(function () { 
	// 	    $(object).parents().removeClass('show');
	// 	}, 1000);
	// 	$("#content").removeClass("blur");
	// 	$("#header").removeClass("blur");
	// };

	function getPostValue() {
		let temp_f1 = $("#fighter1").val();
		if (temp_f1 !== "")
			fighter1 = temp_f1;

		let temp_f2 = $("#fighter2").val();
		if (temp_f2 !== "")
			fighter2 = temp_f2;

		if ($("#bonus_1").val())
			bonus_1 = parseInt($("#bonus_1").val());
		else bonus_1 = 0;
		if ($("#bonus_2").val())
			bonus_2 = parseInt($("#bonus_2").val());
		else bonus_2 = 0;
		var min = 1;
		var max = 10;
		random1 = parseInt((Math.random() * (max - min + 1)), 10) + min + bonus_1;
		random2 = parseInt((Math.random() * (max - min + 1)), 10) + min + bonus_2;
		result = random1 - random2;
		a_1 = a_2 = d_1 = d_2 = c_1 = c_2 = false;
		//Display
		if (!$("#fighter_rolls, #roll_dif").hasClass('show'))
			$("#fighter_rolls, #roll_dif").addClass('show');

		$(".roll_fighter").fadeOut(400, function () {
			$("#roll_fighter_1").text(fighter1 + ": " + random1);
			$("#roll_fighter_2").text(fighter2 + ": " + random2);
			$(".roll_fighter").fadeIn(400);

		});
		$("#roll_dif").fadeOut(400, function () {
			$("#roll_dif").text("Différence de: " + Math.abs(result)).fadeIn(400);
		});
	};

	function displayRollResults(sentence, random1, random2) {
		$("#roll_result").addClass('show');
		$("#roll_previous").addClass('show');
		$("#roll_result").fadeOut(400, function () {
			$("#roll_result").html(sentence).fadeIn(400);
		});
		var dt = new Date();
		var time = "[" + addZeroBefore(dt.getHours()) + ":" + addZeroBefore(dt.getMinutes()) + "] ";
		old_previous_text = $("#listActions").html();
		$("#roll_previous").fadeOut(400, function () {
			$("#listActions").html(time + previous + ' ♓ [' + random1 + '-' + random2 + ']' + '<br/>' + old_previous_text);
			$("#roll_previous").fadeIn(400);
		});
	};

	function updateButtons() {
		$(".c-f-1").children('button').prop("disabled", false);
		$(".c-f-2").children('button').prop("disabled", false);
		if (me) {
			$(".c-f-2").children('button').prop("disabled", true);
			$(".c-f-1").children('button').prop("disabled", true);
		}
		else if (c_1)//Fighter 1 strikebacks.
		{
			$(".c-f-1").children('button').prop("disabled", true);
			$(".c-f-2 button:eq(0)").prop("disabled", true);
		}
		else if (c_2)//Fighter 2 strikebacks.
		{
			$(".c-f-2").children('button').prop("disabled", true);
			$(".c-f-1 button:eq(0)").prop("disabled", true);
		}
		else if (a_1)//Fighter 1 attacks.
		{
			$(".c-f-2").children('button').prop("disabled", true);
			$(".c-f-1 button:eq(1)").prop("disabled", true);
		}
		else if (a_2)//Fighter 2 attacks.
		{
			$(".c-f-1").children('button').prop("disabled", true);
			$(".c-f-2 button:eq(1)").prop("disabled", true);
		}
		else if (d_1) {
			$(".c-f-2").children('button').prop("disabled", true);
			$(".c-f-1 button:eq(0)").prop("disabled", true);
		}
		else if (d_2) {
			$(".c-f-1").children('button').prop("disabled", true);
			$(".c-f-2 button:eq(0)").prop("disabled", true);
		}
		else {
			$(".c-f-1 button:eq(1)").prop("disabled", true);
			$(".c-f-2 button:eq(1)").prop("disabled", true);
		}
	};

	function checkPostValidity() {
		v1 = document.getElementById('fighter1').checkValidity();
		v2 = document.getElementById('fighter2').checkValidity();
	};

	function RollTouch() {
		checkMatchEnd();
		$("#f1").parent().addClass('show').fadeIn();
		$("#f1").text(fighter1);
		$("#f2").text(fighter2);
		$("#f1_touch").text(tf1);
		$("#f2_touch").text(tf2);
	};

	function checkMatchEnd() {
		if (tf1 >= 3) {
			me = true;
			finish_content = '<div class="col-md-6 col-ct"><div class="row"><div class="col-md-10 col-md-offset-1"><p class="match_end col-md-12">' + fighter1 + ' a subi 3 touches et perd le match.</p><p class="match_win col-md-12">' + fighter2 + ' won. <span class="icon-doge"></span></p></div></div></div>';
			$(finish_content).appendTo($("#content")).hide().fadeIn(800);
		}
		else if (tf2 >= 3) {
			me = true;
			finish_content = '<div class="col-md-6 col-ct"><div class="row"><div class="col-md-10 col-md-offset-1"><p class="match_end col-md-12">' + fighter2 + ' a subi 3 touches et perd le match.</p><p class="match_win col-md-12">' + fighter1 + ' won. <span class="icon-doge"></span></p></div></div></div>';
			$(finish_content).appendTo($("#content")).hide().fadeIn(800);
		}
	};

	function addZeroBefore(n) {
		return (n < 10 ? '0' : '') + n;
	}

})(jQuery);