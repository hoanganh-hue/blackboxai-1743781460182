/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    USER: '/api/user'
  },
  CATEGORIES: {
    BASE: '/api/categories',
    BY_SLUG: (slug: string) => `/api/categories/${slug}`,
    BY_ID: (id: number) => `/api/categories/${id}`
  },
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: number) => `/api/products/${id}`,
    BY_SLUG: (slug: string) => `/api/products/slug/${slug}`,
    FEATURED: '/api/products/featured',
    TOP_SELLING: '/api/products/featured/top-selling',
    DISCOUNTED: '/api/products/featured/discounted',
    BY_CATEGORY: (categoryId: number) => `/api/products/category/${categoryId}`
  },
  CART: {
    BASE: '/api/cart',
    ADD_ITEM: '/api/cart/items',
    REMOVE_ITEM: (id: number) => `/api/cart/items/${id}`
  },
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id: number) => `/api/orders/${id}`,
    BY_USER: '/api/orders/user'
  },
  SELLERS: {
    BASE: '/api/sellers',
    BY_ID: (id: number) => `/api/sellers/${id}`,
    REFERRAL: (code: string) => `/api/sellers/referral/${code}`,
    BY_USER: (userId: number) => `/api/sellers/user/${userId}`
  },
  REVIEWS: {
    BASE: '/api/reviews',
    BY_PRODUCT: (productId: number) => `/api/reviews/product/${productId}`
  },
  WALLET: {
    BASE: '/api/wallet',
    WITHDRAWALS: '/api/withdrawals',
    TRANSACTIONS: '/api/wallet/transactions'
  },
  BANKING: {
    BASE: '/api/banking'
  },
  ADMIN: {
    WITHDRAWALS: {
      PENDING: '/api/admin/withdrawals/pending',
      APPROVE: (id: number) => `/api/admin/withdrawals/${id}/approve`,
      REJECT: (id: number) => `/api/admin/withdrawals/${id}/reject`
    },
    SELLERS: {
      VERIFY: (id: number) => `/api/admin/sellers/${id}/verify`,
      ASSIGN_REFERRAL: (id: number) => `/api/admin/sellers/${id}/assign-referral`
    },
    PRODUCTS: {
      APPROVE: (id: number) => `/api/admin/products/${id}/approve`,
      REJECT: (id: number) => `/api/admin/products/${id}/reject`,
      SAMPLE_STORE: '/api/admin/products/sample-store'
    },
    BOTS: {
      BASE: '/api/admin/bots'
    }
  },
  BOTS: {
    BASE: '/api/bots',
    BY_ID: (id: number) => `/api/bots/${id}`,
    ACTIVATE: (id: number) => `/api/bots/${id}/activate`,
    DEACTIVATE: (id: number) => `/api/bots/${id}/deactivate`
  }
};

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PRODUCT: {
    DETAIL: (slug: string) => `/product/${slug}`,
    CATEGORY: (slug: string) => `/category/${slug}`
  },
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ACCOUNT: '/account',
  SELLER: {
    DASHBOARD: '/seller/dashboard',
    PRODUCTS: '/seller/products',
    ORDERS: '/seller/orders',
    PROFILE: '/seller/profile',
    WALLET: '/seller/wallet',
    REGISTER: '/seller/register',
    SETTINGS: '/seller/settings',
    PRODUCT_PRICE: (id: number) => `/seller/products/price/${id}`
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    PRODUCT_APPROVAL: '/admin/product-approval',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    SELLERS: '/admin/sellers',
    SAMPLE_STORE: '/admin/sample-store',
    WALLET: '/admin/wallet',
    WITHDRAWALS: '/admin/withdrawals',
    BOTS: '/admin/bots',
    SETTINGS: '/admin/settings',
    CATEGORIES: '/admin/categories',
    UPDATE_ICONS: '/admin/update-icons'
  }
};

/**
 * User role permissions
 */
export const ROLE_PERMISSIONS = {
  CUSTOMER: ['view_products', 'add_to_cart', 'checkout', 'view_orders'],
  SELLER: ['view_products', 'add_to_cart', 'checkout', 'view_orders', 'manage_products', 'view_sales', 'manage_profile'],
  ADMIN: ['view_products', 'add_to_cart', 'checkout', 'view_orders', 'manage_products', 'view_sales', 'manage_profile', 'manage_users', 'manage_sellers', 'manage_categories', 'manage_withdrawals', 'manage_bots']
};

/**
 * Categories
 */
export const SAMPLE_CATEGORIES = [
  {
    name: 'Thời trang',
    slug: 'thoi-trang',
    icon: 'Shirt'
  },
  {
    name: 'Điện tử',
    slug: 'dien-tu',
    icon: 'Smartphone'
  },
  {
    name: 'Nội thất',
    slug: 'noi-that',
    icon: 'Sofa'
  },
  {
    name: 'Túi xách',
    slug: 'tui-xach',
    icon: 'ShoppingBag'
  },
  {
    name: 'Mỹ phẩm',
    slug: 'my-pham',
    icon: 'Sparkles'
  },
  {
    name: 'Thực phẩm',
    slug: 'thuc-pham',
    icon: 'Apple'
  },
  {
    name: 'Đồ chơi',
    slug: 'do-choi',
    icon: 'Gamepad2'
  },
  {
    name: 'Sách',
    slug: 'sach',
    icon: 'BookOpen'
  }
];
