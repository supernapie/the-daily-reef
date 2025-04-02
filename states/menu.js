import state from '../lib/statemachine/state.js';
import ft from '../lib/draw/text.js';
import createBoat from '../sprites/boat.js';
import tappable from '../lib/pointer/rect.js';

let menu = state();

let boat = createBoat({state: menu});
tappable(boat);

menu.on('start', () => {
    menu.emit('color', { stroke: 'Coral', fill: 'Coral', bg: 'white' });
    boat.pointer.once('pointerup', () => {
        menu.stop('level');
    });
});

let intro = `The many tourist boats are damaging
the reef. It is your job to chase
them away by gently tapping on them.

Boats can only move back and forth.
Red boats are above the reef.
White boats are not above the reef.

If there are no red boats left,
the reef is safe.

Good luck!

Tap on the boat to start...`;

let menuText = ft({text: intro});
menu.on('draw', e => {
    menuText.draw(e);
    boat.x = menuText.x;
    boat.y = menuText.h + 40;
    boat.draw(e);
});

export default menu;
