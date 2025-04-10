import drawTiles from '../lib/draw/tiles.js';
import autoTiles from '../lib/math/autotile.js';

export default (obj = {}) => {
    let defaults = {
        grid: []
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    autoTiles(obj);
    obj.url = '../assets/tiles/jetty.svg';
    drawTiles(obj);

    return obj;
};
