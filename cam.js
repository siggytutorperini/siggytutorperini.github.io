$(document).ready(function() {
	var videoTimeoutId;

	// Get location hash to see what slide we start with
	var hash = window.location.hash.replace('#', '');

	// Cycle Timing (in milliseconds)
	var CYCLE_TIME = 1000 * 30;

	// The videos
	var videos = [
		{name: 'emarket', caption: 'East Market', type: 'mjpeg', url: 'http://38.98.234.33/-wvhttp-01-/GetOneShot?frame_count=no_limit'}
		,{name: 'whotel', caption: 'W/Element Hotel', type: 'mjpeg', url: 'http://96.90.35.110/-wvhttp-01-/GetOneShot?frame_count=no_limit'}
	];

	// Add carousel slides
	for (var i = 0; i < videos.length; i++) {
		
		// Figure out which slide to make active
		if ((hash && videos[i].name === hash) || (i === 0 && !hash)) {
			// Create slide
			var parts = createSlide(videos[i], i);
			$slide = parts[0];
			$li = parts[1];

			// Set active slide
			$slide.addClass('active');
			$li.addClass('active');

			// Append slide and indicator to carousel
			$('.carousel-inner').append($slide);
			$('.carousel-indicators').append($li); 
		} else if (!hash) {
			// Create slide
			var parts = createSlide(videos[i], i);
			$slide = parts[0];
			$li = parts[1];

			// Append slide and indicator to carousel
			$('.carousel-inner').append($slide);
			$('.carousel-indicators').append($li); 
		}      
	};

	function createSlide(video, index) {
		// Create slide element
		$slide = $('<div class="item"></div>');
		$slide.attr('data-src', video.url);
		$slide.attr('data-site', video.name);

		// Create img tag for mjpeg stream
		$img = $('<img class="" />');
		$img.attr('src', video.url);

		// Add img to slide
		$slide.append($img);

		// Create indicator element
		var $li = $('<li data-target="#myCarousel"></li>');
		$li.html(video.caption);
		$li.attr('data-slide-to', index);

		return [$slide, $li];
	}

	/**
	 * Update img tag to play mjpeg stream and refresh it every [interval] seconds
	 * @param  {jQuery} $item The slide that holds the img element
	 */
	// function refreshVid($item) {
	// 	// Get reference to slide img tag
	// 	var $img = $item.find('img');
	// 	$img.off('load');

	// 	// Generate random number to bust cache
	// 	var random = Math.floor(Math.random() * Math.pow(2, 31));

	// 	// Setup to refresh the stream after image finishes loading
	// 	$img.load(function() {
	// 		// Only after image finishes loading do we set to refresh the image
	// 		videoTimeoutId = setTimeout(refreshVid, 30000, $item);
	// 	});

	// 	// Update img src to new mjpeg stream
	// 	$img.attr('src', $item.data('src') + '&bust=' + random);
	// }

	// Initialize carousel
	$('#myCarousel').carousel({
	  interval: CYCLE_TIME,
	  pause: ''
	});

	// Handler to refresh video after the slide moves
	$('#myCarousel').on('slide.bs.carousel', function (ev) {
		// if (videoTimeoutId) {
		// 	clearTimeout(videoTimeoutId);
		// }

		var $item = $(ev.relatedTarget);
		window.location.hash = $item.data('site');
		// refreshVid($item);
	});

	// Start carousel in paused or cycle mode
	if (hash === 'cycle') {
		$('#myCarousel').carousel('cycle');
	} else {
		$('#myCarousel').carousel('pause');
	}

	// Change carousel based on hash
	window.onhashchange = function () {
		var hash = window.location.hash.replace('#', '');
		if (hash === 'cycle') {
			$('#myCarousel').carousel('cycle');
		}
	};
});