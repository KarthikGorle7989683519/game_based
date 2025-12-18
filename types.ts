
export type Operator = '+' | '-' | '*' | '/' | '%';

export type GameMode = 'smallest' | 'ascending' | 'descending' | 'largest';

export interface Equation {
  id: string;
  text: string;
  value: number;
  color: string;
}

export interface GameState {
  currentLevel: number;
  score: number;
  timeLeft: number;
  status: 'playing' | 'won' | 'lost' | 'idle';
  equations: Equation[];
  clickedIds: string[]; // Track which balloons are clicked in ordering modes
}

export enum Side {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3
}

export type Connection = [Side, Side];

export interface TileState {
  id: string;
  connections: Connection[];
}

export interface Point {
  row: number;
  col: number;
  side: Side;
}

export interface Level {
  id: number;
  name: string;
  gridSize: number;
  start: Point;
  end: Point;
  initialTiles: TileState[][];
}
