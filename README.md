turf-convex
===============
[![build status](https://secure.travis-ci.org/Turfjs/turf-concave.png)](http://travis-ci.org/Turfjs/turf-concave)

Takes a set of points and returns a concave hull polygon.

```js
var concave = require('turf-concave')
var fs = require('fs')

var maxEdge = 2.5

var pts = JSON.parse(fs.readFileSync('/path/to/pts.geojson'))
  
var hull = concave(pts, maxEdge)

console.log(hull)
```