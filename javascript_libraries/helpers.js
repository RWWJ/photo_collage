//
//	        Helpers.js
//
//        Misc Helper Classes and functions
//
//  RWWJ  26 Dec 2021	Created
//
//  RWWJ   1 Apr 2022	Added fullscreenToggle()
//              			Version 1.1
//
//  RWWJ   2 Jul 2022  Fixed pageName() for Atom editor preview html, it seems to append a (second) .html extension
//                     Added decodeURI() to convert %20 back to a space (for html filenames with spaces, "Contact Us.html" et.al.)
//                     Fixed hostName() "." to "," conversion and eating last digit of IP. Remove port #
//			               Version 1.5
//
//  RWWJ  21 Jul 2022  Fixed capitalizeWords() (more like finished it, is was totaly not correct/working)
//                     Version 1.6
//
//  RWWJ  10 Aug 2022  Fixed infinite recursion in cloneObj() by adding check for hasOwnProperty()
//                     Version 1.7
//  RWWJ  15 Aug 2022  Removed redundant .replace(".html", "") in pageName()
//  RWWJ  31 Aug 2022  Added pathFromURL()
//                     Removed cloneObj_OLD()
//                     Fixed capitalizeWords()
//  RWWJ   4 Sep 2022  Fixed playSoundFileWebAudio(), playSoundFile(), playSoundFile2() to use fileName param and return sound element
//                     Version 1.8
//  RWWJ   5 Sep 2022  Added hash() function (I did not write it)
//  RWWJ  24 Sep 2022  Removed "redundant" .replace(".html", "") in pageName(), as it is a fix for Atom preview
//  RWWJ  07 Oct 2022  Added extension()
//					   Version 1.9
//  RWWJ  30 Oct 2022  Added changeExtension( fileName, ext )
//
//  19 Nov 2022  Added uuid() and initSlider()
//        Version 2.0
//  20 Dec 2022  Added cssStylesheet()
//        Version 2.1
//  27 Dec 2022  Added emptyObj( )
//        Version 2.2
//   4 Jan 2023  Added capitalize() synonym for capitalizeWords()
//        Version 2.3
//   4 Jan 2023  Added filename()
//        Version 2.3a
//   4 Jan 2023  Added makeDOMId( ) (moved her from dialog_box.js)
//        Version 2.3b
//   9 Jan 2023  Added guid() and smallId()
//   6 Feb 2023  Added copyObj
//        Version 2.4
//  28 Mar 2023  Added toClipboard( event )
//        Version 2.5
//   3 May 2023  Added fileSizeStr( size )
//



var HelpersJsVersion = "2.5";



// Import all with this statement (NOTE: change the directory as appropriate)
//import {fullscreenToggle, hostName, pageName, capitalizeWords, capitalize, isCellPhone, cloneObj, copyObj, emptyObj,
//        daysInMonth, loadScript, playSoundFile, pathFromURL, hash, uuid, guid, smallId, makeDOMId,
//        filename, extension, changeExtension,changeExt, initSlider, toClipboard
//       } from "../javascript_libraries/Helpers-Module.js";


// export {fullscreenToggle, pageName, hostName, capitalizeWords, capitalize, isCellPhone, cloneObj, copyObj, emptyObj,
//         daysInMonth, loadScript, playSoundFile, pathFromURL, hash, uuid, guid, smallId, makeDOMId,
//         filename, extension, changeExtension,changeExt, initSlider, toClipboard, fileSizeStr
//        };

//   ONLY needed in Node Js, not in browser (client side) code
// import {performance} from "perf_hooks";


//        Functions
//
// fullscreenToggle( )
// hostName( )
// pageName( )
// capitalizeWords( str )
// capitalize( str )
// isCellPhone( )
// cloneObj( src )
// copyObj( src, dst )
// emptyObj( obj )
// daysInMonth( theDate = null )
// loadScript( jsFileName, callback = null )
// playSoundFileWebAudio( fileName, volume = 0.01 )
// playSoundFile( fileName, volume = 0.01 )
// playSoundFile2( fileName, volume = 0.01 )
// pathFromURL( url )
// hash( string )
// uuid()
// guid()
// smallId( )
// makeDOMId( name, suffix = "ID" )
// filename( filename  )
// extension( filename )
// changeExtension( fileName, ext )
// changeExt( fileName, ext )
// initSlider( {name="Percentage", sliderId=null, parent = null, callback=null, min=0, max=100} )
// cssStylesheet( name, styleText )
// toClipboard( event )
// fileSizeStr( size )
//


//
//
// Toggle Fullscreen mode
//
function fullscreenToggle( ) {
  if( document.fullscreenElement )  document.exitFullscreen();  // Exit is done on the document
  else document.documentElement.requestFullscreen();            // Enter is done on an element, which the document is not. The <html> tag is however.
}



//
// Returns the webpage name, i.e. the URL, minus the, server, port, extension, anchors ("#pageMarker" et.al.) and search string ("?string" if any)
//
// So we return, for example, "index", "About", etc..
//
// Browsers load index.html if the URL does not have a file name, so this routine does as well
//
// Could use location.pathname() instead of .href(), but still need to .split("/"), so code is no shorter
//
function pageName( ) {
  // FIX: For Atom editor preview html, it seems to append a (second) .html extension
  return  decodeURI(location.href.split("/").slice(-1).toString().replace(".html", "").replace(".html", "").split("?")[0].split("#")[0] || "index");
}



//
// Returns the webpage host name, i.e. the URL, minus the, protocol, port, path, page name, and search string ("?" if any)
//
// So we return, for example, just "google.com", "RipsPics.com", etc..
//
function hostName( ) {
  // return location.href.split("/").slice(2,3).toString().replace("www.", "").split(".").slice(0,-1).toString();

  // Fixes the .'s in domain names and ip address being replaced by ,'s (i.e. amzon.com bacame amazon,com, http://127.0.0.1:59730/index.html, becoming 127,0,0)
  // Also was eating the last digit of the ip address
  // And remove port
  return location.hostname.replace( "www.", "" );
}



//
// Capitalize all words that start with a character (i.e. not with a # or symbol)
//
// Equivelent to capitalize()
//
function capitalizeWords( str ) {
  // return str.split(" ").map(str => str[0].toUpperCase()+str.slice(1) ).join(" ");
  return str.replace( /\b(\w)/g , match => match.toUpperCase() );
}


//
// Synonym for capitalizeWords()
//
function capitalize( str ) {
  return capitalizeWords( str );
}


//
// RWWJ Check userAgent for word "Mobi" (i.e. Mobile) or "Phone"
//   Most phone browsers include Mobile but NOT Phone
//   Some iPhone browsers include Phone but NOT Mobile
//   Some versions of Opera include Mobi but NOT Mobile, so we just use Mobi for our search string
//
// Seems to be no good way to check for cell phone, but if I just want to run my test code on my phone...
//
function isCellPhone( ) {
  return (navigator.userAgent.indexOf("Mobi") > 0) || (navigator.userAgent.indexOf("Phone") > 0);

  // Dom (dcode on youtube) uses the line below in his video "How to Easily Detect Mobile Devices with JavaScript"
  // return /Android|iPhone/i.test(navigator.userAgent);
}



//
// Returns a copy of the objects (sub-objects are copied too, not just their references)
//
// Recursive
//
// NOTE: This is similar to the first routine I wrote, but is a variation on code from a video by Dave Gray
//       It is more concise and fixes a couple of bugs that my routine had
//       Among other modifications, I added code for dates and catching non-cloneable items (functions et.al.)
//
function cloneObj( src ) {
  let dst;

  // Basic type, not an array, not null (is the typeof "object") not a date and not an object
  if( typeof src != "object" || src == null )  dst = src;
  else if(src instanceof Date) {  // Handle Dates, I don't use them, but may as well cover it
    dst = new Date();
    dst.setTime(src.getTime());
  }
  else if( typeof src == "object" ) { // Handle arrays ([]) and "real" objects (i.e. {})
    let next;
    dst = Array.isArray(src) ? [] : {};

    for( next in src ) {
      if( src.hasOwnProperty(next) ) {
        dst[next] = cloneObj(src[next]);
      }
    }
  }
  else    console.error("ERROR cloneObj(): Unexpected data type"); // Can not clone functions, etc..

  return dst;
}



//
// Copy src object to dest object (like a deep clone, but a deep copy)
//
// Similar to cloneObj(), but totaly different :-)
//
function copyObj( src, dst ) {
    // Basic type, not an array, not null (is the typeof "object") not a date and not an object
    if( typeof src != "object" || src == null )  ;  // No change to dst
    else if(src instanceof Date) {  // Handle Dates, I don't use them, but may as well cover it
      dst = new Date();
      dst.setTime(src.getTime());
    }
    else if( typeof src == "object" ) { // Handle arrays ([]) and "real" objects (i.e. {})
      for( let property in src ) {
        if( src.hasOwnProperty(property) && src[property] != undefined ) {
          if( typeof src[property] != "object" || src[property] == null ) { // Of course, null IS an "object". Crazy!
            dst[property] = src[property];
          }
          else if( typeof dst[property] != "object" || dst[property] == null ) {
            dst[property] = copyObj( Array.isArray(src[property]) ? [] : {}, src[property] );  // Copy to ew [] or {}
          }
          else {
            copyObj(src[property], dst[property]);
          }
        }
      }
    }

    return dst;
}



//
// This only tests for emptiness. Use Object.keys(obj).length if you want to know the number of properties
//
function emptyObj( obj ) {
  for( let property in obj ) return false; // If there are ANY properties, then it is not empty
  return true;
}



//
// Defaults to today, but can pass in value valid for the Date constructor
// i.e. dateString, dateObject, or milliseconds since January 1, 1970, 00:00:00 UTC
//
function daysInMonth( theDate = null ) {
  let dt;
  dt = theDate ? new Date(theDate) : new Date();

  // Specifying a day of 0 makes us go to the last day of the month previous to the specified one
  return new Date( dt.getFullYear(), dt.getMonth()+1, 0 ).getDate();
}



//
// Load a .js script file by injecting a <script> tag into the <head> of the dom
//
// Since it loads asynchronously, we can provide a callback if we need to know when variables and functions
// in the file are ready to be used
//
function loadScript( jsFileName, callback = null ) {
    let scriptElement = document.createElement("script");

    if( callBack ) scriptElement.onload = callback;	// The callback function can use the newly loaded .js file

    scriptElement.src = jsFileName;

    // Trigger the load by adding it to the <head>
    document.head.appendChild(jsScript);
}



// Play sound files (mp3, wav, etc..)
//
// NOTE Does NOT work for .mp3 nor .ogg
//    Does work for .wav, m4a
function playSoundFileWebAudio( soundFileName, volume = 0.01 ) {
  let buffer = null;
  let sndContext = new AudioContext();

  fetch(soundFileName)
  .then( response => {
    if(response.ok) return response.arrayBuffer();
    else throw new Error("playSoundFileWebAudio() Could not open file: <"+soundFileName+">");
  })
  .then (data => {
    console.log("playSoundFile(): Array Data");
    console.log(data);
    return sndContext.decodeAudioData( data );
  })
  .then( decodedData => {
    let sourceNode = sndContext.createBufferSource( );
    buffer = decodedData;
    sourceNode.buffer = buffer;

    sourceNode.connect( sndContext.destination );

    sourceNode.start( 0 );
    sourceNode.stop( 2 ); // Play for 2 seconds
  })
  .catch( error => console.log(error)
  );

}



//
// Play sound files (mp3, wav, etc..)
//
// Returns the Sound Element, so caller can use .pause(), .play(), .volume, .muted, .loop
//
// Works with .wav, .mp3, .m4a
// Does NOT work with the .ogg file I have
//
function playSoundFile( fileName, volume = 0.01 ) {
  let sndElement = document.createElement( "audio" );

  // fileName = "Sounds/aliencom.wav";  // Works
  // fileName = "Sounds/Charity Rag-BudShank-Saxophone.mp3"; // Works
  // fileName = "Sounds/Dry Leaves Walking - RWWJ.m4a";  // Works
  // fileName = "Sounds/kindland - PublicDomain - Dark_Rainy_Night(ambience).ogg"; // NOT working


  // NOTE: 0.5 is supposedly half volume. I don't believe it!
  sndElement.volume = volume;

  // Can set .autoplay in place of .play()
  // sndElement.autoplay=true;

  sndElement.src = fileName;

  // NOTE: Instead, we could set .autoplay=true BEFORE setting .src above
  sndElement.play();
//  setTimeout(()=>sndElement.pause(),3000); // Play for 2 seconds

  // We can also pause the playback
  // Do NOT know how to auto-repeat (loop forever)
  // sndElement.pause();

  // We can also rewind the playback
  // sndElement.currentTime = 0;

  // Can mute it without changing the volume (that is, .volume=0 also mutes)
  // sndElement.muted = true;

  // We can loop forever
  // sndElement.loop = true;

  return sndElement;
}


//
// Play sound files (mp3, wav, etc..)
//
// Returns the Sound Element, so caller can use .pause(), .play(), .volume, .muted, .loop
//
// Works with .wav, .mp3, .m4a
// Does NOT work with the .ogg file I have
//
function playSoundFile2( fileName, volume = 0.01 ) {
  let sndElement;

  // fileName = "Sounds/aliencom.wav";  // Works
  // fileName = "Sounds/Charity Rag-BudShank-Saxophone.mp3"; // Works
  // fileName = "Sounds/Dry Leaves Walking - RWWJ.m4a";  // Works
  // fileName = "Sounds/kindland - PublicDomain - Dark_Rainy_Night(ambience).ogg"; // NOT working

  // Browser starts loading file imediatly, if a fileName is specified
  sndElement = new Audio( fileName );

  // NOTE: 0.5 is supposedly half volume. I don't believe it!
  sndElement.volume = volume;

  // Can set .autoplay in place of .play()
  sndElement.autoplay=true;

  // NOTE: Instead, we could set .autoplay=true
  // sndElement.play();
  // setTimeout(()=>sndElement.pause(),5000); // Play for 5 seconds

  // We can also pause the playback
  // sndElement.pause();

  // We can also rewind the playback
  // sndElement.currentTime = 0;

  // Can mute it without changing the volume (that is, .volume=0 also mutes)
  // sndElement.muted = true;

  // We can loop forever
  // sndElement.loop = true;

  return sndElement;
}



//
// e.g. "http://127.0.0.1:3000/Images/Chris_Hamons-PublicDomain-DungeonCrawl_ProjectUtumnoTileset-32x32.png"
//     becomes "Images/Chris_Hamons-PublicDomain-DungeonCrawl_ProjectUtumnoTileset-32x32.png"
//
function pathFromURL( url ) {
  let path = decodeURI( url );
  let foundAt = url.indexOf("://"); // See if there is a "http://" prefix

  // Ensure it is a url
  if( foundAt != -1 ) {
    path = path.slice( foundAt+3 );
    if( path.indexOf("/") != -1 ) {
     path = path.substring(path.indexOf("/")+1);
    }
  }

  return path;
}



//
//    Create a hash number from a string
//
//    RWWJ This function is verbatum (except name change from cyrb53() to hash()) from:
//        https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
//        "...cyrb53, a simple but high quality 53-bit hash. It's quite fast, provides very good* hash distribution"
//      You can read more of what Bryc says about it on StackOverflow.com by search for cyrb53 at:
//        https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
//
//    cyrb53 (c) 2018 bryc (github.com/bryc)
//    A fast and simple hash function with decent collision resistance.
//    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
//    Public domain. Attribution appreciated.
//
function hash( str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}

//
//  Generate an RFC compliant UUID (GUID), specifally an rfc uuid v4 (standard uuid these days)
//
//  NOTE: The UUID is a valid html class and id name
//
//  23 Feb 2022	Created by Ray Wallace based on code from by broofa, called uuidv4() at:
//    https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523
//
// Synonym for guid()
//
function uuid() {
  return crypto.randomUUID ?
    crypto.randomUUID() : // .randomUUID() is only avalable in https:// (secure) connections
    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
    // Equivelent to:
    // `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
    // --or--
    //    "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
}

//
// Synonym for uuid()
//
function guid() {
  return uuid();
}

//
// Returns a 19 character string (17 hex digits and 2 _'s)
// NOTE: Note in about 500 years, the date will be such that the string will be one hex digit longer :-)
//
function smallId( ) {
  // Ignore the fractional part of .now(), since most browsers round it up to full milliseoconds (or more)
  return Date.now().toString(16).padStart(12,"0") + "_" + Math.floor(performance.now()%65535).toString(16).padStart(4,"0") + "_" + Math.floor(Math.random()*256).toString(16).padStart(2,"0");
}

//
// Creates a unique DOM Element ID with __, name, datetime and specified suffix
//
// Sanitizes name by replacing spaces and invalid ID characters with _ (underscore)
//
function makeDOMId( name, suffix = "ID" ) {
  let uniqueStr = performance.now().toString(16);

  return "__" + name.replace( /[\[\]\s!@#$%^&\*\(\)]/g, "_" ) + "_" + uniqueStr + "_" + suffix;
}



//
// Returns filename with the path stripped off
//
function filename( fileName ) {
  let pathEnd;

  pathEnd = fileName.lastIndexOf( "/" );
  if( pathEnd != -1 ) fileName = fileName.substring( pathEnd+1 );

  pathEnd = fileName.lastIndexOf( "\\" );

  if( pathEnd != -1 ) return fileName.substring( pathEnd+1 );
  else return fileName;
}



//
// Returns .ext (extension of filename), i.e. ".jpg", ".pdf"
//
function extension( fileName ) {
  let extStart;

  extStart = fileName.lastIndexOf( "." );
  if( extStart != -1 ) return fileName.substring( extStart );
  else return "";
}



//
// Returns fileName with it's extension changed to ext (e.g. "name.jpg" changed to "name.json")
//
// NOTE: Appends the ext if one does not exist
//
// A synonym for changeExt()
//
function changeExtension( fileName, ext ) {
  let extStart;

  if( ext[0] != "." ) ext = "." + ext;

  extStart = fileName.lastIndexOf( "." );
  if( extStart != -1 ) return fileName.slice( 0, extStart ) + ext;
  else return fileName + ext;
}



//
// Returns fileName with it's extension changed to ext (e.g. "name.jpg" changed to "name.json")
//
// NOTE: Appends the ext if one does not exist
//
// A synonym for changeExtension()
//
function changeExt( fileName, ext ) {
  return changeExtension( fileName, ext );
}




//
// sliderId
//   If sliderId is specified, then we'll use the associated element if it's already in the DOM, or create it if it isn't
//   If sliderId is not specified (or or there is no element for the id provided), then a slider (range input) will be created.
///  NOTE: You must specify a sliderId if you want the slider value saved and restored to/from localStorage
//
// parent (can be either an element OR an "ID_string")
//   Where the slider and all it's parts (label, min, max, and value spans) will be appended to.
//   If it doesn't exist then we'll append to the body
//
// min
//    Minimum value slider can have
//
// max
//    Maximum value slider can have
//
// callback()
//   Called anytime slider value changes and is passed that value
//   Also called once during Initialization so caller knows the initial value (possibly restore from localStorage)
//
// Return sliderId.
//
// localStorage
//   If a sliderId is specified, then we will store and restore the slider's value to/from local storage
//
// Classes .SliderContainer, .Slider (same as input[type=range]), .SliderLabel, .SliderRange, .SliderValue
//   NOTE: Caller can use these classes to style the "parts" of the slider
//
function initSlider( {name="Percentage", sliderId=null, parent = null, callback=null, min=0, max=100} ) {
  let storeAndRestore = sliderId ? true : false;  // Don't clutter localStorage with a bunch of random sliderId name entries
  let value = null;
  let sliderElement = null;
  // let containerElement = document.createElement("div");
  let labelElement = document.createElement("label");
  let minElement = document.createElement("span");
  let maxElement = document.createElement("span");
  let valueElement = document.createElement("span");

  // The Container
  // containerElement.className = "SliderContainer";

  // Slider id and element (either get or create it)
  if( sliderId ) sliderElement = document.getElementById( sliderId );
  else sliderId = uuid().slice(-12) + "_ID";
  if( sliderElement === null ) sliderElement = document.createElement("input");

  // Get stored value from localStorage (if there), now that we have a sliderId
  // NOTE value will be null if not in localStorage
  if( storeAndRestore ) value = jsonFromLocalStorage(`Slider_${sliderId}`);

  // Slider
  sliderElement.type = "range";
  sliderElement.id = sliderId;
  sliderElement.class = "Slider";
  sliderElement.min = min;
  sliderElement.max = max;
  if( value !== null ) sliderElement.value = value;
  else value = sliderElement.value;

  // The Label
  labelElement.innerText = name;
  labelElement.className = "SliderLabel";

  // The Min
  minElement.innerText = min;
  minElement.className = "SliderRange";

  // The Max
  maxElement.innerText = max;
  maxElement.className = "SliderRange";

  // The Value
  valueElement.id = "value_" + sliderId;
  valueElement.className = "SliderValue";
  valueElement.innerText = `{${value}}`; // Is either from storage or the default slider value

  // Add to DOM
  parent = parent ? (typeof parent === "string" ? document.getElementById( parent ) : parent) : document.body;
  parent.appendChild( labelElement );
  parent.appendChild( minElement );
  parent.appendChild( sliderElement );
  parent.appendChild( maxElement );
  parent.appendChild( valueElement );

  // Initial call to user callback
  if( callback ) callback( value ); // Initial slider value

  // input is an active event (fires as slider is moving)
  sliderElement.addEventListener( "input", event => {
    value = event.target.value;
    valueElement.innerText = `{${value}}`;
    // if( callback ) callback( value );
    if( callback )
      callback( value );
  } );

  if( storeAndRestore ) {
    // change event only fires when slider stops moving, so good time to store value in localStorage
    sliderElement.addEventListener( "change", event => {
      value = event.target.value;
      jsonToLocalStorage( value, `Slider_${sliderId}` );
    } );
  }

  return sliderId;
}


function cssStylesheet( name, styleText ) {
  let newStyleSheet;
  let existingSheets;
  let newRule;
  let exists = false;

  // Figure out if we are doing the workaround for browser not implementing CSSStyleSheet() constructor
  if( document.adoptedStyleSheets ) existingSheets = document.adoptedStyleSheets;
  else existingSheets = document.styleSheets;

  // First see if we've already created this css style
  for( let next = 0 ; !exists && next < existingSheets.length; ++next ) {
    let sheetFirstRule = existingSheets[next].cssRules[0].cssText;
    // Look for our mark (a class we use only for this purpose) and the name
    exists = sheetFirstRule.startsWith(".DlgCSSCreatedFlag") && sheetFirstRule.includes(name);
  }

  if( !exists ) {
    // Go ahead and create the css stylesheet
    if( document.adoptedStyleSheets ) {
      newStyleSheet = new CSSStyleSheet();
      document.adoptedStyleSheets = [newStyleSheet];  // Tell the DOM about our new styleSheet
    }
    else {
      let styleElement = document.createElement( "style" );
      document.head.appendChild( styleElement );
      newStyleSheet = styleElement.sheet;
    }

    // Set the contents of the stylesheet (Synchronously)
    newStyleSheet.replaceSync( styleText );

    // Set a flag so we know we've created this stylesheet
    newStyleSheet.insertRule( `.DlgCSSCreatedFlag { content: "${name}" }` ); // Ensure it's last rule that we add, so we find it at .cssRules[0]
  }
}



//
// Copy selected text of .target to the clipboard. If there is no selection then copy everything
//
function toClipboard( event ) {
  let txt;

  // If there is no selection, then copy everything, else copy the selection
  if( event.target.selectionStart == event.target.selectionEnd ) txt = event.target.value
  else txt = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd)

  // Put it on the clipboard
  navigator.clipboard.writeText( txt )
}


//
// Using fileSizeStr().padStart(13) can line up an output display nicely
//
function fileSizeStr( size ) {
  const places = 3  // places right of the .
  let suffix = ""
  let newSize = size

  if( newSize < 1024 ) suffix = "B"
  else if( (newSize /= 1024) < 1024 )     suffix = "KB"
  else if( (newSize /= 1024) < 1024 )     suffix = "MB"
  else if( (newSize /= 1024) < 1024 )     suffix = "GB"
  else if( (newSize /= 1024) < 1024 )     suffix = "TB"

  return newSize.toFixed(places) + suffix
}







//
