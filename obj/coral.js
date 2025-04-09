import svg from '../lib/svg.js';
import drawTiles from '../lib/draw/tiles.js';
import autoTiles from '../lib/math/autotile.js';

// cache the svg
svg({url: '../assets/tiles/coral.svg'});

export default (obj = {}) => {
    let defaults = {
        grid: [],
        x: 0,
        y: 0
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    autoTiles(obj);

    obj.show = () => {
        obj.state.on('draw', e => {
            let {ctx} = e;
            ctx.translate(obj.x, obj.y);
        });

        obj.url = '../assets/tiles/coral.svg';
        drawTiles(obj);

        obj.state.on('draw', e => {
            let {ctx} = e;
            ctx.translate(-obj.x, -obj.y);
        });
    };

    return obj;
};
