import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { checkConnection } from "./db";
import { adminApiRouter } from "./admin-api";
import { 
  insertCategorySchema, insertProductSchema, insertSellerSchema, 
  insertBankingSchema, insertProductImageSchema, insertReviewSchema, 
  insertBotSchema, insertOrderSchema, insertOrderItemSchema,
  insertWithdrawalSchema, USER_ROLES, PRODUCT_STATUS,
  WITHDRAWAL_STATUS, BOT_STATUS, ORDER_STATUS 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Check database connection
  await checkConnection();

  // Setup Auth Routes and Middleware
  const { authMiddleware, adminMiddleware, sellerMiddleware } = setupAuth(app);

  // API routes
  
  // Categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách danh mục", error });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin danh mục", error });
    }
  });

  app.post("/api/categories", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu danh mục không hợp lệ", error });
    }
  });

  app.patch("/api/categories/:id", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Không thể cập nhật danh mục", error });
    }
  });

  app.delete("/api/categories/:id", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa danh mục", error });
    }
  });

  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { categoryId, sellerId, status, limit, offset, affiliate } = req.query;
      
      // Nếu đây là yêu cầu cho tiếp thị liên kết
      if (affiliate === 'true') {
        console.log("Đang lấy sản phẩm cho tiếp thị liên kết");
        try {
          const affiliateProducts = await storage.getAffiliateProducts();
          console.log(`Tìm thấy ${affiliateProducts.length} sản phẩm cho tiếp thị liên kết`);
          
          // Lấy thêm hình ảnh cho sản phẩm
          const productsWithImages = await Promise.all(
            affiliateProducts.map(async (product) => {
              const images = await storage.getProductImages(product.id);
              const mainImage = images.find(img => img.isMain);
              
              return {
                ...product,
                mainImage: mainImage ? mainImage.url : product.image
              };
            })
          );
          
          return res.json(productsWithImages);
        } catch (error) {
          console.error("Lỗi khi lấy sản phẩm tiếp thị liên kết:", error);
          return res.status(500).json({ message: "Lỗi khi lấy sản phẩm tiếp thị liên kết" });
        }
      }
      
      const options: any = {};
      if (categoryId) options.categoryId = parseInt(categoryId as string);
      if (sellerId) options.sellerId = parseInt(sellerId as string);
      if (status) options.status = status as string;
      if (limit) options.limit = parseInt(limit as string);
      if (offset) options.offset = parseInt(offset as string);
      
      const products = await storage.getAllProducts(options);
      
      // Lấy thêm hình ảnh cho sản phẩm
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await storage.getProductImages(product.id);
          const mainImage = images.find(img => img.isMain);
          
          return {
            ...product,
            mainImage: mainImage ? mainImage.url : product.image
          };
        })
      );
      
      res.json(productsWithImages);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Không thể lấy danh sách sản phẩm", error });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin sản phẩm", error });
    }
  });

  app.get("/api/products/slug/:slug", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin sản phẩm", error });
    }
  });

  app.get("/api/products/featured/top-selling", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const products = await storage.getTopSellingProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách sản phẩm bán chạy", error });
    }
  });

  app.get("/api/products/featured/discounted", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const products = await storage.getDiscountedProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách sản phẩm giảm giá", error });
    }
  });

  app.get("/api/products/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const products = await storage.getAllProducts({ categoryId });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách sản phẩm theo danh mục", error });
    }
  });

  app.post("/api/products", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu sản phẩm không hợp lệ", error });
    }
  });

  app.patch("/api/products/:id", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      // Tất cả người bán đều có thể cập nhật bất kỳ sản phẩm nào
      // Chỉ cần kiểm tra người dùng là người bán hoặc admin
      if (req.user!.role === USER_ROLES.ADMIN || req.user!.role === USER_ROLES.SELLER) {
        const updatedProduct = await storage.updateProduct(id, req.body);
        return res.json(updatedProduct);
      } else {
        return res.status(403).json({ message: "Bạn không có quyền cập nhật sản phẩm này" });
      }
    } catch (error) {
      res.status(400).json({ message: "Không thể cập nhật sản phẩm", error });
    }
  });

  app.delete("/api/products/:id", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      // Tất cả người bán đều có thể xóa bất kỳ sản phẩm nào
      // Chỉ cần kiểm tra người dùng là người bán hoặc admin
      if (req.user!.role === USER_ROLES.ADMIN || req.user!.role === USER_ROLES.SELLER) {
        const success = await storage.deleteProduct(id);
        return res.status(204).end();
      } else {
        return res.status(403).json({ message: "Bạn không có quyền xóa sản phẩm này" });
      }
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa sản phẩm", error });
    }
  });

  // Product Images
  app.get("/api/products/:id/images", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const images = await storage.getProductImages(id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách hình ảnh sản phẩm", error });
    }
  });

  app.post("/api/products/:id/images", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      // Tất cả người bán đều có thể thêm hình ảnh cho bất kỳ sản phẩm nào
      // Chỉ cần kiểm tra người dùng là người bán hoặc admin
      if (req.user!.role === USER_ROLES.ADMIN || req.user!.role === USER_ROLES.SELLER) {
        const imageData = insertProductImageSchema.parse({
          ...req.body,
          productId
        });
        
        const image = await storage.addProductImage(imageData);
        return res.status(201).json(image);
      } else {
        return res.status(403).json({ message: "Bạn không có quyền thêm hình ảnh cho sản phẩm này" });
      }
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu hình ảnh không hợp lệ", error });
    }
  });

  app.delete("/api/product-images/:id", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeProductImage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy hình ảnh" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa hình ảnh", error });
    }
  });

  app.patch("/api/product-images/:id/main", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.setMainProductImage(id);
      
      if (!image) {
        return res.status(404).json({ message: "Không tìm thấy hình ảnh" });
      }
      
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: "Không thể đặt hình ảnh chính", error });
    }
  });

  // Sellers
  app.get("/api/sellers", async (req: Request, res: Response) => {
    try {
      const sellers = await storage.getAllSellers();
      res.json(sellers);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách người bán", error });
    }
  });

  app.get("/api/sellers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const seller = await storage.getSeller(id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy người bán" });
      }
      
      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin người bán", error });
    }
  });

  app.get("/api/sellers/referral/:code", async (req: Request, res: Response) => {
    try {
      const seller = await storage.getSellerByReferralCode(req.params.code);
      
      if (!seller) {
        return res.status(404).json({ message: "Mã giới thiệu không hợp lệ" });
      }
      
      res.json(seller);
    } catch (error) {
      res.status(500).json({ message: "Không thể kiểm tra mã giới thiệu", error });
    }
  });
  
  // Lấy thông tin người bán theo ID người dùng
  app.get("/api/sellers/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const seller = await storage.getSellerByUserId(userId);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy thông tin người bán" });
      }
      
      res.json(seller);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người bán theo userId:", error);
      res.status(500).json({ message: "Không thể lấy thông tin người bán" });
    }
  });

  app.post("/api/sellers", authMiddleware, async (req: Request, res: Response) => {
    try {
      // Check if user is already a seller
      const existingSeller = await storage.getSellerByUserId(req.user!.id);
      
      if (existingSeller) {
        return res.status(400).json({ message: "Bạn đã là người bán" });
      }
      
      const sellerData = insertSellerSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Kiểm tra mã giới thiệu nếu có
      let referringSeller = null;
      if (req.body.referralCode) {
        referringSeller = await storage.getSellerByReferralCode(req.body.referralCode);
        if (!referringSeller) {
          return res.status(400).json({ message: "Mã giới thiệu không hợp lệ" });
        }
      }
      
      const seller = await storage.createSeller(sellerData);
      
      // Update user role to seller
      await storage.updateUser(req.user!.id, { role: USER_ROLES.SELLER });
      
      // Create wallet for seller
      await storage.createWallet({ userId: req.user!.id, balance: 0 });
      
      // Xử lý tiếp thị liên kết nếu có mã giới thiệu
      if (referringSeller) {
        // Kiểm tra xem người giới thiệu có phải là affiliate không
        const referringUser = await storage.getUser(referringSeller.userId);
        const referringAffiliate = referringUser?.role === USER_ROLES.AFFILIATE ?
          await storage.getAffiliateByUserId(referringSeller.userId) : null;
        
        if (referringAffiliate) {
          // Tạo bản ghi giới thiệu mới
          await storage.createReferral({
            affiliateId: referringAffiliate.id,
            referredUserId: req.user!.id,
            status: "completed",
          });
          
          // Gửi thông báo cho người giới thiệu
          await storage.createNotification({
            userId: referringSeller.userId,
            title: "Giới thiệu thành công!",
            message: `Người dùng mới đã đăng ký bằng mã giới thiệu của bạn.`,
            type: "referral",
            isRead: false,
            link: "/seller/dashboard"
          });
        }
      }
      
      res.status(201).json(seller);
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu người bán không hợp lệ", error });
    }
  });

  app.patch("/api/sellers/:id", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const seller = await storage.getSeller(id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy người bán" });
      }
      
      // Check if user is the seller or admin
      if (req.user!.role !== USER_ROLES.ADMIN && seller.userId !== req.user!.id) {
        return res.status(403).json({ message: "Bạn không có quyền cập nhật thông tin người bán này" });
      }
      
      const updatedSeller = await storage.updateSeller(id, req.body);
      res.json(updatedSeller);
    } catch (error) {
      res.status(400).json({ message: "Không thể cập nhật thông tin người bán", error });
    }
  });

  // Banking
  app.get("/api/banking", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const seller = await storage.getSellerByUserId(req.user!.id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy thông tin người bán" });
      }
      
      // Lấy thông tin banking dựa trên seller.id
      try {
        const banking = await storage.getBanking(seller.id);
        
        if (!banking) {
          // Thông báo 404 là bình thường nếu chưa có thông tin ngân hàng
          return res.status(404).json({ message: "Chưa có thông tin ngân hàng" });
        }
        
        return res.json(banking);
      } catch (bankingErr) {
        console.error("Lỗi khi truy vấn thông tin ngân hàng:", bankingErr);
        // Nếu chưa có thông tin ngân hàng, trả về thông báo 404 thay vì lỗi 500
        return res.status(404).json({ message: "Chưa có thông tin ngân hàng" });
      }
    } catch (error) {
      console.error("Lỗi chung khi lấy thông tin ngân hàng:", error);
      res.status(500).json({ message: "Không thể lấy thông tin ngân hàng", error: error.message });
    }
  });

  app.post("/api/banking", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const seller = await storage.getSellerByUserId(req.user!.id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy thông tin người bán" });
      }
      
      // Check if banking info already exists
      const existingBanking = await storage.getBanking(seller.id);
      
      if (existingBanking) {
        return res.status(400).json({ message: "Đã có thông tin ngân hàng" });
      }
      
      const bankingData = insertBankingSchema.parse({
        ...req.body,
        sellerId: seller.id
      });
      
      const banking = await storage.createBanking(bankingData);
      res.status(201).json(banking);
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu ngân hàng không hợp lệ", error });
    }
  });

  app.patch("/api/banking/:id", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const banking = await storage.getBanking(id);
      
      if (!banking) {
        return res.status(404).json({ message: "Không tìm thấy thông tin ngân hàng" });
      }
      
      const seller = await storage.getSeller(banking.sellerId);
      
      if (!seller || (req.user!.role !== USER_ROLES.ADMIN && seller.userId !== req.user!.id)) {
        return res.status(403).json({ message: "Bạn không có quyền cập nhật thông tin ngân hàng này" });
      }
      
      const updatedBanking = await storage.updateBanking(id, req.body);
      res.json(updatedBanking);
    } catch (error) {
      res.status(400).json({ message: "Không thể cập nhật thông tin ngân hàng", error });
    }
  });

  // Wallet
  app.get("/api/wallet", authMiddleware, async (req: Request, res: Response) => {
    try {
      const wallet = await storage.getWallet(req.user!.id);
      
      if (!wallet) {
        return res.status(404).json({ message: "Không tìm thấy ví điện tử" });
      }
      
      // Lấy thông tin bổ sung
      const seller = await storage.getSellerByUserId(req.user!.id);
      let pendingBalance = 0;
      let totalEarnings = 0;
      
      if (seller) {
        // Lấy số dư đang chờ xử lý từ các đơn hàng
        const pendingOrders = await storage.getSellerOrders(seller.id);
        pendingBalance = pendingOrders
          .filter(order => order.status === ORDER_STATUS.PROCESSING || order.status === ORDER_STATUS.SHIPPED)
          .reduce((sum, order) => sum + order.totalAmount, 0) * 0.9; // 90% của giá trị đơn hàng
          
        // Tính tổng doanh thu
        const completedOrders = pendingOrders
          .filter(order => order.status === ORDER_STATUS.DELIVERED);
        totalEarnings = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0) * 0.9;
      }
      
      res.json({
        ...wallet,
        pendingBalance,
        totalEarnings
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin ví điện tử", error });
    }
  });
  
  // Lấy lịch sử giao dịch của ví
  app.get("/api/wallet/transactions", authMiddleware, async (req: Request, res: Response) => {
    try {
      const wallet = await storage.getWallet(req.user!.id);
      
      if (!wallet) {
        return res.status(404).json({ message: "Không tìm thấy ví điện tử" });
      }
      
      // Tạo mảng giao dịch từ các nguồn khác nhau
      const transactions: any[] = [];
      
      try {
        // Thêm lịch sử rút tiền
        const withdrawals = await storage.getUserWithdrawals(req.user!.id);
        
        // Lấy thông tin ngân hàng cho mỗi yêu cầu rút tiền
        const withdrawalsWithDetails = await Promise.all(
          withdrawals.map(async (w) => {
            try {
              const banking = await storage.getBanking(w.bankingId);
              return { ...w, banking };
            } catch (err) {
              console.error("Lỗi khi lấy thông tin ngân hàng:", err);
              return { ...w, banking: null };
            }
          })
        );
        
        const withdrawalTransactions = withdrawalsWithDetails.map(w => ({
          id: `W${w.id}`,
          type: 'withdrawal',
          amount: w.amount,
          description: `Rút tiền về tài khoản ${w.banking?.bankName || 'Không xác định'} - ${w.banking?.accountNumber || 'Không xác định'}`,
          status: w.status,
          createdAt: w.createdAt ? new Date(w.createdAt) : new Date()
        }));
        transactions.push(...withdrawalTransactions);
      } catch (err) {
        console.error("Lỗi khi xử lý dữ liệu rút tiền:", err);
      }
      
      try {
        // Thêm thu nhập từ đơn hàng
        const seller = await storage.getSellerByUserId(req.user!.id);
        if (seller) {
          const orders = await storage.getSellerOrders(seller.id);
          const orderTransactions = orders
            .filter(o => o.status === ORDER_STATUS.DELIVERED)
            .map(o => ({
              id: `O${o.id}`,
              type: 'earning',
              amount: o.totalAmount * 0.9, // 90% giá trị đơn hàng
              description: `Thu nhập từ đơn hàng #${o.id}`,
              status: 'completed',
              createdAt: o.updatedAt || o.createdAt || new Date()
            }));
          transactions.push(...orderTransactions);
        }
      } catch (err) {
        console.error("Lỗi khi xử lý dữ liệu thu nhập:", err);
      }
      
      // Sắp xếp theo thời gian gần nhất
      transactions.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
        return dateB.getTime() - dateA.getTime();
      });
      
      res.json(transactions);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử giao dịch:", error);
      // Trả về mảng rỗng thay vì lỗi để tránh lỗi parsing JSON
      res.json([]);
    }
  });

  // Withdrawals
  app.get("/api/withdrawals", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const withdrawals = await storage.getUserWithdrawals(req.user!.id);
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách yêu cầu rút tiền", error });
    }
  });

  app.post("/api/withdrawals", sellerMiddleware, async (req: Request, res: Response) => {
    try {
      const wallet = await storage.getWallet(req.user!.id);
      
      if (!wallet) {
        return res.status(404).json({ message: "Không tìm thấy ví điện tử" });
      }
      
      const seller = await storage.getSellerByUserId(req.user!.id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy thông tin người bán" });
      }
      
      const banking = await storage.getBanking(seller.id);
      
      if (!banking) {
        return res.status(400).json({ message: "Chưa cập nhật thông tin ngân hàng" });
      }
      
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Số tiền không hợp lệ" });
      }
      
      if (amount > wallet.balance) {
        return res.status(400).json({ message: "Số dư không đủ" });
      }
      
      const withdrawalData = insertWithdrawalSchema.parse({
        walletId: wallet.id,
        bankingId: banking.id,
        amount,
        status: WITHDRAWAL_STATUS.PENDING
      });
      
      const withdrawal = await storage.createWithdrawal(withdrawalData);
      
      // Subtract amount from wallet
      await storage.updateWalletBalance(wallet.id, -amount);
      
      res.status(201).json(withdrawal);
    } catch (error) {
      res.status(400).json({ message: "Không thể tạo yêu cầu rút tiền", error });
    }
  });

  // Reviews
  app.get("/api/reviews/product/:productId", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách đánh giá", error });
    }
  });

  app.post("/api/reviews", authMiddleware, async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Check if product exists
      const product = await storage.getProduct(reviewData.productId);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      // TODO: Check if user has purchased the product
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu đánh giá không hợp lệ", error });
    }
  });

  // Cart
  app.get("/api/cart", authMiddleware, async (req: Request, res: Response) => {
    try {
      let cart = await storage.getCart(req.user!.id);
      
      // Create cart if it doesn't exist
      if (!cart) {
        cart = await storage.createCart({ userId: req.user!.id });
      }
      
      const items = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        ...cart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin giỏ hàng", error });
    }
  });

  app.post("/api/cart/items", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
      }
      
      // Check if product exists and is available
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      if (product.status !== PRODUCT_STATUS.APPROVED) {
        return res.status(400).json({ message: "Sản phẩm không có sẵn" });
      }
      
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Số lượng sản phẩm không đủ" });
      }
      
      // Get or create cart
      let cart = await storage.getCart(req.user!.id);
      
      if (!cart) {
        cart = await storage.createCart({ userId: req.user!.id });
      }
      
      // Check if item already exists in cart
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update quantity
        const updatedItem = await storage.updateCartItem(
          existingItem.id, 
          existingItem.quantity + quantity
        );
        
        return res.json(updatedItem);
      }
      
      // Add new item to cart
      const cartItem = await storage.addCartItem({
        cartId: cart.id,
        productId,
        quantity
      });
      
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Không thể thêm sản phẩm vào giỏ hàng", error });
    }
  });

  app.patch("/api/cart/items/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }
      
      // Check if cart item exists and belongs to user
      const cart = await storage.getCart(req.user!.id);
      
      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(item => item.id === id);
      
      if (!existingItem) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }
      
      // Check if product has enough stock
      const product = await storage.getProduct(existingItem.productId);
      
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: "Số lượng sản phẩm không đủ" });
      }
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: "Không thể cập nhật giỏ hàng", error });
    }
  });

  app.delete("/api/cart/items/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if cart item exists and belongs to user
      const cart = await storage.getCart(req.user!.id);
      
      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(item => item.id === id);
      
      if (!existingItem) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }
      
      await storage.removeCartItem(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Không thể xóa sản phẩm khỏi giỏ hàng", error });
    }
  });

  // Orders
  app.get("/api/orders", authMiddleware, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getUserOrders(req.user!.id);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách đơn hàng", error });
    }
  });

  app.get("/api/orders/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      
      // Check if user is the buyer, seller with items in this order, or admin
      if (order.userId !== req.user!.id) {
        if (req.user!.role !== USER_ROLES.ADMIN) {
          if (req.user!.role === USER_ROLES.SELLER) {
            const seller = await storage.getSellerByUserId(req.user!.id);
            if (!seller) {
              return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này" });
            }
            
            const items = await storage.getOrderItems(order.id);
            const hasSellerItems = items.some(item => item.sellerId === seller.id);
            
            if (!hasSellerItems) {
              return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này" });
            }
          } else {
            return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này" });
          }
        }
      }
      
      const items = await storage.getOrderItems(order.id);
      
      res.json({
        ...order,
        items
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin đơn hàng", error });
    }
  });

  app.post("/api/orders", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { address, phoneNumber, items } = req.body;
      
      if (!address || !phoneNumber || !items || !items.length) {
        return res.status(400).json({ message: "Thông tin đơn hàng không đầy đủ" });
      }
      
      // Calculate total amount and check stock
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        
        if (!product) {
          return res.status(404).json({ message: `Không tìm thấy sản phẩm: ${item.productId}` });
        }
        
        if (product.status !== PRODUCT_STATUS.APPROVED) {
          return res.status(400).json({ message: `Sản phẩm không có sẵn: ${product.name}` });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Sản phẩm không đủ số lượng: ${product.name}` });
        }
        
        const price = product.discountedPrice || product.price;
        const itemTotal = price * item.quantity;
        
        totalAmount += itemTotal;
        
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price,
          sellerId: product.sellerId || 0
        });
      }
      
      // Create order
      const orderData = insertOrderSchema.parse({
        userId: req.user!.id,
        status: ORDER_STATUS.PENDING,
        totalAmount,
        address,
        phoneNumber
      });
      
      const order = await storage.createOrder(orderData);
      
      // Add order items
      for (const item of orderItems) {
        await storage.addOrderItem({
          ...item,
          orderId: order.id
        });
        
        // Update product stock
        const product = await storage.getProduct(item.productId);
        if (product && product.stock >= item.quantity) {
          const newStock = product.stock - item.quantity;
          await storage.updateProduct(item.productId, { stock: newStock });
        }
      }
      
      // Clear cart if order is created successfully
      const cart = await storage.getCart(req.user!.id);
      if (cart) {
        await storage.clearCart(cart.id);
      }
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Không thể tạo đơn hàng", error });
    }
  });

  // Admin Routes
  app.get("/api/admin/withdrawals/pending", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const withdrawals = await storage.getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách yêu cầu rút tiền", error });
    }
  });

  app.patch("/api/admin/withdrawals/:id/approve", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const withdrawal = await storage.getWithdrawal(id);
      
      if (!withdrawal) {
        return res.status(404).json({ message: "Không tìm thấy yêu cầu rút tiền" });
      }
      
      if (withdrawal.status !== WITHDRAWAL_STATUS.PENDING) {
        return res.status(400).json({ message: "Yêu cầu rút tiền đã được xử lý" });
      }
      
      const updatedWithdrawal = await storage.updateWithdrawalStatus(id, WITHDRAWAL_STATUS.APPROVED);
      res.json(updatedWithdrawal);
    } catch (error) {
      res.status(500).json({ message: "Không thể duyệt yêu cầu rút tiền", error });
    }
  });

  app.patch("/api/admin/withdrawals/:id/reject", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const withdrawal = await storage.getWithdrawal(id);
      
      if (!withdrawal) {
        return res.status(404).json({ message: "Không tìm thấy yêu cầu rút tiền" });
      }
      
      if (withdrawal.status !== WITHDRAWAL_STATUS.PENDING) {
        return res.status(400).json({ message: "Yêu cầu rút tiền đã được xử lý" });
      }
      
      const updatedWithdrawal = await storage.updateWithdrawalStatus(id, WITHDRAWAL_STATUS.REJECTED);
      
      // Refund amount to wallet
      const wallet = await storage.getWallet(withdrawal.walletId);
      await storage.updateWalletBalance(wallet!.id, withdrawal.amount);
      
      res.json(updatedWithdrawal);
    } catch (error) {
      res.status(500).json({ message: "Không thể từ chối yêu cầu rút tiền", error });
    }
  });

  app.patch("/api/admin/sellers/:id/verify", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const seller = await storage.getSeller(id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy người bán" });
      }
      
      if (seller.verified) {
        return res.status(400).json({ message: "Người bán đã được xác minh" });
      }
      
      const updatedSeller = await storage.verifySeller(id);
      res.json(updatedSeller);
    } catch (error) {
      res.status(500).json({ message: "Không thể xác minh người bán", error });
    }
  });

  app.patch("/api/admin/sellers/:id/assign-referral", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Mã giới thiệu không hợp lệ" });
      }
      
      const seller = await storage.getSeller(id);
      
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy người bán" });
      }
      
      // Check if referral code is already used
      const existingSeller = await storage.getSellerByReferralCode(referralCode);
      
      if (existingSeller && existingSeller.id !== id) {
        return res.status(400).json({ message: "Mã giới thiệu đã được sử dụng" });
      }
      
      const updatedSeller = await storage.assignReferralCode(id, referralCode);
      res.json(updatedSeller);
    } catch (error) {
      res.status(500).json({ message: "Không thể cấp mã giới thiệu", error });
    }
  });

  app.patch("/api/admin/products/:id/approve", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      if (product.status !== PRODUCT_STATUS.PENDING) {
        return res.status(400).json({ message: "Sản phẩm không đang chờ phê duyệt" });
      }
      
      const updatedProduct = await storage.approveProduct(id);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Không thể duyệt sản phẩm", error });
    }
  });

  app.patch("/api/admin/products/:id/reject", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      if (product.status !== PRODUCT_STATUS.PENDING) {
        return res.status(400).json({ message: "Sản phẩm không đang chờ phê duyệt" });
      }
      
      const updatedProduct = await storage.rejectProduct(id);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Không thể từ chối sản phẩm", error });
    }
  });

  // Sample Store Management
  app.post("/api/admin/products/sample-store", adminMiddleware, async (req: Request, res: Response) => {
    try {
      // Kiểm tra xem đây là yêu cầu cập nhật trạng thái hay tạo sản phẩm mẫu mới
      if (req.body.productId !== undefined) {
        // Cập nhật trạng thái sản phẩm mẫu
        const { productId, isSampleStore } = req.body;
        
        if (isSampleStore === undefined) {
          return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
        
        const product = await storage.getProduct(productId);
        
        if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        
        const updatedProduct = await storage.markProductAsSampleStore(productId, isSampleStore);
        return res.json(updatedProduct);
      } else {
        // Tạo sản phẩm mẫu mới
        const productData = {
          ...req.body,
          status: 'approved',  // Tự động phê duyệt sản phẩm mẫu
          isSampleStore: true, // Đánh dấu là sản phẩm mẫu
        };
        
        const product = await storage.createProduct(productData);
        return res.status(201).json(product);
      }
    } catch (error) {
      res.status(500).json({ message: "Không thể xử lý yêu cầu cửa hàng mẫu", error });
    }
  });

  app.get("/api/admin/products/sample-store", async (req: Request, res: Response) => {
    try {
      const products = await storage.getSampleStoreProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách sản phẩm cửa hàng mẫu", error });
    }
  });

  // Bots
  app.get("/api/bots", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const bots = await storage.getAllBots();
      res.json(bots);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy danh sách bot", error });
    }
  });

  app.get("/api/bots/:id", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      
      if (!bot) {
        return res.status(404).json({ message: "Không tìm thấy bot" });
      }
      
      res.json(bot);
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy thông tin bot", error });
    }
  });

  app.post("/api/bots", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const botData = insertBotSchema.parse(req.body);
      const bot = await storage.createBot(botData);
      res.status(201).json(bot);
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu bot không hợp lệ", error });
    }
  });

  app.patch("/api/bots/:id/activate", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      
      if (!bot) {
        return res.status(404).json({ message: "Không tìm thấy bot" });
      }
      
      if (bot.status === BOT_STATUS.ACTIVE) {
        return res.status(400).json({ message: "Bot đã được kích hoạt" });
      }
      
      const updatedBot = await storage.activateBot(id);
      res.json(updatedBot);
    } catch (error) {
      res.status(500).json({ message: "Không thể kích hoạt bot", error });
    }
  });

  app.patch("/api/bots/:id/deactivate", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      
      if (!bot) {
        return res.status(404).json({ message: "Không tìm thấy bot" });
      }
      
      if (bot.status === BOT_STATUS.INACTIVE) {
        return res.status(400).json({ message: "Bot đã bị vô hiệu hóa" });
      }
      
      const updatedBot = await storage.deactivateBot(id);
      res.json(updatedBot);
    } catch (error) {
      res.status(500).json({ message: "Không thể vô hiệu hóa bot", error });
    }
  });

  // Sử dụng Router cho API Admin
  app.use(adminApiRouter);

  // Create HTTP server and return it
  const httpServer = createServer(app);
  return httpServer;
}
