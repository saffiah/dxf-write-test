(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.drawing = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Arc
{
    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     * @param {number} startAngle - degree 
     * @param {number} endAngle - degree 
     */
    constructor(x1, y1, r, startAngle, endAngle)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.r = r;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        let s = `0\nARC\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `40\n${this.r}\n50\n${this.startAngle}\n51\n${this.endAngle}\n`;
        return s;
    }
}

module.exports = Arc;
},{}],2:[function(require,module,exports){
class Circle
{
    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     */
    constructor(x1, y1, r)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.r = r;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/circle_al_u05_c.htm
        let s = `0\nCIRCLE\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `40\n${this.r}\n`;
        return s;
    }
}

module.exports = Circle;
},{}],3:[function(require,module,exports){
const LineType = require('./LineType');
const Layer = require('./Layer');
const Line = require('./Line');
const Arc = require('./Arc');
const Circle = require('./Circle');
const Text = require('./Text');
const Polyline = require('./Polyline');
const Face = require('./Face');
const Point = require('./Point.js')

class Drawing
{
    constructor()
    {
        this.layers = {};
        this.activeLayer = null;
        this.lineTypes = {};

        for (let i = 0; i < Drawing.LINE_TYPES.length; ++i)
        {
            this.addLineType(Drawing.LINE_TYPES[i].name,
                             Drawing.LINE_TYPES[i].description,
                             Drawing.LINE_TYPES[i].elements);
        }

        for (let i = 0; i < Drawing.LAYERS.length; ++i)
        {
            this.addLayer(Drawing.LAYERS[i].name,
                          Drawing.LAYERS[i].colorNumber,
                          Drawing.LAYERS[i].lineTypeName);
        }

        this.setActiveLayer('0');
    }


    /**
     * @param {string} name
     * @param {string} description
     * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
     */
    addLineType(name, description, elements)
    {
        this.lineTypes[name] = new LineType(name, description, elements);
        return this;
    }

    addLayer(name, colorNumber, lineTypeName)
    {
        this.layers[name] = new Layer(name, colorNumber, lineTypeName);
        return this;
    }

    setActiveLayer(name)
    {
        this.activeLayer = this.layers[name];
        return this;
    }

    drawPoint(x,y)
    {
        this.activeLayer.addShape(new Point(x,y));
        return this
    }

    drawLine(x1, y1, x2, y2)
    {
        this.activeLayer.addShape(new Line(x1, y1, x2, y2));
        return this;
    }

    drawRect(x1, y1, x2, y2)
    {
        this.activeLayer.addShape(new Line(x1, y1, x2, y1));
        this.activeLayer.addShape(new Line(x1, y2, x2, y2));
        this.activeLayer.addShape(new Line(x1, y1, x1, y2));
        this.activeLayer.addShape(new Line(x2, y1, x2, y2));
        return this;
    }

    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     * @param {number} startAngle - degree
     * @param {number} endAngle - degree
     */
    drawArc(x1, y1, r, startAngle, endAngle)
    {
        this.activeLayer.addShape(new Arc(x1, y1, r, startAngle, endAngle));
        return this;
    }

    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     */
    drawCircle(x1, y1, r)
    {
        this.activeLayer.addShape(new Circle(x1, y1, r));
        return this;
    }

    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     */
    drawText(x1, y1, height, rotation, value)
    {
        this.activeLayer.addShape(new Text(x1, y1, height, rotation, value));
        return this;
    }

    /**
     * @param {array} points - Array of points like [ [x1, y1], [x2, y2]... ]
     */
    drawPolyline(points)
    {
        this.activeLayer.addShape(new Polyline(points));
        return this;
    }

    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} z1 - z
     * @param {number} x2 - x
     * @param {number} y2 - y
     * @param {number} z2 - z
     * @param {number} x3 - x
     * @param {number} y3 - y
     * @param {number} z3 - z
     * @param {number} x4 - x
     * @param {number} y4 - y
     * @param {number} z4 - z
     */
    drawFace(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4)
    {
        this.activeLayer.addShape(new Face(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4));
        return this;
    }

    _getDxfLtypeTable()
    {
        let s = '0\nTABLE\n'; //start table
        s += '2\nLTYPE\n';    //name table as LTYPE table

        for (let lineTypeName in this.lineTypes)
        {
            s += this.lineTypes[lineTypeName].toDxfString();
        }

        s += '0\nENDTAB\n'; //end table

        return s;
    }

    _getDxfLayerTable()
    {
        let s = '0\nTABLE\n'; //start table
        s += '2\nLAYER\n'; //name table as LAYER table

        for (let layerName in this.layers)
        {
            s += this.layers[layerName].toDxfString();
        }

        s += '0\nENDTAB\n';

        return s;
    }

    toDxfString()
    {
        let s = '';

        //start section
        s += '0\nSECTION\n';
        //name section as TABLES section
        s += '2\nTABLES\n';

        s += this._getDxfLtypeTable();
        s += this._getDxfLayerTable();

        //end section
        s += '0\nENDSEC\n';


        //ENTITES section
        s += '0\nSECTION\n';
        s += '2\nENTITIES\n';

        for (let layerName in this.layers)
        {
            let layer = this.layers[layerName];
            s += layer.shapesToDxf();
            // let shapes = layer.getShapes();
        }

        s += '0\nENDSEC\n';


        //close file
        s += '0\nEOF';

        return s;
    }

}

//AutoCAD Color Index (ACI)
//http://sub-atomic.com/~moses/acadcolors.html
Drawing.ACI =
{
    LAYER : 0,
    RED : 1,
    YELLOW : 2,
    GREEN : 3,
    CYAN : 4,
    BLUE : 5,
    MAGENTA : 6,
    WHITE : 7
}

Drawing.LINE_TYPES =
[
    {name: 'CONTINUOUS', description: '______', elements: []},
    {name: 'DASHED',    description: '_ _ _ ', elements: [5.0, -5.0]},
    {name: 'DOTTED',    description: '. . . ', elements: [0.0, -5.0]}
]

Drawing.LAYERS =
[
    {name: '0',  colorNumber: Drawing.ACI.WHITE, lineTypeName: 'CONTINUOUS'}
]

module.exports = Drawing;

},{"./Arc":1,"./Circle":2,"./Face":4,"./Layer":5,"./Line":6,"./LineType":7,"./Point.js":8,"./Polyline":9,"./Text":10}],4:[function(require,module,exports){
class Face
{
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;
        this.x4 = x4;
        this.y4 = y4;
        this.z4 = z4;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/3dface_al_u05_c.htm
        let s = `0\n3DFACE\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n${this.z1}\n`;
        s += `11\n${this.x2}\n21\n${this.y2}\n31\n${this.z2}\n`;
        s += `12\n${this.x3}\n22\n${this.y3}\n32\n${this.z3}\n`;
        s += `13\n${this.x4}\n23\n${this.y4}\n33\n${this.z4}\n`;
        return s;
    }
}

module.exports = Face;
},{}],5:[function(require,module,exports){
class Layer
{
    constructor(name, colorNumber, lineTypeName)
    {
        this.name = name;
        this.colorNumber = colorNumber;
        this.lineTypeName = lineTypeName;
        this.shapes = [];
    }

    toDxfString()
    {
        let s = '0\nLAYER\n';
        s += '70\n64\n';
        s += `2\n${this.name}\n`;
        s += `62\n${this.colorNumber}\n`;
        s += `6\n${this.lineTypeName}\n`;
        return s;        
    }

    addShape(shape)
    {
        this.shapes.push(shape);
        shape.layer = this;
    }

    getShapes()
    {
        return this.shapes;
    }

    shapesToDxf()
    {
        let s = '';
        for (let i = 0; i < this.shapes.length; ++i)
        {
            s += this.shapes[i].toDxfString();
        } 
        
        
        return s;
    }
}

module.exports = Layer;
},{}],6:[function(require,module,exports){
class Line
{
    constructor(x1, y1, x2, y2)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        let s = `0\nLINE\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `11\n${this.x2}\n21\n${this.y2}\n31\n0\n`;
        return s;
    }
}

module.exports = Line;
},{}],7:[function(require,module,exports){
class LineType
{
    /**
     * @param {string} name
     * @param {string} description
     * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a 
     */
    constructor(name, description, elements)
    {
        this.name = name;
        this.description = description;
        this.elements = elements;
    }

    /**
     * @link https://www.autodesk.com/techpubs/autocad/acadr14/dxf/ltype_al_u05_c.htm
     */
    toDxfString()
    {
        let s = '0\nLTYPE\n';
        s += '72\n65\n';
        s += '70\n64\n';
        s += `2\n${this.name}\n`;
        s += `3\n${this.description}\n`;
        s += `73\n${this.elements.length}\n`;
        s += `40\n${this.getElementsSum()}\n`;

        for (let i = 0; i < this.elements.length; ++i)
        {
            s += `49\n${this.elements[i]}\n`;
        }

        return s;
    }

    getElementsSum()
    {
        let sum = 0;
        for (let i = 0; i < this.elements.length; ++i)
        {
            sum += Math.abs(this.elements[i]);
        }

        return sum;
    }
}

module.exports = LineType;
},{}],8:[function(require,module,exports){
class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
        let s = `0\nPOINT\n`;
        s += `8\n${this.layer.name}\n`;
        s += `10\n${this.x}\n20\n${this.y}\n30\n0\n`;
        return s;
    }
}

module.exports = Point;

},{}],9:[function(require,module,exports){
class Polyline
{
    /**
     * @param {array} points - Array of points like [ [x1, y1], [x2, y2]... ]
     */
    constructor(points)
    {
        this.points = points;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acad2000/dxf/polyline_dxf_06.htm
        //https://www.autodesk.com/techpubs/autocad/acad2000/dxf/vertex_dxf_06.htm
        let s = `0\nPOLYLINE\n`;
        s += `8\n${this.layer.name}\n`;
        s += `66\n1\n70\n0\n`;

        for (let i = 0; i < this.points.length; ++i)
        {
            s += `0\nVERTEX\n`;
            s += `8\n${this.layer.name}\n`;
            s += `70\n0\n`;
            s += `10\n${this.points[i][0]}\n20\n${this.points[i][1]}\n`;
        }
        
        s += `0\nSEQEND\n`;
        return s;
    }
}

module.exports = Polyline;
},{}],10:[function(require,module,exports){
class Text
{
    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     */
    constructor(x1, y1, height, rotation, value)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.height = height;
        this.rotation = rotation;
        this.value = value;
    }

    toDxfString()
    {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/text_al_u05_c.htm
        let s = `0\nTEXT\n`;
        s += `8\n${this.layer.name}\n`;
        s += `1\n${this.value}\n`;
        s += `10\n${this.x1}\n20\n${this.y1}\n30\n0\n`;
        s += `40\n${this.height}\n50\n${this.rotation}\n`;
        return s;
    }
}

module.exports = Text;
},{}],11:[function(require,module,exports){
module.exports = require('./src/Drawing');
},{"./src/Drawing":3}]},{},[11])(11)
});
