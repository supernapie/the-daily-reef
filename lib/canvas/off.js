import state from '../statemachine/state.js';
export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        w: 40,
        h: 40,
        repetition: 'repeat', // repeat-x, repeat-y, no-repeat
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
        let {cam, ctx, cx, cy} = e;
        let {vw, vh} = obj.state.last('resize');
        let repeatX = obj.repetition === 'repeat-x' || obj.repetition === 'repeat';
        let repeatY = obj.repetition === 'repeat-y' || obj.repetition === 'repeat';
        let bgPattern = ctx.createPattern(offCanvas, obj.repetition);
        ctx.fillStyle = bgPattern;
        ctx.translate(-cx, -cy);
        let w = repeatX ? vw : obj.w;
        let h = repeatY ? vh : obj.h;
        let x = repeatX ? cx : obj.x;
        let y = repeatY ? cy : obj.y;
        ctx.fillRect(x, y, w, h);
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
