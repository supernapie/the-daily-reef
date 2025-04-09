export default (obj = {}) => {
    let defaults = {
        grid: [],
        minustile: 0
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    let { grid, minustile } = obj;
    obj.grid = grid.map((row, y) => {
        return row.map((tile, x) => {
            if (tile === minustile) {
                return -1;
            }
            let weight = 0;
            if (y !== 0 && [-1, minustile].indexOf(grid[y - 1][x]) === -1) {
                weight += 1;
            }
            if (x !== (row.length - 1) && [-1, minustile].indexOf(grid[y][x + 1]) === -1) {
                weight += 2;
            }
            if (y !== (grid.length - 1) && [-1, minustile].indexOf(grid[y + 1][x]) === -1) {
                weight += 4;
            }
            if (x !== 0 && [-1, minustile].indexOf(grid[y][x - 1]) === -1) {
                weight += 8;
            }
            return weight;
        });
    });

    return obj;
};
