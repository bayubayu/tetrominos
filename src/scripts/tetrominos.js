// (c) 2018 by Bayu Rizaldhan Rayes
// http://www.bayubayu.com

'use strict'

const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 20;
const OFFSCREEN_HEIGHT = 4;
const SHAPE_WIDTH = 4;
const SHAPE_HEIGHT = 4;

const SHAPES = {
    'I' : [
            [
                0,0,0,0,
                0,0,0,0,
                1,1,1,1,
                0,0,0,0,
            ],
            [
                0,1,0,0,
                0,1,0,0,
                0,1,0,0,
                0,1,0,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                1,1,1,1,
                0,0,0,0,
            ],
            [
                0,1,0,0,
                0,1,0,0,
                0,1,0,0,
                0,1,0,0,
            ],            
          ],
    'L' : [
            [
                0,0,0,0,
                0,1,0,0,
                0,1,0,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,1,0,
                1,1,1,0,
                0,0,0,0,
            ],
            [
                0,0,0,0,
                1,1,0,0,
                0,1,0,0,
                0,1,0,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                1,1,1,0,
                1,0,0,0,
            ],
          ],
    'J' : [
            [
                0,0,0,0,
                0,0,1,0,
                0,0,1,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                1,1,1,0,
                0,0,1,0,
            ],
            [
                0,0,0,0,
                0,1,1,0,
                0,1,0,0,
                0,1,0,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                1,0,0,0,
                1,1,1,0,
            ],
          ],
    'Z' : [
            [
                0,0,0,0,
                0,0,0,0,
                1,1,0,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,1,0,
                0,1,1,0,
                0,1,0,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                1,1,0,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,1,0,
                0,1,1,0,
                0,1,0,0,
            ],
          ],
    'S' : [
            [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                1,1,0,0,
            ],
            [
                0,0,0,0,
                0,1,0,0,
                0,1,1,0,
                0,0,1,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                1,1,0,0,
            ],
            [
                0,0,0,0,
                0,1,0,0,
                0,1,1,0,
                0,0,1,0,
            ],
          ],
    'T' : [
            [
                0,0,0,0,
                0,0,0,0,
                1,1,1,0,
                0,1,0,0,
            ],
            [
                0,0,0,0,
                0,1,0,0,
                0,1,1,0,
                0,1,0,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                0,1,0,0,
                1,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,1,0,
                0,1,1,0,
                0,0,1,0,
            ],
          ],
    'O' : [
            [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
            ],
            [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
            ],
          ],

          
}

const STATE = {
    'START' : 0,
    'NEXT_SHAPE' : 1,
    'GAME' : 2,
    'LANDED': 3,
    'CHECK' : 4
}

function Tet(options) {
    options = Object.assign({
        width: DEFAULT_WIDTH,  
        height: DEFAULT_HEIGHT  
    }, options);

    // TODO: width & height should not be editable from outside
    this._width = options.width;     // visual width
    this._height = options.height;   // visual height

    this._dataWidth = this._width;
    this._dataHeight = this._height + OFFSCREEN_HEIGHT;
    
    this._landed = [];
    for (let i=0; i< (this._dataWidth * this._dataHeight); i++) {
        this._landed[i] = 0;
    }    
    

    this._float = null; // float data
    this._floatShape = null; // current float shape
    this._floatX = null;
    this._floatY = null;
    this._floatRotation = null;

    this.data = this._landed.slice(0); // merged between _landed and _float, for now just copy _landed

    this.currentState = null;
    this.STATE = STATE;
}

Tet.prototype._validPos = function(x,y) {
    return ((x>=0 && x<this._dataWidth) && (y>=0 && y<this._dataHeight));    
}

// for _landed & data
Tet.prototype._posToIndex = function(x,y) {
    if (this._validPos(x,y)) {
        return this._dataWidth * y + x;
    } else {
        return null;
    }
}

Tet.prototype._getValue = function(target, x,y) {
    if (this._validPos(x,y)) {
        return target[this._posToIndex(x,y)];
    } else {
        return null;
    }
}

Tet.prototype._setValue = function(target, x,y, value) {
    if (this._validPos(x,y)) {
        target[this._posToIndex(x,y)] = value;
        return value;
    } else {
        return null;
    }
}


Tet.prototype._getLandedValue = function(x,y) {
    return this._getValue(this._landed, x, y);
}

Tet.prototype._setLandedValue = function(x,y, value) {
    return this._setValue(this._landed, x, y, value);
}

Tet.prototype._getDataValue = function(x,y) {
    return this._getValue(this.data, x, y);
}

Tet.prototype._setDataValue = function(x,y, value) {
    return this._setValue(this.data, x, y, value);
}

// for shape
Tet.prototype._shapePosToIndex = function(x,y) {
    return SHAPE_WIDTH * y + x;
}

Tet.prototype._getShapeValue = function(target, x,y) {
    return target[this._shapePosToIndex(x,y)];
}

// merge _float and _landed, 
// return { data: next data or false, landed: true if landed } 
Tet.prototype._placeFloat = function(floatX, floatY) {
    // copy _landed first
    let data = this._landed.slice(0);
    let valid = true;
    let bottomY = 0;    // to get bottom y of the shape

    console.log('float x,y',floatX, floatY);

    // for (let x=0;x<SHAPE_WIDTH;x++) {
    //     console.log('check',floatX+x, floatY+bottomY);
    //     if (this._getValue(data, floatX+x, floatY+bottomY) !== 0) {
    //         // valid = false;
    //         console.log('value',this._getValue(data, floatX+x, floatY+bottomY))
    //         console.log('LANDED AT ',x, bottomY, floatX+x, floatY+bottomY);
    //         // break;
    //         return { 
    //             data: false,
    //             landed: false
    //         };
    //     }    
    // }

    // console.log('float',this._float);
    // merge with _float
    for (let y=0;y<SHAPE_HEIGHT;y++) {
        for (let x=0; x<SHAPE_WIDTH; x++) {
            // console.log(`shape value of ${x} and ${y} is ${this._getShapeValue(this._float, x, y)}, ${this._shapePosToIndex(x,y)}`);

            // todo: collision detection
            if ((this._getShapeValue(this._float, x, y)) !== 0) {
                if (y > bottomY) {
                    bottomY = y;
                }
                
                if (this._getValue(data, floatX+x, floatY+y) !== 0) {
                    // valid = false;
                    // break;
                    return { 
                        data: false,
                        landed: false
                    };
                }    
            }
            if (this._getShapeValue(this._float, x, y) !== 0) {
                this._setValue(data, floatX+x, floatY+y, this._getShapeValue(this._float, x, y));
            } 
        }
        // if (!valid) {
        //     break;
        // }
    }

    // console.log('bottomY', bottomY);
    
    // console.log('data',data);
    this._floatX = floatX;
    this._floatY = floatY;
    
    // todo:
    // set landed if shape are landed
    let landed = false;
    let belowBottomY = (bottomY+1) + floatY;
    if (/*!this._validPos(0, belowBottomY) &&*/ belowBottomY >= this._dataHeight) {
        // already reach the end        
        landed = true;
        console.log('reach the end');
    } else {
        for (let y=SHAPE_HEIGHT-1; y>=0; y--) {
        for(let x=0; x<SHAPE_WIDTH; x++) {
            if (this._getShapeValue(this._float, x, y) !== 0 && this._validPos(floatX+x, floatY+y+1) && this._getValue(this._landed, floatX+x, floatY+y+1) !== 0) {
                console.log('LANDED!');
                landed = true;
                break;
            }

        }
        }
    }

    return { 
        data,
        landed
    };
}

Tet.prototype.getData = function() {
    
    return this.data;
};

Tet.prototype.init = function() {
    // this.data = 'hey';
    this.currentState = STATE.START;
}

// check if all shapes landed or there's no active float
Tet.prototype.allLanded = function() {
    return !this._float;
}

// setup next float shape
Tet.prototype.nextFloatShape = function(shape, rotation) {
    if (!this.allLanded) {
        return false;
    }

    this._floatShape = shape;
    this._float = SHAPES[shape][rotation];
    this._floatRotation = rotation;
}

// rotate current float shape
// param: l = rotate left
//        r = rotate right
//        number = rotate to index
// return true = success
Tet.prototype.rotateFloatShape = function(rotation) {
    let rotationIndex;
    let shapeRotationLength = SHAPES[this._floatShape].length;  // always 4
    if (rotation === 'r') {
        if (this._floatRotation <= 0) {
            rotationIndex = shapeRotationLength-1;
        } else {
            rotationIndex = this._floatRotation-1;
        }
    } else if (rotation === 'l') {
        if (this._floatRotation >= shapeRotationLength-1) {
            rotationIndex = 0;
        } else {
            rotationIndex = this._floatRotation+1;
        }
    } else if (Number.isInteger(rotation) && rotation >= 0 && rotation < shapeRotationLength) {
        rotationIndex = rotation;
    } else {
        return false;
    }
    
    let backupFloatRotation = this._floatRotation;
    let backupFloat = this._float.slice(0);

    this._floatRotation = rotationIndex;
    this._float = SHAPES[this._floatShape][rotationIndex].slice(0);

    // check validity
    let newData = this._placeFloat(this._floatX,this._floatY);
    console.log('newData',newData);
    if (!newData.data) {
        this._floatRotation = backupFloatRotation;
        this._float = backupFloat.slice(0);
        return {
            rotated: false,
            landed: false,
            data: newData.data
        };
    }

    this.data = newData.data.slice(0);

    return {
        rotated: true,
        landed: newData.landed,
        data: newData.data
    };
}

Tet.prototype.start = function() {
    this.init();
}

Tet.prototype.resetFloat = function() {
    this._float = null; // float data
    this._floatShape = null; // current float shape
    this._floatX = null;
    this._floatY = null;
    this._floatRotation = null;
}
// return
//  landed
Tet.prototype.move = function(direction) {
    if (this.allLanded()) { return false; }
    let nextX = this._floatX;
    let nextY = this._floatY;

    if (direction === 'd') {
        nextY++;
    } else if (direction === 'l') {
        nextX--;
    } else if (direction === 'r') {
        nextX++;
    }

    let newData = this._placeFloat(nextX,nextY);
    if (newData.data) {
        this.data = newData.data.slice(0);
    }
    if (newData.landed) {
        // merge data
        // this._landed = newData.data.slice(0);
        // this.resetFloat();
        // return true;
        return { 
            data: newData.data.slice(0),
            landed : true
        };
    
    } 
    // return false;
    return {
        data: false,
        landed: false
    }
}

// return new data
Tet.prototype.destroy = function() {
    if (!this.allLanded()) { return false; }
    let data = this._landed.slice(0);

    for (let y= 0; y < this._dataHeight; y++) {

        let complete = true;
        for (let x=0; x < this._dataWidth; x++) {
            if (this._getValue(data, x, y) === 0) {
                // skip to next line
                complete = false;
                break;
            }
        }

        if (!complete) {
            continue;
        } else {
            console.log('line ',y,'is complete!!!!!!!!!!');
            // move
            for (let yd= y; yd > 0; yd--) {
                for (let xd=0; xd < this._dataWidth; xd++) {
                    this._setValue(data,xd,yd, this._getValue(data,xd,yd-1));
                }
            }
            
        }
    }

    return data;
}
// Tet.prototype.next = function() {
//     if (this.currentState === STATE.START) {
        
//     } else if (this.currentState === STATE.NEXT_SHAPE) {
//         // check if already landed
//     } else if (this.currentState === STATE.GAME) {
//     }
// }

export { Tet };