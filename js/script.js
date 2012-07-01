/* Author: 

*/
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return false;
}

$(function(){
	$('#login').click(function(){
		FB.login(function(response) {
			var accessToken = response.authResponse.accessToken;
			setCookie('accessToken',accessToken);
			if (response.authResponse) {
				console.log('Welcome!  Fetching your information.... ');
				FB.api('/me/photos?'+accessToken, function(response) {
					console.log(response);
					var $photoShuffle = $('#photoShuffle')
					for (i=0;i<10;i++) {
						imgSrc = response.data[i].images[4].source;
						imgTitle = response.data[i].place.name;
						imgDate = new Date(response.data[i].created_time);
						imgDate = imgDate.toLocaleDateString();
						$thisPhoto = $('<div class="container" data-drag="true" data-resize="true"  data-dock="dock" data-collapse="true" data-containment="document" />')
						$thisPhoto.append('<img src="'+imgSrc+'" />');
						$thisPhoto.appendTo('#photoShuffle');
						//console.log($thisPhoto);
					}
					$(".container").containerize();
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		}, {scope: 'email,user_likes,user_photos,friends_photos'});
	});
});





















