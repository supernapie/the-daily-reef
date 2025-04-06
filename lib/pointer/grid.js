import events from '../events.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        nCols: 10,
        nRows: 10,
        tileSize: 40,
        w: 400,
        h: 400,
        grid: []
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    let {on, off, once, emit, last} = events();
    obj.pointer = {
        on,
        off,
        once,
        emit,
        last
    };
    obj.state.on('pointerup', e => {
        let {cx: tx, cy: ty} = e;
        let {nCols, nRows, tileSize, grid} = obj;
        while (tx < 0) {
            tx += tileSize * nCols;
        }
        while (ty < 0) {
            ty += tileSize * nRows;
        }
        let x = Math.floor(tx / tileSize) % nCols;
        let y = Math.floor(ty / tileSize) % nRows;
        if (x < 0 || x >= nCols || y < 0 || y >= nRows) {
            return;
        }
        let value = grid[y][x];
        let {cx, cy, cam} = e;
        emit('pointerup', {x, y, value, cx, cy, cam});
    });
    return obj;
};
