/**
 * Sample Products Generator
 * 
 * Script để tạo các sản phẩm mẫu với dữ liệu và hình ảnh phong phú
 * cho cửa hàng TikTok Shop khi mới ra mắt.
 * 
 * Sử dụng:
 * 1. Đăng nhập vào tài khoản admin
 * 2. Chạy script với lệnh: node utils/sample-products-creator.js
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Token JWT của admin (lấy sau khi đăng nhập)
let JWT_TOKEN = '';

// Base URL của API
const API_BASE_URL = 'http://localhost:5000';

// Danh mục sản phẩm 
const CATEGORIES = {
  THOI_TRANG: 1,
  DIEN_TU: 2,
  NOI_THAT: 3,
  TUI_XACH: 4,
  MY_PHAM: 5,
  THUC_PHAM: 6,
  DO_CHOI: 7,
  SACH: 8
};

// Danh sách các hình ảnh sản phẩm theo danh mục
const PRODUCT_IMAGES = {
  [CATEGORIES.THOI_TRANG]: [
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68',
    'https://images.unsplash.com/photo-1608228088998-57828365d486',
    'https://images.unsplash.com/photo-1588099768531-a72d4a198538',
    'https://images.unsplash.com/photo-1612215327150-72f01f98aae3',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157',
    'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f',
  ],
  [CATEGORIES.DIEN_TU]: [
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826',
    'https://images.unsplash.com/photo-1591815302525-756a9bcc3425',
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    'https://images.unsplash.com/photo-1606041011872-596597976b25',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147',
  ],
  [CATEGORIES.NOI_THAT]: [
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
    'https://images.unsplash.com/photo-1538688423619-a81d3f23454b',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
  ],
  [CATEGORIES.TUI_XACH]: [
    'https://images.unsplash.com/photo-1591561954555-607968c989ab',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    'https://images.unsplash.com/photo-1559563458-527698bf5295',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
    'https://images.unsplash.com/photo-1614179689702-355944cd0918',
    'https://images.unsplash.com/photo-1597633544424-4da0af9f4b5d',
    'https://images.unsplash.com/photo-1590739293931-a87275d8f266',
  ],
  [CATEGORIES.MY_PHAM]: [
    'https://images.unsplash.com/photo-1612817288484-6f916006741a',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    'https://images.unsplash.com/photo-1607652871277-96e74a5ee019',
    'https://images.unsplash.com/photo-1617897903246-719242758050',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af',
    'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137',
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    'https://images.unsplash.com/photo-1573575155376-b5010099301b',
  ],
  [CATEGORIES.THUC_PHAM]: [
    'https://images.unsplash.com/photo-1603569283847-aa295f0d016a',
    'https://images.unsplash.com/photo-1631209121338-86f4387nde24',
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818',
    'https://images.unsplash.com/photo-1505253758473-96b7015fcd40',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    'https://images.unsplash.com/photo-1602253057119-44d745d9b860',
    'https://images.unsplash.com/photo-1567374783966-9e1ac218480d',
  ],
  [CATEGORIES.DO_CHOI]: [
    'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1',
    'https://images.unsplash.com/photo-1575364289437-fb16240b7511',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
    'https://images.unsplash.com/photo-1536846511313-4b07b637b5c9',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
    'https://images.unsplash.com/photo-1596217235220-9986f3af6c1e',
    'https://images.unsplash.com/photo-1603118214539-9ca156e7254a',
  ],
  [CATEGORIES.SACH]: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765',
    'https://images.unsplash.com/photo-1526243741027-444d633d7365',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    'https://images.unsplash.com/photo-1548364538-60b952c3cd31',
    'https://images.unsplash.com/photo-1509266272358-7701da638078',
  ],
};

// Danh sách sản phẩm mẫu theo danh mục
const SAMPLE_PRODUCTS = {
  [CATEGORIES.THOI_TRANG]: [
    {
      name: "Áo Thun Unisex TikTok Trends",
      description: "Áo thun unisex chất liệu cotton mềm mại, thoáng mát. Thiết kế đơn giản với logo TikTok Trends hiện đại, phù hợp cho cả nam và nữ.",
      price: 199000,
      discountedPrice: 149000,
      stock: 100,
      isFeatured: true
    },
    {
      name: "Quần Jeans Slim Fit",
      description: "Quần jeans dáng slim fit, chất liệu denim co giãn thoải mái. Thiết kế hiện đại, dễ phối đồ, phù hợp cho nhiều dịp khác nhau.",
      price: 549000,
      discountedPrice: 450000,
      stock: 80,
      isFeatured: true
    },
    {
      name: "Váy Suông Phong Cách Hàn Quốc",
      description: "Váy suông dáng dài, thiết kế đơn giản theo phong cách Hàn Quốc. Chất liệu vải mềm mịn, thoáng mát, phù hợp cho mùa hè.",
      price: 320000,
      discountedPrice: 280000,
      stock: 65,
      isFeatured: false
    },
    {
      name: "Áo Khoác Bomber Unisex",
      description: "Áo khoác bomber thiết kế unisex, chất liệu cao cấp, cản gió tốt. Họa tiết đơn giản, dễ dàng kết hợp với nhiều loại trang phục khác nhau.",
      price: 650000,
      discountedPrice: 499000,
      stock: 45,
      isFeatured: true
    },
    {
      name: "Giày Sneaker Thời Trang",
      description: "Giày sneaker thiết kế thời trang, đế cao su chống trượt. Phù hợp cho cả nam và nữ, dễ dàng kết hợp với nhiều loại trang phục.",
      price: 850000,
      discountedPrice: 680000,
      stock: 60,
      isFeatured: true
    },
    {
      name: "Áo Sơ Mi Linen Cao Cấp",
      description: "Áo sơ mi chất liệu linen cao cấp, thoáng mát, thấm hút mồ hôi tốt. Thiết kế đơn giản, thanh lịch, phù hợp cho nhiều dịp khác nhau.",
      price: 450000,
      discountedPrice: 380000,
      stock: 70,
      isFeatured: false
    },
    {
      name: "Đầm Maxi Đi Biển",
      description: "Đầm maxi thiết kế dáng dài, chất liệu vải nhẹ, thoáng mát. Họa tiết hoa văn tươi sáng, phù hợp cho các chuyến đi biển, du lịch.",
      price: 389000,
      discountedPrice: 299000,
      stock: 55,
      isFeatured: false
    },
    {
      name: "Quần Short Kaki",
      description: "Quần short kaki chất liệu cao cấp, thoáng mát. Thiết kế đơn giản với nhiều túi tiện dụng, phù hợp cho các hoạt động ngoài trời.",
      price: 280000,
      discountedPrice: 219000,
      stock: 85,
      isFeatured: false
    }
  ],
  [CATEGORIES.DIEN_TU]: [
    {
      name: "Tai Nghe Bluetooth TikTok Pro",
      description: "Tai nghe bluetooth không dây với công nghệ noise-cancelling, âm thanh HD crystal clear. Thời lượng pin lên đến 20 giờ, sạc nhanh trong 15 phút.",
      price: 1200000,
      discountedPrice: 990000,
      stock: 50,
      isFeatured: true
    },
    {
      name: "Smart Watch Fitness Tracker",
      description: "Đồng hồ thông minh theo dõi sức khỏe với nhiều tính năng: đo nhịp tim, theo dõi giấc ngủ, đếm bước chân. Kết nối bluetooth với điện thoại, nhận thông báo tin nhắn.",
      price: 1500000,
      discountedPrice: 1290000,
      stock: 45,
      isFeatured: true
    },
    {
      name: "Camera Hành Trình 4K",
      description: "Camera hành trình độ phân giải 4K, chống nước, chống rung. Phù hợp cho các hoạt động ngoài trời, thể thao mạo hiểm.",
      price: 2800000,
      discountedPrice: 2199000,
      stock: 30,
      isFeatured: false
    },
    {
      name: "Loa Bluetooth Mini",
      description: "Loa bluetooth mini kích thước nhỏ gọn, âm thanh sống động, bass mạnh mẽ. Thời lượng pin lên đến 10 giờ, kết nối bluetooth 5.0.",
      price: 799000,
      discountedPrice: 650000,
      stock: 60,
      isFeatured: true
    },
    {
      name: "Sạc Dự Phòng 20000mAh",
      description: "Sạc dự phòng dung lượng 20000mAh, sạc nhanh 18W, 2 cổng USB và 1 cổng Type-C. Thiết kế mỏng nhẹ, dễ dàng mang theo.",
      price: 560000,
      discountedPrice: 450000,
      stock: 75,
      isFeatured: false
    },
    {
      name: "Máy Chụp Ảnh Lấy Ngay",
      description: "Máy chụp ảnh lấy ngay với thiết kế retro, in ảnh tức thì. Tích hợp nhiều bộ lọc và hiệu ứng ảnh, dễ dàng sử dụng.",
      price: 1800000,
      discountedPrice: 1499000,
      stock: 40,
      isFeatured: true
    },
    {
      name: "Bàn Phím Cơ Gaming",
      description: "Bàn phím cơ chuyên game với đèn LED RGB, switch blue độ bền cao. Thiết kế công thái học, thoải mái khi sử dụng trong thời gian dài.",
      price: 1200000,
      discountedPrice: 990000,
      stock: 35,
      isFeatured: false
    },
    {
      name: "Ổ Cứng SSD 500GB",
      description: "Ổ cứng SSD dung lượng 500GB, tốc độ đọc/ghi lên đến 550MB/s. Tăng tốc máy tính, giảm thời gian khởi động và tải ứng dụng.",
      price: 1800000,
      discountedPrice: 1590000,
      stock: 55,
      isFeatured: false
    }
  ],
  [CATEGORIES.NOI_THAT]: [
    {
      name: "Ghế Sofa Đơn Minimalist",
      description: "Ghế sofa đơn thiết kế đơn giản theo phong cách minimalist. Chất liệu vải bọc cao cấp, khung gỗ bền chắc, tạo cảm giác thoải mái khi sử dụng.",
      price: 2500000,
      discountedPrice: 1999000,
      stock: 20,
      isFeatured: true
    },
    {
      name: "Bàn Trà Gỗ Tự Nhiên",
      description: "Bàn trà làm từ gỗ tự nhiên, thiết kế đơn giản, hiện đại. Bề mặt được xử lý chống thấm, dễ dàng vệ sinh.",
      price: 1800000,
      discountedPrice: 1500000,
      stock: 25,
      isFeatured: false
    },
    {
      name: "Đèn Ngủ Thông Minh",
      description: "Đèn ngủ thông minh với đa dạng chế độ ánh sáng, điều khiển từ xa hoặc qua ứng dụng smartphone. Tiết kiệm điện, bảo vệ mắt.",
      price: 750000,
      discountedPrice: 599000,
      stock: 40,
      isFeatured: true
    },
    {
      name: "Kệ Sách Treo Tường",
      description: "Kệ sách treo tường thiết kế đơn giản, hiện đại. Chất liệu gỗ kết hợp kim loại, chắc chắn và bền bỉ.",
      price: 950000,
      discountedPrice: 799000,
      stock: 30,
      isFeatured: false
    },
    {
      name: "Giường Ngủ Hiện Đại",
      description: "Giường ngủ thiết kế hiện đại, chất liệu gỗ cao cấp. Kích thước 1m6 x 2m, phù hợp cho phòng ngủ hiện đại.",
      price: 4500000,
      discountedPrice: 3800000,
      stock: 15,
      isFeatured: true
    },
    {
      name: "Gương Trang Trí Hình Tròn",
      description: "Gương trang trí hình tròn viền kim loại. Đường kính 60cm, phù hợp cho phòng khách, phòng ngủ hoặc hành lang.",
      price: 850000,
      discountedPrice: 690000,
      stock: 35,
      isFeatured: false
    },
    {
      name: "Thảm Phòng Khách Bắc Âu",
      description: "Thảm phòng khách thiết kế theo phong cách Bắc Âu, họa tiết hình học đơn giản. Chất liệu lông ngắn dễ vệ sinh.",
      price: 1200000,
      discountedPrice: 980000,
      stock: 25,
      isFeatured: false
    },
    {
      name: "Tủ Quần Áo 3 Cánh",
      description: "Tủ quần áo 3 cánh thiết kế hiện đại, chất liệu gỗ công nghiệp. Ngăn kéo tiện dụng, không gian lưu trữ rộng rãi.",
      price: 3800000,
      discountedPrice: 3200000,
      stock: 18,
      isFeatured: true
    }
  ],
  [CATEGORIES.TUI_XACH]: [
    {
      name: "Túi Xách Tay Nữ Elegant",
      description: "Túi xách tay nữ thiết kế thanh lịch, sang trọng. Chất liệu da PU cao cấp, lót vải bền đẹp, khóa kim loại chắc chắn.",
      price: 850000,
      discountedPrice: 680000,
      stock: 45,
      isFeatured: true
    },
    {
      name: "Balo Laptop Chống Trộm",
      description: "Balo laptop với thiết kế chống trộm, ngăn laptop riêng biệt. Chất liệu vải oxford chống thấm nước, dây đeo thoải mái.",
      price: 750000,
      discountedPrice: 599000,
      stock: 60,
      isFeatured: true
    },
    {
      name: "Túi Đeo Chéo Mini",
      description: "Túi đeo chéo mini thiết kế nhỏ gọn, thời trang. Chất liệu da tổng hợp cao cấp, nhiều ngăn tiện dụng.",
      price: 450000,
      discountedPrice: 380000,
      stock: 75,
      isFeatured: false
    },
    {
      name: "Vali Kéo 24 inch",
      description: "Vali kéo size 24 inch, chất liệu nhựa ABS bền chắc. 4 bánh xoay 360 độ, khóa số an toàn, tay kéo hợp kim nhôm.",
      price: 1500000,
      discountedPrice: 1199000,
      stock: 30,
      isFeatured: true
    },
    {
      name: "Túi Du Lịch Gấp Gọn",
      description: "Túi du lịch có thể gấp gọn, dung tích lớn. Chất liệu vải polyester bền bỉ, chống thấm nước, dây đeo điều chỉnh được.",
      price: 380000,
      discountedPrice: 299000,
      stock: 50,
      isFeatured: false
    },
    {
      name: "Túi Đựng Mỹ Phẩm",
      description: "Túi đựng mỹ phẩm nhiều ngăn, thiết kế nhỏ gọn, tiện lợi khi đi du lịch. Chất liệu vải oxford dễ lau chùi.",
      price: 220000,
      discountedPrice: 180000,
      stock: 85,
      isFeatured: false
    },
    {
      name: "Túi Xách Công Sở Nam",
      description: "Túi xách công sở dành cho nam, thiết kế đơn giản, lịch sự. Chất liệu da bò cao cấp, ngăn laptop riêng biệt.",
      price: 1200000,
      discountedPrice: 990000,
      stock: 40,
      isFeatured: true
    },
    {
      name: "Túi Clutch Dự Tiệc",
      description: "Túi clutch dự tiệc thiết kế sang trọng, đính đá tinh tế. Dây đeo có thể tháo rời, phù hợp cho các sự kiện quan trọng.",
      price: 580000,
      discountedPrice: 450000,
      stock: 35,
      isFeatured: false
    }
  ],
  [CATEGORIES.MY_PHAM]: [
    {
      name: "Bộ Dưỡng Da Cơ Bản",
      description: "Bộ sản phẩm dưỡng da cơ bản bao gồm sữa rửa mặt, toner và kem dưỡng ẩm. Dành cho mọi loại da, đặc biệt là da nhạy cảm.",
      price: 850000,
      discountedPrice: 690000,
      stock: 50,
      isFeatured: true
    },
    {
      name: "Kem Chống Nắng SPF50+",
      description: "Kem chống nắng với chỉ số SPF50+, bảo vệ da khỏi tác hại của tia UV. Kết cấu nhẹ, không gây nhờn rít, phù hợp sử dụng hàng ngày.",
      price: 420000,
      discountedPrice: 350000,
      stock: 70,
      isFeatured: true
    },
    {
      name: "Son Môi Lì Lâu Trôi",
      description: "Son môi lì với công thức lâu trôi đến 12 giờ. Chất son mịn, không làm khô môi, màu sắc tươi tắn, trẻ trung.",
      price: 280000,
      discountedPrice: 230000,
      stock: 85,
      isFeatured: false
    },
    {
      name: "Mặt Nạ Dưỡng Ẩm (Hộp 10 Miếng)",
      description: "Mặt nạ giấy dưỡng ẩm sâu với chiết xuất từ thiên nhiên. Cung cấp độ ẩm tức thì, làm da mềm mịn và rạng rỡ.",
      price: 350000,
      discountedPrice: 280000,
      stock: 60,
      isFeatured: false
    },
    {
      name: "Nước Hoa Unisex 50ml",
      description: "Nước hoa unisex với hương thơm gỗ và hoa cỏ, phù hợp cho cả nam và nữ. Độ lưu hương cao, thiết kế chai sang trọng.",
      price: 1200000,
      discountedPrice: 980000,
      stock: 40,
      isFeatured: true
    },
    {
      name: "Bảng Phấn Mắt 12 Màu",
      description: "Bảng phấn mắt 12 màu với tone màu đa dạng từ nhũ đến lì. Chất phấn mịn, dễ tán, độ bám cao.",
      price: 490000,
      discountedPrice: 390000,
      stock: 55,
      isFeatured: false
    },
    {
      name: "Sữa Tắm Hương Hoa Hồng",
      description: "Sữa tắm với hương thơm hoa hồng dịu nhẹ, giúp làm sạch và dưỡng ẩm cho da. Không chứa paraben, an toàn cho da nhạy cảm.",
      price: 180000,
      discountedPrice: 150000,
      stock: 90,
      isFeatured: false
    },
    {
      name: "Serum Vitamin C Sáng Da",
      description: "Serum vitamin C nồng độ 10%, giúp làm sáng da, mờ thâm nám và chống oxy hóa. Kết cấu nhẹ, thẩm thấu nhanh.",
      price: 580000,
      discountedPrice: 490000,
      stock: 45,
      isFeatured: true
    }
  ],
  [CATEGORIES.THUC_PHAM]: [
    {
      name: "Combo Bánh Tráng Trộn (5 Gói)",
      description: "Combo bánh tráng trộn gồm 5 gói với đầy đủ gia vị: bánh tráng, rau răm, đậu phộng, khô bò, tương ớt. Hương vị đậm đà, thơm ngon.",
      price: 150000,
      discountedPrice: 120000,
      stock: 100,
      isFeatured: true
    },
    {
      name: "Trà Sữa Trân Châu (Hộp 10 Gói)",
      description: "Trà sữa trân châu hòa tan với trân châu đen dẻo, hương vị thơm béo. Chuẩn vị trà sữa Đài Loan, dễ dàng pha chế tại nhà.",
      price: 180000,
      discountedPrice: 150000,
      stock: 80,
      isFeatured: true
    },
    {
      name: "Set Hạt Dinh Dưỡng Mix (500g)",
      description: "Set hạt dinh dưỡng mix gồm hạt điều, hạt óc chó, hạnh nhân và hạt bí. Đóng gói tiện lợi, giữ nguyên hương vị tự nhiên.",
      price: 250000,
      discountedPrice: 199000,
      stock: 60,
      isFeatured: false
    },
    {
      name: "Cà Phê Phin Đặc Biệt (500g)",
      description: "Cà phê rang xay nguyên chất, hương thơm đậm đà, vị đắng thanh. Đóng gói kín, giữ nguyên hương vị cà phê mới rang.",
      price: 180000,
      discountedPrice: 150000,
      stock: 70,
      isFeatured: true
    },
    {
      name: "Snack Khoai Tây Vị Wasabi",
      description: "Snack khoai tây vị wasabi cay nồng, giòn rụm. Sản phẩm không chứa chất bảo quản, an toàn cho sức khỏe.",
      price: 35000,
      discountedPrice: 30000,
      stock: 150,
      isFeatured: false
    },
    {
      name: "Mật Ong Rừng Nguyên Chất (500ml)",
      description: "Mật ong rừng nguyên chất thu hoạch từ vùng núi cao nguyên. Không pha trộn, giữ nguyên dưỡng chất tự nhiên.",
      price: 290000,
      discountedPrice: 250000,
      stock: 50,
      isFeatured: false
    },
    {
      name: "Chocolate Đắng 70% (Hộp 10 Thanh)",
      description: "Chocolate đắng 70% cacao, vị đắng thanh, béo ngậy. Sản phẩm nhập khẩu, đóng gói sang trọng, phù hợp làm quà tặng.",
      price: 320000,
      discountedPrice: 280000,
      stock: 40,
      isFeatured: true
    },
    {
      name: "Combo Gia Vị Nấu Phở (Set 5 Gói)",
      description: "Combo gia vị nấu phở gồm 5 gói với đầy đủ hương liệu: quế, hoa hồi, thảo quả, đinh hương, gừng. Hương vị đậm đà, chuẩn vị phở Bắc.",
      price: 150000,
      discountedPrice: 120000,
      stock: 65,
      isFeatured: false
    }
  ],
  [CATEGORIES.DO_CHOI]: [
    {
      name: "Lego Mô Hình Thành Phố",
      description: "Bộ Lego mô hình thành phố với 500+ chi tiết, bao gồm nhà cửa, xe cộ và nhiều nhân vật. Phát triển tư duy không gian và sự sáng tạo cho trẻ.",
      price: 850000,
      discountedPrice: 699000,
      stock: 35,
      isFeatured: true
    },
    {
      name: "Búp Bê Thời Trang",
      description: "Búp bê thời trang với nhiều bộ quần áo và phụ kiện. Chất liệu an toàn, không chứa BPA, phù hợp cho trẻ từ 3 tuổi trở lên.",
      price: 380000,
      discountedPrice: 299000,
      stock: 50,
      isFeatured: false
    },
    {
      name: "Xe Điều Khiển từ xa",
      description: "Xe đua điều khiển từ xa tốc độ cao, pin sạc, thời gian chơi lên đến 30 phút. Chống va đập, phù hợp cho trẻ từ 8 tuổi trở lên.",
      price: 650000,
      discountedPrice: 499000,
      stock: 40,
      isFeatured: true
    },
    {
      name: "Bộ Đồ Chơi Nấu Ăn",
      description: "Bộ đồ chơi nấu ăn với nhiều dụng cụ nhà bếp: nồi, chảo, dao, thớt. Chất liệu nhựa an toàn, bền bỉ, phù hợp cho trẻ từ 3 tuổi.",
      price: 299000,
      discountedPrice: 240000,
      stock: 60,
      isFeatured: false
    },
    {
      name: "Rubik 3x3",
      description: "Rubik 3x3 chuyên nghiệp, xoay trơn, bền bỉ. Giúp rèn luyện tư duy logic và khả năng giải quyết vấn đề.",
      price: 150000,
      discountedPrice: 120000,
      stock: 80,
      isFeatured: false
    },
    {
      name: "Board Game Cờ Tỷ Phú",
      description: "Board game cờ tỷ phú phiên bản Việt Nam, bao gồm bàn cờ, thẻ bài, tiền và phụ kiện. Trò chơi giải trí dành cho cả gia đình.",
      price: 450000,
      discountedPrice: 380000,
      stock: 45,
      isFeatured: true
    },
    {
      name: "Đồ Chơi Slime Set",
      description: "Bộ đồ chơi slime với nhiều màu sắc và phụ kiện trang trí. An toàn cho trẻ em, không chứa borax.",
      price: 180000,
      discountedPrice: 150000,
      stock: 70,
      isFeatured: false
    },
    {
      name: "Máy Bay Điều Khiển Drone Mini",
      description: "Drone mini điều khiển từ xa, camera HD, thời gian bay 15 phút. Dễ dàng điều khiển, phù hợp cho người mới bắt đầu.",
      price: 1200000,
      discountedPrice: 990000,
      stock: 30,
      isFeatured: true
    }
  ],
  [CATEGORIES.SACH]: [
    {
      name: "Đắc Nhân Tâm (Bìa Cứng)",
      description: "Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie. Bản dịch mới nhất, bìa cứng sang trọng.",
      price: 150000,
      discountedPrice: 120000,
      stock: 100,
      isFeatured: true
    },
    {
      name: "Tiểu Thuyết Văn Học Hiện Đại",
      description: "Tiểu thuyết văn học hiện đại đoạt giải thưởng quốc tế. Câu chuyện sâu sắc về cuộc sống và tình người trong xã hội hiện đại.",
      price: 180000,
      discountedPrice: 155000,
      stock: 85,
      isFeatured: false
    },
    {
      name: "Sách Tâm Lý Học Đại Chúng",
      description: "Sách tâm lý học đại chúng với ngôn ngữ dễ hiểu, nhiều ví dụ thực tế. Giúp bạn hiểu rõ hơn về bản thân và người xung quanh.",
      price: 210000,
      discountedPrice: 180000,
      stock: 75,
      isFeatured: true
    },
    {
      name: "Sách Học Nấu Ăn Cơ Bản",
      description: "Sách dạy nấu ăn cơ bản với hơn 100 công thức món ăn đơn giản, dễ làm. Hình ảnh minh họa rõ ràng, hướng dẫn chi tiết từng bước.",
      price: 230000,
      discountedPrice: 195000,
      stock: 60,
      isFeatured: false
    },
    {
      name: "Sách Luyện Thi TOEIC 900+",
      description: "Sách luyện thi TOEIC với đầy đủ phương pháp, bài tập và đề thi thực hành. Cam kết đạt 900+ điểm sau khi hoàn thành toàn bộ giáo trình.",
      price: 320000,
      discountedPrice: 280000,
      stock: 50,
      isFeatured: true
    },
    {
      name: "Truyện Tranh Manga (Bộ 5 Tập)",
      description: "Bộ truyện tranh manga nổi tiếng, bao gồm 5 tập đầu tiên. Bìa màu, giấy in chất lượng cao, hình ảnh sắc nét.",
      price: 500000,
      discountedPrice: 420000,
      stock: 40,
      isFeatured: false
    },
    {
      name: "Sách Kinh Doanh Khởi Nghiệp",
      description: "Sách kinh doanh khởi nghiệp với những bài học từ các doanh nhân thành công. Phương pháp xây dựng và phát triển doanh nghiệp từ số 0.",
      price: 250000,
      discountedPrice: 210000,
      stock: 65,
      isFeatured: true
    },
    {
      name: "Sách Thai Giáo Cho Mẹ Bầu",
      description: "Sách thai giáo toàn diện từ tháng đầu đến tháng cuối thai kỳ. Hướng dẫn chăm sóc sức khỏe, dinh dưỡng và kích thích trí thông minh cho thai nhi.",
      price: 189000,
      discountedPrice: 160000,
      stock: 70,
      isFeatured: false
    }
  ]
};

// Helper function để gọi API
async function callAPI(endpoint, method = 'GET', data = null, token = '') {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error);
    throw error;
  }
}

// Lấy token JWT để gọi API admin
async function loginAsAdmin() {
  try {
    // Sử dụng token cứng vì đây là công cụ chỉ chạy trong môi trường phát triển
    // Trong môi trường thực tế, bạn nên đăng nhập qua API
    JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NjgwOTc3MX0.l4J8N0C7FTrp8NbUAYMd-TRKLOEbq_meAWTW9JUo_JA';
    console.log('Đăng nhập thành công!');
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    process.exit(1);
  }
}

// Tạo sản phẩm mẫu cho cửa hàng
async function createSampleProducts() {
  try {
    const allCategories = Object.keys(CATEGORIES);
    let createdProducts = 0;
    
    for (const categoryKey of allCategories) {
      const categoryId = CATEGORIES[categoryKey];
      const products = SAMPLE_PRODUCTS[categoryId];
      const images = PRODUCT_IMAGES[categoryId];
      
      console.log(`Đang tạo sản phẩm cho danh mục: ${categoryKey}...`);
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imageUrl = images[i % images.length]; // Luân phiên qua các hình ảnh
        
        // Thêm thông tin sellerId và markSampleStore
        const productData = {
          ...product,
          sellerId: 1, // ID của seller mẫu
          categoryId,
          status: 'approved',
          isSampleStore: true
        };
        
        // Tạo sản phẩm
        const createdProduct = await callAPI('/api/admin/products/sample-store', 'POST', productData, JWT_TOKEN);
        console.log(`✓ Đã tạo sản phẩm: ${createdProduct.name}`);
        
        // Thêm hình ảnh cho sản phẩm
        const imageData = {
          productId: createdProduct.id,
          url: imageUrl,
          isMain: true
        };
        
        await callAPI(`/api/products/${createdProduct.id}/images`, 'POST', imageData, JWT_TOKEN);
        console.log(`  ✓ Đã thêm hình ảnh cho sản phẩm: ${createdProduct.name}`);
        
        createdProducts++;
      }
    }
    
    console.log(`\n===================================`);
    console.log(`✅ Đã tạo thành công ${createdProducts} sản phẩm mẫu!`);
    console.log(`===================================`);
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm mẫu:', error);
  }
}

// Chạy script
async function run() {
  console.log('===================================');
  console.log('  TikTok Shop - Tạo Sản Phẩm Mẫu');
  console.log('===================================\n');
  
  await loginAsAdmin();
  await createSampleProducts();
}

run().catch(console.error);