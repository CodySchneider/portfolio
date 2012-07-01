/* Greybox Redux
* Required: http://jquery.com/
* Written by: John Resig
* Based on code by: 4mir Salihefendic (http://amix.dk)
* Additional changes by Cody Schneider
* License: LGPL (read more in LGPL.txt)
*/
var GB_ANIMATION = true;
var GB_DONE = false;
var GB_HEIGHT = 400;
var GB_WIDTH = 400;

function GB_Show(messageNumber, url, height, width) {
    //console.log('GB_Show');
    GB_HEIGHT = height || 400;
    GB_WIDTH = width || 400;
    var caption = "Feature Unavailable";

    var popUpMessage = "";
    switch (messageNumber) {
        case 1: popUpMessage = "<div id='GB_frame'>" +
	        "<p>This feature is currently unavailable. Please close this window to continue.</p></div>";
          break;
    }
    if (!GB_DONE) {
        jQuery(document.body).append("<div id='GB_overlay'></div><div id='GB_window'><h2 id='GB_caption'></h2>"
        + "<div class='cancel'><span class='hidden'>Close Window</span></div><div class='hook'>"
				+ "<p class='continue'><a href='#'>Continue</a></p></div></div>");
        jQuery(".cancel, .continue").click(GB_hide);
        jQuery("#GB_overlay").click(GB_hide);
        jQuery(window).resize(GB_position);
        jQuery(window).scroll(GB_position);
        GB_DONE = true;
    }

    jQuery("#GB_frame").remove();
    //jQuery(".continue a").remove();
    jQuery(".hook").prepend(popUpMessage);
    jQuery(".continue").click(function(){GB_hide();return false;});


    jQuery("#GB_caption").html(caption);
    jQuery("#GB_overlay").show();
    GB_position();

    if (GB_ANIMATION)
        jQuery("#GB_window").slideDown("slow");
    else
        jQuery("#GB_window").show("slow");
}

function GB_hide() {
    jQuery("#GB_window,#GB_overlay").hide();
}

function GB_position() {
    var de = document.documentElement;
    var h = self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    var w = self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
    var dsocleft = document.all ? iebody.scrollLeft : pageXOffset;
    var dsoctop = document.all ? iebody.scrollTop : pageYOffset;

    var height = h < GB_HEIGHT ? h - 32 : GB_HEIGHT;
    var top = (h - height) / 2 + dsoctop;

    jQuery("#GB_window").css({ width: GB_WIDTH + "px", height: height + "px",
        left: ((w - GB_WIDTH) / 2) + "px", top: top + "px"
    });
    jQuery("#GB_frame").css("height", height - 100 + "px");
    jQuery("#GB_overlay").css({ height: h, top: dsoctop + "px", width: w });
}
