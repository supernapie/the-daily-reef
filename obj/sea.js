import offCanvas from '../lib/canvas/off.js';
import createFleet from './fleet.js';
import createSeabed from './seabed.js';

export default (obj = {}) => {

    offCanvas(obj);
    //obj.repetition = 'no-repeat';

    createSeabed(obj);
    createFleet(obj);

    return obj;
};
