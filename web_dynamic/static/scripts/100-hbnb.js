$(document).ready(function() {
    const amenityDict = {};
    const stateDict = {};
    const cityDict = {};

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
                    </article>`;
                    $('section.places').append(article);
                }
            }
        });
    });
});
