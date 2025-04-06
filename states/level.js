import state from '../lib/statemachine/state.js';
import createCam from '../lib/cam.js';
import createSea from '../obj/sea.js';
import createMenubutton from '../obj/menubutton.js';

let level = state();
level.on('start', () => {
    let cam = createCam({state: level});
    let sea = createSea({state: level});
    cam.x = cam.target.x = sea.w / 2;
    cam.y = cam.target.y = sea.h / 2;
    createMenubutton({state: level});
});

export default level;
