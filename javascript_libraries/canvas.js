//
//    canvas.js
//
//

//
//   8 Oct 2022  Created
//  30 Oct 2022  Added more methods
//  31 Oct 2022  AddisPointInPath( x, y )
//   3 Nov 2022  Added mouseOnMove(), get mouseX(), get mouseY()
//  10 Nov 2022  Added shadow(), dropShadow(), boxShadow()
//               V1.4
//  16 Nov 2022  Added strokeRect( ), drawImageRotate( ), and imageRotate( )
//  17 Nov 2022  Added mouseDown() user mouse click event handler support
//  25 Nov 2022  Added strokeCircle() and fillCircle(). Fixed .circle() and .arc() to use arc(), NOT arcTo()
//               Removed get mouseX() and get mouseY()
//               Added set strokeStyle() and set fillStyle()
//               Fixed arcTo(). Added closePath(). Fixed a bunch of color useage
//               Added roundedRect(). Changed font(), textAlign() and textBaseline()
//               to be getters and setters. Added "return this" to most methods (for chaining)
//               V1.5
//  26 Nov 2022  Added some save() restore() calls to some methods.
//               Consolidate some color and lineWidth into .stroke() and .fill() calls
//               V1.6
//               Added radians( ), fixed calls to .stroke() and .fill() to set color first
//               V1.6a
//  28 Nov 2022  Added text( ) and centerText( ). Added color param to vector()
//               V1.6b
//  29 Nov 2022  Added setTransform( ) and transform( ). Added a few comments.
//               Added getters and setters for lineWidth()
//               V1.7
//               Added oval() and ellipse(). Made lots of minor changes around color and returning this
//               V1.7a
//               Added toDataURL(), strokeArc() strokeEllipse() and strokeOval(). Changed .arc() to NOT draw the path
//               V1.7b
//  13 Dec 2022  Started adding animateQue, addObj(), delObj(), clearObjs(), _moveObjs(), _drawObjs()
//  14 Dec 2022  Added toColorString( ) to convert a number to a css color.
//               Modified all the color code to use the new toColorString( )
//               Fixed set color(), it was not setting the .canvas fillStyle or strokeStyle correctly
//               V1.8
//  18 Apr 2023  Added putImageData(), getImageData( ), createImageData()
//               V1.9
//  22 Apr 2023  Changed putImageData() parameter names dx and dy made me think of deltaX deltaY, not destX
//               V2.0
//  23 Apr 2023  Fix first line of circle() to be this.canvas.strokeStyle, NOT JUST this.strokeStyle
//               v2.1
//   6 Jun 2023  Fixed _drawObjs() so it clears the screen every frame
//               Added fps default for addObj()
//               Modified _moveObjs() to deal with a null move() (i.e. no move specified)
//               Fixed setting ._previousMs in _moveObjs(), so that ALL objects will move
//               Add .resized function pointer
//               ReWrote clearRect() to be just that (i.e. the same as canvas clearRect() )
//               ReWrote clear(), but it still has the same functionality (i.e. clear canvas (clear screen) )
//               v2.2
//  26 Jun 2023  Change _animate() to do nothing if animate objects queue is empty (i.e. don't clear canvas)
//               v2.3



var CanvasJsVersion = "2.2";


//   METHODS
//
//  constructor( container )
//  onMouseDown( event )
//  onMouseMove( event )
//  onResize( event )
//  resized // User specified function called when canvas is resized
//  save( )
//  restore( )
//  toColorString( color )
//  set color( color )
//  get color( )
//  set strokeStyle( color )
//  get strokeStyle( )
//  set fillStyle( color )
//  get fillStyle( )
//  set lineWidth( width )
//  get lineWidth( )
//  set lineCap( style )
//  get lineCap( )
//  set lineJoin( style )
//  get lineJoin( )
//  translate( x, y )
//  transform( a,b, c,d, e,f )
//  setTransform( a,b, c,d, e,f )
//  rotate( angleDeg )
//  beginPath( )
//  closePath( )
//  stroke( )
//  fill( )
//  moveTo( x, y )
//  lineTo( x, y )
//  line( sx, sy, dx, dy, color = this.strokeColor )
//  clearRect( x, y, w, h )
//  clear( )
//  rect( x, y, w, h, color = this.strokeColor )
//  strokeRect( x, y, w, h, color = this.strokeColor )
//  fillRect( x, y, w, h, color = this.fillColor )
//  roundedRect( x1, y1, w, h, radius, color=this.strokeColor )
//  arcTo( x1, y1, x2, y2, r )
//  arc( cx, cy, r, deg1, deg2, color = this.strokeColor )
//  strokeArc( cx, cy, r, deg1, deg2, color = this.strokeColor )
//  circle( cx, cy, r, color = this.strokeColor )
//  strokeCircle( cx, cy, r, color = this.strokeColor )
//  fillCircle( cx, cy, r, color = this.fillColor )
//  oval( x, y, radiusX, radiusY, rotationDeg=0 )
//  strokeOval( x, y, radiusX, radiusY, rotationDeg=0, color = this.strokeColor )
//  ellipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360, counterclockwise = false )
//  strokeEllipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360, counterclockwise = false, color = this.strokeColor )
//  vector( x, y, angle, distance, color = this.strokeColor )
//  strokeText( text, x, y, color = this.strokeColor )
//  fillText( text, x, y, color = this.fillColor )
//  text( text, x, y, color = this.fillColor )
//  centerText( text, x, y, color = this.fillColor )
//  set font( fontInfo )
//  get font( )
//  set textAlign( how )
//  get textAlign( )
//  set textBaseline( how )
//  get textBaseline( )
//  image( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  imageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angleDeg = 0 )
//  drawImageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angleDeg = 0 )
//  getImageData( srcX, srcY, srcW, srcH )
//  putImageData( imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight )
//  createImageData( width, height )
//  toDataURL( mimeType = "image/png" )
//  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y )
//  isPointInPath( x, y )
//  shadow( offsetX, offsetY, blurRadius, color )
//  boxShadow( offsetX, offsetY, blurRadius, color )
//  dropShadow( offsetX, offsetY, blurRadius, color )
//  static radians( degrees )
//  addObj( move, draw, fps )
//  delObj( objId )
//  clearObjs( )
//  _moveObjs( ms )
//  _drawObjs( )
//  _animate( ms )


class Canvas {

  //
  // container can be:
  //   ""  --- We will create a <div> container and a <canvas>, appended to the <body>
  //   "idName"  --- Id name of a <div> container, we will create a <canvas>, appended to the <div>
  //   element  --- A <div> element, we will create a <canvas>, appended to the <div>
  //
  constructor( container = "" ) {
    const MinHeight = 600;  // Only used if container has 0 height

    if( container === "" )  container = document.body.appendChild( document.createElement( "section" ) );
    else if( typeof container === "string" ) container = document.body.appendChild( document.getElementById( container ) );
    if( !container.offsetHeight ) {
      console.error( `ContentArea div has no height, so canvas would have 0px height! Forcing it to ${MinHeight}` );
      container.style.height = MinHeight+"px";  // The section defaults to 0px high, which will make our canvas 0px as well
    }
    this.containerElement = container;
    this.canvasElement = document.createElement( "canvas" );
    this.canvas = this.canvasElement.getContext( "2d" );

    this.resized = null;

    // Set
    //  this.width
    //  this.height
    //  this.offsetX
    //  this.offsetY
    this.onResize();

    this.mouse = {x:0, y:0};

    this.containerElement.appendChild( this.canvasElement );

    this.lineWidthValue = this.canvas.lineWidth = 1; // Value for .canvas.lineWidth
    this.strokeColor = this.canvas.strokeStyle = "black";
    this.fillColor = this.canvas.fillStyle = "black";

    // Setup event handlers

    window.addEventListener( "resize", event => this.onResize( event ) ); // NOTE: ONLY window get's a resize event

    // NOTE: Must either use .bind(this) or a arrow function
    this.canvas.canvas.onmousedown = this.onMouseDown.bind(this);      // Example with bind
    this.canvas.canvas.onmousemove = event => this.onMouseMove(event); // Example with arrow function

    this._animateQue = []; // [{move:function, draw:function, fps:60, elapsedSec}, {}, ...]
    this._previousMs = performance.now();
    this._animate( this._previousMs );
  } // END constructor


  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  onMouseDown( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.mouseDown ) this.mouseDown( event );
  }


  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  onMouseMove( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
  }


  onResize( event ) {
    this.width = this.containerElement.offsetWidth;
    this.height = this.containerElement.offsetHeight;

    // Setting the canvas height can cause it's container <div> to grow by a few (4?) pixels,
    // due to <canvas> being inline, so they take up space below them,
    // like text does to leave space for descenders.
    // Fix is to set <canvas> position to absolute in the .css file
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;

    // These get us offset from the left/top of the document NOT the window
    // Probably not useful
    this.offsetX = this.containerElement.offsetLeft;
    this.offsetY = this.containerElement.offsetTop;

    // Call user resized handler
    if( this.resized ) this.resized( this.offsetX, this.offsetY, this.width, this.height );
  }


  save( ) {
    this.canvas.save();

    return this;
  }

  restore( ) {
    this.canvas.restore();

    return this;
  }


  //
  // If color is a number, then convert it to standard css hex string (#000000)
  // Otherwise, return unchanged
  //
  static toColorString( color ) {
    // .floor() to deal with floats
    if( typeof color == "number" ) {
      console.log( `color: ${color}, ${"#" + Math.floor(color).toString(16)}`);
      color = "#" + Math.floor(color).toString(16);
    }

    return color;
  }

  set color( color ) {
    this.strokeStyle = color;
    this.fillStyle = color;

    return color;
  }


  get color( ) {
    return this.strokeColor;
  }


  //
  // For canvas naming consistency
  //
  set strokeStyle( color ) {
    color = Canvas.toColorString( color );

    this.canvas.strokeStyle = color;

    return this.strokeColor = color;
  }


  get strokeStyle( ) {
    return this.strokeColor;
  }


  //
  // For canvas naming consistency
  //
  set fillStyle( color ) {
    color = Canvas.toColorString( color );

    this.canvas.fillStyle = color;

    return this.fillColor = color;
  }


  get fillStyle( ) {
    return this.fillColor;
  }

  set lineWidth( width ) {
    this.canvas.lineWidth = width;

    return this.lineWidthValue = width;
  }

  get lineWidth( ) {
    return this.lineWidthValue;
  }


  //
  // Just the bare ends of lines
  //   butt, round, square
  // NOTE: See lineJoin for shape of touching line ends
  //
  set lineCap( style ) {
    return this.canvas.lineCap = style;
  }


  get lineCap( ) {
    return this.canvas.lineCap;
  }


  //
  // Just the ends of lines that touch
  //  round, bevel, miter
  //
  // NOTE: See lineCap for shape of bare ends
  //
  set lineJoin( style ) {
    return this.canvas.lineJoin = style;
  }


  get lineJoin( ) {
    return this.canvas.lineJoin;
  }


  //
  // Modify the matrix, moving the origin to be x, y for drawing
  //
  // Negative values can effectively flip the canvas, but this is
  // probably not what you want if using text or images
  //
  translate( x, y ) {
    this.canvas.translate( x, y );

    return this;
  }


  //
  // Multiply the matrix by these values
  //
  // Documentation calls these parameters: a, b, c, d, e, f
  //  --or-- m11, m12, m21, m22, dx, dy
  // Defined as: xScale, ySkew, xSkew, yScale, xTranslate, yTranslate
  //
  transform( a,b, c,d, e,f ) {
    this.canvas.transform( a,b, c,d, e,f );

    return this;
  }


  //
  // The unity matrix (original, no translation, no rotation), is ( 1,0, 0,1, 0,0 )
  // So the matrix can be reset with those values
  //
  // Documentation calls these parameters: a, b, c, d, e, f
  //  --or-- m11, m12, m21, m22, dx, dy
  // Defined as: xScale, ySkew, xSkew, yScale, xTranslate, yTranslate
  //
  setTransform( a,b, c,d, e,f ) {
    this.canvas.setTransform( a,b, c,d, e,f );

    return this;
  }


  //
  // Angle in degrees
  //
  // Optional translation to cx, cy
  //
  rotate( angleDeg, cx=null, cy=null ) {
    // If cx and cy were specified, then translate to there before rotating
    if( cx != null && cy != null )  this.translate( cx, cy );

    this.canvas.rotate( Canvas.radians(angleDeg) );

    return this;
  }


  beginPath( ) {
    this.canvas.beginPath( );

    return this;
  }


  closePath( ) {
    this.canvas.closePath( );

    return this;
  }


  stroke( ) {
    this.canvas.stroke();

    return this;
  }


  fill( ) {
    this.canvas.fill();

    return this;
  }


  moveTo( x, y ) {
    this.canvas.moveTo( x, y );

    return this;
  }


  lineTo( x, y ) {
    this.canvas.lineTo( x, y );

    return this;
  }


  line( sx, sy, dx, dy, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.moveTo( sx, sy );
    this.canvas.lineTo( dx, dy );
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  clearRect( x = 0, y = 0, w = this.width, h = this.height ) {
    this.canvas.clearRect( x, y, w, h );

    return this;
  }


  //
  // Clear the whole canvas
  //
  clear( ) {
    // Ensure "clear screen" is not translated or rotated
    this.canvas.save();
    this.canvas.setTransform( 1,0, 0,1, 0,0 ); // Unity
    this.canvas.clearRect( 0, 0, this.width, this.height );
    this.canvas.restore();

    return this;
  }


  //
  // Synonym for strokeRect()
  //
  // Does not effect path
  //
  rect( x, y, w, h, color = this.strokeColor ) {
    return this.strokeRect( x, y, w, h, color );
  }


  //
  // Does not effect path
  //
  strokeRect( x, y, w, h, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.strokeRect( x, y, w, h );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  fillRect( x, y, w, h, color = this.fillColor ) {
    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.fillRect( x, y, w, h );

    this.canvas.fillStyle = this.fillColor; // Restore fillStyle

    return this;
  }


  //
  // NOTE: I DID write this function :-) As apposed to the old one that I did not
  //
  roundedRect( x1, y1, w, h, r, color=this.strokeColor ) {
    let x2 = x1 + w - 1;
    let y2 = y1 + h -1;

    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.moveTo( x1, y2 - r );  // Start at radius distance from Bottom left

    // Draw line to within radius distance from the corner
    // Arc from that point toward corner THEN arc toward next corner
    this.canvas.arcTo( x1, y1, x2, y1, r );       // Top Left
    // Repeat for other three sides and corners
    this.canvas.arcTo( x2, y1, x2, y2, r );       // Top right
    this.canvas.arcTo( x2, y2, x1, y2, r );       // Bottom right
    this.canvas.arcTo( x1, y2, x1, y2 - r, r ); // Bottom left (ending at y1 would duplicate line)
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Add an arc to the path.
  // Good for rounding rectangle corners
  //
  arcTo( x1, y1, x2, y2, r ) {
    return this.canvas.arcTo( x1, y1, x2, y2, r );
  }


  //
  // Add an arc to the path
  // Does NOT stroke/draw the path
  //
  arc( cx, cy, r, deg1, deg2 ) {
    this.canvas.arc( cx, cy, r, Canvas.radians(deg1), Canvas.radians(deg2) );

    return this;
  }


  strokeArc( cx, cy, r, deg1, deg2, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, Canvas.radians(deg1), Canvas.radians(deg2) );
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  circle( cx, cy, r, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, 0, Math.PI * 2, color );
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Synonym for circle()
  //
  strokeCircle( cx, cy, r, color = this.strokeColor ) {
    return this.circle( cx, cy, r, color );
  }



  fillCircle( cx, cy, r, color = this.fillColor ) {
    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, 0, Math.PI * 2 );
    this.canvas.fill( );

    this.canvas.fillStyle = this.fillColor; // Restore fillStyle

    return this;
  }


  //
  // Add a full (closed) oval/elipse to the path
  //
  oval( x, y, radiusX, radiusY, rotationDeg=0 ) {
    this.ellipse( x, y, radiusX, radiusY, rotationDeg, 0, 360 );

    return this;
  }


  //
  // Draw a full (closed) oval/elipse
  //
  strokeOval( x, y, radiusX, radiusY, rotationDeg=0, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath();
    this.ellipse( x, y, radiusX, radiusY, rotationDeg, 0, 360 );
    this.canvas.stroke();

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Adds an ellipse, whole or part of one, to the path (does NOT draw the path)
  //
  // rotation angle is in degrees (it is converted to radians for you)
  // rotation seems to start with 0 at radiusX on the x axis and go clockwise
  //
  ellipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360, counterclockwise = false ) {
    this.canvas.ellipse( x, y, radiusX, radiusY, Canvas.radians(rotationDeg),
      Canvas.radians(startAngle), Canvas.radians(endAngle), counterclockwise );

    return this;
  }


  //
  // Draws an ellipse, whole or part of one
  //
  // rotation angle is in degrees (it is converted to radians for you)
  // rotation seems to start with 0 at radiusX on the x axis and go clockwise
  //
  strokeEllipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360,
        counterclockwise = false, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath();
    this.canvas.ellipse( x, y, radiusX, radiusY, Canvas.radians(rotationDeg),
      Canvas.radians(startAngle), Canvas.radians(endAngle), counterclockwise );
    this.canvas.stroke();

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Draw line with given angle (degrees) and length (distance)
  //
  vector( x, y, angleDeg, distance, color = this.strokeColor ) {
    let newX = x + Math.cos(Canvas.radians(angleDeg)) * distance;
    let newY = y + Math.sin(Canvas.radians(angleDeg)) * distance;

    this.line( x, y, newX, newY, color );

    return this;
  }


  strokeText( text, x, y, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.strokeText( text, x, y );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  fillText( text, x, y, color = this.fillColor ) {
    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.fillText( text, x, y );

    this.canvas.fillStyle = this.fillColor; // Restore strokeStyle

    return this;
  }


  //
  // Synonym for fillText()
  //
  text( text, x, y, color = this.fillColor ) {
    this.fillText( text, x, y, color );
  }


  centerText( text, x, y, color = this.fillColor ) {
    this.save( );
    this.textAlign = "center";
    this.textBaseline = "middle";
    this.fillText( text, x, y, color );
    this.restore( );
  }


  //
  // NOTE: Size and Font Size, both must be specified in that ORDER
  //       Optionaly boldness can be specified BEFORE size (bold, bolder, lighter, normal)
  //
  // Examples:
  //   "10px sans-serif"; // The default
  //   "bolder 24px serif";
  //   "60px verdana";
  set font( fontInfo ) {
    return this.canvas.font = fontInfo;
  }


  get font( ) {
    return this.canvas.font;
  }


  //
  // Position relative to x
  //
  // Examples:
  //   "left"
  //   "center"
  //   "right"
  set textAlign( how ) {
    return this.canvas.textAlign = how;
  }


  get textAlign( ) {
    return this.canvas.textAlign;
  }


  //
  // Position relative to y
  //
  // Examples:
  //   "top"
  //   "middle"
  //   "bottom"
  set textBaseline( how ) {
    return this.canvas.textBaseline = how;
  }


  get textBaseline( ) {
    return this.canvas.textBaseline;
  }


  //
  // Variations of params:
  //  img, dx, dy
  //  img, dx, dy, dw, dh
  //  img, sx, sy, sw, sh, dx, dy, dw, dh
  //
  image( img, x1, y1, w1, h1, x2, y2, w2, h2 ) {
    if( arguments.length == 3 ) this.canvas.drawImage( img, x1, y1 );
    if( arguments.length == 5 ) this.canvas.drawImage( img, x1, y1, w1, h1 );
    if( arguments.length == 9 ) this.canvas.drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 );

    return this;
  }


  //
  // Synonym for image() for Javascript canvas naming consistency
  //
  drawImage( img, ...argz ) {
    this.image( img, ...argz );

    return this;
  }


  //
  // Draw sprite rotated around it's center
  //
  imageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angleDeg = 0 ) {
    if( arguments.length >= 9 ) {
      this.canvas.save( );
      this.canvas.translate( x2+w2/2, y2+h2/2 );
      this.canvas.rotate( Canvas.radians(angleDeg) );

      this.canvas.drawImage( img, x1, y1, w1, h1, -w2/2, -h2/2, w2, h2 );
      this.canvas.restore( );
    }
    else console.error( "imageRotate(): Wrong number of parameters" );

    return this;
  }


  //
  // Synonym for imageRotate() for Javascript canvas naming consistency
  //
  drawImageRotate( img, ...argz ) {
      this.imageRotate( img, ...argz );

      return this;
  }

  getImageData( srcX, srcY, srcW, srcH ) {
    return this.canvas.getImageData( srcX, srcY, srcW, srcH );
  }

  putImageData( imageData, destX, destY, dirtyX=0, dirtyY=0, dirtyWidth=imageData.width, dirtyHeight=imageData.height ) {
    this.canvas.putImageData( imageData, destX, destY, dirtyX, dirtyY, dirtyWidth, dirtyHeight );

    return this;
  }

  createImageData( width, height ) {
    return this.canvas.createImageData( width, height );
  }

  //
  // Returns a dataURL of the canvas contents,
  // which can be used as the same as a image file name for image .src etc..
  //
  toDataURL( mimeType = "image/png", quality = 1.0 ) {
    // Needs the canvasElement
    return this.canvasElement.toDataURL( mimeType, quality ); // 1.0 is high quality, for lossy mime types
  }


  //
  // Draw a curve from the current path point to x,y using the two control points to set the curve
  //
  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y ) {
    this.canvas.bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y );

    return this;
  }


  isPointInPath( x, y ) {
    this.canvas.isPointInPath( x, y );

    return this;
  }


  //
  // Caller should probably wrap code in a .save() and .restore() as appropriate
  //
  shadow( offsetX, offsetY, blurRadius, color = "black" ) {
    this.canvas.shadowOffsetX = offsetX;
    this.canvas.shadowOffsetY = offsetY;
    this.canvas.shadowBlur = blurRadius;
    this.canvas.shadowColor = color;

    return this;
  }


  //
  // Synonym for shadow()
  //
  boxShadow( ...argz ) {
    return this.shadow( argz );
  }


  //
  // Synonym for shadow()
  //
  dropShadow( ...argz ) {
    return this.shadow( argz );
  }


  //
  // Convert degrees to radians
  //
  // NOTE: Same as radians(degrees) from math.js, to keep us independant of math.js
  //
  static radians( degrees ) {
    return degrees * Math.PI / 180;
  }


  //
  // Add move() and draw() funcitons to the que to be called via requestAnimationFrame()
  //
  // NOTE: move() can be null if object does not move every frame
  //
  // Returns identifier that can be used by call to delObj(id) (is actually the index into our ._animateQue[])
  //
  // ._animateQue = [{move:function, draw:function, fps:60, elapsedSec}, {}, ...]
  //
  addObj( move, draw, fps=60 ) {
    this._animateQue.push( {move,draw,fps,elapsedSec:0} );

    return this._animateQue.length - 1;
  }


  delObj( objId ) {
    this._animateQue.splice( objId, 1 );
  }


  clearObjs( ) {
    this._animateQue = [];
  }

  _moveObjs( ms ) {
    let deltaSecs;

    for( let obj of this._animateQue ) {
      if( obj.move ) {
        deltaSecs = (ms - this._previousMs) / 1000;   // Seconds since last call to _moveObjs()
        obj.elapsedSec += deltaSecs;

        if( obj.elapsedSec >= (1 / obj.fps) ) {
          obj.elapsedSec = 0; // Start timing over

          obj.move( );
        }
      }
    } // END for

    this._previousMs = ms;        // Save new previous value
  }


  _drawObjs( ) {
    this.clear();

    for( let obj of this._animateQue ) {
      obj.draw( this );  // Pass Canvas object, or we could pass the <canvas> context (this.canvas)
    }
  }


  _animate( ms ) {
    // Let the canvas be used for static drawing, if nothing is in the animate object queue
    if( !Paused && this._animateQue.length ) {
      this._moveObjs( ms );
      this._drawObjs();
    }

    requestAnimationFrame( ms => this._animate(ms) );
  }







} // END Canvas class







//
