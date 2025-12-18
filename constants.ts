
import { Side, TileState, Connection } from './types';

// Helper to create tile states
const createTile = (id: string, connections: Connection[]): TileState => ({
  id,
  connections
});

export const TILE_TYPES = {
  STRAIGHT_V: () => createTile('s-v', [[Side.TOP, Side.BOTTOM]]),
  STRAIGHT_H: () => createTile('s-h', [[Side.LEFT, Side.RIGHT]]),
  CURVE_TR: () => createTile('c-tr', [[Side.TOP, Side.RIGHT]]),
  CURVE_RB: () => createTile('c-rb', [[Side.RIGHT, Side.BOTTOM]]),
  CURVE_BL: () => createTile('c-bl', [[Side.BOTTOM, Side.LEFT]]),
  CURVE_LT: () => createTile('c-lt', [[Side.LEFT, Side.TOP]]),
  T_JUNCTION: () => createTile('t-j', [[Side.LEFT, Side.TOP], [Side.LEFT, Side.RIGHT]]),
  SPLIT_H: () => createTile('sp-h', [[Side.LEFT, Side.TOP], [Side.LEFT, Side.BOTTOM]]),
  CROSS: () => createTile('cr', [[Side.LEFT, Side.RIGHT], [Side.TOP, Side.BOTTOM]])
};
