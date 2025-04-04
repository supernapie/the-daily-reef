import offCanvas from '../lib/canvas/off.js';
import data from '../lib/data/kv.js';
import createBoat from '../obj/boat.js';
import mulberry from '../lib/math/mulberry.js';

export default (obj = {}) => {

    offCanvas(obj);

    // a grid
    let nRows = 14;
    let nCols = 14;
    let grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));

    let boats = [];

    let {vw, vh} = obj.state.last('resize');

    nRows = 14;
    nCols = 14;

    // Number of days since 2025-01-01
    let day = Math.floor((Date.now() - new Date('2025-01-01').getMilliseconds()) / 86400000);
    let getRandom = mulberry(day);

    // Reset all to 0
    grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));

    // Add one number 13 to the grid in a random position
    let position = {
        x: Math.floor(getRandom() * nCols),
        y: Math.floor(getRandom() * nRows)
    };
    grid[position.y][position.x] = 13;

    // Around this position, create polyomino of 13 (tridecomino)
    let directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: -1, dy: 0},
        {dx: 0, dy: -1}
    ];
    let nMino = 1;
    let nMinoMax = 13;
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
            grid[newPosition.y][newPosition.x] = nMinoMax;
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

    // Place a 1 where the remaining empty row and column intersect
    // This is the starting point for the player
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

    // Add the start to the grid
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
    directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1}
    ];
    direction = directions[0];
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

    obj.state.emit('color', {'c0': 'Aqua', 'c1': 'Aqua', 'c2': 'SandyBrown', 'c3': 'Aqua', 'c13': 'Aqua', 'c14': 'Aqua'});

    // offCanvas size
    obj.w = 40 * nCols;
    obj.h = 40 * nRows;

    obj.state.on('draw', e => {
        let {ctx} = e;

        for (let y = 0; y < nRows; y++) {
            for (let x = 0; x < nCols; x++) {
                ctx.fillStyle = obj.state.last('color')[`c${grid[y][x]}`];
                ctx.fillRect(x * 40, y * 40, 40, 40);
            }
        }
    });

    // on each 0 add a boat
    let angles = [0, 90, 180, 270];
    boats = [];
    for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
            if (grid[y][x] === 0) {
                let angle = angles[Math.floor(getRandom() * angles.length)];
                let boat = createBoat({
                    state: obj.state,
                    x: x * 40,
                    y: y * 40,
                    a: angle,
                    gx: x,
                    gy: y
                });
                boats.push(boat);
                grid[y][x] = 1;
            }
        }
    }
    // Boats can only move backwards or forwards in the direction (angle or a) they are pointing
    // they cannot move where there is another boat or a 2 in the grid
    // they can wrap around the grid
    // When they are on a 0 they are color Seashell, on a 13 they are color Coral
    // The player will be able to move a boat with one cell by tapping on it
    // When a boat is stuck, it will not move, but it will rotate 180 degrees by the tap of the player
    // When all boats are on a 0, the player wins

    // a zero with a boat on becomes a 1, color Seashell
    // a 13 with a boat on becomes a 14, color Coral

    // Now move the boats a bit before starting
    boats.forEach(boat => boat.move(grid));

    let clickGrid = e => {
        let {cam, cx: tx, cy: ty} = e;
        while (tx < 0) {
            tx += 40 * nCols;
        }
        while (ty < 0) {
            ty += 40 * nRows;
        }
        let gx = Math.floor(tx / 40) % nCols;
        let gy = Math.floor(ty / 40) % nRows;
        if (gx < 0 || gx >= nCols || gy < 0 || gy >= nRows) {
            return;
        }
        let value = grid[gy][gx];
        if (value === 1 || value === 14) {
            // find boat and move it
            let boat = boats.find(b => b.gx === gx && b.gy === gy);
            if (boat) {
                let {dx, dy} = boat.move(grid);
                cam.target.x += dx * 40;
                cam.target.y += dy * 40;
            }
        }
        if (value === 14) {
            // check if there are no boats left on the coral reef
            // if so, the player wins
            if (grid.flat().includes(14)) {
                return;
            }
            obj.state.off('pointerup', clickGrid);
            // show solution
            obj.state.emit('color', {'c0': 'Aqua', 'c1': 'Aqua', 'c2': 'SandyBrown', 'c3': 'Aqua', 'c13': 'Coral', 'c14': 'Coral'});
            let achievements = data.getItem('achievements') || [];
            achievements.push(day);
            data.setItem('achievements', achievements);
        }
    };
    obj.state.on('pointerup', clickGrid);
};
