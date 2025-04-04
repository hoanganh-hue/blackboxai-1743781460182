// Danh sách URL biểu tượng danh mục mới, theo phong cách chuyên nghiệp
const modernCategoryIcons = {
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

const API_BASE_URL = "https://tiktok-commerce-ngahunglchp.replit.app";

const getModernIconForCategory = (slug) => {
  return modernCategoryIcons[slug] || null;
};

const updateCategoryIcons = async () => {
  try {
    // Kết nối với API từ máy chủ
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    const categories = await response.json();
    
    console.log("Danh sách danh mục:", categories);
    
    // Tạo hướng dẫn cập nhật thủ công
    console.log("\n=== HƯỚNG DẪN CẬP NHẬT BIỂU TƯỢNG DANH MỤC ===");
    console.log("Đăng nhập vào trang admin và cập nhật URL hình ảnh cho từng danh mục như sau:\n");
    
    for (const category of categories) {
      const { id, name, slug } = category;
      const newIcon = getModernIconForCategory(slug);
      
      if (newIcon) {
        console.log(`Danh mục: ${name} (ID: ${id})`);
        console.log(`URL biểu tượng mới: ${newIcon}`);
        console.log("--------------------------------------");
      }
    }
    
    console.log("\nHoặc sử dụng API trực tiếp:");
    console.log("Ví dụ cập nhật danh mục có ID = 1:");
    console.log(`fetch('/api/categories/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: '[URL biểu tượng mới]' })
});`);
    
    // In thêm đoạn mã để chèn vào console của trình duyệt
    console.log("\n=== MÃ JavaScript để chạy trong console của trình duyệt ===");
    console.log("// Chỉ chạy khi đã đăng nhập với vai trò admin");
    console.log("const updateIcons = async () => {");
    for (const category of categories) {
      const { id, slug } = category;
      const newIcon = getModernIconForCategory(slug);
      
      if (newIcon) {
        console.log(`  // Cập nhật ${slug}`);
        console.log(`  await fetch('/api/categories/${id}', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: '${newIcon}' })
  });
  console.log('Đã cập nhật ${slug}');`);
      }
    }
    console.log("};");
    console.log("updateIcons();");
    console.log("Hoàn tất tạo hướng dẫn cập nhật biểu tượng danh mục!");
  } catch (error) {
    console.error("Lỗi khi xử lý danh mục:", error);
  }
};

// Chạy hàm cập nhật
updateCategoryIcons();