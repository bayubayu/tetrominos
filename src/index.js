// (c) 2018 by Bayu Rizaldhan Rayes
// http://www.bayubayu.com

import $ from "jquery";
import { Tet } from './scripts/tetrominos';

console.log('Tetrominos');

function buildTable($el, width, height) {
    let str = '';
    str += '<tbody>';
    for (let j=0; j<height; j++) {
        str += '<tr>';
        for (let i=0; i< width; i++) {
            str += `<td id="cell-${i}-${j}" class="color-1"></td>`;
        }
        str += '</tr>';
    }
    str += '</tbody>';
    let tab = $el.append('<table id="tab">'+str+'</table>');
}

function updateTable($el, data, width, height) {
    let $tab = $el.find('table').first();
    let index = 0;
    for (let j=0; j<height;j++) {
        for (let i=0; i<width; i++) {
            $tab.find(`#cell-${i}-${j}`).removeClass().addClass(`color-${data[index]}`);
            index++;
        }
    }
}

//$('#table').append('<strong>hello</strong>');
let $el = $('#table');
buildTable($el,10,24);

let data = [
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,1,0,0,0,0,0,
    0,0,0,0,1,0,0,0,0,0,
    0,0,0,0,1,1,0,0,0,0,
    
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
];

updateTable($el, data, 10, 24);
let tet = new Tet();
tet.start();
let nextLanded = false;
let nextData = [];
let lockControl = false;

let f = ()=>{
    lockControl = false;
    console.log('tick');
    if (tet.currentState === tet.STATE.START) {
        tet.currentState = tet.STATE.NEXT_SHAPE;
    } else if (tet.currentState === tet.STATE.NEXT_SHAPE) {

        let random = Math.floor(Math.random() * 8);
        let shape = 'I';
        if (random === 0) shape = 'I'
        else if (random === 1) shape = 'L'
        else if (random === 2) shape = 'J'
        else if (random === 3) shape = 'Z'
        else if (random === 4) shape = 'S'
        else if (random === 5) shape = 'T'
        else if (random === 6) shape = 'O';

        tet.nextFloatShape(shape,1);
        let newData = tet._placeFloat(3,0);
        if (newData.landed || newData.data === false) {
            alert('Game Over');
        } else {
            tet.data = newData.data;
        }

        tet.currentState = tet.STATE.GAME;
    } else if (tet.currentState === tet.STATE.GAME) {
        if (nextLanded === true)
        {
            console.log('landed'); 

            tet._landed = nextData.slice(0);
            tet.resetFloat();    

            let newData = tet.destroy();
            tet._landed = newData.slice(0);

            tet.currentState = tet.STATE.NEXT_SHAPE;
            nextLanded = false;
            lockControl = true;
        } else {
            // detect if current position is already landed
            let newData = tet._placeFloat(tet._floatX,tet._floatY);
            if (newData.landed) {
                console.log('hey this is locked!!!!');
                nextLanded = true;
                return false;
            }

            let obj = tet.move('d');
            let landed = obj.landed;
            if (landed) {
                nextLanded = true;
                nextData = obj.data.slice(0);
            }    

            // locked condition?
            //console.log('DATA',obj.data);
            // if (obj.data && !nextLanded) {
            //     console.log('LOCKED CONDITION!');
            //     nextLanded = true;
            // }
            console.log('nextLanded',nextLanded);
        }

    }
    // tet.next();
    updateTable($el, tet.getData(), 10,24);    
}

// game loop
let timerId = setInterval(f,500);

updateTable($el, tet.getData(), 10,24);

$(document).keydown((ev)=>{
    console.log('hey',ev.which);
    if (lockControl) {
        return false;
    }
    if (ev.which === 32) {
        return false;
    }
    if (tet.currentState !== tet.STATE.GAME) {
        return false;
    }
    if (ev.which === 37) {
        let obj = tet.move('l');
        updateTable($el, tet.getData(), 10,24);    
        if (obj.landed)             { nextLanded = true; 
            nextData = obj.data.slice(0);
            // tet.resetFloat();    
            // lockControl = true;
        
        } else { nextLanded = false; }
    } else if (ev.which === 39) {
        let obj = tet.move('r');
        updateTable($el, tet.getData(), 10,24);    
        if (obj.landed)             { nextLanded = true; 
            nextData = obj.data.slice(0);
            // tet.resetFloat();    
            // lockControl = true;
        
        } else { nextLanded = false; }

    } else if (ev.which === 38) {
        let rotateResult = tet.rotateFloatShape('r')
        if (rotateResult.rotated) {
            updateTable($el, tet.getData(), 10,24);
            if (rotateResult.landed) {
                nextLanded = true;
                nextData = rotateResult.data.slice(0);
            } else {
                nextLanded = false;
            }
        }
    } else if (ev.which === 40) {
        let obj = tet.move('d');
        updateTable($el, tet.getData(), 10,24);    
        if (obj.landed)             { nextLanded = true; 
            nextData = obj.data.slice(0);
            // tet.resetFloat();    
        
        } //else { nextLanded = false; }

    }
})