import svg from '../svg.js';

export default (obj = {}) => {
    let defaults = {
        url: '',
        paths: [],
        fills: [],
        grid: [],
        tileSize: 40,
        ow: 40,
        oh: 40
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.ow = obj.tileSize;
    obj.oh = obj.tileSize;
    if (obj.url) {
        svg(obj);
    }
    obj.state.on('draw', e => {
        let { ctx } = e;
        let { paths, fills, grid, tileSize, ow, oh } = obj;
        let cx = tileSize / ow;
        let cy = tileSize / oh;
        grid.forEach((row, y) => {
            row.forEach((col, x) => {
                let m = new DOMMatrix([cx, 0, 0, cy, x * tileSize, y * tileSize]);
                let p = new Path2D();
                p.addPath(new Path2D(paths[col]), m);
                ctx.fillStyle = 'green';
                ctx.fill(p);
            });
        });
    });
    return obj;
};
