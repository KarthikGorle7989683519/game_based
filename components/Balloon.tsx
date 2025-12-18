
import React from 'react';
import { Equation } from '../types';

interface BalloonProps {
  equation: Equation;
  onClick: (eq: Equation) => void;
  disabled: boolean;
}

const Balloon: React.FC<BalloonProps> = ({ equation, onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={() => onClick(equation)}
      className="relative group transition-transform active:scale-95 duration-200 focus:outline-none"
    >
      {/* Balloon Pill Shape */}
      <div 
        style={{ backgroundColor: equation.color }}
        className="w-32 h-44 rounded-[60px] shadow-lg flex items-center justify-center relative overflow-hidden"
      >
        {/* Shine effect */}
        <div className="absolute top-4 right-6 w-6 h-10 bg-white/20 rounded-full rotate-45" />
        
        {/* Equation Text */}
        <span className="text-white font-black text-2xl drop-shadow-md select-none">
          {equation.text}
        </span>
      </div>
      
      {/* Balloon String (Visual only) */}
      <div className="w-0.5 h-16 bg-gray-200 mx-auto -mt-1 opacity-50" />
    </button>
  );
};

export default Balloon;
