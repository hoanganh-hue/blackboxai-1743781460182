# Báo Cáo Dự Án: Nền Tảng TikTok Shop

![TikTok Shop Logo](https://cdn-icons-png.flaticon.com/512/3046/3046121.png)

**Phiên bản:** 1.0.0  
**Ngày báo cáo:** 02/04/2025  
**Tác giả:** Đội phát triển TikTok Shop

## Mục Lục

1. [Giới Thiệu Dự Án](#1-giới-thiệu-dự-án)
   - [1.1. Tổng Quan](#11-tổng-quan)
   - [1.2. Mục Tiêu Dự Án](#12-mục-tiêu-dự-án)
   - [1.3. Đối Tượng Người Dùng](#13-đối-tượng-người-dùng)
   - [1.4. Phạm Vi Dự Án](#14-phạm-vi-dự-án)

2. [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống)
   - [2.1. Sơ Đồ Tổng Thể](#21-sơ-đồ-tổng-thể)
   - [2.2. Cấu Trúc Thư Mục](#22-cấu-trúc-thư-mục)
   - [2.3. Stack Công Nghệ](#23-stack-công-nghệ)
   - [2.4. Kiến Trúc Cơ Sở Dữ Liệu](#24-kiến-trúc-cơ-sở-dữ-liệu)
   - [2.5. Kiến Trúc API](#25-kiến-trúc-api)

3. [Phần I: Ứng Dụng Thương Mại Điện Tử](#3-phần-i-ứng-dụng-thương-mại-điện-tử)
   - [3.1. Giao Diện Người Dùng](#31-giao-diện-người-dùng)
   - [3.2. Hệ Thống Xác Thực](#32-hệ-thống-xác-thực)
   - [3.3. Quản Lý Sản Phẩm](#33-quản-lý-sản-phẩm)
   - [3.4. Giỏ Hàng và Thanh Toán](#34-giỏ-hàng-và-thanh-toán)
   - [3.5. Quản Lý Đơn Hàng](#35-quản-lý-đơn-hàng)
   - [3.6. Hệ Thống Đánh Giá và Bình Luận](#36-hệ-thống-đánh-giá-và-bình-luận)
   - [3.7. Tìm Kiếm và Lọc Sản Phẩm](#37-tìm-kiếm-và-lọc-sản-phẩm)
   - [3.8. Hệ Thống Tiếp Thị Liên Kết](#38-hệ-thống-tiếp-thị-liên-kết)
   - [3.9. Ví Điện Tử và Liên Kết Ngân Hàng](#39-ví-điện-tử-và-liên-kết-ngân-hàng)

4. [Phần II: Hệ Thống Quản Trị (Admin)](#4-phần-ii-hệ-thống-quản-trị-admin)
   - [4.1. Tổng Quan Hệ Thống Quản Trị](#41-tổng-quan-hệ-thống-quản-trị)
   - [4.2. Quản Lý Người Dùng](#42-quản-lý-người-dùng)
   - [4.3. Quản Lý Người Bán](#43-quản-lý-người-bán)
   - [4.4. Quản Lý Sản Phẩm](#44-quản-lý-sản-phẩm)
   - [4.5. Quản Lý Danh Mục](#45-quản-lý-danh-mục)
   - [4.6. Quản Lý Đơn Hàng](#46-quản-lý-đơn-hàng)
   - [4.7. Quản Lý Thanh Toán và Rút Tiền](#47-quản-lý-thanh-toán-và-rút-tiền)
   - [4.8. Báo Cáo và Thống Kê](#48-báo-cáo-và-thống-kê)
   - [4.9. Quản Lý Cửa Hàng Mẫu](#49-quản-lý-cửa-hàng-mẫu)

5. [Triển Khai và Bảo Mật](#5-triển-khai-và-bảo-mật)
   - [5.1. Môi Trường Triển Khai](#51-môi-trường-triển-khai)
   - [5.2. Quy Trình CI/CD](#52-quy-trình-cicd)
   - [5.3. Bảo Mật Hệ Thống](#53-bảo-mật-hệ-thống)
   - [5.4. Sao Lưu và Khôi Phục Dữ Liệu](#54-sao-lưu-và-khôi-phục-dữ-liệu)
   - [5.5. Mở Rộng và Khả Năng Chịu Tải](#55-mở-rộng-và-khả-năng-chịu-tải)

6. [Hướng Dẫn Sử Dụng Chi Tiết](#6-hướng-dẫn-sử-dụng-chi-tiết)
   - [6.1. Hướng Dẫn Cài Đặt](#61-hướng-dẫn-cài-đặt)
   - [6.2. Hướng Dẫn Sử Dụng Cho Người Dùng](#62-hướng-dẫn-sử-dụng-cho-người-dùng)
   - [6.3. Hướng Dẫn Sử Dụng Cho Người Bán](#63-hướng-dẫn-sử-dụng-cho-người-bán)
   - [6.4. Hướng Dẫn Sử Dụng Cho Quản Trị Viên](#64-hướng-dẫn-sử-dụng-cho-quản-trị-viên)

7. [Phát Triển Trong Tương Lai](#7-phát-triển-trong-tương-lai)
   - [7.1. Kế Hoạch Phát Triển](#71-kế-hoạch-phát-triển)
   - [7.2. Tính Năng Dự Kiến](#72-tính-năng-dự-kiến)
   - [7.3. Thách Thức và Giải Pháp](#73-thách-thức-và-giải-pháp)

8. [Kết Luận](#8-kết-luận)
   - [8.1. Tổng Kết Dự Án](#81-tổng-kết-dự-án)
   - [8.2. Thành Tựu và Giá Trị](#82-thành-tựu-và-giá-trị)

9. [Phụ Lục](#9-phụ-lục)
   - [9.1. Thuật Ngữ](#91-thuật-ngữ)
   - [9.2. Tài Liệu Tham Khảo](#92-tài-liệu-tham-khảo)
   - [9.3. Mẫu Dữ Liệu API](#93-mẫu-dữ-liệu-api)

---

## 1. Giới Thiệu Dự Án

### 1.1. Tổng Quan

TikTok Shop là một nền tảng thương mại điện tử toàn diện được phát triển dựa trên mô hình sàn thương mại điện tử (marketplace). Dự án hướng đến việc tạo ra một hệ sinh thái mua bán trực tuyến hiện đại, tận dụng sức mạnh thương hiệu của TikTok để thu hút người dùng và người bán.

Nền tảng này được thiết kế với hai phần chính:
- **Ứng dụng thương mại điện tử**: Giao diện dành cho người dùng cuối và người bán hàng, cung cấp đầy đủ các chức năng mua bán, quản lý sản phẩm và thanh toán.
- **Hệ thống quản trị (Admin)**: Giao diện hậu đài dành cho quản trị viên, cung cấp các công cụ kiểm soát toàn bộ nền tảng.

### 1.2. Mục Tiêu Dự Án

- Xây dựng nền tảng thương mại điện tử hoàn chỉnh với giao diện thân thiện, dễ sử dụng
- Tạo môi trường an toàn và tin cậy cho người mua và người bán
- Hỗ trợ cơ chế tiếp thị liên kết và mã giới thiệu để mở rộng mạng lưới người bán
- Xây dựng hệ thống quản lý ví điện tử và rút tiền cho người bán
- Cung cấp công cụ quản trị mạnh mẽ để kiểm soát và giám sát hoạt động của nền tảng
- Tạo dựng cơ sở dữ liệu sản phẩm phong phú thông qua cửa hàng mẫu

### 1.3. Đối Tượng Người Dùng

**1. Người Mua:**
- Tìm kiếm và mua sắm sản phẩm đa dạng
- Đánh giá và đọc nhận xét về sản phẩm
- Theo dõi trạng thái đơn hàng

**2. Người Bán:**
- Đăng ký và quản lý cửa hàng trực tuyến
- Đăng tải và quản lý sản phẩm
- Xử lý đơn hàng và giao dịch
- Quản lý thu nhập và rút tiền
- Tiếp thị và bán lại sản phẩm từ các cửa hàng khác

**3. Quản Trị Viên:**
- Quản lý người dùng và người bán
- Phê duyệt sản phẩm và người bán mới
- Quản lý danh mục sản phẩm
- Theo dõi thống kê và báo cáo
- Quản lý giao dịch tài chính

### 1.4. Phạm Vi Dự Án

**Phạm vi bao gồm:**
- Xây dựng ứng dụng web đáp ứng cho người dùng
- Phát triển hệ thống quản trị tách biệt
- Triển khai cơ sở dữ liệu PostgreSQL
- Tích hợp hệ thống xác thực và phân quyền
- Tích hợp hệ thống ví điện tử và thanh toán
- Xây dựng API backend đầy đủ
- Hỗ trợ tạo dữ liệu mẫu để khởi động nền tảng

**Phạm vi không bao gồm:**
- Ứng dụng di động native (iOS/Android)
- Tích hợp cổng thanh toán trực tuyến bên thứ ba
- Hệ thống giao hàng tự động
- Phân tích dữ liệu người dùng nâng cao

## 2. Kiến Trúc Hệ Thống

### 2.1. Sơ Đồ Tổng Thể

```
+----------------------------------+
|          Người Dùng              |
|   (Khách hàng & Người bán)       |
+----------------------------------+
               |
               v
+----------------------------------+
|        Frontend (React.js)       |
|   Giao diện người dùng và admin  |
+----------------------------------+
               |
               v
+----------------------------------+
|        Backend (Node.js)         |
|     Express + API Endpoints      |
+----------------------------------+
               |
               v
+----------------------------------+
|      Database (PostgreSQL)       |
|     Drizzle ORM + Migrations     |
+----------------------------------+
```

### 2.2. Cấu Trúc Thư Mục

```
tiktok-shop/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── assets/             # Hình ảnh, biểu tượng và tài nguyên tĩnh
│   │   ├── components/         # React components tái sử dụng
│   │   │   ├── ui/             # Các thành phần giao diện cơ bản (shadcn)
│   │   │   ├── home/           # Components cho trang chủ
│   │   │   ├── product/        # Components liên quan đến sản phẩm
│   │   │   ├── auth/           # Components xác thực
│   │   │   ├── admin/          # Components cho giao diện admin
│   │   │   └── seller/         # Components cho người bán
│   │   ├── hooks/              # React custom hooks
│   │   ├── lib/                # Thư viện tiện ích và helpers
│   │   ├── pages/              # Trang giao diện
│   │   │   ├── admin/          # Giao diện admin
│   │   │   ├── seller/         # Giao diện người bán
│   │   │   └── ...             # Các trang người dùng khác
│   │   ├── App.tsx             # Component gốc và định tuyến
│   │   └── main.tsx            # Điểm khởi đầu ứng dụng
│   └── ...
├── server/                     # Backend Express application
│   ├── admin-api.ts            # API dành riêng cho admin
│   ├── auth.ts                 # Xác thực người dùng
│   ├── db.ts                   # Kết nối cơ sở dữ liệu
│   ├── index.ts                # Điểm khởi đầu ứng dụng server
│   ├── routes.ts               # Định nghĩa API routes
│   └── storage.ts              # Lớp truy cập dữ liệu
├── shared/                     # Mã nguồn dùng chung
│   └── schema.ts               # Định nghĩa schema và models
├── utils/                      # Công cụ hỗ trợ
│   ├── sample-products-creator.js  # Tạo sản phẩm mẫu
│   └── ...
├── public/                     # Tài nguyên tĩnh
├── package.json                # Cấu hình dự án và dependencies
└── ...
```

### 2.3. Stack Công Nghệ

**Frontend:**
- **Framework**: React.js 18.x với TypeScript 5.x
- **State Management**: TanStack React Query 5.x
- **Routing**: Wouter (nhẹ hơn React Router)
- **UI Components**: shadcn/ui và Tailwind CSS 3.x
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React và React Icons
- **Charts**: Recharts cho báo cáo và thống kê
- **Bundler**: Vite 5.x

**Backend:**
- **Runtime**: Node.js 20.x
- **Framework**: Express 4.x
- **Authentication**: Passport.js + JWT
- **Type Safety**: TypeScript 5.x
- **API Documentation**: Swagger/OpenAPI

**Database:**
- **RDBMS**: PostgreSQL 15.x
- **ORM**: Drizzle ORM
- **Migration**: Drizzle Kit
- **Validation**: Drizzle-Zod

**DevOps & Tooling:**
- **Version Control**: Git
- **Hosting**: Replit
- **CI/CD**: Replit GitHub integration
- **Code Quality**: ESLint, Prettier
- **Custom Domain**: tiktoksshopp.com

### 2.4. Kiến Trúc Cơ Sở Dữ Liệu

Dự án sử dụng PostgreSQL với Drizzle ORM. Dưới đây là mô hình cơ sở dữ liệu chính:

**Sơ đồ quan hệ chính:**

```
Users (1) -- (0..1) Sellers
      |
      | -- (0..1) Wallets
      |
      | -- (0..N) Orders
      |
      | -- (0..N) Reviews

Products (N) -- (1) Categories
        |
        | -- (1) Sellers
        |
        | -- (0..N) ProductImages
        |
        | -- (0..N) Reviews
        |
        | -- (0..N) CartItems

Orders (1) -- (0..N) OrderItems
      |
      | -- (1) Users

Wallets (1) -- (0..N) Withdrawals
      |
      | -- (1) Users

Banking (1) -- (1) Sellers
       |
       | -- (0..N) Withdrawals
```

**Các bảng chính:**

1. **users**: Thông tin người dùng hệ thống
2. **sellers**: Thông tin người bán hàng
3. **products**: Thông tin sản phẩm
4. **categories**: Danh mục sản phẩm
5. **product_images**: Hình ảnh sản phẩm
6. **orders**: Đơn hàng
7. **order_items**: Chi tiết đơn hàng
8. **carts**: Giỏ hàng
9. **cart_items**: Sản phẩm trong giỏ hàng
10. **reviews**: Đánh giá sản phẩm
11. **wallets**: Ví điện tử
12. **banking**: Thông tin tài khoản ngân hàng
13. **withdrawals**: Yêu cầu rút tiền
14. **affiliates**: Người tham gia tiếp thị liên kết
15. **referrals**: Thông tin giới thiệu

### 2.5. Kiến Trúc API

**Mô hình RESTful API:**

1. **Auth APIs**:
   - `/api/register`: Đăng ký người dùng mới
   - `/api/login`: Đăng nhập người dùng
   - `/api/logout`: Đăng xuất
   - `/api/user`: Lấy thông tin người dùng hiện tại

2. **Product APIs**:
   - `/api/products`: CRUD cho sản phẩm
   - `/api/products/:id/images`: Quản lý hình ảnh sản phẩm
   - `/api/products/featured/top-selling`: Lấy sản phẩm bán chạy
   - `/api/products/category/:categoryId`: Lọc theo danh mục

3. **Category APIs**:
   - `/api/categories`: CRUD cho danh mục

4. **Seller APIs**:
   - `/api/sellers`: CRUD cho người bán
   - `/api/sellers/referral/:code`: Lấy thông tin mã giới thiệu

5. **Order APIs**:
   - `/api/orders`: CRUD cho đơn hàng
   - `/api/orders/:id`: Chi tiết đơn hàng

6. **Cart APIs**:
   - `/api/cart`: Lấy giỏ hàng người dùng
   - `/api/cart/items`: Thêm, sửa, xóa sản phẩm giỏ hàng

7. **Wallet & Banking APIs**:
   - `/api/wallet`: Thông tin ví điện tử
   - `/api/wallet/transactions`: Lịch sử giao dịch
   - `/api/banking`: CRUD cho thông tin ngân hàng
   - `/api/withdrawals`: Yêu cầu rút tiền

8. **Admin APIs**:
   - `/api/admin/statistics/dashboard`: Thống kê tổng quan
   - `/api/admin/sellers/pending`: Quản lý người bán chờ duyệt
   - `/api/admin/products/pending`: Quản lý sản phẩm chờ duyệt
   - `/api/admin/withdrawals/pending`: Quản lý rút tiền chờ duyệt
   - `/api/admin/products/sample-store`: API cửa hàng mẫu

## 3. Phần I: Ứng Dụng Thương Mại Điện Tử

### 3.1. Giao Diện Người Dùng

**Thiết kế tổng thể:**
- Giao diện hiện đại, thân thiện với người dùng
- Thiết kế đáp ứng (responsive) trên cả desktop và thiết bị di động
- Palette màu chính: đỏ đen trắng theo thương hiệu TikTok
- Component library: shadcn/ui với theme tùy chỉnh

**Các trang chính:**
1. **Trang chủ**:
   - Hero banner với sản phẩm nổi bật
   - Phần danh mục sản phẩm với biểu tượng trực quan
   - Section sản phẩm bán chạy và khuyến mãi
   - Call-to-action cho đăng ký người bán

2. **Trang danh mục**:
   - Hiển thị sản phẩm theo danh mục
   - Bộ lọc theo giá, tình trạng kho, đánh giá
   - Sắp xếp theo mới nhất, bán chạy, giá

3. **Trang chi tiết sản phẩm**:
   - Slider hình ảnh sản phẩm
   - Thông tin chi tiết và mô tả sản phẩm
   - Phần đánh giá và bình luận
   - Thông tin người bán
   - Sản phẩm liên quan

4. **Trang giỏ hàng**:
   - Danh sách sản phẩm trong giỏ
   - Cập nhật số lượng và xóa sản phẩm
   - Tính toán tổng đơn hàng
   - Tiến hành thanh toán

5. **Trang thanh toán**:
   - Form địa chỉ giao hàng
   - Xác nhận đơn hàng
   - Chọn phương thức thanh toán

### 3.2. Hệ Thống Xác Thực

**Cơ chế xác thực:**
- Sử dụng Passport.js kết hợp với JWT và Session
- Hỗ trợ đăng nhập bằng tên người dùng/mật khẩu
- Mật khẩu được băm bằng scrypt trước khi lưu vào cơ sở dữ liệu

**Các trang xác thực:**
1. **Trang đăng nhập / đăng ký**:
   - Giao diện hai cột với form bên trái và hero section bên phải
   - Chuyển đổi dễ dàng giữa đăng nhập và đăng ký với Tabs
   - Validation form sử dụng Zod + React Hook Form
   - Xử lý lỗi trực quan với Toast notifications

**Luồng xác thực:**
1. Đăng ký:
   ```
   User → Form đăng ký → Validate dữ liệu → Băm mật khẩu → Lưu vào DB → Tự động đăng nhập
   ```

2. Đăng nhập:
   ```
   User → Form đăng nhập → Xác thực → Tạo session → Redirect tới trang chủ
   ```

3. Đăng xuất:
   ```
   User → Yêu cầu đăng xuất → Xóa session → Redirect tới trang đăng nhập
   ```

**Phân quyền:**
- Middleware `authMiddleware`: Bảo vệ các route yêu cầu đăng nhập
- Middleware `sellerMiddleware`: Bảo vệ các route dành cho người bán
- Middleware `adminMiddleware`: Bảo vệ các route dành cho quản trị viên
- Component `ProtectedRoute`: Bảo vệ các trang client-side

### 3.3. Quản Lý Sản Phẩm

**Chức năng cho người bán:**
1. **Thêm sản phẩm mới**:
   - Form đầy đủ với các trường thông tin sản phẩm
   - Upload nhiều hình ảnh với preview
   - Chọn danh mục và thiết lập giá
   - Cài đặt giá khuyến mãi (nếu có)

2. **Quản lý sản phẩm**:
   - Danh sách sản phẩm với bộ lọc và tìm kiếm
   - Hiển thị trạng thái phê duyệt (đang chờ, đã duyệt, từ chối)
   - Thống kê số lượng đã bán
   - Thao tác nhanh: chỉnh sửa, xóa, đánh dấu nổi bật

3. **Chỉnh sửa sản phẩm**:
   - Cập nhật thông tin sản phẩm
   - Thay đổi hình ảnh sản phẩm
   - Cài đặt giá và khuyến mãi
   - Cập nhật số lượng tồn kho

4. **Quản lý hình ảnh sản phẩm**:
   - Thêm/xóa hình ảnh
   - Đánh dấu hình ảnh chính
   - Sắp xếp thứ tự hiển thị

5. **Quản lý giá sản phẩm**:
   - Trang riêng cho cập nhật giá sản phẩm
   - Thiết lập giá gốc và giá khuyến mãi
   - Tính toán tự động phần trăm giảm giá
   - Xem trước giá mới trước khi lưu

### 3.4. Giỏ Hàng và Thanh Toán

**Giỏ hàng:**
- Lưu trữ giỏ hàng trong cơ sở dữ liệu, liên kết với tài khoản người dùng
- Hỗ trợ thêm, xóa, cập nhật số lượng sản phẩm
- Tính toán tổng giá trị giỏ hàng tự động
- Kiểm tra số lượng tồn kho khi thêm vào giỏ

**Thanh toán:**
1. **Quy trình thanh toán**:
   ```
   Giỏ hàng → Nhập địa chỉ → Xác nhận đơn hàng → Chọn phương thức thanh toán → Hoàn tất
   ```

2. **Phương thức thanh toán**:
   - Thanh toán khi nhận hàng (COD)
   - Chuẩn bị sẵn hạ tầng cho thanh toán trực tuyến

3. **Xử lý đơn hàng**:
   - Tạo đơn hàng mới trong hệ thống
   - Cập nhật số lượng sản phẩm trong kho
   - Xóa giỏ hàng sau khi đặt hàng thành công
   - Gửi email xác nhận đơn hàng (tính năng tương lai)

### 3.5. Quản Lý Đơn Hàng

**Cho người mua:**
- Xem lịch sử đơn hàng và trạng thái hiện tại
- Chi tiết đơn hàng với danh sách sản phẩm
- Theo dõi quá trình giao hàng
- Đánh giá sản phẩm sau khi nhận hàng

**Cho người bán:**
- Danh sách đơn hàng với bộ lọc theo trạng thái
- Cập nhật trạng thái đơn hàng (đang xử lý, đang giao, đã giao)
- Xem chi tiết đơn hàng và thông tin người mua
- Thống kê doanh thu theo đơn hàng

**Trạng thái đơn hàng:**
1. `PROCESSING`: Đơn hàng mới tạo, đang chờ xử lý
2. `CONFIRMED`: Đơn hàng đã được xác nhận
3. `SHIPPED`: Đơn hàng đang được giao
4. `DELIVERED`: Đơn hàng đã giao thành công
5. `CANCELLED`: Đơn hàng đã hủy

### 3.6. Hệ Thống Đánh Giá và Bình Luận

**Đánh giá sản phẩm:**
- Người dùng có thể đánh giá từ 1-5 sao
- Viết nhận xét chi tiết về sản phẩm
- Chỉ cho phép đánh giá sau khi mua và nhận sản phẩm
- Hỗ trợ tải lên hình ảnh sản phẩm thực tế (tính năng tương lai)

**Hiển thị đánh giá:**
- Đánh giá trung bình và tổng số lượt đánh giá
- Biểu đồ phân bố số sao
- Danh sách nhận xét với phân trang
- Sắp xếp theo mới nhất hoặc hữu ích nhất

### 3.7. Tìm Kiếm và Lọc Sản Phẩm

**Tìm kiếm:**
- Thanh tìm kiếm toàn cục trong header
- Tìm kiếm theo từ khóa trong tên và mô tả sản phẩm
- Gợi ý tìm kiếm với danh sách các từ khóa phổ biến
- Lưu lịch sử tìm kiếm của người dùng

**Bộ lọc sản phẩm:**
- Lọc theo danh mục
- Lọc theo khoảng giá
- Lọc theo đánh giá
- Lọc theo trạng thái khuyến mãi
- Lọc theo tình trạng tồn kho

**Sắp xếp:**
- Mới nhất
- Giá từ thấp đến cao
- Giá từ cao đến thấp
- Bán chạy nhất
- Đánh giá cao nhất

### 3.8. Hệ Thống Tiếp Thị Liên Kết

**Đăng ký tiếp thị liên kết:**
- Người bán có thể đăng ký làm người tiếp thị liên kết
- Mỗi người bán được cấp một mã giới thiệu duy nhất
- Người bán có thể chia sẻ mã giới thiệu với người khác

**Chức năng tiếp thị liên kết:**
- Người bán có thể tiếp thị và bán sản phẩm từ các cửa hàng khác
- Hiển thị danh sách sản phẩm có thể tiếp thị
- Thống kê doanh thu từ tiếp thị liên kết
- Hệ thống hoa hồng cho người giới thiệu

**Luồng đăng ký người bán mới:**
```
Người dùng → Đăng ký làm người bán → Nhập mã giới thiệu (nếu có) → Hoàn tất đăng ký → Chờ quản trị viên xác minh
```

### 3.9. Ví Điện Tử và Liên Kết Ngân Hàng

**Ví điện tử:**
- Mỗi người bán được cấp một ví điện tử
- Hiển thị số dư hiện tại, số dư đang chờ xử lý và tổng doanh thu
- Xem lịch sử giao dịch với đầy đủ chi tiết
- Phân loại giao dịch: thu nhập từ đơn hàng, rút tiền, hoa hồng tiếp thị liên kết

**Giao diện ví điện tử:**
- Dashboard hiển thị tổng quan tài chính
- Biểu đồ thống kê doanh thu theo thời gian
- Danh sách các giao dịch gần đây với phân trang
- Bộ lọc giao dịch theo loại và thời gian

**Liên kết ngân hàng:**
- Người bán cần thêm thông tin ngân hàng để rút tiền
- Form thêm tài khoản ngân hàng với các trường:
  - Tên ngân hàng
  - Số tài khoản
  - Tên chủ tài khoản
  - Chi nhánh ngân hàng
- Xác thực và lưu trữ an toàn thông tin ngân hàng
- Hỗ trợ chỉnh sửa thông tin ngân hàng đã lưu

**Quy trình rút tiền:**
```
Người bán → Kiểm tra số dư → Chọn "Rút tiền" → Nhập số tiền → Chọn tài khoản ngân hàng → Gửi yêu cầu → Chờ quản trị viên phê duyệt
```

**Xử lý yêu cầu rút tiền:**
1. Kiểm tra số dư có đủ không
2. Tạo yêu cầu rút tiền với trạng thái "đang chờ"
3. Trừ số tiền từ ví điện tử
4. Yêu cầu chờ quản trị viên phê duyệt
5. Sau khi phê duyệt, cập nhật trạng thái thành "hoàn thành"

**Các trạng thái rút tiền:**
- `PENDING`: Đang chờ phê duyệt
- `APPROVED`: Đã phê duyệt, đang xử lý
- `COMPLETED`: Hoàn thành
- `REJECTED`: Từ chối

## 4. Phần II: Hệ Thống Quản Trị (Admin)

### 4.1. Tổng Quan Hệ Thống Quản Trị

**Đặc điểm:**
- Hệ thống admin được triển khai tách biệt tại URL: `https://tik-tok-admin-ngahunglchp.replit.app`
- Sử dụng JWT để xác thực API giữa frontend và backend
- Giao diện đơn giản, hiệu quả, tập trung vào chức năng

**Giao diện admin:**
- Layout với sidebar điều hướng
- Dashboard tổng quan với các thống kê và biểu đồ
- Các trang quản lý chuyên biệt
- Thông báo real-time về hoạt động mới

**Xác thực admin:**
- Đăng nhập bằng tài khoản admin
- Tạo JWT token với thời hạn 7 ngày
- Kiểm tra quyền admin trước khi cho phép truy cập API

### 4.2. Quản Lý Người Dùng

**Chức năng chính:**
- Xem danh sách tất cả người dùng
- Lọc người dùng theo vai trò (admin, seller, user)
- Xem chi tiết thông tin người dùng
- Khóa/mở khóa tài khoản người dùng
- Đặt lại mật khẩu người dùng (tính năng tương lai)

**Giao diện quản lý người dùng:**
- Bảng dữ liệu với phân trang
- Bộ lọc nâng cao
- Thao tác nhanh với dropdown menu
- Modal xác nhận các thao tác quan trọng

### 4.3. Quản Lý Người Bán

**Quản lý đăng ký người bán:**
- Xem danh sách người bán đang chờ xác minh
- Xem chi tiết hồ sơ đăng ký
- Phê duyệt hoặc từ chối đăng ký
- Cấp mã giới thiệu cho người bán mới

**Quản lý người bán hiện có:**
- Xem danh sách tất cả người bán
- Lọc theo trạng thái (đã xác minh, chưa xác minh)
- Xem thống kê doanh số của người bán
- Quản lý phí hoa hồng và thanh toán

**Giao diện quản lý người bán:**
- Tab phân chia người bán chờ duyệt và người bán hiện có
- Bảng dữ liệu với các trường thông tin quan trọng
- Biểu đồ thống kê doanh số
- Form cấp mã giới thiệu

### 4.4. Quản Lý Sản Phẩm

**Phê duyệt sản phẩm:**
- Xem danh sách sản phẩm đang chờ phê duyệt
- Xem chi tiết sản phẩm và hình ảnh
- Phê duyệt hoặc từ chối sản phẩm
- Gửi lý do từ chối khi cần thiết

**Quản lý sản phẩm hiện có:**
- Xem danh sách tất cả sản phẩm
- Lọc theo danh mục, trạng thái
- Đánh dấu sản phẩm nổi bật (featured)
- Xóa hoặc vô hiệu hóa sản phẩm vi phạm

**Giao diện quản lý sản phẩm:**
- Tab phân chia sản phẩm chờ duyệt và đã duyệt
- Hiển thị hình ảnh thu nhỏ trong bảng
- Preview sản phẩm với modal
- Thao tác phê duyệt hàng loạt

### 4.5. Quản Lý Danh Mục

**Chức năng quản lý danh mục:**
- Xem danh sách tất cả danh mục
- Thêm danh mục mới
- Chỉnh sửa thông tin danh mục
- Tải lên biểu tượng danh mục
- Xóa danh mục (nếu không có sản phẩm liên kết)

**Thông tin danh mục:**
- Tên danh mục
- Slug (URL friendly)
- Mô tả
- Biểu tượng
- Thứ tự hiển thị

**Giao diện quản lý danh mục:**
- Bảng danh sách danh mục
- Form thêm/sửa danh mục
- Upload và crop biểu tượng
- Drag & drop để sắp xếp thứ tự

### 4.6. Quản Lý Đơn Hàng

**Chức năng quản lý đơn hàng:**
- Xem danh sách tất cả đơn hàng
- Lọc đơn hàng theo trạng thái, người bán
- Xem chi tiết đơn hàng và sản phẩm
- Cập nhật trạng thái đơn hàng
- Xử lý hoàn tiền hoặc hủy đơn hàng

**Giao diện quản lý đơn hàng:**
- Bảng đơn hàng với các thông tin cơ bản
- Detail view với đầy đủ chi tiết
- Timeline trạng thái đơn hàng
- Form cập nhật trạng thái

### 4.7. Quản Lý Thanh Toán và Rút Tiền

**Quản lý yêu cầu rút tiền:**
- Xem danh sách yêu cầu rút tiền đang chờ phê duyệt
- Xem chi tiết yêu cầu và thông tin ngân hàng
- Phê duyệt hoặc từ chối yêu cầu
- Ghi chú nội bộ về giao dịch

**Lịch sử thanh toán:**
- Xem tất cả giao dịch đã hoàn thành
- Lọc theo người bán, trạng thái
- Xuất báo cáo (tính năng tương lai)

**Giao diện quản lý thanh toán:**
- Tab phân chia yêu cầu chờ duyệt và lịch sử
- Hiển thị tổng số tiền đang chờ xử lý
- Form xác nhận với thông tin chi tiết
- Kiểm tra chéo thông tin ngân hàng

### 4.8. Báo Cáo và Thống Kê

**Dashboard tổng quan:**
- Tổng số người dùng, đơn hàng, sản phẩm
- Biểu đồ doanh thu theo thời gian (ngày, tuần, tháng)
- Tỷ lệ chuyển đổi và bán hàng
- Thông tin người bán và sản phẩm mới

**Báo cáo chi tiết:**
- Báo cáo doanh thu theo danh mục
- Báo cáo doanh thu theo người bán
- Báo cáo đơn hàng theo trạng thái
- Báo cáo sản phẩm bán chạy

**Giao diện báo cáo:**
- Các biểu đồ trực quan (line, bar, pie)
- Card thống kê với các con số quan trọng
- Bộ lọc thời gian linh hoạt
- Xuất báo cáo dạng CSV (tính năng tương lai)

### 4.9. Quản Lý Cửa Hàng Mẫu

**Chức năng cửa hàng mẫu:**
- Tạo sản phẩm mẫu cho nhiều danh mục
- Tải lên hình ảnh mẫu chất lượng cao
- Đánh dấu sản phẩm là "mẫu" để phân biệt
- Quản lý và cập nhật sản phẩm mẫu

**Công cụ tạo mẫu tự động:**
- Script `sample-products-creator.js` để tạo sản phẩm mẫu tự động
- Hỗ trợ tạo sản phẩm cho 8 danh mục khác nhau
- Tạo dữ liệu mẫu phong phú với giá, mô tả, hình ảnh
- Cấu hình linh hoạt với các tham số

**Giao diện quản lý cửa hàng mẫu:**
- Form tạo sản phẩm mẫu với tất cả thông tin cần thiết
- Chọn nhiều hình ảnh cùng lúc
- Danh sách sản phẩm mẫu hiện có
- Nút tạo mẫu tự động với các tùy chọn

## 5. Triển Khai và Bảo Mật

### 5.1. Môi Trường Triển Khai

**Nền tảng triển khai:**
- Ứng dụng chính triển khai trên Replit
- Hệ thống admin triển khai tại URL riêng biệt
- Sử dụng tên miền tùy chỉnh `tiktoksshopp.com`

**Cấu hình server:**
- Node.js 20.x runtime
- Vite development server cho frontend
- Express server cho backend
- PostgreSQL database

**Biến môi trường:**
- `DATABASE_URL`: Kết nối PostgreSQL
- `JWT_SECRET`: Khóa bảo mật cho token
- `SESSION_SECRET`: Khóa bảo mật cho phiên đăng nhập
- `PORT`: Cổng chạy ứng dụng

### 5.2. Quy Trình CI/CD

**Continuous Integration:**
- Kiểm tra syntax và type với TypeScript
- Lint code với ESLint
- Format code với Prettier
- Unit testing (tính năng tương lai)

**Continuous Deployment:**
- Tự động deploy khi push lên main branch
- Migrations tự động với Drizzle Kit
- Rollback khẩn cấp khi cần

**Quy trình triển khai:**
```
Code → Commit → Push → CI Checks → Build → Deploy → Health Check
```

### 5.3. Bảo Mật Hệ Thống

**Xác thực và ủy quyền:**
- Mật khẩu được băm với scrypt
- JWT cho xác thực API
- Session cho xác thực người dùng
- Middleware kiểm tra quyền truy cập

**Bảo mật dữ liệu:**
- HTTPS cho tất cả kết nối
- Prepared statements để tránh SQL injection
- Input validation với Zod
- Output escaping để tránh XSS

**Các biện pháp bảo mật khác:**
- Rate limiting cho API endpoints
- CSRF protection
- Content Security Policy
- HTTP Security Headers

### 5.4. Sao Lưu và Khôi Phục Dữ Liệu

**Chiến lược sao lưu:**
- Sao lưu cơ sở dữ liệu hàng ngày
- Sao lưu gia tăng hàng giờ
- Lưu trữ sao lưu trong 30 ngày

**Khôi phục dữ liệu:**
- Khôi phục point-in-time
- Quy trình khôi phục khẩn cấp
- Testing khôi phục định kỳ

### 5.5. Mở Rộng và Khả Năng Chịu Tải

**Chiến lược mở rộng:**
- Horizontal scaling cho application servers
- Database connection pooling
- Caching với Redis (tính năng tương lai)
- CDN cho tài nguyên tĩnh

**Tối ưu hóa hiệu suất:**
- Code splitting và lazy loading
- Tối ưu hình ảnh
- Minification và bundling
- Database indexing

## 6. Hướng Dẫn Sử Dụng Chi Tiết

### 6.1. Hướng Dẫn Cài Đặt

**Yêu cầu hệ thống:**
- Node.js 18.x trở lên
- PostgreSQL 15.x trở lên
- Git

**Cài đặt local:**
```bash
# Clone repository
git clone https://github.com/yourusername/tiktok-shop.git
cd tiktok-shop

# Cài đặt dependencies
npm install

# Thiết lập biến môi trường
cp .env.example .env
# Chỉnh sửa file .env với thông tin cấu hình của bạn

# Chạy migration
npm run db:push

# Chạy ứng dụng
npm run dev
```

**Triển khai production:**
```bash
# Build frontend
npm run build

# Chạy production server
npm run start
```

### 6.2. Hướng Dẫn Sử Dụng Cho Người Dùng

**Đăng ký và đăng nhập:**
1. Truy cập trang web TikTok Shop
2. Nhấp vào "Đăng nhập / Đăng ký" ở góc phải trên
3. Chọn tab "Đăng ký" và điền thông tin
4. Xác nhận email (nếu được yêu cầu)
5. Đăng nhập với tài khoản vừa tạo

**Mua sắm:**
1. Duyệt sản phẩm qua danh mục hoặc tìm kiếm
2. Xem chi tiết sản phẩm và đánh giá
3. Chọn số lượng và nhấp "Thêm vào giỏ hàng"
4. Xem giỏ hàng và nhấp "Thanh toán"
5. Nhập địa chỉ giao hàng và chọn phương thức thanh toán
6. Xác nhận đơn hàng

**Theo dõi đơn hàng:**
1. Đăng nhập vào tài khoản
2. Chọn "Đơn hàng" từ menu người dùng
3. Xem danh sách đơn hàng và trạng thái
4. Nhấp vào đơn hàng để xem chi tiết

**Đánh giá sản phẩm:**
1. Đăng nhập vào tài khoản
2. Chọn "Đơn hàng" từ menu người dùng
3. Tìm đơn hàng đã nhận và nhấp "Đánh giá"
4. Chọn số sao và viết nhận xét
5. Gửi đánh giá

### 6.3. Hướng Dẫn Sử Dụng Cho Người Bán

**Đăng ký làm người bán:**
1. Đăng nhập vào tài khoản người dùng
2. Chọn "Trở thành người bán" từ menu
3. Điền thông tin gian hàng và nhập mã giới thiệu (nếu có)
4. Gửi đơn đăng ký và chờ phê duyệt
5. Sau khi được phê duyệt, truy cập khu vực người bán

**Thêm sản phẩm:**
1. Đăng nhập vào tài khoản người bán
2. Chọn "Sản phẩm" từ menu người bán
3. Nhấp "Thêm sản phẩm mới"
4. Điền thông tin sản phẩm và tải lên hình ảnh
5. Lưu sản phẩm và chờ phê duyệt

**Quản lý đơn hàng:**
1. Đăng nhập vào tài khoản người bán
2. Chọn "Đơn hàng" từ menu người bán
3. Xem danh sách đơn hàng mới
4. Cập nhật trạng thái đơn hàng

**Thiết lập ví điện tử và rút tiền:**
1. Đăng nhập vào tài khoản người bán
2. Chọn "Ví điện tử" từ menu người bán
3. Thêm thông tin tài khoản ngân hàng (nếu chưa có)
4. Xem số dư và lịch sử giao dịch
5. Nhấp "Rút tiền" và nhập số tiền cần rút
6. Xác nhận và chờ phê duyệt

**Tiếp thị liên kết:**
1. Đăng nhập vào tài khoản người bán
2. Chọn "Tiếp thị liên kết" từ menu người bán
3. Xem mã giới thiệu của bạn
4. Duyệt sản phẩm có thể tiếp thị
5. Chọn sản phẩm để tiếp thị

### 6.4. Hướng Dẫn Sử Dụng Cho Quản Trị Viên

**Đăng nhập quản trị:**
1. Truy cập URL admin: `https://tik-tok-admin-ngahunglchp.replit.app`
2. Đăng nhập với tài khoản admin
3. Truy cập dashboard quản trị

**Quản lý người bán:**
1. Chọn "Quản lý người bán" từ sidebar
2. Xem danh sách người bán đang chờ duyệt
3. Kiểm tra thông tin và phê duyệt/từ chối
4. Cấp mã giới thiệu cho người bán mới

**Quản lý sản phẩm:**
1. Chọn "Quản lý sản phẩm" từ sidebar
2. Xem danh sách sản phẩm đang chờ duyệt
3. Kiểm tra thông tin và phê duyệt/từ chối
4. Quản lý sản phẩm vi phạm

**Quản lý rút tiền:**
1. Chọn "Quản lý rút tiền" từ sidebar
2. Xem danh sách yêu cầu rút tiền đang chờ duyệt
3. Kiểm tra thông tin ngân hàng
4. Phê duyệt hoặc từ chối yêu cầu

**Tạo cửa hàng mẫu:**
1. Chọn "Cửa hàng mẫu" từ sidebar
2. Nhấp "Tạo sản phẩm mẫu"
3. Điền thông tin sản phẩm và tải lên hình ảnh
4. Lưu sản phẩm mẫu
5. Hoặc sử dụng công cụ tạo mẫu tự động

## 7. Phát Triển Trong Tương Lai

### 7.1. Kế Hoạch Phát Triển

**Lộ trình ngắn hạn (3 tháng):**
- Tối ưu hóa hiệu suất frontend và backend
- Cải thiện UX/UI dựa trên phản hồi người dùng
- Bổ sung thêm phương thức thanh toán
- Mở rộng phạm vi danh mục sản phẩm

**Lộ trình trung hạn (6 tháng):**
- Phát triển ứng dụng di động native
- Tích hợp hệ thống thông báo thời gian thực
- Bổ sung tính năng chat giữa người mua và người bán
- Cải thiện hệ thống tìm kiếm và gợi ý sản phẩm

**Lộ trình dài hạn (12 tháng):**
- Mở rộng sang các thị trường quốc tế
- Tích hợp AI cho gợi ý cá nhân hóa
- Phát triển marketplace API cho bên thứ ba
- Triển khai chương trình khách hàng thân thiết

### 7.2. Tính Năng Dự Kiến

**Tính năng người dùng:**
- Ứng dụng di động (iOS và Android)
- Livestream bán hàng
- Chương trình khách hàng thân thiết
- Mã giảm giá và flash sale
- Chat với người bán

**Tính năng người bán:**
- Dashboard phân tích nâng cao
- Công cụ marketing tự động
- Tối ưu hóa SEO cho sản phẩm
- Quản lý kho hàng nâng cao
- Tích hợp với các công cụ bán hàng khác

**Tính năng admin:**
- Reporting và analytics nâng cao
- Hệ thống phát hiện gian lận
- Quản lý chiến dịch marketing
- Tự động hóa các quy trình phê duyệt

### 7.3. Thách Thức và Giải Pháp

**Thách thức kỹ thuật:**
- Khả năng mở rộng khi số lượng người dùng tăng
- Hiệu suất và tối ưu hóa cơ sở dữ liệu
- Bảo mật dữ liệu người dùng và thanh toán
- Tích hợp với các hệ thống bên thứ ba

**Giải pháp:**
- Thiết kế kiến trúc microservices
- Caching và CDN cho tài nguyên tĩnh
- Áp dụng các tiêu chuẩn bảo mật
- Phát triển API gateway và adapter patterns

**Thách thức kinh doanh:**
- Cạnh tranh với các nền tảng thương mại điện tử lớn
- Thu hút và giữ chân người bán
- Xây dựng lòng tin của người dùng
- Mở rộng thị trường

**Giải pháp:**
- Tập trung vào trải nghiệm người dùng độc đáo
- Chương trình ưu đãi cho người bán mới
- Chính sách bảo vệ người mua và đảm bảo chất lượng
- Chiến lược thâm nhập thị trường theo từng giai đoạn

## 8. Kết Luận

### 8.1. Tổng Kết Dự Án

Dự án TikTok Shop đã được phát triển thành công với đầy đủ chức năng của một nền tảng thương mại điện tử hiện đại:

- Giao diện người dùng thân thiện, đáp ứng trên nhiều thiết bị
- Hệ thống quản lý sản phẩm và đơn hàng toàn diện
- Ví điện tử và hệ thống thanh toán an toàn
- Cơ chế tiếp thị liên kết và mã giới thiệu
- Hệ thống quản trị mạnh mẽ

Dự án tuân thủ các nguyên tắc thiết kế hiện đại với kiến trúc phân lớp rõ ràng, giúp dễ dàng bảo trì và mở rộng trong tương lai.

### 8.2. Thành Tựu và Giá Trị

**Thành tựu kỹ thuật:**
- Xây dựng hệ thống end-to-end với frontend và backend
- Thiết kế cơ sở dữ liệu tối ưu với Drizzle ORM
- Triển khai xác thực và phân quyền an toàn
- Tích hợp thanh toán và quản lý tài chính

**Giá trị kinh doanh:**
- Tạo sàn thương mại điện tử đa người dùng
- Mô hình hoa hồng từ các giao dịch
- Hệ thống tiếp thị liên kết để mở rộng người bán
- Cơ sở dữ liệu sản phẩm phong phú qua cửa hàng mẫu

**Giá trị người dùng:**
- Trải nghiệm mua sắm thuận tiện
- Đa dạng sản phẩm từ nhiều người bán
- Thanh toán an toàn và theo dõi đơn hàng
- Đánh giá và nhận xét để tham khảo

## 9. Phụ Lục

### 9.1. Thuật Ngữ

- **Marketplace**: Sàn thương mại điện tử nơi nhiều người bán có thể bán sản phẩm
- **Tiếp thị liên kết (Affiliate Marketing)**: Hình thức tiếp thị dựa trên hoa hồng
- **JWT (JSON Web Token)**: Chuẩn mở để truyền thông tin an toàn
- **ORM (Object-Relational Mapping)**: Kỹ thuật chuyển đổi dữ liệu giữa hệ thống không tương thích
- **REST API**: Kiến trúc API tuân theo các nguyên tắc Representational State Transfer

### 9.2. Tài Liệu Tham Khảo

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [TanStack React Query Documentation](https://react-query.tanstack.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### 9.3. Mẫu Dữ Liệu API

**Ví dụ response API sản phẩm:**
```json
{
  "id": 1,
  "name": "Áo Thun Unisex TikTok Trends",
  "slug": "ao-thun-unisex-tiktok-trends",
  "description": "Áo thun unisex chất liệu cotton mềm mại, thoáng mát. Thiết kế đơn giản với logo TikTok Trends hiện đại, phù hợp cho cả nam và nữ.",
  "price": 199000,
  "discountedPrice": 149000,
  "isDiscounted": true,
  "stock": 100,
  "categoryId": 1,
  "sellerId": 1,
  "status": "approved",
  "isFeatured": true,
  "image": "https://example.com/images/product1.jpg",
  "sold": 50,
  "createdAt": "2025-03-01T00:00:00.000Z",
  "updatedAt": "2025-03-30T00:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Thời trang",
    "slug": "thoi-trang"
  },
  "seller": {
    "id": 1,
    "storeName": "TikTok Official Store",
    "isVerified": true
  },
  "images": [
    {
      "id": 1,
      "url": "https://example.com/images/product1-1.jpg",
      "isMain": true
    },
    {
      "id": 2,
      "url": "https://example.com/images/product1-2.jpg",
      "isMain": false
    }
  ]
}
```

**Ví dụ response API ví điện tử:**
```json
{
  "id": 1,
  "userId": 2,
  "balance": 1560000,
  "pendingBalance": 450000,
  "totalEarnings": 5250000,
  "createdAt": "2025-01-15T00:00:00.000Z",
  "updatedAt": "2025-04-01T00:00:00.000Z",
  "transactions": [
    {
      "id": "W12",
      "type": "withdrawal",
      "amount": 1000000,
      "description": "Rút tiền về tài khoản VCB - 9876543210",
      "status": "completed",
      "createdAt": "2025-03-25T00:00:00.000Z"
    },
    {
      "id": "O45",
      "type": "earning",
      "amount": 270000,
      "description": "Thu nhập từ đơn hàng #45",
      "status": "completed",
      "createdAt": "2025-03-20T00:00:00.000Z"
    }
  ]
}
```

---

© 2025 TikTok Shop. Tất cả các quyền được bảo lưu.