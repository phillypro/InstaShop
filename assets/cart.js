
$(document).on("pagecontainerbeforeshow", function(event, ui) {
    // add custom remove and update functions to cart when init
    if (ui.toPage[0].id == 'cart') {
    var page = jQuery(ui.toPage[0]);  
    removeitem();

    cartreserve(page);  
      
      
    // frequently bought together
    updatequantity();
      
      
      
   var callbackCart = function(){
  // Handler when the DOM is fully loaded
  if(!window.Swiper) {
    // add script
    var script = document.createElement("script");
    script.type = "text/javascript";   
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@5.2.1/js/swiper.min.js';
    document.getElementsByTagName("head")[0].appendChild(script);
    // add style
    var style = document.createElement("link");
    style.type = "text/css";  
    style.rel = "stylesheet";
    style.href = 'https://cdn.jsdelivr.net/npm/swiper@5.2.1/css/swiper.min.css';
    document.getElementsByTagName("head")[0].appendChild(style);
  }
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callbackCart();
} else {
  document.addEventListener("DOMContentLoaded", callbackCart);
}   
function deferCart(methodCart) {
    if (window.Swiper && window.jQuery) {
        methodCart();
    } else {
        setTimeout(function() { deferCart(methodCart) }, 50);
    }
}
deferCart(function () {        
    frequentlyboughtslider(page);
});
      
      
      
      
      
      
     if (typeof ui.prevPage[0] !== 'undefined') {
      if(ui.prevPage[0].id !== 'cart') {
        page.addClass('animate');
        page.get(0).timer = setTimeout( function() {
          page.removeClass('animate');
        }, 1400 );
      }
     }else{
        page.addClass('animate');
        page.get(0).timer = setTimeout( function() {
          page.removeClass('animate');
        }, 1400 );
     }
      
      
      // slidecartcontrols on mobile only
 
      page.find('.product-cart-wrap').slideCartControls(); 

      

       
 
     //activate all ajax add buttons
     jQuery('.frequently-add').frequentlyadd(); 
   
      
     $('#checkout-bar-button').off('click').on('click', function() {
       $.mobile.loading( "show");
        $('#checkoutnow').trigger('click');
    });
      
      

      
      
    }
    // if coming from cart page remove it
    if (ui.prevPage === undefined) {
    if (ui.prevPage[0].id == 'cart') {
        jQuery(ui.prevPage[0]).remove();
        //scroll back to previous position
        $.mobile.silentScroll(window.cartscrolltop);
    }
    }
});



$(document).on("pagecontainershow", function(event, ui) {
if (ui.toPage[0].id == 'cart') {
  var page = jQuery(ui.toPage[0]);  
   updateButtonsTotal();
  
} 
});




// remove previous cart page when refreshed in the dom
$(document).on("pageshow", "#cart[data-role='page']", function(event, data) {

  
     if (localStorage.getItem('storedDiscount')){  
      var discountStored = localStorage.getItem('storedDiscount');   
      $('input[name="discount"]').val(localStorage.getItem('storedDiscount'));  
    }  
    $('form[action="/cart"]').on('submit', function(){ 
      var $discountCode = $('input[name="discount"]').val(); 
      localStorage.setItem('storedDiscount', $discountCode);  
    });   
  
  
});


$(document).on("pagecontainerhide", function(event, ui) {
    // always remove cart from dom
    if (ui.prevPage[0].id == 'cart') {
      $(ui.prevPage[0]).remove();
    }
});




function updatequantity() {
    $('.btn-number').unbind().click(function(e) {
        e.preventDefault();




        fieldName = $(this).attr('data-field');
        type = $(this).attr('data-type');
        var input = $(this).closest('.quantity-wrap').find("input[type='number']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if (type == 'minus') {

                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

            } else if (type == 'plus') {
                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }

            }
        } else {
            input.val(0);
        }
    });
    $('.input-number').focusin(function() {
        $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function() {

        minValue = parseInt($(this).attr('min'));
        maxValue = parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());

        name = $(this).attr('id');
        if (valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if (valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }


    });
    $(".input-number").keydown(function(e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });




    $("#cartform input.quantity").change(function() {

        // get current scroll position 
        window.cartscrolltop = $(window).scrollTop();

        var item_id = $(this).attr('id').replace('updates_', '');
        var item_quantity = $(this).val();
        var updatestring = 'updates[' + item_id + ']=' + item_quantity;
        jQuery.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: updatestring,
            async: false,
            cache: false,
            dataType: 'json',
            success: function(data) {
                cartcall(data);
            },
            error: Shopify.onError
        });

      if(jQuery(this).val() == 0) {
        // reload cart page
        jQuery(this).closest('.product-cart-wrap').fadeOut(400, function() {
           $( ":mobile-pagecontainer" ).pagecontainer( "change", "/cart", {  showLoadMsg: true, reload: true, transition: "none", changeHash: "false" });
            jQuery.ajax({
                type: 'GET',
                url: '/cart.js',
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                   cartcall(data);
                   var value = $('.cart-count').html() || '0';
                  if(data.item_count == 0) {
                    $('.cart-count').html(value.replace(/[0-9]+/,data.item_count)).addClass('hidden-count'); 
                  }else{
                   $('.cart-count').html(value.replace(/[0-9]+/,data.item_count)).removeClass('hidden-count');
                  }
                }
            });
        });
      }else{
         $( ":mobile-pagecontainer" ).pagecontainer( "change", "/cart", {  showLoadMsg: true, reload: true, transition: "none", changeHash: "false" });
      }
        // add function for updating cart icons
    });

}



//review slider hompage
function frequentlyboughtslider(page) {
  
  var container = page.find('.frequently-swiper');
  // create the slider
            var swiper = new Swiper((container), {
                effect: 'slide',
    slidesPerView: 1.1,
    spaceBetween: 10,
                centeredSlides: true,
              loop: false,
                   speed: 600,
                   autoplay: {
        delay: 4000,
        disableOnInteraction: true,
      },   
                breakpoints: {
    // when window width is <= 320px
    480: {
      // speed: 300,
      //spaceBetween: 0,
      }
     }
                      
             
            });
   
  
}


function updateButtonsTotal() {
  var total = jQuery('#cart-total').text();
  var sup = jQuery('#cart-total').children('sup');

  if(sup.length) {
var len = total.length;
var total = total.substring(0, len-3) + "." + total.substring(len-3);
   }
  jQuery('#checkout-bar-total').text(total);
}






(function($) {
    $.fn.slideCartControls = function() {

        // show loading
        var $this = $(this);


        $this.each(function() {
            var sliderEl = jQuery(this).get(0);
            var mc = new Hammer(sliderEl);
            sliderEl.hammer = mc;
            mc.on("pan", function(e) {
                var windowwidth = $('#swiper_Frame').innerWidth();
                var controlwidth = windowwidth / 2;
                var percentage = 100 / 1 * e.deltaX / windowwidth; // NEW: our % calc
              
                if (!jQuery(sliderEl).hasClass('open')) {
                    if (percentage <= 0 && percentage >= -50) {
                        sliderEl.style.transform = 'translateX(' + percentage + '%)'; // NEW: our CSS transform
                    }
                } else {
                    
                    var matrix = $(sliderEl).css('transform').replace(/[^0-9\-.,]/g, '').split(',');
                    var x = matrix[12] || matrix[4];
                    var percentage = 100 / 1 * e.deltaX / windowwidth; // NEW: our % calc
                    var current = 100 / 1 * x / windowwidth; // NEW: our % calc
                    var newpos = current + percentage;
  
                    if (newpos >= -50 && newpos <= 0) {
                        sliderEl.style.transform = 'translateX(' + newpos + '%)'; // NEW: our CSS transform
                    }
                }

               
                if (e.isFinal) { // NEW: this only runs on event end
                    if (percentage < -15 && !jQuery(sliderEl).hasClass('open')) {
                        // add open class, start animation
                        jQuery(sliderEl).addClass('open is-animating');
                        sliderEl.style.transform = 'translateX(-50%)';
                        // end animation after 400 seconds
                        sliderEl.timer = setTimeout( function() {
                        jQuery(sliderEl).removeClass('is-animating');
                        }, 300 );
                        // close siblings
                      jQuery(sliderEl).siblings().each(function() {
                         var sliderSib = jQuery(this).get(0);
                         jQuery(sliderSib).addClass('is-animating').removeClass('open');
                         sliderSib.style.transform = 'translateX(0%)';
                         sliderSib.timer = setTimeout( function() {
                        jQuery(sliderSib).removeClass('is-animating');
                        }, 300 );
                      });
  
                    } else {
                        // remove open class, start animation
                        jQuery(sliderEl).addClass('is-animating').removeClass('open');
                        sliderEl.style.transform = 'translateX(0%)';
                        // end animation after 400 seconds
                        sliderEl.timer = setTimeout( function() {
                        jQuery(sliderEl).removeClass('is-animating');
                        }, 300 );
                       
                    }
                }
              

            });
        });


    }
})(jQuery);



function cartreserve(page) {
var timer = page.find('#reserve-cart-timer');
if(timer.length) {
if(window.CartReserve) {
countdown( page.find('#reserve-cart-timer')[0], window.CartReserve['minutes'], window.CartReserve['seconds'] );   
}else{
window.CartReserve = {};  
countdown( page.find('#reserve-cart-timer')[0], timer.attr('time-left'), 0 );       
}
}
}


function countdown( elementName, minutes, seconds )
{
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.parentElement.innerHTML = "Time is up!";
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            window.CartReserve['minutes'] =  mins;
            window.CartReserve['seconds'] = twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = elementName;
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}
      
          



// load ajaxadd
(function($) {
  
    $.fn.frequentlyadd = function() {

        // show loading

        var $this = jQuery(this);

      
      
      
       // update price on qunatity
       $this.siblings('.input-group').find('.input-number').change(function() {
         var currentotal = jQuery(this).closest('.quantity-wrap').find('#frequently-bought-total');
         var currentotalnum = currentotal.attr('price').replace("$", "");
         var newprice = currentotalnum * jQuery(this).val(); 
           var newprice = newprice.toFixed(2);
           var newprice = newprice.replace(".", "");
           var finalprice = Shopify.formatMoney(newprice);
           var finalprice2 = finalprice.toString().replace('.00','');
           currentotal.text(finalprice2);
       });
             
       $this.off().on('click', function() {
         
        var $this = jQuery(this);
        var variant_id = $this.attr('variant-id');
        var quantity = $this.siblings('.input-group').find('.input-number').val();
        var updatestring = 'updates[' + variant_id + ']=' + quantity;
         
         
          $.mobile.loading( "show");  
           jQuery.post('/cart/update.js', updatestring , function(data) {
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "/cart", {  showLoadMsg: false, reload: true, transition: "fade", changeHash: "false" });
            $(document).one("pagecontainerbeforeshow", function(event, ui) {
               $.mobile.loading( "hide");  
            });
             jQuery.ajax({
                type: 'GET',
                url: '/cart.js',
                async: false,
                cache: false,
                dataType: 'json',
                success: function(data) {
                    cartcall(data);
                }
            });
           // googletrack(data, collection);
        }, 'json');
      });
    }
})(jQuery);



function removeitem() {
    $("#cartform .remove").unbind().click(function(e) {
        e.preventDefault();
        $.mobile.loading( "show");
      
        var productid = jQuery(this).attr('product-id');

        // reload cart page
        jQuery(this).closest('.product-cart-wrap').fadeOut(400, function() {
           jQuery.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: 'updates[' + productid + ']=0',
            async: false,
            cache: false,
            dataType: 'json',
            success: function(data) {
                cartcall(data);
              $(document).one("pagecontainerbeforeshow", function(event, ui) {
               $.mobile.loading( "hide");  
              });
              $( ":mobile-pagecontainer" ).pagecontainer( "change", "/cart", {  showLoadMsg: false, reload: true, changeHash: "false", transition: "none" });
            },
            error: Shopify.onError
        });
        });

    });
}



function cartcall(data) {

    // check for hasitem on zero
    if (data.item_count < 1) {
        $('body').removeClass('hasitem');
    } else {
        $('body').addClass('hasitem');
    }
}
