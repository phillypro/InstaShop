jQuery(document).on('mobileinit',function(){

  $.mobile.pageContainer = $("#swiper_Frame");
  $.mobile.loader.prototype.options.text = '<svg xmlns="http://www.w3.org/2000/svg" width="73px" height="73px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-ball2"><g ng-attr-transform="translate(0,)" transform="translate(0,-15)"><circle cx="50" ng-attr-cy="" r="24.1587" ng-attr-fill="" cy="32" fill="rgb(184, 83, 139)" transform="rotate(135.572 50 50)"> <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/> <animate attributeName="r" calcMode="spline" values="0;30;0" keyTimes="0;0.5;1" dur="1" keySplines="0.2 0 0.8 1;0.2 0 0.8 1" begin="0s" repeatCount="indefinite"/> </circle><circle cx="50" ng-attr-cy="" r="5.84128" ng-attr-fill="" cy="32" fill="rgb(239, 211, 61)" transform="rotate(315.572 50 50)"> <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="180 50 50;540 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/> <animate attributeName="r" calcMode="spline" values="30;0;30" keyTimes="0;0.5;1" dur="1" keySplines="0.2 0 0.8 1;0.2 0 0.8 1" begin="0s" repeatCount="indefinite"/></circle></g></svg>';
$(function(){ 
   $( "#header" ).toolbar();
   $( "[data-role = 'navbar']" ).navbar();
  
   //disable page transition
    $.mobile.defaultPageTransition = 'fade';
  
  
});
  
});



$(document).on("pagecreate", '#index', function (event, ui) {
sr();
});
               
function sr() {
     ScrollReveal().reveal('.headline-inner, .product, .button-wrap, .text.parallax-element', {  container: '#swiper_Frame', viewFactor: 0.2,	distance: '50px', duration: 800,  easing: 'ease-out'}); 
}



$(document).one("pagecontainershow", function (event,ui) {
   window.loaded = true; 
   function logLoaded2() {
   var swiperFrame = document.querySelector('#swiper_Frame');
   swiperFrame.classList.add('loaded');
   setTimeout(function() {
   swiperFrame.classList.add('loadedscroll');
      $(ui.toPage[0]).focus();
       },2500); 
   }

  if ($('#shopify-section-Loader svg.trace').length) {
    (function listen2() {
        if (window.loaded && window.draw) {
            logLoaded2();

        } else {
            window.setTimeout(listen2, 50);
        }
    })();      
  }else{
    (function listen2() {
        if (window.loaded) {
            logLoaded2();

        } else {
            window.setTimeout(listen2, 50);
        }
    })();  
  }
  
  
});






