import path from '../lib/draw/path.js';
import pointarea from '../lib/pointer/rect.js';

let margin = 8;

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        w: 40,
        h: 40,
        a: 0,
        url: '../assets/paths/compass.svg',
        paths: [],
        fills: ['black']
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    path(obj);
    pointarea(obj);
    let resize = e => {
        let {vw, vh} = e;
        obj.x = vw - obj.w - margin;
        obj.y = margin;
    };
    obj.state.on('resize', resize);
    obj.pointer.on('pointerup', () => {
        obj.state.stop('menu');
    });
    return obj;
};
