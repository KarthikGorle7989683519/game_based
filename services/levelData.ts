
import { Level, Side } from '../types';
import { TILE_TYPES } from '../constants';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "System Boot",
    gridSize: 3,
    start: { row: 1, col: 0, side: Side.LEFT },
    end: { row: 1, col: 2, side: Side.RIGHT },
    initialTiles: [
      [TILE_TYPES.STRAIGHT_H(), TILE_TYPES.CURVE_RB(), TILE_TYPES.STRAIGHT_H()],
      [TILE_TYPES.CURVE_TR(), TILE_TYPES.STRAIGHT_H(), TILE_TYPES.CURVE_BL()],
      [TILE_TYPES.STRAIGHT_V(), TILE_TYPES.CURVE_LT(), TILE_TYPES.STRAIGHT_H()]
    ]
  },
  {
    id: 2,
    name: "Data Flow",
    gridSize: 4,
    start: { row: 1, col: 0, side: Side.LEFT },
    end: { row: 2, col: 3, side: Side.RIGHT },
    initialTiles: [
      [TILE_TYPES.CURVE_RB(), TILE_TYPES.STRAIGHT_H(), TILE_TYPES.STRAIGHT_H(), TILE_TYPES.CURVE_BL()],
      [TILE_TYPES.STRAIGHT_H(), TILE_TYPES.CURVE_TR(), TILE_TYPES.T_JUNCTION(), TILE_TYPES.STRAIGHT_V()],
      [TILE_TYPES.CURVE_TR(), TILE_TYPES.STRAIGHT_H(), TILE_TYPES.STRAIGHT_H(), TILE_TYPES.CURVE_BL()],
      [TILE_TYPES.STRAIGHT_V(), TILE_TYPES.CURVE_LT(), TILE_TYPES.STRAIGHT_H(), TILE_TYPES.STRAIGHT_V()]
    ]
  },
  {
    id: 3,
    name: "Mainframe Link",
    gridSize: 5,
    start: { row: 2, col: 0, side: Side.LEFT },
    end: { row: 2, col: 4, side: Side.RIGHT },
    initialTiles: Array.from({ length: 5 }, () => 
      Array.from({ length: 5 }, () => TILE_TYPES.CROSS())
    )
  }
];
