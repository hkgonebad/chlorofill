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

});