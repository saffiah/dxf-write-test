const Drawing = require('./../src/Drawing');
const fs = require('fs');

let d = new Drawing();

d.addLineType('DASHDOT', '_ . _ ', [0.5, -0.5, 0.0, -0.5])
d.addLayer('l_green', Drawing.ACI.GREEN, 'DASHDOT');
d.setActiveLayer('l_green');

d.drawPolyline([ [0,0], [10, 10], [20, 10], [30, 0] ]);

fs.writeFileSync(__filename + '.dxf', d.toDxfString());