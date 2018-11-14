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
