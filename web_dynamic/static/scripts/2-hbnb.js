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
});
