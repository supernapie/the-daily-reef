import data from '../lib/data/kv.js';
import currentDay from '../lib/time/day.js';
import mulberry from '../lib/math/mulberry.js';
import gridPointer from '../lib/pointer/grid.js';
import createBoat from './boat.js';

export default (obj = {}) => {

    let day = currentDay();
    let getRandom = mulberry(day);

    // on each 0 add a boat
    let angles = [0, 90, 180, 270];
    let boats = [];
    let {nRows, nCols, grid, tileSize} = obj;
    for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
            if (grid[y][x] === 0) {
                let angle = angles[Math.floor(getRandom() * angles.length)];
                let boat = createBoat({
                    state: obj.state,
                    x: x * tileSize,
                    y: y * tileSize,
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

    gridPointer(obj);
    let clickGrid = e => {
        let {value, x, y, cam} = e;
        let {tileSize, grid} = obj;

        if (value === 1 || value === 14) {
            // find boat and move it
            let boat = boats.find(b => b.gx === x && b.gy === y);
            if (boat) {
                let {dx, dy} = boat.move(grid);
                cam.target.x += dx * tileSize;
                cam.target.y += dy * tileSize;
            }
        }
        if (value === 14) {
            // check if there are no boats left on the coral reef
            // if so, the player wins
            if (grid.flat().includes(14)) {
                return;
            }
            obj.pointer.off('pointerup', clickGrid);
            // show solution
            obj.solution.show();
            // center grid
            //cam.target.x = obj.w / 2;
            //cam.target.y = obj.h / 2;
            let achievements = data.getItem('achievements') || [];
            achievements.push(day);
            data.setItem('achievements', achievements);
        }
    };
    obj.pointer.on('pointerup', clickGrid);

    return obj;
};
