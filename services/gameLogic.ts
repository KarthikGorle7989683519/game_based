
import { Equation, Operator, GameMode } from '../types';

const COLORS = ['#f1b40f', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#ec4899'];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getGameMode(level: number): GameMode {
  if (level <= 20) return 'smallest';
  if (level <= 40) return 'ascending';
  if (level <= 60) return 'descending';
  return 'largest';
}

export function getDifficulty(level: number): string {
  if (level <= 20) {
    if (level <= 5) return 'PHASE 1.1: BASIC SMALL';
    if (level <= 10) return 'PHASE 1.2: DIVISION MASTERY';
    if (level <= 15) return 'PHASE 1.3: MODULO MAGIC';
    return 'PHASE 1.4: SMALLEST EXPERT';
  }
  if (level <= 40) return 'PHASE 2: LOW TO HIGH';
  if (level <= 60) return 'PHASE 3: HIGH TO LOW';
  return 'PHASE 4: BIGGEST';
}

export function generateLevelEquations(level: number): Equation[] {
  const equations: Equation[] = [];
  
  // Custom operator weighting for Phase 1 sub-levels
  let operators: Operator[] = [];
  if (level <= 4) {
    operators = ['+', '-', '+', '-']; // Mostly +/-
  } else if (level <= 8) {
    operators = ['+', '-', '/', '/']; // Heavy on division
  } else if (level <= 12) {
    operators = ['/', '/', '%', '%']; // Only division and modulo
  } else if (level <= 16) {
    operators = ['+', '-', '*', '/', '%']; // All mixed
  } else if (level <= 20) {
    operators = ['/', '%', '*', '/', '%']; // Expert small values
  } else {
    operators = ['+', '-', '*', '/', '%']; // Standard mix for other phases
  }

  // Range and precision scales with level
  let maxRange = 10 + Math.floor(level / 2);
  let allowDecimals = level > 8; // Decimals introduced mid-phase 1

  const seenValues = new Set<number>();

  for (let i = 0; i < 6; i++) {
    let attempts = 0;
    while (attempts < 50) {
      const op = operators[getRandomInt(0, operators.length - 1)];
      let a = getRandomInt(2, maxRange + 5);
      let b = getRandomInt(2, Math.max(2, Math.floor(maxRange / 2)));
      
      let text = '';
      let value = 0;

      switch (op) {
        case '+':
          value = a + b;
          text = `${a} + ${b}`;
          break;
        case '-':
          if (a < b) [a, b] = [b, a];
          value = a - b;
          text = `${a} - ${b}`;
          break;
        case '*':
          a = getRandomInt(1, Math.min(maxRange, 10));
          b = getRandomInt(1, 8);
          value = a * b;
          text = `${a} * ${b}`;
          break;
        case '/':
          // For level 5-10, division is usually clean to find small values
          if (!allowDecimals || level < 12) {
            // Pick a small result and multiply to get numerator
            const expectedResult = getRandomInt(1, 5); 
            const divisor = getRandomInt(2, 6);
            const dividend = expectedResult * divisor;
            value = expectedResult;
            text = `${dividend} / ${divisor}`;
          } else {
            // Produce interesting decimal results for precision
            const res = a / b;
            value = Math.round(res * 10) / 10;
            text = `${a} / ${b}`;
          }
          break;
        case '%':
          // Modulo is great for small values
          // e.g. 10 % 3 = 1
          if (a <= b) a = b + getRandomInt(1, 10);
          value = a % b;
          text = `${a} % ${b}`;
          break;
      }

      // Check for uniqueness to avoid confusion
      if (!seenValues.has(value) || attempts > 40) {
        seenValues.add(value);
        equations.push({
          id: `lvl${level}-eq${i}-${attempts}`,
          text,
          value,
          color: COLORS[i % COLORS.length]
        });
        break;
      }
      attempts++;
    }
  }

  return equations;
}
