$(function () {
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET", "musicDir.php", false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;

	x = xmlDoc.getElementsByTagName("Song");
	i = 0;

	function displaySongs() {
		artist = (x[i].getElementsByTagName("songURL")[0].childNodes[0].nodeValue);
		txt = artist;
		document.getElementById("showSongs").innerHTML = txt + poo;
		document.getElementById("myAudio").src = txt;
	}

	function next() {
		if (i < x.length - 1) {
			i++;
			displaySongs();
			replaySong();
		}
	}

	function previous() {
		if (i > 0) {
			i--;
			displaySongs();
			replaySong();
		}
	}

	function replaySong() {

		$.getScript("js/main.js", function (playAud) {
			//playAud();
		})
			.fail(function () {
				/* boo, fall back to something else */
			});

	}
});