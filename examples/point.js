const Drawing = require('./../src/Drawing');
const fs = require('fs');

let d = new Drawing();

d.addLayer('l_green', Drawing.ACI.GREEN,'CONTINUOUS');
d.setActiveLayer('l_green');

d.drawPoint(50, 50)
d.drawPoint(60,60)
d.drawPoint(0,30)
d.drawPoint(0,0)

fs.writeFileSync('point.dxf', d.toDxfString());
