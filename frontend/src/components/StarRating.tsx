import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number | null;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  interactive = false,
  onChange,
  size = 20,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (val: number) => {
    if (interactive && onChange) {
      onChange(val);
    }
  };

  const handleMouseEnter = (val: number) => {
    if (interactive) {
      setHoverRating(val);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((val) => {
        const isFilled = hoverRating !== null ? val <= hoverRating : (rating !== null ? val <= rating : false);
        return (
          <button
            key={val}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(val)}
            onMouseEnter={() => handleMouseEnter(val)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                isFilled 
                  ? 'fill-amber-400 stroke-amber-400' 
                  : 'fill-transparent stroke-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
export default StarRating;
