import data from '../lib/data/kv.js';
import currentDay from '../lib/time/day.js';
import text from '../lib/draw/text.js';
import path from '../lib/draw/path.js';
import pointarea from '../lib/pointer/rect.js';

let r = 'M 0 0 L 256 0 L 256 128 L 0 128 Z';
let t = 'M 64 32 L 192 64 L 64 96 Z';

export default (obj = {}) => {
    let defaults = {
        paths: [r],
        x: 0,
        y: 0,
        w: 256,
        h: 128,
        a: 0,
        fills: ['black']
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    path(obj);
    pointarea(obj);
    let day = currentDay();
    let achievements = data.getItem('achievements') || [];
    let done = true;
    if (achievements.indexOf(day) === -1) {
        done = false;
    }
    let txt = text({state: obj.state, fill: 'white', text: 'Play'});
    obj.state.on('resize', e => {
        let {vw, vh} = e;
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 - obj.h / 2;
    });
    obj.state.on('step', e => {
        if (done) {
            // hours until midnight (padded to 2 digits)
            let hours = String(23 - new Date().getHours()).padStart(2, '0');
            let minutes = String(59 - new Date().getMinutes()).padStart(2, '0');
            let seconds = String(59 - new Date().getSeconds()).padStart(2, '0');
            let time = `${hours}:${minutes}:${seconds}`;
            let newDay = currentDay();
            txt.text = time;
            if (newDay !== day) {
                obj.state.stop('level');
            }
        }
        txt.x = obj.x + obj.w / 2 - txt.w / 2;
        txt.y = obj.y + obj.h / 2 - txt.h / 2;
    });
    if (!done) {
        obj.pointer.on('pointerdown', () => {
            obj.fills = ['white'];
        });
        obj.pointer.on('pointerup', () => {
            obj.fills = ['black'];
            obj.state.stop('level');
        });
    }
    return obj;
};
