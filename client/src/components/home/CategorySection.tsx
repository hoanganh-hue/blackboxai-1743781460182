import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ROUTES, API_ENDPOINTS } from "@/lib/constants";
import { Category } from "@shared/schema";
import {
  Shirt,
  Smartphone,
  Sofa,
  ShoppingBag,
  Sparkles,
  Apple,
  Gamepad2,
  BookOpen,
  MoreHorizontal,
  Clock,
  CreditCard,
  GemIcon,
  ArrowRight
} from "lucide-react";

// Define extended category type with icon
interface CategoryWithIcon {
  name: string;
  slug: string;
  icon: string;
  image?: string;
}

interface CategoryCardProps {
  name: string;
  slug: string;
  icon?: string;
  image?: string;
}

function CategoryCard({ name, slug, icon, image }: CategoryCardProps) {
  // Chọn biểu tượng fallback nếu không có hình ảnh
  const getIcon = () => {
    switch (icon) {
      case "Shirt":
        return <Shirt className="h-7 w-7 text-primary" />;
      case "Smartphone":
        return <Smartphone className="h-7 w-7 text-primary" />;
      case "Sofa":
        return <Sofa className="h-7 w-7 text-primary" />;
      case "ShoppingBag":
        return <ShoppingBag className="h-7 w-7 text-primary" />;
      case "Sparkles":
        return <Sparkles className="h-7 w-7 text-primary" />;
      case "Apple":
        return <Apple className="h-7 w-7 text-primary" />;
      case "Gamepad2":
        return <Gamepad2 className="h-7 w-7 text-primary" />;
      case "BookOpen":
        return <BookOpen className="h-7 w-7 text-primary" />;
      case "Clock":
        return <Clock className="h-7 w-7 text-primary" />;
      case "CreditCard":
        return <CreditCard className="h-7 w-7 text-primary" />;
      case "GemIcon":
        return <GemIcon className="h-7 w-7 text-primary" />;
      default:
        return <MoreHorizontal className="h-7 w-7 text-primary" />;
    }
  };

  // Luôn ưu tiên hình ảnh từ cơ sở dữ liệu
  return (
    <Link href={ROUTES.PRODUCT.CATEGORY(slug)} className="bg-white shadow-sm border border-slate-100 rounded-lg p-5 text-center hover:shadow-md transition duration-150 ease-in-out block">
      <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3">
        {image && image.length > 0 ? (
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 object-contain" 
            onError={(e) => {
              // Nếu hình ảnh lỗi, hiển thị biểu tượng thay thế
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '';
                const iconEl = document.createElement('div');
                parent.appendChild(iconEl);
                // React không thể render ở đây, nên chỉ hiển thị div trống
              }
            }}
          />
        ) : (
          getIcon()
        )}
      </div>
      <span className="block text-sm font-medium">{name}</span>
    </Link>
  );
}

export function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.CATEGORIES.BASE],
    enabled: true // Enable fetching from real API
  });

  // Use real categories from database
  const displayCategories = categories || [];

  // Map categories with icons based on their names if not present
  const categoriesWithIcons: CategoryWithIcon[] = displayCategories.map(cat => {
    // Set default icon based on category name
    let icon = "MoreHorizontal";
    
    if (cat.name.toLowerCase().includes("điện tử")) icon = "Smartphone";
    else if (cat.name.toLowerCase().includes("thời trang") || 
             cat.name.toLowerCase().includes("quần áo") || 
             cat.name.toLowerCase().includes("trang phục")) icon = "Shirt";
    else if (cat.name.toLowerCase().includes("nội thất")) icon = "Sofa";
    else if (cat.name.toLowerCase().includes("túi xách")) icon = "ShoppingBag";
    else if (cat.name.toLowerCase().includes("mỹ phẩm")) icon = "Sparkles";
    else if (cat.name.toLowerCase().includes("thực phẩm")) icon = "Apple";
    else if (cat.name.toLowerCase().includes("đồ chơi") || 
             cat.name.toLowerCase().includes("trẻ em")) icon = "Gamepad2";
    else if (cat.name.toLowerCase().includes("sách")) icon = "BookOpen";
    else if (cat.name.toLowerCase().includes("đồng hồ")) icon = "Clock";
    else if (cat.name.toLowerCase().includes("thẻ nạp")) icon = "CreditCard";
    else if (cat.name.toLowerCase().includes("trang sức")) icon = "GemIcon";
    
    // Ensure image from DB is properly used - convert null/undefined to empty string
    // so the conditional in the component works properly
    const imageStr = cat.image || "";
    
    // Return category with DB data
    return { 
      name: cat.name, 
      slug: cat.slug, 
      icon, 
      image: imageStr
    };
  });

  if (isLoading) {
    return (
      <section className="py-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Danh mục</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white shadow-sm rounded-lg p-5 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
        <Link href="/categories" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2">
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categoriesWithIcons.map((category, index) => (
          <CategoryCard
            key={index}
            name={category.name}
            slug={category.slug}
            icon={category.icon}
            image={category.image}
          />
        ))}
      </div>
    </section>
  );
}
