if ( window.location !== window.parent.location && window.virtualGuide ) {	  
  
  startGuide();
 
}


function switchTutorial(sectionType) {


switch(sectionType) {
    
    
    
  case 'Image':
    // Change Title 
    var $title = 'Introduction';
    var youtubeUrl = 'https://www.youtube.com/watch?v=bL_X_GK69P4&t=488s';    
    break;
        
    
  case 'Banner':
    // code block
    var $title = 'Introduction';
    var youtubeUrl = 'https://www.youtube.com/watch?v=bL_X_GK69P4&t=488s';
    break;
    
    
    
  default:
   var $title = 'Introduction';
   var youtubeUrl = 'https://www.youtube.com/watch?v=bL_X_GK69P4&t=488s';
}


}



function convertEvent(e) {

var dataset = e.target.dataset;
var dataset = JSON.parse(dataset[Object.keys(dataset)[0]]);
var sectionType = dataset['type'];
switchTutorial(sectionType);
}



function startGuide() {


  
  
  
  
  
  

  
  

  
  
document.body.classList.add('virtualGuide'); 
  
  
var stringToHTML = function (str) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body.children[0];
}; 
  
  
  
  
  
 
var guideWrapEl = document.querySelector('#guideWrap');
var filters = '?modestbranding=1&amp;autoplay=1';  
if(!guideWrapEl) {  
   document.body.prepend(stringToHTML('<div id="guideWrap"><h2>Overview</h2><div class="flex-video youtube widescreen"><iframe width="560" height="315" src="https://www.youtube.com/embed/bL_X_GK69P4'+ filters +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>'));
}  
  
 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}