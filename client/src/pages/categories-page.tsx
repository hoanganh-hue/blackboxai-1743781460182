import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { ROUTES, API_ENDPOINTS } from "@/lib/constants";
import { 
  Shirt,
  Smartphone,
  Sofa,
  ShoppingBag,
  Sparkles,
  Apple,
  Gamepad2,
  BookOpen,
  CreditCard,
  Footprints,
  Watch,
  Gem,
  Home,
  Dumbbell,
  Laptop,
  MoreHorizontal
} from "lucide-react";

interface CategoryCardProps {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
}

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CATEGORIES.BASE],
    // We will enable the real API fetch
    enabled: true
  });

  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case "Shirt":
        return <Shirt className="h-10 w-10 text-primary" />;
      case "Smartphone":
        return <Smartphone className="h-10 w-10 text-primary" />;
      case "Sofa":
        return <Sofa className="h-10 w-10 text-primary" />;
      case "ShoppingBag":
        return <ShoppingBag className="h-10 w-10 text-primary" />;
      case "Sparkles":
        return <Sparkles className="h-10 w-10 text-primary" />;
      case "Apple":
        return <Apple className="h-10 w-10 text-primary" />;
      case "Gamepad2":
        return <Gamepad2 className="h-10 w-10 text-primary" />;
      case "BookOpen":
        return <BookOpen className="h-10 w-10 text-primary" />;
      case "CreditCard":
        return <CreditCard className="h-10 w-10 text-primary" />;
      case "Footprints":
        return <Footprints className="h-10 w-10 text-primary" />;
      case "Watch":
        return <Watch className="h-10 w-10 text-primary" />;
      case "Gem":
        return <Gem className="h-10 w-10 text-primary" />;
      case "Home":
        return <Home className="h-10 w-10 text-primary" />;
      case "Dumbbell":
        return <Dumbbell className="h-10 w-10 text-primary" />;
      case "Laptop":
        return <Laptop className="h-10 w-10 text-primary" />;
      default:
        return <MoreHorizontal className="h-10 w-10 text-primary" />;
    }
  };

  // Add icon mapping for categories that don't have icons
  const categoriesWithIcons = Array.isArray(categories) 
    ? categories.map(cat => {
        // Map category names to icons if they don't have one
        let icon = cat.icon;
        if (!icon) {
          if (cat.name.includes("điện tử")) icon = "Smartphone";
          else if (cat.name.includes("thời trang") || cat.name.includes("quần áo") || cat.name.includes("trang phục")) icon = "Shirt";
          else if (cat.name.includes("nội thất")) icon = "Sofa";
          else if (cat.name.includes("túi xách")) icon = "ShoppingBag";
          else if (cat.name.includes("mỹ phẩm")) icon = "Sparkles";
          else if (cat.name.includes("thực phẩm")) icon = "Apple";
          else if (cat.name.includes("đồ chơi") || cat.name.includes("trẻ em")) icon = "Gamepad2";
          else if (cat.name.includes("sách")) icon = "BookOpen";
          else if (cat.name.includes("thẻ nạp")) icon = "CreditCard";
          else if (cat.name.includes("giày dép")) icon = "Footprints";
          else if (cat.name.includes("đồng hồ")) icon = "Watch";
          else if (cat.name.includes("trang sức") || cat.name.includes("đá quý")) icon = "Gem";
          else if (cat.name.includes("gia dụng") || cat.name.includes("gia đình")) icon = "Home";
          else if (cat.name.includes("luyện tập") || cat.name.includes("thể dục")) icon = "Dumbbell";
          else if (cat.name.includes("kỹ thuật")) icon = "Laptop";
          else icon = "MoreHorizontal";
        }
        return { ...cat, icon };
      }) 
    : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tất cả danh mục sản phẩm</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="rounded-lg shadow-sm animate-pulse">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
                  <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesWithIcons.map((category) => (
              <Link key={category.id} href={ROUTES.PRODUCT.CATEGORY(category.slug)}>
                <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-12 h-12 object-contain" />
                      ) : (
                        getIcon(category.icon)
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Xem tất cả sản phẩm
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}