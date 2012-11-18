/**
* TinyFader 2.0.2 - scriptiny.com/tinyfader
* License: GNU GPL v3.0 - scriptiny.com/license
*/

var TINY = TINY || {};

function T$( i ) {
	return document.getElementById(i);
}
function T$$( e, p ) {
	return p.getElementsByTagName(e);
}

TINY.fader = function() {
	var p = {
		position: 0,
		auto: 0,
		navEvent: "click",
		duration: .25
	};
	function init( n, o ) {
		p.n = n;
		for ( s in o ) {
			p[s] = o[s]
		}
		this.build();
	}
	
	// Create slideshow object
	init.prototype.build = function() {
		var fader = T$(p.id),
		slides = p.slides = T$$("li", fader),
		total = slides.length,
		i = p.count = 0;
		fader.style.overflow = "hidden";
		for ( i; i < total; i++ ) {
			var slide = slides[i];
			if ( slide.parentNode == fader ) {
				slide.className += " fader-slide";
				slide.opacity = 0;
				slide.style.filter = "alpha(opacity=0)";
				p.count++;
			}
			if ( p.pauseHover ) {
				slide.onmouseover = new Function(p.n + ".pause()");
				slide.onmouseout = new Function(p.n + ".play()");
			}
		}
		if ( p.navid ) {
			var nav = T$(p.navid);
			if ( p.pauseHover ) {
				nav.onmouseover = new Function(p.n + ".pause()");
				nav.onmouseout = new Function(p.n + ".play()");
			}
			nav.style.display = "block";
			p.nav = T$$("li", nav);
			for ( var x = 0; x < p.count; x++ ) {
				if ( p.nav[x].addEventListener ) {
					p.nav[x].addEventListener(p.navEvent, new Function(p.n + ".pos(" + x + ")"), 0);
				} else {
					p.nav[x].attachEvent("on" + p.navEvent, new Function(p.n + ".pos(" + x + ")"), 0);
				}
			}
		}
		p.cssTrans = ( document.body.style.webkitTransition !== undefined ) || ( document.body.style.MozTransition !== undefined );
		this.pos(p.position, p.auto, 1);
	};
	
	// Start the automatic rotation
	init.prototype.play = function() {
		if ( !p.slides.ai ) {
			p.slides.ai = setInterval(new Function(p.n + ".move(1, 1)"), p.auto * 1000);
		}
	};
	
	// Pause the automatic rotation
	init.prototype.pause = function() {
		clearInterval(p.slides.ai);
		p.slides.ai = 0;
	};
	
	// Transition the slideshow to the left (-1) or right (1)
	init.prototype.move = function( dir, auto ) {
		var target = p.current + dir,
		index = ( dir == 1 ) ? ( target == p.count ) ? 0 : target : ( target < 0 ) ? p.count - 1 : target;
		this.pos(index, auto);
	};
	
	// Transition the slideshow to a particular slide
	init.prototype.pos = function( index, auto ) {
		if ( p.current != index ) {
			var slide = p.slides[index];
			for ( var x = 0; x < p.count; x++ ) {
				p.slides[x].style.zIndex = ( x == index ) ? 3 : ( x == p.current ) ? 2 : 1;
			}
			clearInterval(slide.si);
			this.pause();
			if (p.nav) {
				for ( var x = 0; x < p.count; x++ ) {
					p.nav[x].className = ( x == index ) ? p.activeClass : "";
				}
			}
			if ( p.duration ) {
				if ( p.cssTrans ) {
					if ( slide.className.indexOf("fader-fade") != -1 ) {
						slide.className = slide.className.replace(" fader-fade", "");
					}
					slide.si = setTimeout( function(){
						slide.className += " fader-fade";
					}, 20);
					if ( ( auto || ( p.auto && p.resume ) ) && !p.slides.ai ) {
						this.play();
					}
				} else {
					if ( slide.opacity >= 100 ) {
						slide.opacity = slide.style.opacity = 0;
						slide.style.filter = "alpha(opacity=0)";
					}
					slide.si = setInterval(new Function(p.n + ".fade(" + index + ", " + auto + ")"), ( (p.duration * 1000) / 10 ));
				}
				p.current = index;
			}
		}
	};
	
	// Slide fade transition
	init.prototype.fade = function( index, auto ) {
		var slide = p.slides[index];
		if ( slide.opacity >= 100 ) {
			clearInterval(slide.si);
			if ( ( auto || ( p.auto && p.resume ) ) && !p.slides.ai ) {
				this.play();
			}
		} else {
			slide.opacity += 10;
			slide.style.opacity = slide.opacity / 100;
			slide.style.filter = "alpha(opacity=" + slide.opacity + ")";
		}
	};
	
	return{init:init}
}();