import createGrid from './grid.js';

export default (obj = {}) => {
    let defaults = {
        getRandom: () => Math.random(),
        nMinos: 13 // number of minos (tridecomino)
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    let {getRandom, nMinos} = obj;

    // a grid
    obj.nCols = nMinos + 1;
    obj.nRows = nMinos + 1;
    let {nRows, nCols, grid} = createGrid(obj);

    // Add one number to the grid in a random position
    let position = {
        x: Math.floor(getRandom() * nCols),
        y: Math.floor(getRandom() * nRows)
    };
    grid[position.y][position.x] = 1;

    // Around this position, create polyomino
    let directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: -1, dy: 0},
        {dx: 0, dy: -1}
    ];
    let nMino = 1;
    let nMinoMax = nMinos;
    let direction = directions[Math.floor(getRandom() * directions.length)];
    while (nMino < nMinoMax) {
        let newPosition = {
            x: position.x + direction.dx,
            y: position.y + direction.dy
        };
        if (newPosition.x < 0) {
            newPosition.x += nCols;
        }
        if (newPosition.x >= nCols) {
            newPosition.x -= nCols;
        }
        if (newPosition.y < 0) {
            newPosition.y += nRows;
        }
        if (newPosition.y >= nRows) {
            newPosition.y -= nRows;
        }
        if (grid[newPosition.y][newPosition.x] === 0) {
            grid[newPosition.y][newPosition.x] = 1;
            // to prevent being closed in by the polyomino
            // only change direction if there is a free cell
            // To ponder about: does this create all possible polyominos?
            direction = directions[Math.floor(getRandom() * directions.length)];
            nMino++;
        }
        position = newPosition;
    }

    // remove all rows and columns that are empty, and have adjacent empty rows or columns
    // remove rows
    grid = grid.filter((row, y) => row.some((valueA) => {
        return valueA !== 0 || grid[(y + 1) % nRows].some((valueB) => valueB !== 0);
    }));
    // remove columns
    let emptyCols = Array(nCols).fill(0);
    emptyCols = emptyCols.map((value, x) => grid.every(row => row[x] === 0));
    grid = grid.map((row) => row.filter((value, x) => {
        return value !== 0 || !emptyCols[x] || !emptyCols[(x + 1) % nCols];
    }));

    // update nRows and nCols
    nRows = grid.length;
    nCols = grid[0].length;

    // Get positions where the remaining empty row and column intersect
    let emptyRow = grid.findIndex(row => row.every(value => value === 0));
    let emptyCol = grid[0].findIndex((value, x) => grid.every(row => row[x] === 0));
    let start = {x: emptyCol, y: emptyRow};

    // Switch rows and columns to make the start point the top left corner
    while (start.y > 0) {
        grid.push(grid.shift());
        start.y--;
    }
    while (start.x > 0) {
        grid.forEach(row => row.push(row.shift()));
        start.x--;
    }

    // finally remove first row and column
    grid.shift();
    grid.forEach(row => row.shift());

    // update nRows and nCols
    nRows = grid.length;
    nCols = grid[0].length;

    obj.grid = grid;
    obj.nRows = nRows;
    obj.nCols = nCols;
    obj.updateGridWH();

    return obj;
};
