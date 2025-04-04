import state from '../lib/statemachine/state.js';
import createPlaybutton from '../obj/playbutton.js';

let menu = state();
menu.on('start', () => {
    let playbutton = createPlaybutton({state: menu});
    menu.emit('color', { stroke: 'Coral', fill: 'Coral', bg: 'Aqua' });
});

export default menu;
