import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Biểu tượng mới, chuyên nghiệp
const modernIcons: Record<string, string> = {
  // Thời trang - biểu tượng chuyên nghiệp, hiện đại
  "thoi-trang": "https://cdn-icons-png.flaticon.com/512/2331/2331966.png",
  // Điện tử - biểu tượng hiện đại
  "dien-tu": "https://cdn-icons-png.flaticon.com/512/2777/2777194.png",
  // Nội thất - biểu tượng sang trọng
  "noi-that": "https://cdn-icons-png.flaticon.com/512/3190/3190825.png",
  // Túi xách - biểu tượng minimalist
  "tui-xach": "https://cdn-icons-png.flaticon.com/512/3081/3081986.png",
  // Mỹ phẩm - biểu tượng thanh lịch
  "my-pham": "https://cdn-icons-png.flaticon.com/512/2553/2553650.png",
  // Thực phẩm - biểu tượng chất lượng cao
  "thuc-pham": "https://cdn-icons-png.flaticon.com/512/2515/2515183.png",
  // Đồ chơi/trẻ em - biểu tượng đáng yêu
  "do-choi-tre-em": "https://cdn-icons-png.flaticon.com/512/2991/2991878.png",
  // Sách - biểu tượng tri thức 
  "sach": "https://cdn-icons-png.flaticon.com/512/4390/4390377.png",
  // Đồng hồ - biểu tượng sang trọng
  "dong-ho": "https://cdn-icons-png.flaticon.com/512/2972/2972531.png",
  // Đồ thể thao - biểu tượng năng động
  "the-thao": "https://cdn-icons-png.flaticon.com/512/2972/2972215.png",
  // Thẻ nạp/Dịch vụ - biểu tượng kỹ thuật số
  "the-nap": "https://cdn-icons-png.flaticon.com/512/2666/2666505.png",
  // Trang sức - biểu tượng quý phái
  "trang-suc": "https://cdn-icons-png.flaticon.com/512/1687/1687283.png"
};

export default function UpdateIconsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedCategories, setUpdatedCategories] = useState<string[]>([]);

  interface Category {
    id: number;
    slug: string;
    name: string;
  }
  
  // Lấy danh sách danh mục
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.CATEGORIES.BASE],
    enabled: true
  });

  // Mutation để cập nhật danh mục
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, image }: { id: number; image: string }) => {
      const response = await fetch(`${API_ENDPOINTS.CATEGORIES.BY_ID(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image })
      });
      
      if (!response.ok) {
        throw new Error(`Không thể cập nhật danh mục ID: ${id}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CATEGORIES.BASE] });
    }
  });

  // Cập nhật tất cả biểu tượng danh mục
  const updateAllIcons = async () => {
    if (!categories || categories.length === 0) return;
    
    setIsUpdating(true);
    setUpdatedCategories([]);
    
    const updatedCats: string[] = [];
    
    for (const category of categories) {
      const { id, slug, name } = category;
      
      if (slug in modernIcons) {
        try {
          await updateCategoryMutation.mutateAsync({ 
            id, 
            image: modernIcons[slug as keyof typeof modernIcons] 
          });
          
          updatedCats.push(name);
          setUpdatedCategories([...updatedCats]);
        } catch (error) {
          console.error(`Lỗi khi cập nhật danh mục ${name}:`, error);
          toast({
            title: "Lỗi",
            description: `Không thể cập nhật biểu tượng cho danh mục: ${name}`,
            variant: "destructive"
          });
        }
      }
    }
    
    setIsUpdating(false);
    
    if (updatedCats.length > 0) {
      toast({
        title: "Hoàn tất",
        description: `Đã cập nhật ${updatedCats.length} biểu tượng danh mục thành công`,
        variant: "default"
      });
    }
  };

  if (isLoading) return <div className="p-4">Đang tải danh mục...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cập nhật biểu tượng danh mục</h1>
      
      <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(modernIcons).map(([slug, url]) => (
          <div key={slug} className="border p-4 rounded-md bg-white flex flex-col items-center">
            <img src={url} alt={slug} className="w-16 h-16 object-contain mb-2" />
            <span className="text-sm font-medium">{slug}</span>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={updateAllIcons} 
        disabled={isUpdating}
        className="mb-4"
      >
        {isUpdating ? "Đang cập nhật..." : "Cập nhật tất cả biểu tượng"}
      </Button>
      
      {updatedCategories.length > 0 && (
        <div className="mt-4 border rounded-md p-4 bg-green-50">
          <h3 className="font-semibold mb-2">Danh mục đã cập nhật:</h3>
          <ul className="list-disc list-inside">
            {updatedCategories.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}