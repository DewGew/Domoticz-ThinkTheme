/*
		Custom js for ThinkTheme
*/
var theme = {};
/* Load files */
$.ajax({
	url: 'acttheme/time_ago.js',
	async: false,
	dataType: 'script'
});
$.ajax({
	url: 'acttheme/theme.json',
	cache: false,
	async: false,
	dataType: 'json',
	success: function (localJson) {
		theme = localJson;
	}
});

/* Uncomment below to use custom language for timeago */
/*
jQuery.timeago.settings.strings = {

	prefixAgo: "för",
	prefixFromNow: "om",
	suffixAgo: "sedan",
	suffixFromNow: "",
	seconds: "%d sekunder",
	minute: "ungefär en minut",
	minutes: "%d minuter",
	hour: "ungefär en timme",
	hours: "ungefär %d timmar",
	day: "en dag",
	days: "%d dagar",
	month: "ungefär en månad",
	months: "%d månader",
	year: "ungefär ett år",
	years: "%d år"

};
*/

setTimeout(update, 3000);

(function () {
	$(document).ready(function () {
		// Add custom code -->
		var isMobile = /Android|webOS|iPhone|iPad|iPod|ZuneWP7|BlackBerry/i.test(navigator.userAgent);

		$(document).ajaxSuccess(function (event, xhr, settings) {
			
            	var pagedetect = window.location.href.split("/#/")[1].toLowerCase();

            	// Add searchbar
           	if (pagedetect == 'dashboard' || pagedetect == 'lightswitches' || pagedetect == 'scenes' || pagedetect == 'temperature' || pagedetect == 'weather' || pagedetect == 'utility'){
          		if ($("#searchInput").length == 0) {
             	  		$('<input type="text" id="searchInput" onkeyup="searchFunction()" placeholder="Filter Devices" title="Filter">').insertAfter('.navbar-inner');
       	        	}
    	        }else {
     	        	$("#searchInput").remove();
    	        }

			if (settings.url.startsWith('json.htm?type=devices') ||
				settings.url.startsWith('json.htm?type=scenes')) {
				let counter = 0;
				let intervalId = setInterval(function () {
						if ($('#main-view').find('.item').length > 0) {
							// Add custom functions to items(tiles) -->

							$('#main-view .item').each(function () {

								// Time Ago -->
								let lastupdated = $(this).find('#timeago');
								let lastUpdateTime = $(this).find('#lastupdate');
								if (lastupdated.length == 0) {
									//$(this).find('table tbody tr').append('<td id="timeago" class="timeago"></td>');
									$('<td id="timeago" class="timeago"></td>').insertBefore($(this).find('#lastupdate'));
									$(this).find('#lastupdate').remove();
								}
								$(this).find("#timeago").timeago("update", lastUpdateTime.text());
								// <-- End Time Ago

								// Idx no -->

								if ($('#dashcontent').length == 0 && isMobile == false) {
									let item = $(this).closest('.item');
									var itemID = item.attr('id');
									if (typeof(itemID) === 'undefined') {
										itemID = item[0].offsetParent.id;
									}
									let type = $(this).find('#idno');
									if (type.length == 0) {
										$(this).find('#timeago').append('<i id="idno"></br>Idx: ' + itemID + '</i>');
									}
								} // <-- Idx no

							});

							// <-- End custom functions to items(tiles)
							clearInterval(intervalId);
						} else {
							counter++;
							if (counter >= 5) {
								clearInterval(intervalId);
							}
						}
					}, 1000);
			}
		});

		// <-- End custom code
	});
})();

// Javascript Functions -->

function searchFunction() {
	if ($('#dashcontent') || $('lightcontent') || $('scenecontent') || $('utilitycontent') || $('weatherwidgets') || $('tempwidgets')) {
		var value = $('#searchInput').val().toLowerCase();
		$("div .item").filter(function () {
			$(this).toggle($(this).find('#name').html().toLowerCase().indexOf(value) > -1)
		});
	};
};

function update() {
	$.ajax({
		url: 'https://raw.githubusercontent.com/DewGew/Domoticz-ThinkTheme/' + theme.branch + '/theme.json',
		async: false,
		dataType: 'json',
		success: function (data) {
			gitVersion = data.version
				if (theme.version !== gitVersion) {
					generate_noty('success', 'New version of ThinkTheme is availible! <a href="https://github.com/DewGew/Domoticz-ThinkTheme/tree/' + theme.branch + '" target="_blank">Download now!</a>', false);
				}
		}
	});
}

// <-- End Javascript Functions
