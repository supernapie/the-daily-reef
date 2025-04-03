export default (cam = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        offset: {x: 0, y: 0},
        target: {x: 0, y: 0},
        cx: 0,
        cy: 0,
    };
    Object.assign(defaults, cam);
    Object.assign(cam, defaults);
    let resize = e => {
        let {vw, vh} = e;
        cam.offset.x = Math.floor(vw / 2);
        cam.offset.y = Math.floor(vh / 2);
    };
    let start = e => {
        cam.x = cam.offset.x;
        cam.y = cam.offset.y;
        cam.target.x = cam.x;
        cam.target.y = cam.y;
        cam.cx = Math.floor(cam.x - cam.offset.x);
        cam.cy = Math.floor(cam.y - cam.offset.y);
    };
    let step = e => {
        let {dt} = e;
        let {x, y, target} = cam;
        let dx = target.x - x;
        let dy = target.y - y;
        let speed = 0.005 * dt;
        cam.x += dx * speed;
        cam.y += dy * speed;
        cam.cx = Math.floor(cam.x - cam.offset.x);
        cam.cy = Math.floor(cam.y - cam.offset.y);
    };
    let draw = e => {
        e.cam = cam;
    };
    cam.state.on('resize', resize);
    cam.state.on('start', start);
    cam.state.on('step', step);
    cam.state.on('draw', draw);
    return cam;
};
