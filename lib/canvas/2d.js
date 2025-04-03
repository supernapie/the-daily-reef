import css from '../css.js';
css`body{margin:0;padding:0;overflow:hidden;}canvas{display:block;touch-action:none;user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;}`;

import events from '../events.js';

let canvas = events({}, ['color']);
let {on, emit, last} = canvas;

let el = document.createElement('canvas');
let ctx = el.getContext('2d');
document.body.appendChild(el);
el.addEventListener('touchstart', e => e.preventDefault());

on('resize', e => {
    let { vw, vh, vc } = e;
    el.width = vw * vc;
    el.height = vh * vc;
    el.style.width = vw + 'px';
    el.style.height = vh + 'px';
});
let windowResized = () => emit('resize', {
    vw: window.innerWidth,
    vh: window.innerHeight,
    vc: window.devicePixelRatio || 1
});
window.addEventListener('resize', windowResized);
windowResized();

on('color', e => {
    let {fill, stroke} = e;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
});
emit('color', { bg: 'black', fill: 'white', stroke: 'white' });

on('clear', () => {
    ctx.restore();
    ctx.save();

    let {
        vw = 320,
        vh = 320,
        vc: scale = 1
    } = last('resize');

    ctx.scale(scale, scale);

    let {
        bg = 'black',
        fill = 'white',
        stroke = 'white'
    } = last('color');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, vw, vh);

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
});

window.addEventListener('pointerup', e => {
    let { clientX: x, clientY: y } = e;
    emit('pointerup', {x, y});
});

window.addEventListener('pointerdown', e => {
    let { clientX: x, clientY: y } = e;
    emit('pointerdown', {x, y});
});

window.addEventListener('pointermove', e => {
    let { clientX: x, clientY: y } = e;
    emit('pointermove', {x, y});
});

let t = 0;
let dt = 17;
let onF = time => {
    dt = time - t;
    t = time;
    emit('step', {t, dt});
    emit('clear');
    emit('draw', {ctx});
    requestAnimationFrame(onF);
};
requestAnimationFrame(onF);

export default canvas;
