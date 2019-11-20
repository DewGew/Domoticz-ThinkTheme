/*
		Custom js for ThinkTheme
*/
var theme = {}, lang, user;
var isMobile = /Android|webOS|iPhone|iPad|iPod|ZuneWP7|BlackBerry/i.test(navigator.userAgent);
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

setTimeout(update, 6000);

(function () {
	$(document).ready(function () {
		// Add custom code -->
		
        showThemeSettings();

		$(document).ajaxSuccess(function (event, xhr, settings) {

            // Add pagename to tabtitle
            var pagedetect = window.location.href.split("/#/")[1];
            document.title = 'Domoticz - ' + $.t(pagedetect);

            if ($(".container-logo").length == 0) {
                var containerLogo = '<header class="logo"><div class="container-logo">';
                containerLogo += "</div></header>";
                $(containerLogo).insertBefore(".navbar-inner");
            }
            showThemeSettings();
            
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
            /* Set $scope variable when angular is available */
            var $scope = null;
            checkAngular = setInterval(function() {
                if (($scope === null) && (typeof angular !== "undefined") && (typeof angular.element(document.body).injector() !== "undefined")) {
                    clearInterval(checkAngular);
                    $scope = angular.element(document.body).injector().get('$rootScope');

                    /* Check Domoticz version */
                    var dom_ws_version = 11330;
                    var current_version = parseInt($scope.config.appversion.split(".")[1]);
                    if (current_version < dom_ws_version) {
                        console.error("To be fully working, this theme requires to run Domoticz version " + dom_ws_version + " minimum -- Your version is " + current_version);
                    }
                    $scope.$on('jsonupdate', function (event, data) {
                        if (data.title === "Devices") {
/*                             if (data.item.Type === "Light/Switch") {
                                console.log(data.item.idx, data.item.Name, data.item.Data)
                                if (data.item.Data === "On"){
                                    console.log(data.item.Name, 'är', data.item.Data)
                                }
                            }
                            if (data.item.Type === "Temp") {
                                console.log(data.item.idx, data.item.Name, data.item.Data)
                            } */
                            addCustomItems(data);
                        } else {
                            // Other ? Notification ?
                            console.debug("Other event --> " + data);
                        }
                    }, function errorCallback(response) {
                        console.error("Cannot connect to websocket");
                    });
                }
            }, 100);

		});

		// <-- End custom code
	});
})();

// Javascript Functions -->
function showThemeSettings() {
    if (!$("#tabsystem").length) {
        setTimeout(showThemeSettings, 1000);
        return;
    }
    if (!$("#tabtheme").length) {
        $('<li id="themeTabButton"><a data-target="#tabtheme" data-toggle="tab" data-i18n="Theme">Theme</a></li>').appendTo("#tabs");
        $("#tabs li:not(.pull-right)").click(function() {
            if ($(window).width() < 480) {
                $(this).siblings().show();
            }
        });
        $("#tabs").i18n();
        
        var html = '<section><div id="themesettings">';
        html += '<div class="page-header-small"><h1 data-i18n="Theme">Theme</h1></div>';
        html += '<div class="row-fluid">';
        html += '<div class="span12">';
        html += '<h2><span data-i18n="About">About</span> ThinkTheme</h2>';
        html += '<p><span data-i18n="Version">Version</span> ' + theme.version + '</p>';
        html += '<p>This is a modyfied theme made by Domoticz user <a href= "https://www.domoticz.com/forum/viewtopic.php?f=8&t=7863">Thinkpad</a>';
        html += '</div>';
        html += '</div>';
        html += '</div></section>';
        
        $("#my-tab-content").append('<div class="tab-pane" id="tabtheme">' + html + '</div>');
        $("#my-tab-content").i18n();
    }
}
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

function removeEmptySectionDashboard() {
    $("#dashcontent section").each(function() {
        $(this).show();
        if (!$(this).children("div.row").children(":visible").length) {
            $(this).hide();
        }
    });
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
function addCustomItems(data){
    if ($('#main-view').find('.item').length > 0) {
    // Add custom functions to items(tiles) -->
        $('#main-view .item').each(function () {
            // Idx no -->
            if ($('#dashcontent').length == 0 && isMobile == false) {
                let item = $(this).closest('.item');
                var itemID = item.attr('id');
                if (typeof(itemID) === 'undefined') {
                    itemID = item[0].offsetParent.id;
                }
                let type = $(this).find('#idno');
                if (type.length == 0) {
                    $(this).find('#type').prepend('<div id="idno"> Idx: ' + itemID + '</div>');
                }
            }
            // <-- Idx no
	    // Time Ago -->
	    $(this).find('#lastupdate').hide();
	    let lastupdated = $(this).find('#timeago');
	    let lastUpdateTime = $(this).find('#lastupdate');
	    if (lastupdated.length == 0) {
		$(this).find('#type').prepend('<div id="timeago" class="timeago"></div>');            
	    }
	    if ($(this).find('#type').length == 0) {
		$('<td id="timeago" class="timeago"></td>').insertBefore($(this).find('#lastupdate'));
	    }
	    $(this).find("#timeago").text(moment(lastUpdateTime.text()).fromNow());
	    // <-- End Time Ago
        });
    }
}

// <-- End Javascript Functions
