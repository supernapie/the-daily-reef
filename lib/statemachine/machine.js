import canvas from '../canvas/2d.js';
import createState from './state.js';

let states = {};

let add = (name, state) => {
    if (!name){
        return;
    }
    if (!state) {
        state = createState();
    }
    states[name] = state;
    if (Object.keys(states).length === 1) {
        start(name);
    }
    return states[name];
};

let start = (name) => {
    if (!name || !states[name]){
        return;
    }
    Object.values(states).forEach((s) => {
        if (s.active) {
            s.active = false;
            s.syncOff(canvas);
            canvas.syncOff(s);
        }
    });
    let n = states[name];
    n.syncOn(canvas);
    canvas.syncOn(n);
    n.active = true;
    n.resize(canvas.last('resize'));
    n.once('stop', start);
};

export default { add, start };
