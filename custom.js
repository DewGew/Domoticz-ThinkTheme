/*
		Custom js for ThinkTheme
*/
var theme = {}, lang, user;
/* Load files */
$.ajax({
    url: "json.htm?type=settings",
    cache: false,
    async: false,
    dataType: "json",
    success: function(b) {
        lang = b.Language;
        user = b.WebUserName;
    }
});

$.ajax({
    url: "acttheme/moment.js",
    async: false,
    dataType: "script",
    success: function() {
        moment.locale(lang);
    }
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

setTimeout(update, 3000);

(function () {
	$(document).ready(function () {
		// Add custom code -->
		var isMobile = /Android|webOS|iPhone|iPad|iPod|ZuneWP7|BlackBerry/i.test(navigator.userAgent);

		$(document).ajaxSuccess(function (event, xhr, settings) {
			
	    var pagedetect = window.location.href.split("/#/")[1];
            document.title = 'Domoticz - ' + pagedetect;
            if ($(".container-logo").length == 0) {
                var containerLogo = '<header class="logo"><div class="container-logo">';
                containerLogo += "</div></header>";
                $(containerLogo).insertBefore(".navbar-inner");
            }
            	// Add searchbar
		if (pagedetect.toLowerCase() == 'dashboard' || pagedetect.toLowerCase() == 'lightswitches' || pagedetect.toLowerCase() == 'scenes' || pagedetect.toLowerCase() == 'temperature' || pagedetect.toLowerCase() == 'weather' || pagedetect.toLowerCase() == 'utility'){
          		if ($("#searchInput").length == 0) {
                        $("#appnavbar")
             	  		$('<input type="text" id="searchInput" autocomplete="off" onkeyup="searchFunction()" placeholder="Filter Devices" title="Filter">').appendTo('.container-logo');
                        $("#search").click(function() {
                            $("#searchInput").focus();
                        });
                        $("#searchInput").keyup(function(event) {
                            if (event.keyCode === 13) {
                                $("#searchInput").blur();
                            }
                            if (event.keyCode === 27) {
                                $("#searchInput").val("");
                                $("#searchInput").keyup();
                            }
                        });
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
								$(this).find("#timeago").text(moment(lastUpdateTime.text()).fromNow());
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
    var value = $("#searchInput").val().toLowerCase();
    $("div .item").filter(function() {
        var element = $(this);
        if ($("#dashcontent").length || $("#weatherwidgets").length || $("#tempwidgets").length) {
            element = $(this).parent();
        }
        element.toggle($(this).find("#name").html().toLowerCase().indexOf(value) > -1);
    });
    $(".mobileitem tr").filter(function() {
        $(this).toggle($(this).html().toLowerCase().indexOf(value) > -1);
    });
    removeEmptySectionDashboard();
}

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

function removeEmptySectionDashboard() {
    $("#dashcontent section").each(function() {
        $(this).show();
        if (!$(this).children("div.row").children(":visible").length) {
            $(this).hide();
        }
    });
}

// <-- End Javascript Functions
