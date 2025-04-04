import events from '../events.js';
const eventnames = [
    'start',
    'stop',
    'pointerup',
    'pointerdown',
    'pointermove',
    'resize',
    'step',
    'draw'
];
const volitilenames = [
    'stop',
    'pointerup',
    'pointerdown',
    'pointermove',
    'resize',
    'step',
    'draw'
];
export default () => {
    let active = false;
    let state = {
        get active() {
            return active;
        },
        set active(value) {
            active = value;
            if (active) {
                state.start();
            } else {
                state.stop();
                volitilenames.forEach((name) => {
                    state.off(name);
                });
            }
        }
    };
    events(state, eventnames);
    return state;
};
