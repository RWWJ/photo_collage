//
//     Template.js
//
//  18 Jul 2022 RWWJ  Created
//  15 Nov 2022 RWWJ  Minor tweaks
//  16 Nov 2022 RWWJ  Changed to use Canvas Class
//  19 Nov 2022 RWWJ  Added Paused and code to toggle if P (or p) is pressed
//  30 Nov 2022 Changed Paused to ^P (Ctrl-P), so user can still type the letter P in input boxes
//   8 Mar 2023 Misc fixes for error handling (e.g. missing initThings() or slider elements)
//  11 Mar 2023 Fixed menu layout with proper support of left and right side menus
//   7 Apr 2023 Added MouseX MouseY tracking
//  27 Apr 2023 Added some helpful comments
//   6 Jun 2023 Changed so CanvasObj is not a global
//  25 Jun 2023 Fix test rectangle draw on Canvas to use .addObj() do draw it every frame so it is visible
//              Changed initCanvas() to set font & size to something larger than default
//  29 Jun 2023 Changed initSlider() to only call user function if not null
//              Added UseSliderValue and use thereof


const Version = "V1.06";

const FirstYear = "2023";


//    Functions and globals
//
//  sliderValue( )
//  status( text )
//  UseSliderValue    // Set to a function to be called with slider value when it changes
//  Paused            // Toggled by ^P (Ctrl-P)
//  Houdini           // Toggled by Alt-click on EMail address in Footer
//  MouseX            // Relative to document. Use Canvas .mouse.x for relative to Canvas
//  MouseY            // Relative to document. Use Canvas .mouse.y for relative to Canvas


var UseSliderValue = null;  // Set this to a function that you want called with slider value when it changes

var Houdini = false;  // Toggled by Alt-click on EMail address in Footer

let Paused = false;   // Toggled by ^P (Ctrl-P)

var StatusElement = document.getElementById( "StatusID" );

// Continuously updated by mousemove event. Used for placing pop-up dialogboxs at mouse cursor, etc...
let MouseX = 0;
let MouseY = 0;







// Kick it off
init();

//
// Get it all started
//
function init( ) {
  var canvasObj = null;
  let thisYear = new Date().getFullYear();
  let yearElement = document.querySelector( "footer .Year" );
  let title = document.querySelector( "title" ).innerText;
  let headerH1 = document.querySelector( "header h1" );

  if( headerH1.innerText == "TITLE" ) headerH1.innerText = title;

  document.querySelector( "footer .Version" ).innerText = Version;

  if( FirstYear == thisYear ) yearElement.innerText = thisYear;
  else yearElement.innerText = `${FirstYear} - ${thisYear}`;

  // Set the <time>'s datetime attribute (not visible, just useful for Google et.al.)
  yearElement.setAttribute( "datetime", thisYear );

  // Continuously update mouse x/y RELATIVE to the window/document. Used for placing pop-up dialogboxs at mouse cursor, etc...
  // See .mouse.x and .mouse.y in the Canvas class, for mouse coordinates relative to the canvas
  document.addEventListener( "mousemove" , event => { MouseX = event.pageX; MouseY = event.pageY;} )

  // Allow for easily adding more sliders
  initSlider( "SliderID", "SliderValueID" );

  canvasObj = initCanvas( );

  addEventListener( "keydown", event => {
    if( event.code === "KeyP" && event.ctrlKey && !event.repeat ) {
      event.preventDefault();
      togglePaused( );
    }
  } );


  if( typeof initThings === "function" ) initThings( canvasObj );

  status( "Initialization complete.")
}




//
// Get here by ^P (Ctrl-P) or can be called by application
//
function togglePaused( ) {
  let header = document.querySelector("header");

  Paused = !Paused;

  if( header ) {
    if( !Paused ) document.querySelector("header").classList.remove("Paused");
    else document.querySelector("header").classList.add("Paused");
  }
  else console.log( `${Paused?"":"un"}Paused` );
}



function initSlider( sliderId, valueId ) {
  let sliderElement = document.getElementById( sliderId );
  let sliderValueElement = document.getElementById( valueId );

  if( sliderElement && sliderValueElement ) {
    let value = jsonFromLocalStorage(`Slider_${sliderId}`);
    if( value != null ) sliderElement.value = value;
    else value = sliderElement.value;

    sliderValueElement.innerText = `{${value}}`;
    if( UseSliderValue ) UseSliderValue( value ); // Initial slider value

    // input is an active event (fires as slider is moving)
    sliderElement.addEventListener( "input", event => {
      value = event.target.value;
      sliderValueElement.innerText = `  {${value}}`;
      if( UseSliderValue ) UseSliderValue( value );
    } );

    // change event only fires when slider stops moving, so good time to store value in localStorage
    sliderElement.addEventListener( "change", event => {
      value = event.target.value;
      jsonToLocalStorage( value, `Slider_${sliderId}` );
    } );
  }
}



function sliderValue( ) {
  return document.getElementById( "SliderID" ).value;
}



function status( text ) {
  if( StatusElement ) {
    StatusElement.innerText += "\n" + text;

    StatusElement.scrollTop = StatusElement.scrollHeight;
  }
  else console.log( `Status: ${text}` );
}


function initCanvas( ) {
  let canvas = new Canvas( document.querySelector(".ContentArea") );

  canvas.font =  "16px sans-serif";

  return canvas;
}



//
// Toggle Houdini when user Alt-clicks on my EMail address in Footer
//
// css can target .Houdini to markup any element's with the Houdini class (i.e. highlight, add text :after, etc...)
//
// Also, any element with class "HoudiniOnly" will be hidden if we are not in Houdini mode
// likewise, un-hidden when we are in Houdini mode
//
function houdini( event ) {
  if( event.altKey ) {
    let houdiniOnlyTags = document.querySelectorAll( ".HoudiniOnly" );

    Houdini = !Houdini;

    if( Houdini ) {
      event.target.classList.add( "Houdini" );

      for( let tag of houdiniOnlyTags ) {
        tag.classList.remove( "Hidden" );
      }
    }
    else {
      event.target.classList.remove( "Houdini" );

      for( let tag of houdiniOnlyTags ) {
        tag.classList.add( "Hidden" );
      }
    }
  }
}







//
