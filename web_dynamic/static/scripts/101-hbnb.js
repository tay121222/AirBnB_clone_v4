$(document).ready(function() {
    const amenityDict = {};
    const stateDict = {};
    const cityDict = {};
    const users = {};

     $.getJSON('http://0.0.0.0:5001/api/v1/users/', function(data) {
    for (const user of data) {
        users[user.id] = `${user.first_name} ${user.last_name}`;
    }
});

    $('input[type="checkbox"]').change(function() {
        if ($(this).is(':checked')) {
            if ($(this).data('type') === 'state') {
                stateDict[$(this).data('id')] = $(this).data('name');
            } else if ($(this).data('type') === 'city') {
                cityDict[$(this).data('id')] = $(this).data('name');
            } else {
                amenityDict[$(this).data('id')] = $(this).data('name');
            }
        } else {
            if ($(this).data('type') === 'state') {
                delete stateDict[$(this).data('id')];
            } else if ($(this).data('type') === 'city') {
                delete cityDict[$(this).data('id')];
            } else {
                delete amenityDict[$(this).data('id')];
            }
        }

        const amenityList = Object.values(amenityDict).join(', ');
        const statesList = Object.values(stateDict).join(', ');
        const citiesList = Object.values(cityDict).join(', ');
        $('.locations h4').text(statesList + ' ' + citiesList);
        $('.amenities h4').text(amenityList);
    });

    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    }).fail(function() {
        $('div#api_status').removeClass('available');
    });

    $('#toggle_reviews').click(function() {
        const reviewsSection = $('section.reviews');
        if (reviewsSection.is(':visible')) {
            reviewsSection.hide();
            $('#toggle_reviews').text('show');
        } else {
            reviewsSection.show();
            $('#toggle_reviews').text('hide');
        }
    });

    $('button').click(function() {
        const amenityList = Object.keys(amenityDict);
        const stateList = Object.keys(stateDict);
        const cityList = Object.keys(cityDict);
        const data = {
            amenities: amenityList,
            states: stateList,
            cities: cityList
        };
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                $('section.places').empty();
                for (let place of data) {
                    let article = `<article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
			<div class="reviews" data-id="${place.id}">
                            <h2><span class="num">Reviews</span> <span class="toggle_reviews">Show</span></h2>
                            <ul></ul>
                        </div>
                    </article>`;
                    $('section.places').append(article);
		    fetchReviews(place.id);
                }
            }
        });
    });

    function fetchReviews(placeId) {
        $.ajax({
            url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
            type: 'GET',
            dataType: 'json',
            success: function (reviews) {
                const placeElement = $(`#place-${placeId}`);
                const reviewsSection = placeElement.find('.reviews');

                reviewsSection.find('ul').empty();

                if (reviews.length > 0) {
                    const reviewsList = '<ul>';
                    for (let review of reviews) {
                        const datestr = (new Date(Date.parse(review.updated_at))).toDateString();
                        reviewsList += `
                            <li>
                                <h3>From ${review.user_id} the ${datestr}</h3>
                                <p>${review.text}</p>
                            </li>`;
                    }
                    reviewsList += '</ul>';
                    reviewsSection.find('ul').html(reviewsList);
                }
            }
        });
    }

    $(document).on('click', 'span.toggle_reviews', function () {
        const ul = $(this).parent().parent().children('ul').last();
        if ($(this).text() === 'Show') {
            $(this).text('Hide');
            const url = `http://0.0.0.0:5001/api/v1/places/${$(this).parent().parent().attr('data-id')}/reviews`;
            const parent = $(this).parent();
            $.get(url, function (data) {
                const len = Object.keys(data).length;
                parent.children('span.num').text(`${len} Review${len !== 1 ? 's' : ''}`);
                for (const review of data) {
                    const datestr = (new Date(Date.parse(review.updated_at))).toDateString();
		    const username = users[review.user_id];
                    const template = `<li>
                        <h3>From ${username} the ${datestr}</h3>
                        <p>${review.text}</p>
                    </li>`;
                    ul.append(template);
                    ul.show();
                }
            });
        } else {
            $(this).parent().children('span.num').text('Reviews');
            $(this).text('Show');
            ul.hide();
        }
    });
});
