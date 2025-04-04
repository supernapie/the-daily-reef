let data = {};
let lsKey = document.title + '_kv-data_';
lsKey = lsKey.replace(/[^a-zA-Z0-9]/g, '-');

let getItem = k => {
    if (data[k] === undefined) {
        let lsData = localStorage.getItem(lsKey + k);
        if (lsData !== null) {
            data[k] = lsData;
            return JSON.parse(lsData);
        }
    }
    return data[k];
};

let setItem = (k, v) => {
    let lsData = JSON.stringify(v);
    if (data[k] !== lsData) {
        data[k] = lsData;
        localStorage.setItem(lsKey + k, lsData);
    }
};

export default Object.freeze({
    getItem,
    setItem
});
