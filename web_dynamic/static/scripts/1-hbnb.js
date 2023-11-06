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
});
