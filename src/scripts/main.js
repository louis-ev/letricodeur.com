var $titreProche;
var $viewport = $('html, body');

var gotoByScroll = function(section, margintop, callback) {
	if ($(window).width() >= 992) {
		var offsetTopPx = section.offset().top - margintop;
		$('html, body').animate({
			scrollTop: offsetTopPx
		}, 900, 'easeInOutQuint', callback );
	} else {
		$('html, body').animate({
			scrollTop: section.offset().top
		}, 0, callback );
	}
};

function hyphenate(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

$.extend($.easing, {
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t * t + b; }
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	}
});


var titreProche = function( selector, modwscrollTop) {
	var dist = 0;
	var pDist = 10000000000;
	var titreactif;
	//optimisation : stocker le numéro d'article plutôt que l'article : http://jsperf.com/jquery-each-this-vs-eq-index
	var numTitre = -1;
	var $titres = selector;
	$titres.each(function(index) {
		dist = modwscrollTop - $(this).offset().top;
		if (dist > -10 && dist < pDist) {
			pDist = dist;
			numTitre = index;
		}
		//console.log( "this.offsetTop : " + $(this).offset().top);
	});
	if ( numTitre !== -1 ) {
		titreactif = $titres.eq(numTitre);
		return titreactif;
	}
	return false;
};



function fsopacity(scrollfromtop) {

	var percentfromtop = scrollfromtop / ($('.flexcontainer').height());
/* 	$(".flexcontainer").css("position", "fixed"); */

	if ( percentfromtop < 1 && $(window).width() >= 1025 ) {
		$(".flexcontainer .flexslider").css("opacity", 1 - percentfromtop*1.4);
/* 		$(".titrePage h1").css("text-shadow", "1px 1px 10px rgba(255, 255, 255, " +  (percentfromtop) + ")" ); */

		if (percentfromtop > .8 ) {
			$(".titrePage").addClass("away");
		} else {
			$(".titrePage").removeClass("away");
		}

		if (percentfromtop > .2 ) {
			$(".pleasescroll").addClass("active");
		} else {
			$(".pleasescroll").removeClass("active");

		}
	}
}


$(document).ready(function() {

	$(".pleasescroll .arrowdown").on("click", function() {
		gotoByScroll( $(".blocinfo").eq(0) , 40, function() {} );
	});

	$(".titre").each(function () {

		var $this = $(this);
		var $entrytitle = $this;
		var entrytitletext = $entrytitle.text();

		//$("#journal .recap ol").append("<li><h3>"+ entrytitletext + "</h3></li>");

		var id = $this.attr('id');
		if (!id) {
			id = hyphenate( $entrytitle.text() ).replace(/\s+/g, '-').replace(/éè/g, 'e').replace(/^#/, '').replace(/[!"#$%&'*+,.\/:;<=>?@\[\\\]\^_`{|}~]+/g, '-').replace(/-+/g, '-');
			$(this).attr('id', id);
		}

		$(this).attr('id', id);

		var selector = $('<li class="items ' + id + '"><h3><a href="#' + id + '" data-goto="' + id + '">' + entrytitletext + '</a></h3></li>').appendTo( $(".pleasescroll") );

		//console.log("well " + $(this));

		$(selector).click(function(e) {
			e.preventDefault();
			console.log("this ");
			console.log($this);
			var slideto = $(this).find('a').attr("data-goto");
			console.log("slideto : " + slideto);
			gotoByScroll( $this , 30, function () {
			});
		});
	});

	// lien gotofooter
	$(".scrolltofooter").click(function(e) {
		e.preventDefault();
		$this = $(this);
		gotoByScroll( $(".footer") , 30, function () {
		});
	});





	if ( $('.entry .detail').length !== 0) {

		var counter = 0;

		$(".entry .detail").wrap("<div class='detail-cont'></div>");

		$(".entry").each(function () {

			var $this = $(this);
			var $entrytitle = $(this).find(".detail").eq(0).find("h3");
			var entrytitletext = $entrytitle.text();

			//$("#journal .recap ol").append("<li><h3>"+ entrytitletext + "</h3></li>");

			$(this).bind('touchstart touchend', function(e) {
		        $(this).toggleClass('hover_tap');
		    });


			var id = $this.attr('id');
			if (!id) {
				id = hyphenate( $entrytitle.text() ).replace(/\s+/g, '-').replace(/éè/g, 'e').replace(/^#/, '').replace(/[!"#$%&'*+,.\/:;<=>?@\[\\\]\^_`{|}~]+/g, '-').replace(/-+/g, '-');
				$(this).attr('id', id);
			}

			$(this).attr('id', id);
			var letemps = $this.data("temps");

			var selector = $('<li class="items ' + id + '"><h3><a href="#' + id + '" data-goto="' + id + '">' + entrytitletext + '</a></h3></li>').appendTo( $("#journal .recap ol[data-temps="+letemps+"]") );


			//console.log("well " + $(this));

			$(selector).click(function(e) {
				e.preventDefault();
				console.log("this ");
				console.log($this);
				var slideto = $(this).find('a').attr("data-goto");
				console.log("slideto : " + slideto);
				gotoByScroll( $this , 0, function () {
				});
			});
		});
	}

	var posScrollPage = window.pageYOffset;
	$titreProche = $(".entry .detail-cont").eq(0);
	var $newTitreProche = $titreProche;
/* 	fixedmenu(posScrollPage); */
	fsopacity(posScrollPage);

	$(window).scroll(function() {
		var posScrollPage = window.pageYOffset;
/* 		fixedmenu(posScrollPage); */
		fsopacity(posScrollPage);

		$newTitreProche = titreProche( $(".entry .detail-cont"), window.pageYOffset);

		if ( $titreProche !== $newTitreProche ) {
			$titreProche = $newTitreProche;
			$(".entry .detail").removeClass("fixed");

			if ( $titreProche ) {
				$titreProche.find(".detail").addClass("fixed");

				if ($viewport.is(':animated')) {
					console.log( "animated");
					return;
				}
				$titreProche.siblings(".captures-cont").find("img").each( function() {
					console.log("imgs");
					$(this).attr("src", $(this).attr("data-src") );
				});
			}
		}
	});
});


$(window).load( function() {
	if ( $(window).width() >= 1024 ) {
	  $('.flexslider').flexslider({
	    animation: "fade",
	    animationLoop: true,
	    slideshow: true,
	    directionNav: false,
	    controlNav: true,
	    slideshowSpeed: 6000,
	    after: function() {

	    }
	  });

	} else {
	}

	$newTitreProche = titreProche( $(".entry .detail-cont"), window.pageYOffset);
	if ( $titreProche !== $newTitreProche ) {
		$titreProche = $newTitreProche;
		$(".entry .detail").removeClass("fixed");

		if ( $titreProche ) {
			$titreProche.find(".detail").addClass("fixed");
		}
	}

});
