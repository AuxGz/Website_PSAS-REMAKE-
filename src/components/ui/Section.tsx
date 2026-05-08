import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  fullHeight?: boolean;
  snap?: boolean;
}

export default function Section({
  children,
  id,
  className = '',
  fullHeight = true,
  snap = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`
        relative w-full overflow-hidden
        ${fullHeight ? 'h-screen' : ''}
        ${snap ? 'snap-start' : ''}
        ${className}
      `}
    >
      {children}
    </section>
  );
}
