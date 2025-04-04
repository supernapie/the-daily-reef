import path from '../lib/draw/path.js';
import pointarea from '../lib/pointer/rect.js';

let r = 'M 0 0 L 256 0 L 256 128 L 0 128 Z';
let t = 'M 64 32 L 192 64 L 64 96 Z';

export default (obj = {}) => {
    let defaults = {
        paths: [r, t],
        x: 0,
        y: 0,
        w: 256,
        h: 128,
        a: 0,
        fills: ['black', 'white']
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    path(obj);
    pointarea(obj);
    let resize = e => {
        let {vw, vh} = e;
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 - obj.h / 2;
    };
    obj.state.on('resize', resize);
    obj.pointer.on('pointerdown', () => {
        obj.fills = ['white', 'black'];
    });
    obj.pointer.on('pointerup', () => {
        obj.fills = ['black', 'white'];
        obj.state.stop('level');
    });
    return obj;
};
