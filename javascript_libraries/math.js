//
//            Math.js
//
//        Misc Math Classes and functions
//
//  19 Oct 2022  Created
//  30 Oct 2022  Added bunch of vector functions (did not test all of them)
//  17 Nov 2022  Added vectorAdd() and vectorDivideBy()
//               V1.3
//  18 Nov 2022  Added vectorNegate(), vectorDotProduct()
//  21 Dec 2022  Added lerp(), inverseLerp()
//               V1.4
//  21 Apr 2023  Added vectorSub( ), improved lerp()
//               V1.5
//  25 Apr 2023  Added stdNormalDistribution( x )
//               V1.6
//  29 Jun 2023  Added midPoint( )
//               V1.7



var MathJsVersion = "1.7";




//        Functions
//
// radians( degrees )
// degrees( radians )
//
//   ===== VECTOR MATH ===
// length( point )
// magnitude( point )
// setLength( point, len )
// setMagnitude( point, len )
// distance( point1, point2 )
// midPoint( point1, point2 )
// normalize( point )
// vectorAdd( point1, point2 )
// vectorSub( point1, point2 )
// vectorMultiplyBy( point, scalar )
// vectorDivideBy( point, scalar )
// vectorNegate( point )
// vectorDotProduct( point1, point2 )
// lerp( start, end, where )
// inverseLerp( start, end, value )
// stdNormalDistribution( x )
//



//
// Convert degrees to radians
//
function radians( degrees ) {
  return degrees * Math.PI / 180;
}


//
// Convert radians to degrees
//
function degrees( radians ) {
  return radians * 180 / Math.PI;
}



//   =====================
//   ===== VECTOR MATH ===
//   =====================


//
//
//
function length( point ) {
  return Math.hypot( point.x, point.y ); // sqrt of sum of the squares
  // --OR--
  // return Math.sqrt( point.x * point.x, point.y * point.y );
}


//
// Equivelant to length( point )
//
let magnitude = length;


//
// Use direction of point, return point of a vector with new length
//
function setLength( point, len ) {
  return vectorMultiplyBy( normalize( point ) , len );
}


//
// Use direction of point, return point of a vector with new length
//
let setMagnitude = setLength;


//
// Distance between two 2d points
//
// point1 and point2 are {} (i.e. {x,y})
//
// NOTE: This function used to take arrays. I changed it to take objects {x,y} to be consistant with all the other functions here.
//       Also I seperated out the 2d and 3d versions
//
function distance( point1, point2 ) {
  let difference = point1.x - point2.x;
  let dist = difference * difference; // Squared

  difference = point1.y - point2.y;
  dist += difference * difference; // Squared

  return Math.sqrt( dist );
}


//
// Distance between two 3d points
//
// point1 and point2 are {} (i.e. {x,y,z})
//
function distance3d( point1, point2 ) {
  let difference = point1.x - point2.x;
  let dist = difference * difference; // Squared

  difference = point1.y - point2.y;
  dist += difference * difference; // Squared

  difference = point1.z - point2.z;
  dist += difference * difference; // Squared

  return Math.sqrt( dist );
}



//
// The point (i.e. {x,y}) midway between two points
//
// point1 and point2 (i.e. {x,y}, {x,y})
//
function midPoint( point1, point2 ) {
  let sum = vectorAdd( point1, point2 );

  return vectorDivideBy( sum, 2 );
}



//
// Returns a unit vector from normalizing the vector/point
//
// NOTE: This is the same as vectorDivideBy(point, length(point))
//
function normalize( point ) {
  let len = length(point);

  return {x:point.x/len, y:point.y/len};
  // --OR--
  // return vectorDivideBy( point, length(point) );
}


//
//
//
function vectorAdd( point1, point2 ) {
  return { x:point1.x + point2.x, y:point1.y + point2.y }
}


//
// point1 - point2
//
function vectorSub( point1, point2 ) {
  return { x:point1.x - point2.x, y:point1.y - point2.y }
}


//
//
//
function vectorMultiplyBy( point, scalar ) {
  return { x:point.x * scalar, y:point.y * scalar }
}


//
// point / scalar  (i.e. Divide point by scalar)
//
function vectorDivideBy( point, scalar ) {
  return { x:point.x / scalar, y:point.y / scalar }
}


//
// Reverses the direction of the vector
//
function vectorNegate( point ) {
  return { x:-point.x, y:-point.y };
}

//
// Returns a scalar (not a point)
// dot product is commutative. So, point1 and point2 can be reversed with the same result
//
// For Scalar projection, one of the points should be normalized, i.e. normalize(point1)
// For Vector projection, multiply the dotProduct by the normalized point, i.e. vectorMultiplyBy( normalize(point1), vectorDotProduct(normalize(point1), point2)
//
function vectorDotProduct( point1, point2 ) {
  return point1.x * point2.x + point1.y * point2.y;
}


//
// LERP -- Linear interpolation
//
// Return a value that is the "where" proportional location (from 0 to 1 inclusive) between start and end
//
// start and end can either be scalars or points
//
// Freya Holmer:
//  "Lerp is used to blend between two things!
//    It has three inputs: ( a, b, t )
//    a = start value
//    b = end value
//    t = how far we should go from start to end, as a percentage (RWWJ: proportion (fraction) from 0 to 1)
//
function lerp( start, end, where ) {
  if( typeof start == "object" ) {
    return vectorAdd( start, vectorMultiplyBy( vectorSub(end,start), where ) );
  }
  else return start + where * (end - start); // No clamping (limiting) -- This version gets rid of the js float inaccuracies
}


//
// Linear interpolation
//
// Return the "where" location (from 0 to 1 incluseive) that the "value" is between start and end
//
// start and end can either be scalars or points
//
function inverseLerp( start, end, value ) {
  // Protect against divide by zero
  if( start != end ) {
    // Clamp result to be within 0 and 1 (inclusive).
    // NOTE: Only need if "value" could be outside the start to end range
    let where = (value - start) / (end - start);

    return (where < 0) ? 0 : (where > 1) ? 1 : where; // Clamp / limit the returned where value
  }
  else return 1;
}



//
// Standard Bell Curve, Standard Normal Distribution, Gaussian Distribution
//
// NOTE: Only gives you the right side of the bell curve (x of 0 is the peak and it goes down from there)
//
// Return values from 0 to 1 (0.9973557010035818 actually), based on where on the bell curve x is
//
// x of 0 returns 0.9973557010035818 (the peak of the curve)
// x of 4 returns 0.000334 (even scaled up to draw on a 4k monitor, this would still yield a Y of 0)
// x of 5 returns 0.00000371 (escentially 0 when it comes to drawing a bell curve)
//
// Based on a function by Aleuck (AgataLeuck, agata.leuck.dev) on StackOverflow.com
//
function stdNormalDistribution( x ) {
  // return Math.pow( Math.E, - x*x  /2 ) / Math.sqrt( 2 * Math.PI );

  // The original formula returned a value from 0 to 0.4 (actually 3.9999)
  // So I scale it by 2.5 so I can return values between 0 and 1
  return 2.5 * Math.pow( Math.E, - x*x  /2 ) / Math.sqrt( 2 * Math.PI );
}







//
