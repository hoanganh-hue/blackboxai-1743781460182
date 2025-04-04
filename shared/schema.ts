import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["customer", "seller", "admin", "affiliate"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]);
export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "approved", "rejected"]);
export const productStatusEnum = pgEnum("product_status", ["pending", "approved", "rejected"]);
export const botStatusEnum = pgEnum("bot_status", ["active", "inactive"]);
export const paymentMethodEnum = pgEnum("payment_method", ["credit_card", "bank_transfer", "e_wallet", "cod", "paypal", "stripe"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed", "free_shipping"]);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phoneNumber: text("phone_number"),
  profileImage: text("profile_image"),
  role: userRoleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLogin: timestamp("last_login")
});

export const usersRelations = relations(users, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [users.id],
    references: [sellers.userId]
  }),
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId]
  }),
  affiliate: one(affiliates, {
    fields: [users.id],
    references: [affiliates.userId]
  }),
  reviews: many(reviews),
  orders: many(orders),
  notifications: many(notifications),
  referrals: many(referrals, { relationName: "referredUser" })
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  discountedPrice: doublePrecision("discounted_price"),
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id").references(() => categories.id),
  sellerId: integer("seller_id").references(() => sellers.id),
  status: productStatusEnum("status").notNull().default("pending"),
  isFeatured: boolean("is_featured").default(false),
  isDiscounted: boolean("is_discounted").default(false),
  isSampleStore: boolean("is_sample_store").default(false),
  isDeleted: boolean("is_deleted").default(false),
  isAffiliate: boolean("is_affiliate").default(false),
  sourceProductId: integer("source_product_id").references(() => products.id),
  image: text("image"),
  sold: integer("sold").default(0), // Removed notNull to match insertProductSchema
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  seller: one(sellers, {
    fields: [products.sellerId],
    references: [sellers.id]
  }),
  images: many(productImages),
  reviews: many(reviews)
}));

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  url: text("url").notNull(),
  isMain: boolean("is_main").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  })
}));

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  storeName: text("store_name").notNull(),
  description: text("description"),
  logo: text("logo"),
  verified: boolean("verified").default(false),
  referralCode: text("referral_code").unique(),
  joinedAt: timestamp("joined_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  user: one(users, {
    fields: [sellers.userId],
    references: [users.id]
  }),
  products: many(products),
  banking: one(banking, {
    fields: [sellers.id],
    references: [banking.sellerId]
  })
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: doublePrecision("total_amount").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  sellerId: integer("seller_id").references(() => sellers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  seller: one(sellers, {
    fields: [orderItems.sellerId],
    references: [sellers.id]
  })
}));

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  }),
  items: many(cartItems)
}));

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => carts.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  balance: doublePrecision("balance").notNull().default(0),
  pendingBalance: doublePrecision("pending_balance").notNull().default(0),
  totalEarnings: doublePrecision("total_earnings").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id]
  }),
  withdrawals: many(withdrawals)
}));

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  status: withdrawalStatusEnum("status").notNull().default("pending"),
  bankingId: integer("banking_id").references(() => banking.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  wallet: one(wallets, {
    fields: [withdrawals.walletId],
    references: [wallets.id]
  }),
  banking: one(banking, {
    fields: [withdrawals.bankingId],
    references: [banking.id]
  })
}));

export const banking = pgTable("banking", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => sellers.id).notNull().unique(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountName: text("account_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const bankingRelations = relations(banking, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [banking.sellerId],
    references: [sellers.id]
  }),
  withdrawals: many(withdrawals)
}));

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  })
}));

export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  config: jsonb("config").notNull(),
  status: botStatusEnum("status").notNull().default("inactive"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  transactionId: text("transaction_id"),
  gatewayResponse: jsonb("gateway_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id]
  })
}));

export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  code: text("code").notNull().unique(),
  commission: doublePrecision("commission").notNull().default(0.05),
  status: boolean("status").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliates.userId],
    references: [users.id]
  }),
  referrals: many(referrals)
}));

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => affiliates.id).notNull(),
  referredUserId: integer("referred_user_id").references(() => users.id).notNull().unique(),
  orderId: integer("order_id").references(() => orders.id),
  status: text("status").notNull().default("pending"),
  commissionEarned: doublePrecision("commission_earned"),
  commission: doublePrecision("commission"),
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at")
});

export const referralsRelations = relations(referrals, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [referrals.affiliateId],
    references: [affiliates.id]
  }),
  referredUser: one(users, {
    fields: [referrals.referredUserId],
    references: [users.id]
  }),
  order: one(orders, {
    fields: [referrals.orderId],
    references: [orders.id]
  })
}));

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: couponTypeEnum("type").notNull(),
  value: doublePrecision("value").notNull(),
  minPurchase: doublePrecision("min_purchase"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  sellerId: integer("seller_id").references(() => sellers.id),
  productId: integer("product_id").references(() => products.id),
  categoryId: integer("category_id").references(() => categories.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const couponsRelations = relations(coupons, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [coupons.sellerId],
    references: [sellers.id]
  }),
  product: one(products, {
    fields: [coupons.productId],
    references: [products.id]
  }),
  category: one(categories, {
    fields: [coupons.categoryId],
    references: [categories.id]
  }),
  usages: many(couponUsages)
}));

export const couponUsages = pgTable("coupon_usages", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => coupons.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  discountAmount: doublePrecision("discount_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const couponUsagesRelations = relations(couponUsages, ({ one }) => ({
  coupon: one(coupons, {
    fields: [couponUsages.couponId],
    references: [coupons.id]
  }),
  user: one(users, {
    fields: [couponUsages.userId],
    references: [users.id]
  }),
  order: one(orders, {
    fields: [couponUsages.orderId],
    references: [orders.id]
  })
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  link: text("link"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow()
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  lastLogin: true 
});

export const insertCategorySchema = createInsertSchema(categories).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertProductSchema = createInsertSchema(products).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  sold: true,
  isDeleted: true
}).extend({
  sourceProductId: z.number().optional(),
  isAffiliate: z.boolean().optional()
});

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
  createdAt: true
});

export const insertSellerSchema = createInsertSchema(sellers).omit({
  id: true,
  joinedAt: true,
  updatedAt: true,
  referralCode: true,
  verified: true
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  updatedAt: true
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  updatedAt: true
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBankingSchema = createInsertSchema(banking).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAffiliateSchema = createInsertSchema(affiliates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  paidAt: true
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
  updatedAt: true
});

export const insertCouponUsageSchema = createInsertSchema(couponUsages).omit({
  id: true,
  createdAt: true
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;

export type Seller = typeof sellers.$inferSelect;
export type InsertSeller = z.infer<typeof insertSellerSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

export type Banking = typeof banking.$inferSelect;
export type InsertBanking = z.infer<typeof insertBankingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = z.infer<typeof insertAffiliateSchema>;

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

export type CouponUsage = typeof couponUsages.$inferSelect;
export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Constants
export const USER_ROLES = {
  CUSTOMER: "customer" as const,
  SELLER: "seller" as const,
  ADMIN: "admin" as const,
  AFFILIATE: "affiliate" as const
};

export const ORDER_STATUS = {
  PENDING: "pending" as const,
  PROCESSING: "processing" as const,
  SHIPPED: "shipped" as const,
  DELIVERED: "delivered" as const,
  CANCELLED: "cancelled" as const,
  REFUNDED: "refunded" as const
};

export const WITHDRAWAL_STATUS = {
  PENDING: "pending" as const,
  APPROVED: "approved" as const,
  REJECTED: "rejected" as const
};

export const PRODUCT_STATUS = {
  PENDING: "pending" as const,
  APPROVED: "approved" as const,
  REJECTED: "rejected" as const
};

export const BOT_STATUS = {
  ACTIVE: "active" as const,
  INACTIVE: "inactive" as const
};

export const PAYMENT_METHOD = {
  CREDIT_CARD: "credit_card" as const,
  BANK_TRANSFER: "bank_transfer" as const,
  E_WALLET: "e_wallet" as const,
  COD: "cod" as const,
  PAYPAL: "paypal" as const,
  STRIPE: "stripe" as const
};

export const PAYMENT_STATUS = {
  PENDING: "pending" as const,
  COMPLETED: "completed" as const,
  FAILED: "failed" as const,
  REFUNDED: "refunded" as const
};

export const COUPON_TYPE = {
  PERCENTAGE: "percentage" as const,
  FIXED: "fixed" as const,
  FREE_SHIPPING: "free_shipping" as const
};
