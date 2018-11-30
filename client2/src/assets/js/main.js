$(document).ready(function(){

    // for left side affix
    $('#tech-left-sidebar').on('affix.bs.affix', function(){
      $(this).width($(this).width() - 1);
      $('#tech-main-section').addClass('col-md-offset-3');
    }).on('affix-top.bs.affix', function() {
      $(this).css('width', '');
      $('#tech-main-section').removeClass('col-md-offset-3');
    });


    // for right side affix
    /*$('#tech-ads-sidebar').on('affix.bs.affix', function() {
      $(this).width($(this).width() - 1);
      $('#tech-main-section').addClass('col-md-offset-9');
      $("#tech-main-section").css("position", "relative");
    }).on('affix-top.bs.affix', function() {
      $(this).css('width', '');
      $('#tech-main-section').removeClass('col-md-offset-9');
      $("#tech-main-section").css("position", "absolute");
    });*/

    $(".right-sidebar").affix({
      offset: {top:235}
    });

    //remove TinyMCE plugin notification
    // $('#mceu_34').hide();

    $('.navbar-nav>li>a').on('click', function(){
      $('.navbar-collapse').collapse('hide');
    });
});

