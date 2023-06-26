//       collage.js
//


var CanvasObj;

function initThings( canvas ) {

  CanvasObj = canvas;

  drawPhotos( )
}


function drawPhotos( ) {
  let x = 10

  for( let cardNum = 2; cardNum < 11; ++cardNum ) {
    let y = 30
    for( let cardSuit of ["C", "D", "H", "S"] ) {
      let xx = x
      let yy = y
      CanvasObj.addObj( null, _ => {
        CanvasObj.fillText( `${cardNum}-${cardSuit}`, xx, yy )
        // console.log(`${cardNum}-${cardSuit}, ${xx}:${yy}`);
      } )
      y += 20
    }
    x += 40
  }
}








//
