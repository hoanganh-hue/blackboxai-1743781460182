/**
 * Tệp cấu hình kết nối từ trang admin độc lập đến API TikTok Shop
 * 
 * Tệp này cung cấp các thông tin và hàm cần thiết để kết nối trang admin
 * với các API của hệ thống chính.
 */

// URL cơ sở của API
const API_BASE_URL = process.env.API_BASE_URL || "https://tiktok-commerce-ngahunglchp.replit.app";

// Các endpoint API quan trọng
const API_ENDPOINTS = {
  // Xác thực
  AUTH: {
    LOGIN: "/api/login",
    LOGOUT: "/api/logout",
    CURRENT_USER: "/api/user"
  },

  // Quản lý người dùng
  USERS: {
    BASE: "/api/users",
    BY_ID: (id) => `/api/users/${id}`,
    ADMINS: "/api/users/admins"
  },

  // Quản lý người bán
  SELLERS: {
    BASE: "/api/sellers",
    BY_ID: (id) => `/api/sellers/${id}`,
    VERIFY: (id) => `/api/admin/sellers/${id}/verify`,
    ASSIGN_REFERRAL: (id) => `/api/admin/sellers/${id}/assign-referral`,
    PENDING: "/api/admin/sellers/pending"
  },

  // Quản lý sản phẩm
  PRODUCTS: {
    BASE: "/api/products",
    BY_ID: (id) => `/api/products/${id}`,
    APPROVE: (id) => `/api/admin/products/${id}/approve`,
    REJECT: (id) => `/api/admin/products/${id}/reject`,
    PENDING: "/api/admin/products/pending",
    SAMPLE_STORE: "/api/admin/products/sample-store"
  },

  // Quản lý danh mục
  CATEGORIES: {
    BASE: "/api/categories",
    BY_ID: (id) => `/api/categories/${id}`
  },

  // Quản lý đơn hàng
  ORDERS: {
    BASE: "/api/orders", 
    BY_ID: (id) => `/api/orders/${id}`,
    RECENT: "/api/admin/orders/recent"
  },

  // Quản lý thanh toán và rút tiền
  FINANCIAL: {
    WITHDRAWALS: {
      PENDING: "/api/admin/withdrawals/pending",
      APPROVE: (id) => `/api/admin/withdrawals/${id}/approve`,
      REJECT: (id) => `/api/admin/withdrawals/${id}/reject`
    },
    TRANSACTIONS: "/api/admin/transactions"
  },

  // Thống kê và báo cáo
  STATISTICS: {
    DASHBOARD: "/api/admin/statistics/dashboard",
    SALES: "/api/admin/statistics/sales",
    USERS: "/api/admin/statistics/users"
  },

  // Quản lý bot hỗ trợ
  BOTS: {
    BASE: "/api/bots",
    BY_ID: (id) => `/api/bots/${id}`,
    ACTIVATE: (id) => `/api/bots/${id}/activate`,
    DEACTIVATE: (id) => `/api/bots/${id}/deactivate`
  }
};

/**
 * Hàm gọi API có xác thực token
 * @param {string} endpoint - Đường dẫn API cần gọi
 * @param {Object} options - Tùy chọn fetch API
 * @returns {Promise<any>} - Kết quả từ API
 */
async function callAPI(endpoint, options = {}) {
  const token = localStorage.getItem("admin_token");
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: "include"
  };

  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Kiểm tra lỗi không được phép truy cập
    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    }
    
    // Kiểm tra lỗi không có quyền
    if (response.status === 403) {
      throw new Error("Bạn không có quyền thực hiện thao tác này");
    }
    
    // Kiểm tra các lỗi khác
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Lỗi không xác định từ API");
    }
    
    // Trả về dữ liệu thành công
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Các hàm trợ giúp cho việc gọi API
 */
const AdminAPI = {
  // Thao tác với người dùng và xác thực
  auth: {
    login: async (username, password) => {
      // Thêm header X-Admin-Token-Request để yêu cầu JWT token
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token-Request": "true"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Lỗi đăng nhập");
      }
      
      const data = await response.json();
      
      if (data && data.token) {
        localStorage.setItem("admin_token", data.token);
        // Lưu thêm thông tin người dùng
        localStorage.setItem("admin_user", JSON.stringify({
          id: data.id,
          username: data.username,
          role: data.role,
          email: data.email,
          fullName: data.fullName
        }));
      }
      
      return data;
    },
    
    logout: async () => {
      try {
        await callAPI(API_ENDPOINTS.AUTH.LOGOUT, { method: "POST" });
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      } finally {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    },
    
    getCurrentUser: async () => {
      // Kiểm tra xem có token trong localStorage không
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }
      
      // Kiểm tra xem có thông tin người dùng đã lưu không
      const userString = localStorage.getItem("admin_user");
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          // Vẫn gọi API để xác thực token
          await callAPI(API_ENDPOINTS.AUTH.CURRENT_USER);
          return userData;
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
      
      // Nếu không có dữ liệu người dùng đã lưu, gọi API
      return await callAPI(API_ENDPOINTS.AUTH.CURRENT_USER);
    }
  },
  
  // Thao tác với người bán
  sellers: {
    getAll: async (page = 1, limit = 20) => {
      return await callAPI(`${API_ENDPOINTS.SELLERS.BASE}?page=${page}&limit=${limit}`);
    },
    
    getPending: async () => {
      return await callAPI(API_ENDPOINTS.SELLERS.PENDING);
    },
    
    getById: async (id) => {
      return await callAPI(API_ENDPOINTS.SELLERS.BY_ID(id));
    },
    
    verify: async (id) => {
      return await callAPI(API_ENDPOINTS.SELLERS.VERIFY(id), { method: "PATCH" });
    },
    
    assignReferral: async (id, referralCode) => {
      return await callAPI(API_ENDPOINTS.SELLERS.ASSIGN_REFERRAL(id), {
        method: "PATCH",
        body: JSON.stringify({ referralCode })
      });
    }
  },
  
  // Thao tác với sản phẩm
  products: {
    getAll: async (page = 1, limit = 20) => {
      return await callAPI(`${API_ENDPOINTS.PRODUCTS.BASE}?page=${page}&limit=${limit}`);
    },
    
    getPending: async () => {
      return await callAPI(API_ENDPOINTS.PRODUCTS.PENDING);
    },
    
    getById: async (id) => {
      return await callAPI(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    },
    
    approve: async (id) => {
      return await callAPI(API_ENDPOINTS.PRODUCTS.APPROVE(id), { method: "PATCH" });
    },
    
    reject: async (id, reason) => {
      return await callAPI(API_ENDPOINTS.PRODUCTS.REJECT(id), {
        method: "PATCH",
        body: JSON.stringify({ reason })
      });
    },
    
    createSampleStore: async (data) => {
      return await callAPI(API_ENDPOINTS.PRODUCTS.SAMPLE_STORE, {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
  },
  
  // Thao tác với danh mục
  categories: {
    getAll: async () => {
      return await callAPI(API_ENDPOINTS.CATEGORIES.BASE);
    },
    
    getById: async (id) => {
      return await callAPI(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    },
    
    create: async (data) => {
      return await callAPI(API_ENDPOINTS.CATEGORIES.BASE, {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    
    update: async (id, data) => {
      return await callAPI(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
        method: "PATCH",
        body: JSON.stringify(data)
      });
    },
    
    delete: async (id) => {
      return await callAPI(API_ENDPOINTS.CATEGORIES.BY_ID(id), { method: "DELETE" });
    }
  },
  
  // Thao tác với đơn hàng
  orders: {
    getAll: async (page = 1, limit = 20) => {
      return await callAPI(`${API_ENDPOINTS.ORDERS.BASE}?page=${page}&limit=${limit}`);
    },
    
    getRecent: async () => {
      return await callAPI(API_ENDPOINTS.ORDERS.RECENT);
    },
    
    getById: async (id) => {
      return await callAPI(API_ENDPOINTS.ORDERS.BY_ID(id));
    },
    
    updateStatus: async (id, status) => {
      return await callAPI(API_ENDPOINTS.ORDERS.BY_ID(id), {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
    }
  },
  
  // Thao tác với yêu cầu rút tiền
  withdrawals: {
    getPending: async () => {
      return await callAPI(API_ENDPOINTS.FINANCIAL.WITHDRAWALS.PENDING);
    },
    
    approve: async (id) => {
      return await callAPI(API_ENDPOINTS.FINANCIAL.WITHDRAWALS.APPROVE(id), {
        method: "PATCH"
      });
    },
    
    reject: async (id, reason) => {
      return await callAPI(API_ENDPOINTS.FINANCIAL.WITHDRAWALS.REJECT(id), {
        method: "PATCH",
        body: JSON.stringify({ reason })
      });
    }
  },
  
  // Thao tác với bot hỗ trợ
  bots: {
    getAll: async () => {
      return await callAPI(API_ENDPOINTS.BOTS.BASE);
    },
    
    getById: async (id) => {
      return await callAPI(API_ENDPOINTS.BOTS.BY_ID(id));
    },
    
    create: async (data) => {
      return await callAPI(API_ENDPOINTS.BOTS.BASE, {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    
    activate: async (id) => {
      return await callAPI(API_ENDPOINTS.BOTS.ACTIVATE(id), { method: "PATCH" });
    },
    
    deactivate: async (id) => {
      return await callAPI(API_ENDPOINTS.BOTS.DEACTIVATE(id), { method: "PATCH" });
    }
  },
  
  // Lấy thống kê và báo cáo
  statistics: {
    getDashboard: async () => {
      return await callAPI(API_ENDPOINTS.STATISTICS.DASHBOARD);
    },
    
    getSales: async (startDate, endDate) => {
      return await callAPI(`${API_ENDPOINTS.STATISTICS.SALES}?startDate=${startDate}&endDate=${endDate}`);
    },
    
    getUserStats: async () => {
      return await callAPI(API_ENDPOINTS.STATISTICS.USERS);
    }
  }
};

export { API_ENDPOINTS, callAPI, AdminAPI };