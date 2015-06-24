var $titreProche;
var $viewport = $('html, body');
var loadAllImages = false;

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
			$(".flexcontainer .flexslider").removeClass("moveSlides");
		} else {
			$(".titrePage").removeClass("away");
			$(".flexcontainer .flexslider").addClass("moveSlides");
		}

		if (percentfromtop > .2 ) {
			$(".pleasescroll").addClass("active");
		} else {
			$(".pleasescroll").removeClass("active");

		}
	} else {
		$(".flexcontainer .flexslider").removeClass("moveSlides");
	}
}

function loadNecessaryImages( $newTitreProche ) {

	if ( $newTitreProche.parents(".entry").next().length !== 0 ) {
		$newTitreProche.parents(".entry").next().prevAll().addBack().find(".captures-cont img").each( function() {

			var thisSrc = $(this).attr("data-src");
			if ( thisSrc != undefined ) {
				$(this).attr("src", thisSrc );
				$(this).removeAttr("data-src");
			}

		});
	} else {
		$newTitreProche.parents(".entries").find(".captures-cont img").each( function() {

			var thisSrc = $(this).attr("data-src");
			if ( thisSrc != undefined ) {
				$(this).attr("src", thisSrc );
				$(this).removeAttr("data-src");
			}

		});
	}
}



var photoSwipeImplementation = function(article, gallery_class){
	var self = this;
	self.pswpElement = document.querySelectorAll('.pswp')[0];
	self.options = {
		history: true,
		showAnimationDuration: 1000,
		showHideOpacity: false,
		preload: [2, 2],

		getThumbBoundsFn: function(index){
			var thumbnail = document.querySelectorAll('.pswp-select-tbn')[0];

			var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			var rect = thumbnail.getBoundingClientRect();
			return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		}
	};

	this.init = function(){
		console.log("photoSwipeImplementation initialized.");
		self.bind_open_gallery();
		self.bind_expand();
		self.cover_to_css_cover();
	},

	this.get_slides = function(t){
		var slides = new Array();

		t.parent(gallery_class).find('li').each(function(){
			var img = new Image();
				img.src = $(this).find('img').parent('a').attr('href');
			slides.push({
				title: $(this).find('figcaption').html(),
				src: img.src,
				msrc: $(this).find('img').attr('src'),
				w: img.width || 480,
				h: img.height || 360
			});
		});

		return slides;
	},

	this.bind_open_gallery = function(e){
		$(gallery_class).find('li').on('click', function(e){
			$(".pswp-select-tbn").removeClass('pswp-select-tbn');
			$(this).addClass('pswp-select-tbn');
			var slides = self.get_slides( $(this) );

			self.options.index = $(this).index();
			self.parent = $(this).parent(gallery_class);

			self.gallery = new PhotoSwipe(self.pswpElement, PhotoSwipeUI_Default, slides, self.options);
			self.gallery.init();

			return false;
		});
	},

	this.bind_expand = function(){
		article.find('header').on('click',function(){
			var t_article = $(this).parents('article');

			t_article.toggleClass('expand');
			t_article.find('.content').stop().slideToggle(1000);

			t_article.find(gallery_class).find('li').each(function(){
				var img = new Image();
					img.src = $(this).find('a').attr('href');
			});
		});
	},

	this.cover_to_css_cover = function(){
		var t = $(article).find('header > figure.cover');
		t.each(function(){
			$(this).css("background-image", "url('"+ $(this).find('img').attr('src') +"')");
		});
	},

	this.init();
};




$(document).ready(function() {

	window.photoSwipeImplementation = new photoSwipeImplementation($("article.entry"), ".pswp-gallery" );



	$(".pleasescroll .arrowdown").on("click", function() {
		gotoByScroll( $(".blocinfo").eq(0) , 40, function() {} );
	});

	$(".scrollToBloc").on("click", function(e) {
		e.preventDefault();
		gotoByScroll( $("#" + $(this).data("goto"))  , 40, function() {} );
	});

	$(".titre").each(function () {
		var $this = $(this);
		if ( $this.data("index") === undefined) {
			return;
		}

		var $entrytitle = $this;
		var entrytitletext = $entrytitle.data("index");

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

// 	var posScrollPage = window.pageYOffset;
// 	$titreProche = $(".entry .detail-cont").eq(0);
// 	var $newTitreProche = $titreProche;
// /* 	fixedmenu(posScrollPage); */
// 	fsopacity(posScrollPage);

// 	$(window).scroll(function() {
// 		var posScrollPage = window.pageYOffset;
// /* 		fixedmenu(posScrollPage); */
// 		fsopacity(posScrollPage);

// 		$newTitreProche = titreProche( $(".entry .detail-cont"), window.pageYOffset);



// 		console.log( "$newTitreProche" );
// 		console.log( $newTitreProche );



// 		if ( $newTitreProche ) {

// 			if ( $newTitreProche.find(">.detail.fixed").length === 0 ) {

// 				$(".entry .detail").removeClass("fixed");

// 				if ( $newTitreProche ) {
// 					$newTitreProche.find(">.detail").addClass("fixed");

// 					loadNecessaryImages( $newTitreProche );
// 				}
// 			}
// 		} else {
// 			$(".entry .detail").removeClass("fixed");
// 		}
// 	});
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

	// $newTitreProche = titreProche( $(".entry .detail-cont"), window.pageYOffset);

	// console.log( $newTitreProche.find(">.detail.fixed").length );

	// if ( $newTitreProche.find(">.detail.fixed").length === 0 ) {

	// 	$(".entry .detail").removeClass("fixed");

	// 	if ( $newTitreProche ) {
	// 		$newTitreProche.find(".detail").addClass("fixed");

	// 		loadNecessaryImages( $newTitreProche );
	// 	}
	// }
});
