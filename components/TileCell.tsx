
import React from 'react';
import { TileState, Side } from '../types';

interface TileCellProps {
  tile: TileState;
  isSelected: boolean;
  reachableNodes: Set<number>;
  row: number;
  col: number;
  gridCols: number;
  onClick: () => void;
}

const TileCell: React.FC<TileCellProps> = ({ tile, isSelected, reachableNodes, row, col, gridCols, onClick }) => {
  const laneWidth = 34;
  const halfLane = laneWidth / 2;

  const getNode = (r: number, c: number, side: Side) => 2 + (r * gridCols + c) * 4 + side;

  const renderConnection = (from: Side, to: Side, index: number) => {
    // A connection is active if the entry node of this internal connection is reachable
    const isActive = reachableNodes.has(getNode(row, col, from));
    
    const isOpposite = Math.abs(from - to) === 2;
    const pathColor = isActive ? "#3b82f6" : "white";
    const arrowColor = isActive ? "white" : "#3b82f6";

    let laneElement;
    if (isOpposite) {
      const isVertical = from === Side.TOP || from === Side.BOTTOM;
      laneElement = isVertical ? (
        <rect x={50 - halfLane} y={0} width={laneWidth} height={100} fill={pathColor} />
      ) : (
        <rect x={0} y={50 - halfLane} width={100} height={laneWidth} fill={pathColor} />
      );
    } else {
      const getRect = (side: Side) => {
        switch (side) {
          case Side.TOP: return { x: 50 - halfLane, y: 0, w: laneWidth, h: 50 + halfLane };
          case Side.RIGHT: return { x: 50 - halfLane, y: 50 - halfLane, w: 50 + halfLane, h: laneWidth };
          case Side.BOTTOM: return { x: 50 - halfLane, y: 50 - halfLane, w: laneWidth, h: 50 + halfLane };
          case Side.LEFT: return { x: 0, y: 50 - halfLane, w: 50 + halfLane, h: laneWidth };
        }
      };
      const r1 = getRect(from);
      const r2 = getRect(to);
      laneElement = (
        <g>
          <rect x={r1.x} y={r1.y} width={r1.w} height={r1.h} fill={pathColor} />
          <rect x={r2.x} y={r2.y} width={r2.w} height={r2.h} fill={pathColor} />
        </g>
      );
    }

    const chevrons = [];
    const chevronPath = "M -5 -4 L 0 1 L 5 -4";
    const renderChevron = (x: number, y: number, rot: number, k: string) => (
      <path 
        key={`${index}-${k}`}
        d={chevronPath} 
        fill="none" 
        stroke={arrowColor} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        transform={`translate(${x}, ${y}) rotate(${rot})`}
      />
    );

    if (isOpposite) {
      const isVertical = from === Side.TOP || from === Side.BOTTOM;
      const dir = (from === Side.TOP || from === Side.LEFT) ? 1 : -1;
      const rot = isVertical ? (dir > 0 ? 0 : 180) : (dir > 0 ? -90 : 90);
      if (isVertical) {
        chevrons.push({ x: 50, y: 22, r: rot }, { x: 50, y: 50, r: rot }, { x: 50, y: 78, r: rot });
      } else {
        chevrons.push({ x: 22, y: 50, r: rot }, { x: 50, y: 50, r: rot }, { x: 78, y: 50, r: rot });
      }
    } else {
      const rotMap: Record<string, number> = {
        "0-1": -45, "1-0": 135, "1-2": 45, "2-1": -135,
        "2-3": 135, "3-2": -45, "3-0": -135, "0-3": 45
      };
      const centerRot = rotMap[`${from}-${to}`] || 0;
      chevrons.push({ x: 50, y: 50, r: centerRot });
      
      const getSidePoint = (side: Side, isEntry: boolean) => {
        switch (side) {
          case Side.TOP: return { x: 50, y: 20, r: isEntry ? 0 : 180 };
          case Side.RIGHT: return { x: 80, y: 50, r: isEntry ? 90 : -90 };
          case Side.BOTTOM: return { x: 50, y: 80, r: isEntry ? 180 : 0 };
          case Side.LEFT: return { x: 20, y: 50, r: isEntry ? -90 : 90 };
        }
      };
      chevrons.push(getSidePoint(from, true), getSidePoint(to, false));
    }

    return (
      <g key={index}>
        {laneElement}
        {chevrons.map((c, i) => renderChevron(c.x, c.y, c.r, i.toString()))}
      </g>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full aspect-square bg-[#262626] cursor-pointer transition-all duration-75 overflow-hidden
        ${isSelected ? 'outline outline-4 outline-[#3b82f6] -outline-offset-4 z-10' : 'hover:bg-[#333]'}
      `}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {tile.connections.map((conn, idx) => renderConnection(conn[0], conn[1], idx))}
      </svg>
    </div>
  );
};

export default TileCell;
