import svg from '../svg.js';

export default (obj = {}) => {
    let defaults = {
        url: '',
        paths: [],
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
        let { paths, grid, tileSize, ow, oh } = obj;
        if (paths.length === 0) {
            return;
        }
        let cx = tileSize / ow;
        let cy = tileSize / oh;
        grid.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col === -1) {
                    return;
                }
                let m = new DOMMatrix([cx, 0, 0, cy, x * tileSize, y * tileSize]);
                let drawPath = (path) => {
                    if (Array.isArray(path)) {
                        path.forEach(drawPath);
                    } else {
                        let p = new Path2D();
                        p.addPath(new Path2D(path.d), m);
                        ctx.fillStyle = path.fill;
                        ctx.fill(p);
                    }
                };
                drawPath(paths[col]);
            });
        });
    });
    return obj;
};
