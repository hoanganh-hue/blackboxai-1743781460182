import { Link } from "wouter";
import { ROUTES } from "@/lib/constants";
import { Product } from "@shared/schema";
import { Rating } from "@/components/ui/rating";
import { formatCurrency, formatDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  imageUrl?: string;
  ratings?: { average: number; count: number };
}

export function ProductCard({ product, imageUrl, ratings }: ProductCardProps) {
  const {
    id,
    name,
    slug,
    price,
    discountedPrice,
    isDiscounted,
    sold
  } = product;

  const productUrl = ROUTES.PRODUCT.DETAIL(slug);
  const showDiscount = isDiscounted && discountedPrice && discountedPrice < price;
  const displayPrice = showDiscount ? discountedPrice : price;
  const discountBadge = showDiscount ? formatDiscount(price, discountedPrice!) : '';

  // Default image if none provided
  const displayImageUrl = imageUrl || "https://placehold.co/400x400/333/white?text=TikTok+Shop";

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out">
      <div className="cursor-pointer" onClick={() => window.location.href = productUrl}>
        <div className="relative pb-[100%] overflow-hidden bg-gray-900">
          <img
            src={displayImageUrl}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {showDiscount && discountBadge && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
              {discountBadge}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium mb-1 line-clamp-2">{name}</h3>
          <div className="flex items-center mb-1">
            <Rating 
              value={ratings?.average || 0} 
              showValue 
              showCount 
              count={ratings?.count || 0}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary font-bold">{formatCurrency(displayPrice)}</span>
              {showDiscount && (
                <span className="text-muted-foreground text-xs line-through ml-1">
                  {formatCurrency(price)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Đã bán {sold}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
