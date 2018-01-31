if (!Date.now) {
    Date.now = function() { return new Date().getTime(); };
}

var currentTime = Date.now() || +new Date();
var qs = getQueryStrings();
var id = qs["id"];


RadioSongs(id);


function getQueryStrings() { 
  var assoc  = {};
  var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
  var queryString = location.search.substring(1); 
  var keyValues = queryString.split('&'); 

  for(var i in keyValues) { 
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  } 

  return assoc; 
} 


//var qs = getQueryStrings();


//var first = getUrlVars()["me"];

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function RadioSongs(id){

     //loadJS('http://html5radios.svnlabs.com/json/'+id+'.json?hash='+currentTime+'&_callback=processLastJSON',false);
	 loadJS('1402830293.json?hash='+currentTime+'&_callback=processLastJSON',false);
	
}







function loadJS(url,cache){
    //cache is true by default
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src=url;
    if (cache==false) {
        s.src+='&jpt='+ (+new Date());
    }
    document.getElementsByTagName('head')[0].appendChild(s);
}

function isSafari() {
    return /^((?!chrome).)*safari/i.test(navigator.userAgent);
}

function processLastJSON(feed){
	
	//console.log(feed.playlist.tracks.length);
		
	var currentTime = Date.now() || +new Date();
	
	var cur_radiolink = feed.params.radiolink.replace("listen.pls","");
	
	if(feed.params.radiotype=="icecast")
	  var MP3Url = cur_radiolink+"?hash="+currentTime+".mp3"
	else
	  var MP3Url = cur_radiolink+";audio.mp3?hash="+currentTime
		
	var stream = {
		title: feed.params.title,
		mp3: MP3Url
	},
	ready = false;
	
	
    if(isSafari())
    	var solutionz="flash,html";
    else
    	var solutionz="html,flash";
	
	var idd = "#jquery_jplayer_1";
	
		var options = {
		swfPath: "js",
		preload: "auto",
		supplied: "mp3",
		wmode: "window",
		volume: volumez/100,
		smoothPlayBar: true,
		keyEnabled: true
	};
	
	jQuery("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			ready = true;
			
			if($.jPlayer.platform.android) {
			
			var myAndroidFix = new jPlayerAndroidFix(idd, stream, options);
			
			myAndroidFix.setMedia(stream).play();
			
			}
			else
			{
			
			if(autoplayz==false)
			 jQuery(this).jPlayer("setMedia", stream);
			else
			jQuery(this).jPlayer("setMedia", stream).jPlayer("play");		
			
			}
			
			
		},
		pause: function() {
			jQuery(this).jPlayer("clearMedia");
		},
		error: function(event) {
			if(ready && event.jPlayer.error.type === jQuery.jPlayer.error.URL_NOT_SET) {
				// Setup the media stream again and play it.
				jQuery(this).jPlayer("setMedia", stream).jPlayer("play");
			}
		},
		swfPath: "js",
		supplied: "mp3",
		preload: "auto",
		wmode: "window",
		/*autoPlay: true,*/
		solution: solutionz,
		volume: 100,
		keyEnabled: true
	});
	
	
	var img = (/(http|https)/i).test(feed.params.image);
	
	
	if(img) $("#current-play-pic").attr("src", feed.params.image);
	if(feed.params.facebook!="") $("#current-facebook").attr("href", feed.params.facebook);
	if(feed.params.twitter!="") $("#current-twitter").attr("href", feed.params.twitter);
	if(feed.params.artist!="") $("#current-artist").html("by "+feed.params.artist);
	
	//$("#current-track").html(feed.params.title);
	//$("#current-title").html(feed.params.title);
	
		
	//$("#WraperMainSmall").css("background-color", "#"+feed.params.bcolor);
	
	if(feed.params.bcolor=="ffffff" || feed.params.bcolor=="fff" || feed.params.bcolor=="FFFFFF" || feed.params.bcolor=="FFF")
	{
		
	$("body").css("color", "#000000");
	
	$("#current-track").css("color", "#000000");
	$("#current-title").css("color", "#000000");
	$("#current-artist").css("color", "#000000");
	
	}
	
	callSlider();
	
}	



function SocialShareFB() 
{

 var str = $('#current-track').html();
 var currt = str.replace("&"," ");

 var atitle = encodeURI( "I listen to " + currt + " on Radio Stream" ); 
 var bhref = encodeURI(parent.document.location.href);
 
 //var url = 'https://www.facebook.com/sharer/sharer.php?u=';
 
 var url = 'http://www.facebook.com/sharer.php?s=100&p[title]='+atitle+'&p[url]='+bhref+'&p[images][0]='+mp3p+'&';
 
 window.open(url,"Mywindow","location=yes,menubar=yes");

}


function SocialShareTwitter() 
{

var str = $('#current-track').html();
 var currt = str.replace("&"," ");

var atitle = encodeURI( "I listen to " + currt + " on Radio Stream" ); 
 var bhref = encodeURI(parent.document.location.href);
 
 var url = 'https://twitter.com/intent/tweet?status='+atitle+' '+bhref+'&amp;url='+bhref;
 
 window.open(url,"Mywindow","location=yes,menubar=yes");




}



function callSlider()
{
	
//Store frequently elements in variables
var slider  = jQuery('#slider'),
	tool_tip = jQuery('.tool_tip');

//Hide the Tooltip at first
tool_tip.hide();

//Call the Slider
slider.slider({
	//Config
	range: "min",
	min: 0,
	value: volumez,

	start: function(event,ui) {
		tool_tip.fadeIn('fast');
	},

	//Slider Event
	slide: function(event, ui) { //When the slider is sliding

		var value  = slider.slider('value'),
			volume = jQuery('.vol_ume');

		tool_tip.css('left', value).text(ui.value);  //Adjust the tooltip accordingly
		
		jQuery("#jquery_jplayer_1").jPlayer("volume", ui.value / 100);

		if(value <= 5) { 
			volume.css('background-position', '0 0');
		} 
		else if (value <= 25) {
			volume.css('background-position', '0 -25px');
		} 
		else if (value <= 75) {
			volume.css('background-position', '0 -50px');
		} 
		else {
			volume.css('background-position', '0 -75px');
		};

	},

	stop: function(event,ui) {
		tool_tip.fadeOut('fast');
	}
});	
	
}


var jPlayerAndroidFix = (function($) {
	var fix = function(id, media, options) {
		this.playFix = false;
		this.init(id, media, options);
	};
	fix.prototype = {
		init: function(id, media, options) {
			var self = this;

			// Store the params
			this.id = id;
			this.media = media;
			this.options = options;

			// Make a jQuery selector of the id, for use by the jPlayer instance.
			this.player = $(this.id);

			// Make the ready event to set the media to initiate.
			this.player.bind($.jPlayer.event.ready, function(event) {
				// Use this fix's setMedia() method.
				self.setMedia(self.media);
			});

			// Apply Android fixes
			if($.jPlayer.platform.android) {

				// Fix playing new media immediately after setMedia.
				this.player.bind($.jPlayer.event.progress, function(event) {
					if(self.playFixRequired) {
						self.playFixRequired = false;

						// Enable the contols again
						// self.player.jPlayer('option', 'cssSelectorAncestor', self.cssSelectorAncestor);

						// Play if required, otherwise it will wait for the normal GUI input.
						if(self.playFix) {
							self.playFix = false;
							$(this).jPlayer("play");
						}
					}
				});
				// Fix missing ended events.
				this.player.bind($.jPlayer.event.ended, function(event) {
					if(self.endedFix) {
						self.endedFix = false;
						setTimeout(function() {
							self.setMedia(self.media);
						},0);
						// what if it was looping?
					}
				});
				this.player.bind($.jPlayer.event.pause, function(event) {
					if(self.endedFix) {
						var remaining = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
						if(event.jPlayer.status.currentTime === 0 || remaining < 1) {
							// Trigger the ended event from inside jplayer instance.
							setTimeout(function() {
								self.jPlayer._trigger($.jPlayer.event.ended);
							},0);
						}
					}
				});
			}

			// Instance jPlayer
			this.player.jPlayer(this.options);

			// Store a local copy of the jPlayer instance's object
			this.jPlayer = this.player.data('jPlayer');

			// Store the real cssSelectorAncestor being used.
			this.cssSelectorAncestor = this.player.jPlayer('option', 'cssSelectorAncestor');

			// Apply Android fixes
			this.resetAndroid();

			return this;
		},
		setMedia: function(media) {
			this.media = media;

			// Apply Android fixes
			this.resetAndroid();

			// Set the media
			this.player.jPlayer("setMedia", this.media);
			return this;
		},

		play: function() {
			// Apply Android fixes
			if($.jPlayer.platform.android && this.playFixRequired) {
				// Apply Android play fix, if it is required.
				this.playFix = true;
			} else {
				// Other browsers play it, as does Android if the fix is no longer required.
				this.player.jPlayer("play");
			}
		},
		resetAndroid: function() {
			// Apply Android fixes
			if($.jPlayer.platform.android) {
				this.playFix = false;
				this.playFixRequired = true;
				this.endedFix = true;
				// Disable the controls
				// this.player.jPlayer('option', 'cssSelectorAncestor', '#NeverFoundDisabled');
			}
		}
	};
	return fix;
})(jQuery);
