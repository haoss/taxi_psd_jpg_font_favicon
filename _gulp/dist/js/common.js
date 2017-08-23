'use strict'

// Document ready
$(document).on('ready', function(){

  // SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery-item',
      type: 'image',
      gallery:{
        enabled:true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  // Magnific popup one image
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
    	verticalFit: true
    }
  });

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $('.open-popup-link').magnificPopup({
    type: 'inline',
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
  });

  // Menu
  navigation();
  menuAnimation();

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
        $.smoothScroll();
    }
  } catch(err) {

  };

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-callback');
});

$(window).on('load', function() {
  // $(".loader_inner").fadeOut();
  $(".loader").delay(400).fadeOut("slow");
});

$(window).on('resize', function(){
  var width = $(window).width();

  if (width > 991) {
    $('#btn-mobile').removeClass('is-active');
    $('.header').removeClass('is-active');
  }

  if (width > 767) {
    $('.tarif__navigation').removeClass('is-active');
  }
});
/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
    e.preventDefault();

    var formData = {};

    var hasFile = false;

    if ($(this).find('[type=file]').length < 1) {
      formData = $(this).serialize();
    }
    else {
      formData = new FormData();
      $(this).find('[name]').each(function(){

        switch($(this).prop('type')) {

          case 'file':
            if ($(this)[0]['files'].length > 0) {
              formData.append($(this).prop('name'), $(this)[0]['files'][0]);
              hasFile = true;
            }
            break;

          case 'radio':
          case 'checkbox':
            if (!$(this).prop('checked')) {
              break;
            }
            formData.append($(this).prop('name'), $(this).val().toString());
            break;

          default:
            formData.append($(this).prop('name'), $(this).val().toString());
            break;
        }
      });
    }

    $.ajax({
      url: $(this).prop('action'),
      data: formData,
      type: 'POST',
      contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
      cache       : false,
      processData : false,
      success: function(response) {
        $(form).removeClass('ajax-waiting');
        $(form).html($(response).find(form).html());

        if (typeof callback === 'function') {
          callback(response);
        }
      }
    });

    $(form).addClass('ajax-waiting');

    return false;
  });
}

function navigation(){
  var header = $('.header'),
      btnMobile = $('#btn-mobile'),
      tarifNavigation = $('.tarif__navigation'),
      btnMobileTarif = $('#btn-mobile-tarif'),
      btnMobileTarifText = btnMobileTarif.find('span'),
      btnMobileTarifLi = $('.tarif__tab li'),
      btnMobileTarifActive = $('.tarif__tab li.active a span').text(),
      width = $(window).width();
  ;

  btnMobile.on('click', function(e){
    e.stopPropagation();
    $(this).toggleClass('is-active');
    header.toggleClass('is-active');
  });

  $(document).on('click', function(){
    setTimeout(function(){
      btnMobile.removeClass('is-active');
      header.removeClass('is-active');
    }, 500)
  });

  $(document).on('click', '.header__navigation', function(e){
    e.stopPropagation();
  });

  btnMobileTarif.on('click', function(e){
    e.stopPropagation();
    // $(this).toggleClass('is-active');
    tarifNavigation.toggleClass('is-active');
  });
  $(document).on('click', function(){
    tarifNavigation.removeClass('is-active');
  });

  btnMobileTarifLi.find('a').on('click', function(){
    var text = $(this).find('span').text();
    btnMobileTarifText.text(text);
  });

  if (width < 991) {
    $('.tarif__tab--index > li:first-child').addClass('active');
    $('.tarif__tab-content .tab-pane:first-child').addClass('active');
    $('.tarif__main__auto--animation .tarif__main__auto__wrapper').css({opacity: 1});
    $('.tarif__main__price').css({opacity: 1});
    $('.tarif__main__minute-price--tab').css({opacity: 1});
    $('.tarif__main__auto--zero .img').css({opacity: 1});
  }

  setTimeout(function(){
    btnMobileTarifText.text($('.tarif__tab > li:first-child').text());
    // console.log('rest');
  }, 500)

}

function menuAnimation() {
  var a = $('.tarif__tab--index li a');
  var width = $(window).width();

  a.each(function(){
    $(this).on('click', function(){
      if (width > 767) {
        TweenMax.set($('.tab-pane .tarif__main__price'), {opacity: 0});
        TweenMax.set($('.tab-pane .tarif__main__minute-price--tab'), {opacity: 0});
        TweenMax.set($('.tab-pane .tarif__main__auto--animation .tarif__main__auto__wrapper'), {opacity: 0});
        TweenMax.set($('.tab-pane .tarif__main__auto--animation .tarif__main__auto__wrapper .wheel--one'), {rotation: '0deg'});
        TweenMax.set($('.tab-pane .tarif__main__auto--animation .tarif__main__auto__wrapper .wheel--two'), {rotation: '0deg'});


        setTimeout(function(){
          var auto = $('.tab-pane.active .tarif__main__auto--animation .tarif__main__auto__wrapper');
          var price = $('.tab-pane.active .tarif__main__price');
          var tab = $('.tab-pane.active .tarif__main__minute-price--tab');
          var wheel1 = $('.tab-pane.active .tarif__main__auto--animation .tarif__main__auto__wrapper .wheel--one');
          var wheel2 = $('.tab-pane.active .tarif__main__auto--animation .tarif__main__auto__wrapper .wheel--two');

          TweenMax.fromTo(price, 1, {opacity: 0}, {autoAlpha: 1, ease: Power2.easeInOut});
          TweenMax.fromTo(tab, 1, {opacity: 0}, {autoAlpha: 1, ease: Power2.easeInOut});
          TweenMax.to($('.tarif__main__auto--zero .img'), 0.5, {autoAlpha: 0, ease: Power2.easeInOut});

          var tl = new TimelineMax();
          tl.set(auto, {opacity: 1})
            .fromTo(auto, 1.5, {left: '2000px'}, {left: '-50px', ease: Power2.easeOut})
            .to(wheel1, 1.5, {rotation: '-450deg', transformOrigin:"50% 50%", ease: Power2.ease}, 0)
            .to(wheel2, 1.5, {rotation: '-450deg', transformOrigin:"50% 50%", ease: Power2.ease}, 0)
            .to(auto, 0.5, {left: '0px', ease: Power3.ease}, 'wheelPosition')
            .to(wheel1, 0.5, {rotation: '-370deg', transformOrigin:"50% 50%", ease: Power2.ease}, 'wheelPosition', 0)
            .to(wheel2, 0.5, {rotation: '-370deg', transformOrigin:"50% 50%", ease: Power4.ease}, 'wheelPosition', 0)
          ;

        }, 100);
      }
    });
  });

}
