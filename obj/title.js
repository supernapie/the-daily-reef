import text from '../lib/draw/text.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        font: '34px serif',
        fill: '#074F57',
        text: 'The Daily Reef'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    obj.state.on('draw', e => {
        let {vw, vh} = obj.state.last('resize');
        let {ctx} = e;
        ctx.fillStyle = "#FEF9FF";
        ctx.fillRect(vw / 2 - 120, vh / 2 - 160, 240, 320);
    });

    text(obj);

    obj.state.on('step', e => {
        let {vw, vh} = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 - obj.h / 2 - 128;
    });

    return obj;
};
