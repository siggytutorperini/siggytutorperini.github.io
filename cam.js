$(document).ready(function() {
	var videoTimeoutId;

	// Get location hash to see what slide we start with
	var hash = window.location.hash.replace('#', '');

	// The videos
	var videos = [
		{name: 'whotel', caption: 'W/Element Hotel', type: 'mjpeg', url: 'http://96.90.35.110/-wvhttp-01-/GetOneShot?frame_count=no_limit'}
		,{name: 'emarket', caption: 'East Market', type: 'mjpeg', url: 'http://38.98.234.33/-wvhttp-01-/GetOneShot?frame_count=no_limit'}
	];

	// Add carousel slides
	for (var i = 0; i < videos.length; i++) {
		// Create slide element
		$slide = $('<div class="item"></div>');
		$slide.attr('data-src', videos[i].url);
		$slide.attr('data-site', videos[i].name);

		// Create img tag for mjpeg stream
		$img = $('<img class="" />');
		$img.attr('src', videos[i].url);

		// Add img to slide
		$slide.append($img);

		// Create indicator element
		var $li = $('<li data-target="#myCarousel"></li>');
		$li.html(videos[i].caption);
		$li.attr('data-slide-to', i);

		// Figure out which slide to make active
		if (videos[i].name === hash) {
			$slide.addClass('active');
			$li.addClass('active');
			refreshVid($slide);
		} else if (i === 0 && !hash) {
			$slide.addClass('active');
			$li.addClass('active');
			refreshVid($slide);
		}

		// Append slide to carousel
		$('.carousel-inner').append($slide);

		// Append indicator to carousel
		$('.carousel-indicators').append($li);        
	};

	/**
	 * Update img tag to play mjpeg stream and refresh it every [interval] seconds
	 * @param  {jQuery} $item The slide that holds the img element
	 */
	function refreshVid($item) {
		// Get reference to slide img tag
		var $img = $item.find('img');
		$img.off('load');

		// Generate random number to bust cache
		var random = Math.floor(Math.random() * Math.pow(2, 31));

		// Setup to refresh the stream after image finishes loading
		$img.load(function() {
			// Only after image finishes loading do we set to refresh the image
			videoTimeoutId = setTimeout(refreshVid, 30000, $item);
		});

		// Update img src to new mjpeg stream
		$img.attr('src', $item.data('src') + '&bust=' + random);
	}

	// Initialize carousel
	$('#myCarousel').carousel({
	  interval: 30000,
	  pause: ''
	});

	// Handler to refresh video after the slide moves
	$('#myCarousel').on('slide.bs.carousel', function (ev) {
		if (videoTimeoutId) {
			clearTimeout(videoTimeoutId);
		}

		var $item = $(ev.relatedTarget);
		window.location.hash = $item.data('site');
		refreshVid($item);
	});

	// Start carousel
	if (hash === 'cycle') {
		$('#myCarousel').carousel('cycle');
	}

	// Stop carousel from moving
	$('#myCarousel').carousel('pause');

	// Change carousel based on hash
	window.onhashchange = function () {
		var hash = window.location.hash.replace('#', '');
		if (hash === 'cycle') {
			$('#myCarousel').carousel('cycle');
		}
	};
});