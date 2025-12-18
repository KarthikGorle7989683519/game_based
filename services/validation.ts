
import { TileState, Point, Side } from '../types';

export interface ValidationResult {
  isValid: boolean;
  reachableNodes: Set<number>; // Global node IDs that are reachable from source
}

export function validatePuzzle(gridSize: number, grid: TileState[][], start: Point, end: Point): ValidationResult {
  const rows = gridSize;
  const cols = gridSize;

  const nodeCount = 2 + rows * cols * 4;
  const SOURCE = 0;
  const SINK = 1;

  const getNode = (r: number, c: number, side: Side) => 2 + (r * cols + c) * 4 + side;

  const adj: number[][] = Array.from({ length: nodeCount }, () => []);

  // 1. Internal tile connections
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = grid[r][c];
      for (const [from, to] of tile.connections) {
        adj[getNode(r, c, from)].push(getNode(r, c, to));
      }
    }
  }

  // 2. Inter-cell connections
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isOutput = (rr: number, cc: number, side: Side) => 
        grid[rr][cc].connections.some(conn => conn[1] === side);
      
      const isInput = (rr: number, cc: number, side: Side) => 
        grid[rr][cc].connections.some(conn => conn[0] === side);

      // Connect adjacent nodes if flow is possible (Output of A -> Input of B)
      if (c + 1 < cols && isOutput(r, c, Side.RIGHT) && isInput(r, c + 1, Side.LEFT)) {
        adj[getNode(r, c, Side.RIGHT)].push(getNode(r, c + 1, Side.LEFT));
      }
      if (c - 1 >= 0 && isOutput(r, c, Side.LEFT) && isInput(r, c - 1, Side.RIGHT)) {
        adj[getNode(r, c, Side.LEFT)].push(getNode(r, c - 1, Side.RIGHT));
      }
      if (r + 1 < rows && isOutput(r, c, Side.BOTTOM) && isInput(r + 1, c, Side.TOP)) {
        adj[getNode(r, c, Side.BOTTOM)].push(getNode(r + 1, c, Side.TOP));
      }
      if (r - 1 >= 0 && isOutput(r, c, Side.TOP) && isInput(r - 1, c, Side.BOTTOM)) {
        adj[getNode(r, c, Side.TOP)].push(getNode(r - 1, c, Side.BOTTOM));
      }
    }
  }

  // 3. Source connection
  const hasStartInput = grid[start.row][start.col].connections.some(conn => conn[0] === start.side);
  if (hasStartInput) {
    adj[SOURCE].push(getNode(start.row, start.col, start.side));
  }

  // 4. Sink connection
  const hasEndOutput = grid[end.row][end.col].connections.some(conn => conn[1] === end.side);
  if (hasEndOutput) {
    adj[getNode(end.row, end.col, end.side)].push(SINK);
  }

  // 5. BFS for reachability
  const visited = new Set<number>();
  const queue = [SOURCE];
  visited.add(SOURCE);

  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }

  return {
    isValid: visited.has(SINK),
    reachableNodes: visited
  };
}
