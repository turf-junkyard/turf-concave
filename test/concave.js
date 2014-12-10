var concave = require('../');
var test = require('tape');
var glob = require('glob');
var fs = require('fs');

var REGEN = process.env.REGEN;

test('intersect', function(t){
  glob.sync(__dirname + '/fixtures/in/*.geojson').forEach(function(input) {
    var fcs = JSON.parse(fs.readFileSync(input));
    var output = concave(fcs, 2.5);
    if (REGEN) fs.writeFileSync(input.replace('/in/', '/out/'), JSON.stringify(output));
    t.ok(output);
    t.equal(output.geometry.type, 'MultiPolygon');
    t.deepEqual(output, JSON.parse(fs.readFileSync(input.replace('/in/', '/out/'))), input);
  });
  t.end();
});
