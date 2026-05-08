import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  glass = true,
  hover = true,
}: CardProps) {
  return (
    <div
      className={`
        rounded-[2rem] border border-white/5 p-8 transition-all duration-700
        ${glass ? 'bg-primary/20 backdrop-blur-xl' : 'bg-primary/40'}
        ${hover ? 'hover:border-secondary/20 hover:bg-primary/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
