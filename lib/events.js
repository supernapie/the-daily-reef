export default (src = {}, eTypes = []) => {

    let listeners = {};

    src.on = (type, callback) => {
        if (!listeners[type]) {
            listeners[type] = [];
        }
        listeners[type].push(callback);
    };

    src.off = (type, callback) => {
        if (!type && !callback) {
            listeners = {};
            return;
        }
        if (type && !callback) {
            listeners[type] = [];
            return;
        }
        if (!type && callback) {
            for (let t in listeners) {
                listeners[t] = listeners[t].filter(listener => listener !== callback);
            }
            return;
        }
        if (listeners[type]) {
            listeners[type] = listeners[type].filter(listener => listener !== callback);
        }
    };

    src.once = (type, callback) => {
        let disposableCallback = e => {
            callback(e);
            src.off(type, disposableCallback);
        };
        src.on(type, disposableCallback);
    };

    let lastEmission = {};

    src.emit = (type, e = {}) => {
        if (lastEmission[type] && typeof lastEmission[type] === 'object') {
                Object.assign(lastEmission[type], e);
        } else {
            lastEmission[type] = e;
        }
        if (listeners[type]) {
            listeners[type].forEach(listener => listener(e));
        }
    };

    src.last = (type) => {
        if (!lastEmission[type]) {
            return {};
        }
        return lastEmission[type];
    };

    eTypes.forEach(eType => {
        src[eType] = e => {
            src.emit(eType, e);
        };
    });

    src.syncOn = other => {
        eTypes.forEach(
            eType => other.on(eType, src[eType])
        );
    };

    src.syncOff = other => eTypes.forEach(
        eType => other.off(eType, src[eType])
    );

    return src;
};
