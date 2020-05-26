





// fix initial page load not being at top
$(document).one("pagecontainershow", function(e, data) {
 $('body,html').scrollTop(0);
})




/*
/////////////////////////////////////////////         Always a fresh load for account pages
*/

$(document).on("pagecontainerbeforeload", function(event,data) {
  var newPage = data.dataUrl;
  if(newPage == "/account") {
   event.preventDefault(); 
   data.deferred.reject(); 
   console.log(newPage);
   //$( ":mobile-pagecontainer" ).pagecontainer( "change", $("#index")); 
  }
});


/*
/////////////////////////////////////////////       Contact Page be trippin
*/

$(document).on( "pagecreate", ".ui-page[data-url='/challenge']", function( event, ui ) {
$(document).one("pagecontainershow", function (event,ui) {
  console.log('fuck captcha');
  var page = ui.toPage[0];
  jQuery(page).find('form').attr('data-ajax','false');
});
});







/*
/////////////////////////////////////////////         Swap Active Link
*/

$(document).one("pagecontainerchange", function(event, ui) {
    changelinks(event, ui);
});
$(document).on("pagecontainerbeforetransition", function(event, ui) {
    //changelinks(event, ui); 
});

function changelinks(event, ui) {

  if(ui.toPage[0]) {
    var toPageEl = ui.toPage[0];
  }else{
    var toPageEl = ui.toPage;
  }
     

    var current = $(toPageEl).jqmData("title");
    if (!current) {
      if($(toPageEl).attr("data-url").includes("collections")) {
        var current = $(toPageEl).attr("data-url");
      }else{
        var current = $(toPageEl).attr("data-title");
      }
    }
    if (current.includes("–")) {
        var current = current.substring(0, current.indexOf('–')).trim();
    }
    $("[data-role = 'navbar'] a.ui-btn-active").removeClass("ui-btn-active");
    // Add active class to current nav button
 
    $("[data-role = 'navbar'] a").each(function() {
       if ($(this).attr('title') == null) {
              // do something 
              }else{
        var page = $(this).attr('link-title');
        if (page.includes("–")) {
            var page = page.substring(0, page.indexOf('–')).trim();
        }
       }
        if (page === current) {
            if (!$(this).hasClass('ui-btn-active')) {
                $(this).addClass("ui-btn-active");
            }
        }
    });
}


function mobilepanelbind() {
	jQuery('#mobilepanellink').off('click').on('click', function() {
            jQuery('#mobilemenu').panel( "toggle" );
	});
}



/*
/////////////////////////////////////////////          Swap body classes 
*/

$(document).on("pagecontainerbeforeshow", function (event, ui) {
  var eventid = ui.toPage[0].id;     
  if(eventid.indexOf('collection') != -1){
  var eventid = eventid.substring(0, eventid.indexOf('-'));
   }  
  var dataPrev = ui.prevPage[0] ;
  if(typeof dataPrev != 'undefined') {
     var previd = dataPrev.id;  
      jQuery(document.body).removeClass(previd).addClass(eventid);
  }else{
   jQuery(document.body).addClass(eventid);
  }
 
});

/*
/////////////////////////////////////////////         remove cart updates from broswer history by storing global variable
*/


$(document).on("pagecontainerbeforechange", function(event, ui) {
  if(typeof ui.prevPage !== 'undefined' && typeof ui.toPage !== 'undefined') {
    if(ui.prevPage[0].id == 'cart' && ui.toPage[0].id == 'cart') {
      if(typeof window.cartRefresh == 'undefined') {
       window.cartRefresh = 0;
      }
      window.cartRefresh = window.cartRefresh + 1;
    } 
    if(ui.prevPage[0].id == 'cart' && ui.toPage[0].id !== 'cart') {
      delete window.cartRefresh;
    }  
  }
  
  //if no previous page...lets go hom
  
  
});


$(document).one("pagecontainerbeforechange", function(event, ui) {
  delete window.hasNoHistory;
  if(ui.toPage[0].id == 'cart') {
   window.hasNoHistory = true;
    console.log(window.hasNoHistory);
  }
});


function goBack() {
  if (window.hasNoHistory !== true) { 
  if(typeof window.cartRefresh == 'undefined') {
    window.cartRefresh = 0;
  }
  var backIndex = -Math.abs(1) + -Math.abs(window.cartRefresh);
  window.history.go(backIndex);
  }else{
   $( ":mobile-pagecontainer" ).pagecontainer( "change", "/", {  showLoadMsg: true, reload: true, });
    delete window.hasNoHistory;
  }
}








/*
/////////////////////////////////////////////          Index Variable Fix
*/

$(document).on("pagecontainerbeforeload", function(event,data) {
  var index = document.querySelector('#index.ui-page');
  var newPage = data.dataUrl;
  if(index && newPage == "/") {
   event.preventDefault(); 
   data.deferred.reject(); 
   $( ":mobile-pagecontainer" ).pagecontainer( "change", $("#index")); 
  }
});

$(document).on("pagecontainerloadfailed", function(event,ui) {
  console.log('failure');
});

/*
/////////////////////////////////////////////          Fix Page jump on Transition 
*/
/*
$(document).on("pagecontainerbeforechange", function(e, data) {
    if (typeof data.prevPage !== 'undefined' && data.prevPage[0].baseURI == data.toPage[0].baseURI) {} else {
        if (typeof data.prevPage !== 'undefined' && data.prevPage[0].baseURI == data.toPage || typeof data.prevPage !== 'undefined' && data.toPage.indexOf(data.prevPage[0].baseURI + '?') != -1 ) {} else {
            if (data.options.stopRecursion != 1) {
                // prevent infinite recursion:
                data.options.stopRecursion = 1;
                // prevent pageChange before hiding current Page:
                e.preventDefault();
                var page = data.toPage;
                if (typeof page == 'string') {
                    if (page.indexOf('#') != -1) {
                        var hashash = true;
                    }
                }
            
                if (hashash != true) {
                    // get current ScrollPos and move PageDiv y pixel to top
                    // and scroll at the same time to the top
                    var y = $(document).scrollTop();
                    var h = $(data.prevPage).outerHeight();
                    //var h = $(data).scrollTop();  
                    $(data.options.fromPage).css({
                       // "margin-top": "-" + y + "px",
                        'min-height': h + "px"
                    });
                    $(data.options.fromPage).children('.ui-content').css({
                        "transform": "translateY(-" + y + "px)",
                       // 'min-height': h + "px"
                    });
                     
                    
                 
                }
                //trigger changePage manualy - now Transition-Procedure can scrollTop
                //it will have no effect : we are already at Top ;-)
                $(":mobile-pagecontainer").pagecontainer("change", data.toPage, data.options);
            }
        }
    }
});

$(document).on( "pagecontainertransition", function( event, ui ) {
  if(typeof ui.prevPage !== 'undefined' && typeof ui.toPage !== 'undefined' && ui.prevPage[0].id !== ui.toPage[0].id) {
    $(ui.prevPage).removeAttr("style").children('.ui-content').removeAttr("style");
  }
 
});
*/

$(document).on( "pagecontainerbeforeshow", function( event, ui ) {
 $('#swiper_Frame').scrollTop(0);
});

/*
/////////////////////////////////////////////          Fix Going Back to misplaced div 
*/

// in case of navigating back without page-reload
// remove page-div displacement: 
/*
$(document).on("pagecontainerhide", function(e, data) {
    $(data.prevPage).css({
        "margin-top": "",
        'min-height': ""
    });
})
*/
