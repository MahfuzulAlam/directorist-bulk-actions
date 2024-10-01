jQuery(document).ready(function($) {
    // When a box is clicked, select the corresponding radio button
    $('.radio-box').on('click', function() {
        $(this).find('input[type="radio"]').prop('checked', true);
        
        // Add 'selected' class to the clicked box and remove from others
        $('.radio-box').removeClass('selected');
        $(this).addClass('selected');
    });
});