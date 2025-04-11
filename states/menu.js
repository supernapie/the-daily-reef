import state from '../lib/statemachine/state.js';
import createPlaybutton from '../obj/playbutton.js';
import createTitle from '../obj/title.js';

let menu = state();
menu.on('start', () => {
    menu.emit('color', { stroke: 'Coral', fill: 'Coral', bg: 'Aqua' });
    createTitle({state: menu});
    createPlaybutton({state: menu});
});

export default menu;
