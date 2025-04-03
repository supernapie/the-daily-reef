import state from '../lib/statemachine/state.js';
import createCam from '../lib/cam.js';
import createSea from '../obj/sea.js';
import createMenubutton from '../obj/menubutton.js';

let level = state();
createCam({state: level});
createSea({state: level});
createMenubutton({state: level});

export default level;
