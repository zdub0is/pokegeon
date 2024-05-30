/**
 * This Util determines which background to render based on the surrounding tile assuming a normal tile set.
 *
 */

import { Tile } from "dungeon-mystery";

// Define the tile types
const WALL_TILE = 0;
const FLOOR_TILE = 1;
const SECONDARY_TERRAIN_TILE = 2;

// Tile maps contains an array of if the tile is the same as the surrounding tiles

// order isN, NE, E, SE, S, SW, W, NW,
const tileMapOld = {
  0: [false, false, false, true, true, true, false, false],
  1: [false, false, false, true, true, true, true, true],
  2: [false, false, false, false, false, true, true, true],
  3: [false, false, false, true, false, true, false, false],
  4: [false, false, false, true, false, false, false, true],
  5: [false, false, false, false, false, true, false, true],
  18: [false, true, true, true, true, true, false, false],
  19: [true, true, true, true, true, true, true, true],
  20: [true, true, false, false, false, true, true, true],
  21: [false, true, false, false, false, true, false, false],
  22: [false, false, false, false, false, false, false, false],
  23: [false, true, false, false, false, false, false, true],
  36: [true, true, false, true, false, true, true, true],
  37: [false, true, true, true, true, true, true, false],
  38: [false, false, false, true, true, false, true, false],
  39: [false, false, false, true, false, false, false, false],
  40: [false, true, false, true, false, true, false, true],
  41: [false, false, false, false, false, false, false, true],
  54: [false, true, false, true, true, true, true, true],
  55: [true, true, true, true, false, true, false, true],
  56: [false, true, false, true, false, false, false, true],
  57: [false, true, false, true, false, true, false, false],
  58: [false, true, false, false, false, false, false, false],
  59: [false, true, false, false, false, true, false, true],
  72: [true, true, true, true, false, true, true, true],
  73: [true, true, true, true, true, true, false, true],
  74: [false, true, true, true, false, true, false, false],
  75: [true, true, false, false, false, true, false, true],
  76: [false, false, false, true, false, true, true, true],
  77: [false, false, false, true, true, true, false, true],
  90: [true, true, false, true, true, true, true, true],
  91: [false, true, true, true, true, true, true, true],
  92: [false, true, false, true, true, true, false, false],
  93: [false, true, false, false, false, true, true, true],
  94: [true, true, false, true, false, false, false, true],
  95: [false, true, true, true, false, false, false, true],
  108: [false, true, false, true, true, true, false, true],
  109: [false, true, false, true, false, true, true, true],
  110: [false, true, true, true, false, true, false, true],
  111: [true, true, false, true, false, true, false, true],
  112: [false, true, true, true, false, true, true, true],
  113: [true, true, false, true, true, true, false, true],
};

const tileMap = {
  "00111000": 0,
  "00111110": 1,
  "00001110": 2,
  "00101000": 3,
  "00100010": 4,
  "00001010": 5,
  "11111000": 18,
  "11111111": 19,
  "10001111": 20,
  "11001111": 20,
  
  "10011111": 20,
  "10001000": 21,
  "00000000": 22,
  "10000010": 23,
  "11100000": 36,
  "11100011": 37,
  "10000011": 38,
  "10100000": 39,
  "00001000": 40,
  // '00000010':41,
  "11111010": 54,
  "00010101": 55,
  "00101010": 56,
  "10101010": 57,
  "00000010": 58,
  "10111110": 59,
  "11101001": 72,
  "10100010": 73,
  "10101000": 74,
  "10000000": 75,
  "10001010": 76,
  "11101111": 77,
  "11111011": 90,
  "11101000": 91,
  "10001011": 92,
  "00101110": 93, // not sure about 93 and 94
  "00111001": 94,
  "10111111": 95,
  "11111110": 108,
  "10111000": 109,
  "10001110": 110,
  "10100011": 111,
  "11100010": 112,
  "10111010": 113,
  "10101110": 126,
  "11101010": 127,
  "10101001": 128,
  "11001110": 129,
  "10111011": 130,
  // '10111011':131,

  // extra cases
  "11100111": 37,
  "00111111": 1,
  "11110011": 37,
  "11011111": 20,
  "11000111": 38,
  "11110111": 37,
  "01111000": 0,
  "01111110": 1,
  '10000111': 38,
  '11011001': 4,
  '11001101': 4,
  '01100010': 4,
  '00100011': 4,
  '00110111': 21,
  '10011100': 21,
  "00100000": 56,
  '00001111': 2,
  '10101111':41,
  '00100111': 4,
  '00101111': 93,
  '11001000': 21,
  '11111001': 18,
  '00110010': 4,
  '10001100': 21,
  '11111100': 18,
  '00011000': 40,
  '11000000': 75,
  '11100001': 36,
  '10011011': 92,
  '10100001': 39,
  '10011000': 75,
  '11101011': 55,
  '00011110': 2,
  '10000001': 73,
  '01111111': 1,
  '01100000': 56,
  '11110100': 39,
  '10111001': 109,
  '11000011': 38,
  '00110011': 4,
  '10001001': 21,
  '00100110': 4,
  '11110000': 36,
  '00001100': 40,
  '00001101': 40,
  '01100011': 4,
  '10100111': 111,
  '00011111': 2,
  '10010001': 75,
  '10011110': 110,
  '00000110': 58,
  '01111010': 94,
  '11001011': 93,
  '10001101': 21,
  '01100110': 4,
  '11001001': 21,

  


};
// Function to generate the bitmask for a given tile
function getArr(grid, x, y) {
  let resultString = "";
  const directions = [
    { dx: -1, dy: 0 }, // N
    { dx: -1, dy: 1 }, // NE
    { dx: 0, dy: 1 }, // E
    { dx: 1, dy: 1 }, // SE
    { dx: 1, dy: 0 }, // S
    { dx: 1, dy: -1 }, // SW
    { dx: 0, dy: -1 }, // W
    { dx: -1, dy: -1 }, // NW
  ];
  const testArr = [];
  directions.forEach((dir, index) => {
    const nx = x + dir.dx;
    const ny = y + dir.dy;
    testArr.push({
      dir,
      index,
      nx,
      ny,
      grid:
        grid[ny] && grid[ny][nx] ? grid[ny][nx].terrain_flags.terrain_type : -1,
      x: x,
      y: y,
      current: grid[y][x].terrain_flags.terrain_type,
    });
    // if out of bounds, assume wall
    if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[ny].length) {
      resultString += "1";
      return;
    } else {
      // check if terrain type is the same as current tile
      resultString +=
        grid[y][x].terrain_flags.terrain_type ===
        grid[ny][nx].terrain_flags.terrain_type
          ? "1"
          : "0";
    }
  });
  if (tileMap[resultString] === undefined) {
    // console.log(resultString, testArr);
  }
  return resultString;
}

// Function to get the tile index from the bitmask
function getTileIndex(grid, x, y) {
  const result = getArr(grid, x, y);
  // console.log(result);
  return tileMap[result];
}

// Example grid and rendering function

export function renderGrid(grid) {
  console.log(grid);
  const gridResult = [];
  const gridData = [];
  console.log(grid.length, grid[0].length);
  for (let y = 0; y < grid.length; y++) {
    let row = [];
    let rowDat = [];
    for (let x = 0; x < grid[y].length; x++) {
      const tileIndex = getTileIndex(grid, x, y);
      rowDat.push(getArr(grid, x, y));
      row.push(parseInt(tileIndex) || 0);
      !parseInt(tileIndex) && parseInt(tileIndex) != 0 && console.log(x, y, getArr(grid, x, y), tileIndex);
    }
    gridResult.push(row);
    gridData.push(rowDat);
  }
  console.table(gridData);
  return gridResult;
}
