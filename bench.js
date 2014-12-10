var concave = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var fcs = JSON.parse(fs.readFileSync(__dirname+'/test/fixtures/in/concaveIn2.geojson'));
    
var suite = new Benchmark.Suite('turf-concave');
suite
  .add('turf-concave',function () {
  	concave(fcs, 2.5);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();