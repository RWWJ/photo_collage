//
//        full_creen.js
//
//

//
//  20 Dec 2022  Modified fullScreenButtonOnClick() to handle elements, not just the document
//               V1.1
//


var FullScreenJsVersion = "1.1";



//   FUNCTIONS
//
// fullScreenButtonOnClick( event )
//



//
// To fullscreen an element other than the document, then set a data-parent attribute with value of the
// ID of the element to fullscreen. i.e.:
//    <div id="SomeParentElementID"> <button data-parent="SomeParentElementID" type=button>FS</button>  <p>some content</p> </div>
//
// NOTE <dialog> elements can NOT be set to fullscreen, tho most other DOM elements can
//
// Can only enter fullscreen in response to user input (i.e. a button click)
//
function fullScreenButtonOnClick( event ) {
  // See if we're already in fullscreen (i.e. document.fullscreenElement is not null)
  if( document.fullscreenElement ) {
    document.exitFullscreen()   // document is the only thing you can call .exitFullscreen() on
      .catch( err => console.error(err) );  // No idea what might cause an error here
  }
  else {
    let parent = document.getElementById( event.target.dataset.parent );
    if( !parent ) parent = document.documentElement;

    parent.requestFullscreen()      // Go fullscreen
      .catch( err => console.error(err) );  // If for some reason we can't go fullscreen
  }
}






//
