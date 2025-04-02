import css from '../css.js';
css`body.p canvas{cursor:pointer;}`;

import events from '../events.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        w: 40,
        h: 40
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    let {on, off, once, emit, last} = events();
    obj.pointer = {
        on,
        off,
        once,
        emit,
        last,
        down: false,
        pointing: false,
        x: 0,
        y: 0
    };
    obj.state.on('pointerdown', e => {
        let { x, y } = e;
        if (x > obj.x &&
            x < obj.x + obj.w &&
            y > obj.y &&
            y < obj.y + obj.h
        ) {
            emit('pointerdown', {x, y});
            obj.pointer.down = true;
        }
    });
    obj.state.on('pointerup', e => {
        let { x, y } = e;
        if (x > obj.x &&
            x < obj.x + obj.w &&
            y > obj.y &&
            y < obj.y + obj.h
        ) {
            emit('pointerup', {x, y});
        }
        obj.pointer.down = false;
    });
    obj.state.on('pointermove', e => {
        let { x, y } = e;
        if (x > obj.x &&
            x < obj.x + obj.w &&
            y > obj.y &&
            y < obj.y + obj.h
        ) {
            if (!obj.pointer.pointing) {
                emit('startpointing', {x, y});
                document.body.classList.add('p');
            }
            emit('pointermove', {x, y});
            obj.pointer.pointing = true;
        } else {
            if (obj.pointer.pointing) {
                emit('stoppointing', {x, y});
                document.body.classList.remove('p');
            }
            obj.pointer.pointing = false;
        }
        obj.pointer.x = x;
        obj.pointer.y = y;
    });
    obj.state.on('stop', e => {
        obj.pointer.down = false;
        if (obj.pointer.pointing) {
            emit('stoppointing', {x: obj.pointer.x, y: obj.pointer.y});
            document.body.classList.remove('p');
        }
        obj.pointer.pointing = false;
    });
    return obj;
};
