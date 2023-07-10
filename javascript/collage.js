//       collage.js
//



var CanvasObj
var ImageList = []
var NumImages = 0
var YHighWaterMark = 0  // Always the highest (smallest) bottom Y (y+h) of photos in the current row being drawn



function initThings( canvas ) {

  CanvasObj = canvas;

  loadOnClick( null )

  UseSliderValue = sliderChanged;  // Set this to a function that you want called with slider value when it changes
}


function sliderChanged( value ) {
  CanvasObj.clear();

  drawRotatePhotos( ImageList, sliderValue() )
}


function loadOnClick( event ) {
  const files = fileList( )

  ImageList = loadImages( files )
}


function saveOnClick( event ) {
  fileSaveCanvas( "Collage.png", CanvasObj.canvas )
}


function displayOnClick( event ) {
  CanvasObj.clear();

  drawPhotos( ImageList )
}


function reverseOnClick( event ) {
  CanvasObj.clear();

  drawPhotos( reverse( ImageList ) )
}


function randomOnClick( event ) {
  CanvasObj.clear();

  drawPhotos( randomize( ImageList ) )
}


function rotateOnClick( event ) {
  CanvasObj.clear();

  // First fill the background
  drawPhotos( randomize( ImageList ) )

  drawRotatePhotos( ImageList, sliderValue() )
}


function borderOnClick( {target} ) {
  console.log( `Border IS ${target.checked ? "on":"off"}`);
}


function thicknessOnInput(event) {
  console.log( `Thickness: ${event.target.value}`);
}


function widthOnInput(event) {
  console.log( `Width: ${event.target.value}` );
}


function colorOnInput(event) {
  console.log( `Color = ${event.target.value}`);
}


function reverse( data ) {
  let newData = new Array( data.length )
  let next = newData.length - 1

  for( let datum of data ) {
    newData[ next-- ] = datum
  }

  return newData
}



function randomize( data ) {
  let newData = [...data]

  for( let next = newData.length - 1; next >= 0; --next ) {
    let randLoc = Math.floor(Math.random() * newData.length)
    let temp = newData[ next ]

    newData[ next ] = newData[ randLoc ]
    newData[ randLoc ] = temp
  }

  return newData
}



//
// Presumes that images have finished loading. If not, it'll use only the ones that have finished loading.
//
function drawRotatePhotos( images, numImages ) {
  let x
  let y
  let retries = 0
  const maxRetries = 10
  let closeImage
  let angle
  let ratio
  let imageNum = 0
  let image
  let w = 128 // 48
  let h = 0      // Calculated below
  let drawnImages = [] // {image, x, y}  Used to see if we are drawing close to any other drawn image

  numImages = numImages <= 0 ? 1 : numImages

  do {
    x = Math.floor( Math.random() * CanvasObj.width )
    y = Math.floor( Math.random() * CanvasObj.height )
    closeImage = findCloseImage(x, y, w / 2, drawnImages) // See if we are too close to images we've already drawn

    if( closeImage ) {
      ++retries      // Too close to an existing image, so we will retry with new random x & y
    }
    else {
      // We've a good position, so use these x Y coordinates
      console.log( `${retries} retries` );
      retries = 0

      image = images[imageNum%images.length]
      angle = Math.floor( Math.random() * 36 ) * 10  // 10 degree increments
      ratio = image.height / image.width

      h = Math.floor( ratio * w )

      angle = Math.floor( Math.random() * 36 ) * 10  // 10 degree increments
      ratio = image.height / image.width

      CanvasObj.save()
      CanvasObj.translate( x, y )
      CanvasObj.rotate( angle )
      CanvasObj.drawImage( image, -w/2, -h/2, w, h )
      CanvasObj.lineWidth = 4
      CanvasObj.lineJoin = "round"
      CanvasObj.strokeRect( -w/2, -h/2, w, h, "red" )
      CanvasObj.restore()

      drawnImages.push( {image, x, y} )

      ++imageNum
    }
  } while( imageNum < numImages && retries < maxRetries )

}


function findCloseImage( x, y, maxDist, images ) {
  let found = false
  let image

  for( let nextImg = 0; !found && nextImg < images.length; ++nextImg ) {
    image = images[nextImg]

    if( distance( {x,y}, image ) < maxDist )  found = true

    // console.log( `${x}, ${y} --- ${image.x}, ${image.y} DISTANCE: ${distance( {x,y}, image)}` );
  }

  return found ? image : null
}


//
// Presumes that images have finished loading. If not, it'll use only the ones that have finished loading.
//
function drawPhotos( images ) {
  let w = 128 // 48
  let h = 0      // Calculated below
  let imageNum = 0
  let colHeights =  new Array(Math.floor(CanvasObj.width/w)) // Keep track of the bottom of the lowest card in each col

  for( let row = 0, YHighWaterMark = 0; imageNum < images.length && YHighWaterMark < CanvasObj.height; ++row ) {
    let newHighWater = 0  // Always the highest (smallest) bottom Y (y+h) of photos in the current row being drawn

    for( let col = 0; imageNum < images.length && col < colHeights.length; ++col, ++imageNum ) {
      let image = images[imageNum] // Equivelent to images[row * col]
      let ratio = image.height / image.width
      let x = col * w
      let y

      if( row == 0 ) colHeights[col] = 0  // Initial [] value

      y = colHeights[col]  // Value from last time thru loop

      h = Math.floor( ratio * w )

      colHeights[col] += h

      if( col == 0 )  newHighWater = colHeights[col]  // Init high water mark from the very first photo

      if( colHeights[col] < newHighWater ) newHighWater = colHeights[col]

      // console.log( `YHighWaterMark: ${YHighWaterMark}, newHighWater: ${newHighWater}` );
      // console.log( `colHeights[${col}]: ${colHeights[col]}` );
      CanvasObj.drawImage( image, x, y, w, h )

      YHighWaterMark = newHighWater
    } // END col
  } // END row

  console.log( `ImageNum: ${imageNum} of ${images.length}`);
}



function fileList( ) {
  // return cardPaths( )
  return ImagePaths
}



function cardPaths( ) {
  let list = []
  let faceCards = ["J", "Q", "K", "A"]

  for( let cardNum = 2; cardNum < 11; ++cardNum ) {
    for( let cardSuit of ["C", "D", "H", "S"] ) {
      list.push( `../images/cards/${cardNum}-${cardSuit}.png` )
    }
  }

  for( let card of faceCards ) {
    for( let cardSuit of ["C", "D", "H", "S"] ) {
      list.push( `../images/cards/${card}-${cardSuit}.png` )
    }
  }

  return list
}



function loadImages( files ) {
  let images = []

  for( let file of files ) {
    fileLoadImage( file, jsonObj => {
      images.push( jsonObj.element )
      ++NumImages
    })
  }

  return images
}










//
