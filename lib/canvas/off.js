import state from '../statemachine/state.js';
export default (obj = {}) => {
    let defaults = {
        w: 40,
        h: 40,
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    let offCanvas = new OffscreenCanvas(obj.w, obj.h);
    let offCtx = offCanvas.getContext('2d');
    let shim = state();
    shim.draw = e => {
        let {ctx, cam, cx, cy} = e;
        offCanvas.width = obj.w;
        offCanvas.height = obj.h;
        shim.emit('draw', {
            ctx: offCtx,
            cam, cx, cy
        });
    };
    obj.state.on('draw', e => {
        let {ctx, cx, cy} = e;
        let {vw, vh} = obj.state.last('resize');
        let bgPattern = ctx.createPattern(offCanvas, 'repeat');
        ctx.fillStyle = bgPattern;
        ctx.translate(-cx, -cy);
        ctx.fillRect(cx, cy, vw, vh);
        ctx.translate(cx, cy);
    });
    shim.syncOn(obj.state);
    shim.color = e => {
        shim.emit('color', e);
    };
    obj.state.on('color', shim.color);
    obj.state = shim;
    return obj;
};
