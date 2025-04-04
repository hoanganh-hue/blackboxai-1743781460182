import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  onRatingChange?: (value: number) => void;
  readOnly?: boolean;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  color = "text-yellow-400",
  onRatingChange,
  readOnly = true,
  showValue = false,
  showCount = false,
  count = 0,
  className,
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getSizeClass = () => sizeClass[size];
  
  const handleMouseOver = (rating: number) => {
    if (readOnly) return;
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    if (readOnly || !onRatingChange) return;
    onRatingChange(rating);
  };

  const renderStars = () => {
    const stars = [];
    const activeRating = hoverRating || value;

    for (let i = 1; i <= max; i++) {
      if (i <= activeRating) {
        // Full star
        stars.push(
          <Star
            key={i}
            className={cn(
              getSizeClass(),
              color,
              "fill-current",
              !readOnly && "cursor-pointer"
            )}
            onMouseOver={() => handleMouseOver(i)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(i)}
          />
        );
      } else if (i - 0.5 <= activeRating) {
        // Half star
        stars.push(
          <StarHalf
            key={i}
            className={cn(
              getSizeClass(),
              color,
              "fill-current",
              !readOnly && "cursor-pointer"
            )}
            onMouseOver={() => handleMouseOver(i)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(i)}
          />
        );
      } else {
        // Empty star
        stars.push(
          <Star
            key={i}
            className={cn(
              getSizeClass(),
              "text-gray-400",
              !readOnly && "cursor-pointer"
            )}
            onMouseOver={() => handleMouseOver(i)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(i)}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">{renderStars()}</div>
      {showValue && (
        <span className={cn("ml-1 text-xs", color)}>{value.toFixed(1)}</span>
      )}
      {showCount && count > 0 && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
