export default (obj = {}) => {
    let defaults = {
        nCols: 10,
        nRows: 10,
        tileSize: 40,
        w: 400,
        h: 400,
        grid: []
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    obj.updateGridWH = () => {
        let {nCols, nRows, tileSize} = obj;
        let w = nCols * tileSize;
        let h = nRows * tileSize;
        obj.w = w;
        obj.h = h;
        return obj;
    };

    obj.resetGrid = () => {
        let {nCols, nRows, grid} = obj;
        grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));
        obj.grid = grid;
        return obj;
    };

    return obj.resetGrid().updateGridWH();
};
