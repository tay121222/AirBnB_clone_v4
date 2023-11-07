$(document).ready(function () {
    const amenityDict = {};

    $('input[type="checkbox"]').change(function () {
        if ($(this).is(':checked')) {
            amenityDict[$(this).data('id')] = $(this).data('name');
        } else {
            delete amenityDict[$(this).data('id')];
        }

        const amenityList = Object.values(amenityDict).join(', ');
        $('.amenities h4').text(amenityList);
    });

    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
        $('div#api_status').addClass('available');
    } else {
        $('div#api_status').removeClass('available');
    }
}).fail(function() {
    $('div#api_status').removeClass('available');
});

    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        data: JSON.stringify({}),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
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
                </article>`;
                $('section.places').append(article);
            }
        }
    });
});
