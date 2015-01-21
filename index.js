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
 * Takes a {@link FeatureCollection} of {@link Point} features and
 * returns a concave hull.
 *
 * Internally, this implements
 * a [Monotone chain algorithm](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript).
 *
 * @module turf/concave
 * @param {FeatureCollection} points a FeatureCollection of {@link Point} features
 * @param {number} maxEdge the size of an edge necessary for part of the
 * hull to become concave (in miles)
 * @returns {Feature} a {@link Polygon} feature
 * @throws {Error} if maxEdge parameter is missing
 * @example
 * var points = turf.featurecollection([
 *  turf.point([-63.601226, 44.642643]),
 *  turf.point([-63.591442, 44.651436]),
 *  turf.point([-63.580799, 44.648749]),
 *  turf.point([-63.573589, 44.641788]),
 *  turf.point([-63.587665, 44.64533]),
 *  turf.point([-63.595218, 44.64765])
 * ]);
 *
 * var hull = turf.concave(points, 1);
 *
 * var result = turf.featurecollection(
 *  points.features.concat(hull));
 *
 * //=result
 */


module.exports = function(points, maxEdge) {
  if (typeof maxEdge !== 'number') throw new Error('maxEdge parameter is required');

  var tinPolys = t.tin(points, null);
  var filteredPolys = tinPolys.features.filter(filterTriangles);
  tinPolys.features = filteredPolys;

  function filterTriangles(triangle) {
    var pt1 = t.point(triangle.geometry.coordinates[0][0]);
    var pt2 = t.point(triangle.geometry.coordinates[0][1]);
    var pt3 = t.point(triangle.geometry.coordinates[0][2]);
    var dist1 = t.distance(pt1, pt2, 'miles');
    var dist2 = t.distance(pt2, pt3, 'miles');
    var dist3 = t.distance(pt1, pt3, 'miles');
    return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
  }

  return t.merge(tinPolys);
};
