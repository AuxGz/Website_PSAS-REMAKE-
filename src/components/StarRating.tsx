'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isHalf = !isFilled && star - 0.5 <= displayRating;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'} transition-transform duration-150 disabled:cursor-default`}
          >
            <svg
              className={`${sizeMap[size]} transition-colors duration-150`}
              viewBox="0 0 24 24"
              fill={isFilled ? '#f59e0b' : isHalf ? 'url(#half)' : 'none'}
              stroke={isFilled || isHalf ? '#f59e0b' : '#52525b'}
              strokeWidth={1.5}
            >
              {isHalf && (
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
