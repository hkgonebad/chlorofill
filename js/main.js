///////////////////////////////////
$(function() {

    // News slider
    if ($('.videoCarousel').length > 0) {
        $('.videoCarousel').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            dots: true,
            autoplay: false,

            arrows: true,
            prevArrow:"<button type='button' class='slick-prev pull-left text-dark arrowClr'><i class='fas fa-chevron-left'></i></button>",
            nextArrow:"<button type='button' class='slick-next pull-right text-dark arrowClr'><i class='fas fa-chevron-right'></i></button>",

            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            }, {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                }
            }, {
                breakpoint: 420,
                settings: {
                    slidesToShow: 1,
                }
            }]

        });
    }

    // Store Locator
    const jlocator = $('#jlocator');
    if (jlocator.length > 0) { 
		jlocator.jlocator({
			openInfoWindowOnStoreClick: true,
            startZoom: 4, //initial map zoom (on page load)
            storeZoom: 17, //map zoom on store click
            latitude: 20.593684, //initial map latitude (on page load)
            longitude: 78.962880, //initial map longitude (on page load)         
            geolocation: true
		});
	}

	var showData = $('.stores');

    $.getJSON('json/data.json', function (data) {

	    var items = data.markers.map(function (item) {
		    return `
            <div data-type="store" class="store box" data-latitude="${item.Lat}" data-longitude="${item.Long}">
              <div class="art">
                <h4 class="title" data-type="title">${item.Location}</h4>
                <p data-type="address">${item.Address}</p>
                <p data-type="city">${item.City}</p>
                <p data-type="state">${item.State}</p>
                <p data-type="zipcode">${item.Pincode}</p>
                <p data-type="phone">${item.PhoneNumber}</p>
              </div>
            </div>`;
		});

	    showData.html(items);
    });

    showData.text('Loading the JSON file.');
});