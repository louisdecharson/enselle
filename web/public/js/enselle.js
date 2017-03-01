// $(document).ready(function(){       
//     var scroll_start = 0;
//     var startchange = $('#startchange');
//     var offset = startchange.offset();
//     if (startchange.length){
//         startchange.scroll(function() {
//             scroll_start = $(this).scrollTop();
//             if(scroll_start > offset.top) {
//                 $('.navbar-default').css('background-color', '#332A6C');
//             } else {
//                 $('.navbar-default').css('background-color', 'transparent');
//             }
//         });
//     }
// });

$(document).ready(function(){
    if ($('#startchange').length){
        $('.navbar-default').css('background-color', '#332A6C');
        var offset = $('#startchange').offset();
        $(document).scroll(function(){
            if (offset.top < $('.navbar-default').height()){
                $('.navbar-default').css('background-color', '#332A6C');
            } else {
                $('.navbar-default').css('background-color', 'transparent');
            }
        });
    } 
    else {
        $('.navbar-default').css('background-color', 'transparent');
    }
});
