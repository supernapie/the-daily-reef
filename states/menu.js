import state from '../lib/statemachine/state.js';
import ft from '../lib/draw/text.js';
import createPlaybutton from '../sprites/playbutton.js';

let menu = state();

let playbutton = createPlaybutton({state: menu});

menu.on('start', () => {
    menu.emit('color', { stroke: 'Coral', fill: 'Coral', bg: 'Aqua' });
});

menu.on('draw', e => {
    playbutton.draw(e);
});

export default menu;
