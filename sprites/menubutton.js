import path from '../lib/draw/path.js';
import pointarea from '../lib/pointer/rect.js';

let d = 'M20 0C8.955 0 0 8.955 0 20s8.955 20 20 20 20-8.955 20-20S31.045 0 20 0Zm0 36.364C10.96 36.364 3.636 29.04 3.636 20 3.636 10.96 10.96 3.636 20 3.636c9.04 0 16.364 7.324 16.364 16.364 0 9.04-7.324 16.364-16.364 16.364zm-7.273-3.898 13.574-8.96.972-16.233-13.574 8.96ZM20 16.364A3.64 3.64 0 0 1 23.636 20 3.64 3.64 0 0 1 20 23.636 3.64 3.64 0 0 1 16.364 20 3.64 3.64 0 0 1 20 16.364z';

let margin = 8;

export default (options = {}) => {
    let defaults = {
        paths: [d],
        x: 0,
        y: 0,
        w: 40,
        h: 40,
        a: 0,
        fills: ['black']
    };
    Object.assign(defaults, options);
    Object.assign(options, defaults);
    let btn = path(options);
    pointarea(btn);
    let resize = e => {
        let {vw, vh} = e;
        btn.x = vw - btn.w - margin;
        btn.y = margin;
    };
    btn.state.on('resize', resize);
    btn.state.on('start', e => {
        let {vw, vh} = btn.state.last('resize');
        resize({vw, vh});
    });
    btn.pointer.on('pointerup', () => {
        btn.state.stop('menu');
    });
    return btn;
};
