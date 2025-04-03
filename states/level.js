import state from '../lib/statemachine/state.js';
import createSea from '../obj/sea.js';
import createMenubutton from '../obj/menubutton.js';

let level = state();
createSea({state: level});
createMenubutton({state: level});

export default level;
