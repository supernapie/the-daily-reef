import machine from './lib/statemachine/machine.js';

import menu from './states/menu.js';
import level from './states/level.js';

machine.add('menu', menu);
machine.add('level', level);

export default machine;
