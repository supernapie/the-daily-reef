import currentDay from '../lib/time/day.js';
import mulberry from '../lib/math/mulberry.js';
import createPolyomino from '../lib/math/polyomino.js';
import drawGrid from '../lib/draw/grid.js';

export default (obj = {}) => {

    let day = currentDay();
    let getRandom = mulberry(day);

    // a grid
    obj.nMinos = 13; // a tridecomino
    obj.tileSize = 40;
    obj.getRandom = getRandom;
    let {nRows, nCols, grid} = createPolyomino(obj);

    // Add a row of 0s to the top of the grid
    grid.unshift(Array(nCols).fill(0));
    // Add a column of 0s to the left of the grid
    grid = grid.map(row => [0].concat(row));

    // Add the start to the grid
    let start = {x: 0, y: 0};
    grid[start.y][start.x] = 1;

    // Add a row of 0s to the bottom of the grid
    grid.push(Array(nCols).fill(0));
    nRows = grid.length;
    // Add a column of 0s to the right of the grid
    grid = grid.map(row => row.concat(0));
    nCols = grid[0].length;

    let target = {x: nCols - 1, y: nRows - 1};
    grid[target.y][target.x] = 3;

    // Move the start and target diagonally closer to each other
    // Until they are adjecent to a 13
    let directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1}
    ];
    let direction = directions[0];
    grid[start.y][start.x] = 0;
    while (grid[start.y + direction.dy][start.x + direction.dx] !== 13) {
        start.x += direction.dx;
        start.y += direction.dy;
        direction = directions[1 - directions.indexOf(direction)];
    }
    grid[start.y][start.x] = 1;
    directions = [
        {dx: -1, dy: 0},
        {dx: 0, dy: -1}
    ];
    direction = directions[0];
    grid[target.y][target.x] = 0;
    while (grid[target.y + direction.dy][target.x + direction.dx] !== 13) {
        target.x += direction.dx;
        target.y += direction.dy;
        direction = directions[1 - directions.indexOf(direction)];
    }
    grid[target.y][target.x] = 3;

    // Replace with 2s all 0s surrounded by 0s and/or 2s
    // Wrapping around the grid is considered 
    // Diagonal cells are considered
    //grid[start.y][start.x] = 0; // No pool
    //grid[target.y][target.x] = 0; // No pool
    for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
            if (grid[y][x] === 0) {
                let isSurrounded = true;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let neighbour = grid[(y + dy + nRows) % nRows][(x + dx + nCols) % nCols];
                        if (neighbour !== 0 && neighbour !== 2) {
                            isSurrounded = false;
                        }
                    }
                }
                if (isSurrounded) {
                    grid[y][x] = 2;
                }
            }
        }
    }

    // We will not use a start and target,
    // instead they became pools
    grid[start.y][start.x] = 0;
    grid[target.y][target.x] = 0;

    obj.grid = grid;
    obj.nRows = nRows;
    obj.nCols = nCols;
    obj.updateGridWH();

    drawGrid(obj);
    obj.fills = new Array(15).fill('Aqua');
    obj.fills[2] = 'SandyBrown';

    return obj;
};
