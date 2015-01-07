// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var t = {};
t.tin = require('turf-tin');
t.merge = require('turf-merge');
t.distance = require('turf-distance');
t.point = require('turf-point');

/**
 * Takes a set of points and
 * returns a concave hull
 *
 * Internally this implements
 * a [Monotone chain algorithm](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript).
 *
 * @module turf/concave
 * @param {FeatureCollection} points a collection of Features with {@link Point}
 * geometries
 * @param {number} maxEdge the size of an edge necessary for part of the
 * hull to become concave. Given in miles.
 * @returns {Feature} output a feature with {@link Polygon} geometry
 * @example
 * var fs = require('fs')
 * var pts = JSON.parse(fs.readFileSync('/path/to/pts.geojson'))
 * var hull = turf.concave(pts)
 * console.log(hull)
 */
module.exports = function(points, maxEdge){
  var tinPolys,
    filteredPolys,
    bufferPolys,
    mergePolys;

  tinPolys = t.tin(points, null);

  if (tinPolys instanceof Error) {
    return tinPolys;
  }

  filteredPolys = filterTriangles(tinPolys.features, maxEdge);
  tinPolys.features = filteredPolys;
  return t.merge(tinPolys);
}

var filterTriangles = function(triangles, maxEdge, cb){
  return triangles.filter(function (triangle) {
    var pt1 = t.point(triangle.geometry.coordinates[0][0][0], triangle.geometry.coordinates[0][0][1])
    var pt2 = t.point(triangle.geometry.coordinates[0][1][0], triangle.geometry.coordinates[0][1][1])
    var pt3 = t.point(triangle.geometry.coordinates[0][2][0], triangle.geometry.coordinates[0][2][1])
    var dist1 = t.distance(pt1, pt2, 'miles');
    var dist2 = t.distance(pt2, pt3, 'miles');
    var dist3 = t.distance(pt1, pt3, 'miles');

    return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
  })
}
