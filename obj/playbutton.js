import data from '../lib/data/kv.js';
import currentDay from '../lib/time/day.js';
import text from '../lib/draw/text.js';
import path from '../lib/draw/path.js';
import pointarea from '../lib/pointer/rect.js';

let r = 'M 0 0 L 208 0 L 208 156 L 0 156 Z';

export default (obj = {}) => {
    let defaults = {
        paths: [{d: r, fill: '#074F57'}],
        x: 0,
        y: 0,
        w: 208,
        h: 156,
        a: 0
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
    let txt = text({state: obj.state, fill: '#074F57', text: 'Play'});
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
        txt.y = obj.y + obj.h + 28;
    });
    if (!done) {
        obj.pointer.on('pointerup', () => {
            obj.state.stop('level');
        });
    }
    return obj;
};
