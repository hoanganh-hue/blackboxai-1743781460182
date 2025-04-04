import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET || "tiktok-admin-secret-key";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "tiktok-shop-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }

      // Check if email is already used
      if (req.body.email) {
        const userWithEmail = await storage.getUserByEmail(req.body.email);
        if (userWithEmail) {
          return res.status(400).json({ message: "Email đã được sử dụng" });
        }
      }

      const hashedPassword = await hashPassword(req.body.password);
      const { becomeASeller, referralCode, secretKey, ...userData } = req.body;
      
      // Check if admin registration with correct secret key
      if (secretKey === "tiktokadmin2024" && userData.username === "admin") {
        userData.role = "admin";
      }
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Kiểm tra xem người dùng đăng ký có muốn trở thành người bán hàng không
      if (becomeASeller) {
        // Tự động tạo một mã giới thiệu ngẫu nhiên cho người bán
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Đặt dữ liệu ban đầu cho người bán
        const sellerData = {
          userId: user.id,
          shopName: `${user.fullName || user.username}'s Shop`,
          description: "Cửa hàng mới trên TikTok Shop",
          referralCode: randomCode,
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Kiểm tra mã giới thiệu nếu có
        let referringSeller = null;
        if (referralCode) {
          try {
            referringSeller = await storage.getSellerByReferralCode(referralCode);
            if (referringSeller) {
              // Lưu thông tin giới thiệu
              await storage.createReferral({
                affiliateId: referringSeller.id,
                referredUserId: user.id,
                status: "pending",
                commission: 0
              });
              
              // Tạo thông báo cho người bán đã giới thiệu
              await storage.createNotification({
                userId: referringSeller.userId,
                title: "Người bán mới được giới thiệu",
                message: `${user.fullName || user.username} đã đăng ký làm người bán thông qua mã giới thiệu của bạn.`,
                content: `${user.fullName || user.username} đã đăng ký làm người bán thông qua mã giới thiệu của bạn.`,
                isRead: false,
                type: "referral"
              });
            }
          } catch (error) {
            console.error("Lỗi khi xử lý mã giới thiệu:", error);
          }
        }
        
        // Tạo người bán
        await storage.createSeller({
          userId: user.id,
          storeName: sellerData.shopName || `Shop của ${user.username}`,
          description: sellerData.description || ""
        });
        
        // Cập nhật vai trò người dùng thành người bán
        await storage.updateUser(user.id, { role: "seller" });
        
        // Lấy người dùng đã cập nhật (với vai trò mới)
        const updatedUser = await storage.getUser(user.id);
        if (updatedUser) {
          // Login the new user
          req.login(updatedUser, (err) => {
            if (err) return next(err);
            // Return user data without password
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(201).json(userWithoutPassword);
          });
          return;
        }
      }
      
      // Login the new user (if not becoming a seller)
      req.login(user, (err) => {
        if (err) return next(err);
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message || "Đăng nhập thất bại" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Update last login timestamp
        storage.updateUserLastLogin(user.id)
          .catch(error => console.error("Failed to update last login time:", error));
        
        // Nếu yêu cầu API chứa header X-Admin-Token-Request
        if (req.headers['x-admin-token-request'] === 'true' && user.role === 'admin') {
          // Tạo JWT token cho admin panel
          const token = jwt.sign(
            { 
              id: user.id, 
              username: user.username, 
              role: user.role,
              email: user.email
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
          );
          
          const { password, ...userWithoutPassword } = user;
          return res.json({ 
            ...userWithoutPassword,
            token 
          });
        }
        
        // Return user data without password (trường hợp thường)
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng xuất" });
      }
      res.status(200).json({ message: "Đăng xuất thành công" });
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Middleware to check authentication
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    next();
  };

  // Middleware to check admin role
  const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra nếu có token JWT từ trang admin
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Kiểm tra role là admin
        if (decoded.role !== 'admin') {
          return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        
        // Gán thông tin người dùng vào request
        (req as any).adminUser = decoded;
        return next();
      } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
      }
    }
    
    // Nếu không có token, kiểm tra phiên đăng nhập thông thường
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    if (req.user && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };

  // Middleware to check seller role
  const sellerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    if (req.user && req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };

  return { authMiddleware, adminMiddleware, sellerMiddleware };
}
