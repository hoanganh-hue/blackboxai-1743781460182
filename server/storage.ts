import { users, type User, type InsertUser, products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory, sellers, type Seller, type InsertSeller,
  wallets, type Wallet, type InsertWallet, orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem, reviews, type Review, type InsertReview,
  bots, type Bot, type InsertBot, banking, type Banking, type InsertBanking,
  withdrawals, type Withdrawal, type InsertWithdrawal, productImages, type ProductImage,
  type InsertProductImage, carts, type Cart, type InsertCart, cartItems, type CartItem,
  type InsertCartItem, affiliates, type Affiliate, type InsertAffiliate, referrals, type Referral,
  type InsertReferral, notifications, type Notification, type InsertNotification, 
  coupons, type Coupon, type InsertCoupon, USER_ROLES } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, gte, lte, or, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

type SessionStore = session.Store;

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: SessionStore;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getAllCategories(): Promise<Category[]>;

  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getAllProducts(options?: { categoryId?: number, sellerId?: number, status?: string, limit?: number, offset?: number }): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getDiscountedProducts(limit?: number): Promise<Product[]>;
  getPendingProducts(): Promise<Product[]>;
  getTopSellingProducts(limit?: number): Promise<Product[]>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  approveProduct(id: number): Promise<Product | undefined>;
  rejectProduct(id: number): Promise<Product | undefined>;
  getSampleStoreProducts(): Promise<Product[]>;
  markProductAsSampleStore(id: number, isSampleStore: boolean): Promise<Product | undefined>;

  // Product Images
  getProductImages(productId: number): Promise<ProductImage[]>;
  addProductImage(image: InsertProductImage): Promise<ProductImage>;
  removeProductImage(id: number): Promise<boolean>;
  setMainProductImage(id: number): Promise<ProductImage | undefined>;

  // Sellers
  getSeller(id: number): Promise<Seller | undefined>;
  getSellerByUserId(userId: number): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller): Promise<Seller>;
  updateSeller(id: number, seller: Partial<InsertSeller>): Promise<Seller | undefined>;
  deleteSeller(id: number): Promise<boolean>;
  getAllSellers(): Promise<Seller[]>;
  verifySeller(id: number): Promise<Seller | undefined>;
  assignReferralCode(id: number, code: string): Promise<Seller | undefined>;
  getSellerByReferralCode(code: string): Promise<Seller | undefined>;

  // Carts
  getCart(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(cartId: number): Promise<boolean>;

  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  getUserOrders(userId: number): Promise<Order[]>;
  getSellerOrders(sellerId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Wallets
  getWallet(userId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, amount: number): Promise<Wallet | undefined>;
  getAllWallets(): Promise<Wallet[]>;

  // Withdrawals
  getWithdrawal(id: number): Promise<Withdrawal | undefined>;
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  updateWithdrawalStatus(id: number, status: string): Promise<Withdrawal | undefined>;
  getUserWithdrawals(userId: number): Promise<Withdrawal[]>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  getPendingWithdrawals(): Promise<Withdrawal[]>;

  // Banking
  getBanking(sellerId: number): Promise<Banking | undefined>;
  createBanking(banking: InsertBanking): Promise<Banking>;
  updateBanking(id: number, banking: Partial<InsertBanking>): Promise<Banking | undefined>;
  deleteBanking(id: number): Promise<boolean>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  getProductReviews(productId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;

  // Bots
  getBot(id: number): Promise<Bot | undefined>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: number, bot: Partial<InsertBot>): Promise<Bot | undefined>;
  deleteBot(id: number): Promise<boolean>;
  getAllBots(): Promise<Bot[]>;
  activateBot(id: number): Promise<Bot | undefined>;
  deactivateBot(id: number): Promise<Bot | undefined>;
  
  // Affiliates
  getAffiliate(id: number): Promise<Affiliate | undefined>;
  getAffiliateByUserId(userId: number): Promise<Affiliate | undefined>;
  getAffiliateByCode(code: string): Promise<Affiliate | undefined>;
  createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate>;
  updateAffiliate(id: number, affiliate: Partial<InsertAffiliate>): Promise<Affiliate | undefined>;
  deleteAffiliate(id: number): Promise<boolean>;
  getAllAffiliates(): Promise<Affiliate[]>;
  
  // Referrals
  getReferral(id: number): Promise<Referral | undefined>;
  getReferralsByAffiliateId(affiliateId: number): Promise<Referral[]>;
  getReferralByReferredUserId(userId: number): Promise<Referral | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferral(id: number, referral: Partial<InsertReferral>): Promise<Referral | undefined>;
  
  // Notifications
  getNotification(id: number): Promise<Notification | undefined>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.count > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.count > 0;
  }

  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      // Đầu tiên, xóa tất cả các hình ảnh liên quan
      await db.delete(productImages).where(eq(productImages.productId, id));
      
      // Xóa các cart_items liên quan nếu có
      await db.delete(cartItems).where(eq(cartItems.productId, id));
      
      // Xóa các reviews liên quan nếu có
      await db.delete(reviews).where(eq(reviews.productId, id));
      
      // Đánh dấu sản phẩm là đã xóa nhưng vẫn giữ lại trong cơ sở dữ liệu
      const [product] = await db
        .update(products)
        .set({ 
          isDeleted: true,
          updatedAt: new Date()
        })
        .where(eq(products.id, id))
        .returning();
      
      console.log("Sản phẩm đã được đánh dấu là đã xóa:", product);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
  
  async getAffiliateProducts(): Promise<Product[]> {
    // Không tự động tạo sản phẩm mẫu nữa
    console.log("Đang lấy sản phẩm cho tiếp thị liên kết");
    
    try {
      // Lấy các sản phẩm mẫu và sản phẩm đã được phê duyệt
      const affiliateProducts = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.isDeleted, false),
            or(
              eq(products.isSampleStore, true),
              eq(products.status, "approved")
            )
          )
        );
        
      console.log(`Tìm thấy ${affiliateProducts.length} sản phẩm cho tiếp thị liên kết`);
      return affiliateProducts;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm tiếp thị liên kết:", error);
      return [];
    }
  }
  
  // Hàm tạo sản phẩm mẫu
  async createSampleProducts(): Promise<void> {
    const categoriesList = await db.select().from(categories);
    if (categoriesList.length === 0) {
      console.log("Không có danh mục nào để tạo sản phẩm mẫu");
      return;
    }
    
    // Get first seller or create a default one if none exists
    let sellerId = 1;
    const sellersList = await db.select().from(sellers);
    if (sellersList.length > 0) {
      sellerId = sellersList[0].id;
    }
    
    console.log("Kết quả kiểm tra danh mục:", categoriesList);
    console.log("Kết quả kiểm tra người bán:", sellersList);
    
    console.log("Tạo sản phẩm mẫu với categoryId:", categoriesList[0].id, "và sellerId:", sellerId);
    
    const sampleProducts = [
      {
        name: "Đồng hồ thông minh cao cấp",
        slug: "dong-ho-thong-minh-cao-cap",
        description: "Đồng hồ thông minh cao cấp với nhiều tính năng hữu ích",
        price: 1499000,
        discountedPrice: 1299000,
        stock: 100,
        categoryId: categoriesList[0].id,
        sellerId: sellerId,
        status: "approved",
        isFeatured: true,
        isDiscounted: true,
        isSampleStore: true,
        image: "https://cdn-icons-png.flaticon.com/512/2331/2331895.png",
        sold: 120,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Tai nghe không dây cách âm cao cấp",
        slug: "tai-nghe-khong-day-cach-am-cao-cap",
        description: "Tai nghe không dây cách âm cao cấp với âm thanh chất lượng",
        price: 2499000,
        discountedPrice: 1899000,
        stock: 50,
        categoryId: categoriesList[0].id,
        sellerId: sellerId,
        status: "approved",
        isFeatured: true,
        isDiscounted: true,
        isSampleStore: true,
        image: "https://cdn-icons-png.flaticon.com/512/2331/2331895.png",
        sold: 89,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Túi xách nữ cao cấp phong cách Hàn Quốc",
        slug: "tui-xach-nu-cao-cap-phong-cach-han-quoc",
        description: "Túi xách nữ cao cấp phong cách Hàn Quốc với thiết kế hiện đại",
        price: 649000,
        discountedPrice: 490000,
        stock: 30,
        categoryId: categoriesList[0].id,
        sellerId: sellerId,
        status: "approved",
        isFeatured: true,
        isDiscounted: true,
        isSampleStore: true,
        image: "https://cdn-icons-png.flaticon.com/512/2331/2331895.png",
        sold: 78,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const product of sampleProducts) {
      try {
        console.log("Đang tạo sản phẩm mẫu:", product.name);
        await db.insert(products).values(product);
      } catch (error) {
        console.error("Lỗi khi tạo sản phẩm mẫu:", error);
      }
    }
    
    console.log("Đã tạo xong các sản phẩm mẫu");
  }

  async getAllProducts(options?: { 
    categoryId?: number, 
    sellerId?: number, 
    status?: string, 
    limit?: number, 
    offset?: number 
  }): Promise<Product[]> {
    let query = db.select().from(products);

    if (options?.categoryId) {
      query = query.where(eq(products.categoryId, options.categoryId));
    }

    if (options?.sellerId) {
      query = query.where(eq(products.sellerId, options.sellerId));
    }

    if (options?.status) {
      query = query.where(eq(products.status, options.status));
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return query;
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.status, "approved")))
      .limit(limit);
  }

  async getDiscountedProducts(limit: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(and(eq(products.isDiscounted, true), eq(products.status, "approved")))
      .limit(limit);
  }

  async getPendingProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.status, "pending"));
  }

  async getTopSellingProducts(limit: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.status, "approved"))
      .orderBy(desc(products.sold))
      .limit(limit);
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.sellerId, sellerId));
  }

  async approveProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ status: "approved" })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async rejectProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ status: "rejected" })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async getSampleStoreProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isSampleStore, true));
  }

  async markProductAsSampleStore(id: number, isSampleStore: boolean): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ isSampleStore })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Product Images
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return db.select().from(productImages).where(eq(productImages.productId, productId));
  }

  async addProductImage(imageData: InsertProductImage): Promise<ProductImage> {
    const [image] = await db.insert(productImages).values(imageData).returning();
    return image;
  }

  async removeProductImage(id: number): Promise<boolean> {
    const result = await db.delete(productImages).where(eq(productImages.id, id));
    return result.count > 0;
  }

  async setMainProductImage(id: number): Promise<ProductImage | undefined> {
    const [image] = await db.select().from(productImages).where(eq(productImages.id, id));
    if (!image) return undefined;

    // Reset all other images for this product
    await db
      .update(productImages)
      .set({ isMain: false })
      .where(eq(productImages.productId, image.productId));

    // Set this image as main
    const [updatedImage] = await db
      .update(productImages)
      .set({ isMain: true })
      .where(eq(productImages.id, id))
      .returning();

    return updatedImage;
  }

  // Sellers
  async getSeller(id: number): Promise<Seller | undefined> {
    const [seller] = await db.select().from(sellers).where(eq(sellers.id, id));
    return seller;
  }

  async getSellerByUserId(userId: number): Promise<Seller | undefined> {
    const [seller] = await db.select().from(sellers).where(eq(sellers.userId, userId));
    return seller;
  }

  async createSeller(sellerData: InsertSeller): Promise<Seller> {
    const [seller] = await db.insert(sellers).values(sellerData).returning();
    return seller;
  }

  async updateSeller(id: number, sellerData: Partial<InsertSeller>): Promise<Seller | undefined> {
    const [seller] = await db
      .update(sellers)
      .set(sellerData)
      .where(eq(sellers.id, id))
      .returning();
    return seller;
  }

  async deleteSeller(id: number): Promise<boolean> {
    const result = await db.delete(sellers).where(eq(sellers.id, id));
    return result.count > 0;
  }

  async getAllSellers(): Promise<Seller[]> {
    return db.select().from(sellers);
  }

  async verifySeller(id: number): Promise<Seller | undefined> {
    const [seller] = await db
      .update(sellers)
      .set({ verified: true })
      .where(eq(sellers.id, id))
      .returning();
    return seller;
  }

  async assignReferralCode(id: number, code: string): Promise<Seller | undefined> {
    const [seller] = await db
      .update(sellers)
      .set({ referralCode: code })
      .where(eq(sellers.id, id))
      .returning();
    return seller;
  }

  async getSellerByReferralCode(code: string): Promise<Seller | undefined> {
    const [seller] = await db.select().from(sellers).where(eq(sellers.referralCode, code));
    return seller;
  }

  // Carts
  async getCart(userId: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
    return cart;
  }

  async createCart(cartData: InsertCart): Promise<Cart> {
    const [cart] = await db.insert(carts).values(cartData).returning();
    return cart;
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async addCartItem(itemData: InsertCartItem): Promise<CartItem> {
    const [item] = await db.insert(cartItems).values(itemData).returning();
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return item;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.count > 0;
  }

  async clearCart(cartId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return result.count > 0;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ ...orderData, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.count > 0;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getSellerOrders(sellerId: number): Promise<Order[]> {
    // Get orders that have items from this seller
    const items = await db.select().from(orderItems).where(eq(orderItems.sellerId, sellerId));
    const orderIds = [...new Set(items.map(item => item.orderId))];
    
    if (orderIds.length === 0) return [];
    
    return db.select().from(orders).where(eq(orders.id, orderIds));
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async addOrderItem(itemData: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(itemData).returning();
    return item;
  }

  // Wallets
  async getWallet(userId: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const [wallet] = await db.insert(wallets).values(walletData).returning();
    return wallet;
  }

  async updateWalletBalance(id: number, amount: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    if (!wallet) return undefined;

    const [updatedWallet] = await db
      .update(wallets)
      .set({ 
        balance: wallet.balance + amount,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, id))
      .returning();

    return updatedWallet;
  }

  async getAllWallets(): Promise<Wallet[]> {
    return db.select().from(wallets);
  }

  // Withdrawals
  async getWithdrawal(id: number): Promise<Withdrawal | undefined> {
    const [withdrawal] = await db.select().from(withdrawals).where(eq(withdrawals.id, id));
    return withdrawal;
  }

  async createWithdrawal(withdrawalData: InsertWithdrawal): Promise<Withdrawal> {
    const [withdrawal] = await db.insert(withdrawals).values(withdrawalData).returning();
    return withdrawal;
  }

  async updateWithdrawalStatus(id: number, status: string): Promise<Withdrawal | undefined> {
    const [withdrawal] = await db
      .update(withdrawals)
      .set({ status, updatedAt: new Date() })
      .where(eq(withdrawals.id, id))
      .returning();
    return withdrawal;
  }

  async getUserWithdrawals(userId: number): Promise<Withdrawal[]> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    if (!wallet) return [];

    return db.select().from(withdrawals).where(eq(withdrawals.walletId, wallet.id));
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return db.select().from(withdrawals);
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return db.select().from(withdrawals).where(eq(withdrawals.status, "pending"));
  }

  // Banking
  async getBanking(sellerId: number): Promise<Banking | undefined> {
    try {
      const [bankingInfo] = await db
        .select()
        .from(banking)
        .where(eq(banking.sellerId, sellerId));
      return bankingInfo;
    } catch (error) {
      console.error("Lỗi khi truy vấn thông tin ngân hàng:", error);
      // Sử dụng throw để chuyển tiếp lỗi lên cho phương thức gọi ở trên
      // thay vì trả về undefined
      throw error;
    }
  }

  async createBanking(bankingData: InsertBanking): Promise<Banking> {
    const [bank] = await db.insert(banking).values(bankingData).returning();
    return bank;
  }

  async updateBanking(id: number, bankingData: Partial<InsertBanking>): Promise<Banking | undefined> {
    const [bank] = await db
      .update(banking)
      .set({ ...bankingData, updatedAt: new Date() })
      .where(eq(banking.id, id))
      .returning();
    return bank;
  }

  async deleteBanking(id: number): Promise<boolean> {
    const result = await db.delete(banking).where(eq(banking.id, id));
    return result.count > 0;
  }

  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ ...reviewData, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.count > 0;
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  // Bots
  async getBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot;
  }

  async createBot(botData: InsertBot): Promise<Bot> {
    const [bot] = await db.insert(bots).values(botData).returning();
    return bot;
  }

  async updateBot(id: number, botData: Partial<InsertBot>): Promise<Bot | undefined> {
    const [bot] = await db
      .update(bots)
      .set({ ...botData, updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return bot;
  }

  async deleteBot(id: number): Promise<boolean> {
    const result = await db.delete(bots).where(eq(bots.id, id));
    return result.count > 0;
  }

  async getAllBots(): Promise<Bot[]> {
    return db.select().from(bots);
  }

  async activateBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db
      .update(bots)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return bot;
  }

  async deactivateBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db
      .update(bots)
      .set({ status: "inactive", updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return bot;
  }
  
  // Affiliates
  async getAffiliate(id: number): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, id));
    return affiliate;
  }

  async getAffiliateByUserId(userId: number): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.userId, userId));
    return affiliate;
  }

  async getAffiliateByCode(code: string): Promise<Affiliate | undefined> {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.code, code));
    return affiliate;
  }

  async createAffiliate(affiliateData: InsertAffiliate): Promise<Affiliate> {
    const [affiliate] = await db.insert(affiliates).values(affiliateData).returning();
    return affiliate;
  }

  async updateAffiliate(id: number, affiliateData: Partial<InsertAffiliate>): Promise<Affiliate | undefined> {
    const [affiliate] = await db
      .update(affiliates)
      .set({ ...affiliateData, updatedAt: new Date() })
      .where(eq(affiliates.id, id))
      .returning();
    return affiliate;
  }

  async deleteAffiliate(id: number): Promise<boolean> {
    const result = await db.delete(affiliates).where(eq(affiliates.id, id));
    return result.count > 0;
  }

  async getAllAffiliates(): Promise<Affiliate[]> {
    return db.select().from(affiliates);
  }
  
  // Referrals
  async getReferral(id: number): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.id, id));
    return referral;
  }

  async getReferralsByAffiliateId(affiliateId: number): Promise<Referral[]> {
    return db.select().from(referrals).where(eq(referrals.affiliateId, affiliateId));
  }

  async getReferralByReferredUserId(userId: number): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.referredUserId, userId));
    return referral;
  }

  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(referralData).returning();
    return referral;
  }

  async updateReferral(id: number, referralData: Partial<InsertReferral>): Promise<Referral | undefined> {
    const [referral] = await db
      .update(referrals)
      .set(referralData)
      .where(eq(referrals.id, id))
      .returning();
    return referral;
  }
  
  // Notifications
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id));
    return result.count > 0;
  }
}

// Export storage instance
export const storage = new DatabaseStorage();
