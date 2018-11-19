* 
 
	Custom functions for ThinkTheme

*/

/* Load files */
$.ajax({
	url: 'acttheme/time_ago.js',
	async: false,
	dataType: 'script'
});
/* Uncomment below to use custom language for timeago */
/* 	jQuery.timeago.settings.strings = {
		

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
(function () {
	$(document).ready(function () {
		// Add custom functions -->
		
		$(document).ajaxSuccess(function (event, xhr, settings) {
			if (settings.url.startsWith('json.htm?type=devices') ||
				settings.url.startsWith('json.htm?type=scenes')) {
				let counter = 0;
				let intervalId = setInterval(function () {
					if ($('#main-view').find('.item').length > 0) {
						// add custom functions to items(tiles) -->
						
						$('#main-view .item').each(function () {
							let xyz = $(this).find('#lastupdate');
							$(this).find("#lastupdate").timeago("update", xyz.text());
							
							if ($('#dashcontent').length == 0) {
								let item = $(this).closest('.item');
								var itemID = item.attr('id');
								if (typeof(itemID) === 'undefined') {
									itemID = item[0].offsetParent.id;
								}
								let type = $(this).find('#idno');
								if (type.length == 0) {
									$(this).find('#lastupdate').append('<i id="idno"></br>Idx: ' + itemID + '</i>');
								}
							}
						});
						
						// <-- end custom functions to items(tiles)
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
		// <-- end custom functions 
	});
})();
