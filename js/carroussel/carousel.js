$(document).ready(function() {
  $('.carousel').owlCarousel({
		items: 4,
		loop: true,
		margin: 10,
		responsiveClass: true,
		loop:true,
		
		autoplay: true,
		autoplayTimeout: 6000,
		autoplayHoverPause: true,
		responsive: {
		  0: {
			items: 1,
			nav: true
		  },
		  600: {
			items: 3,
			nav: true
		  },
		  1000: {
			items: 5,
			nav: true,
		}
	}
  })
});