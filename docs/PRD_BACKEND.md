# ⚙️ BACKEND SPECIFICATION DOCUMENT (PRD BACKEND)

| Thuộc tính         | Giá trị                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| **Căn cứ pháp lý** | `docs/PRD_CAU_TRUC_DU_AN_MERN.md` (Master PRD)                            |
| **Phạm vi**        | Node.js/Express, MongoDB/Mongoose Schema, API Contract, Logic Controllers |
| **Phiên bản**      | 5.0 (RBAC System & Complete API Specification)                            |
| **Ngày cập nhật**  | 2026-04-25                                                                |

---

## Mục lục

1. [Kiến trúc & Code Pattern](#1-kien-truc--code-pattern)
2. [Database Schema & Indexing](#2-database-schema--indexing)
3. [API Endpoints Specification](#3-api-endpoints-specification)
4. [Middleware System](#4-middleware-system)
5. [RBAC Permission System](#5-rbac-permission-system)
6. [Business Logic Rules](#6-business-logic-rules)
7. [HTTP Status Codes & Error Handling](#7-http-status-codes--error-handling)

---

## 1. Kiến trúc & Code Pattern

### 1.1. Cấu trúc thư mục

```
backend/
├── api/
│   └── v1/
│       ├── admin/          # Admin APIs
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   └── routes/
│       └── client/         # Client APIs
│           ├── controllers/
│           ├── middlewares/
│           └── routes/
├── models/                 # Mongoose models
├── config/                 # Database config
├── helpers/                # Utilities (sendMail, etc)
└── index.js               # Entry point
```

### 1.2. Luồng dữ liệu

- **Pattern:** `routes` → `middlewares` → `controllers` → `models`
- **Cấm tạo service layer** - Logic nằm trực tiếp trong controllers
- **Namespaces:**
  - `/api/v1/...` - Client/Public APIs
  - `/api/v1/admin/...` - Admin APIs

### 1.3. Authentication & Authorization

- **JWT Access Token:** Thời gian sống ngắn (15 phút)
- **JWT Refresh Token:** Thời gian sống dài (7 ngày), lưu trong collection `sessions`
- **RBAC:** Role-Based Access Control với `roleId` và `permissions`
- **Middleware chain:** `requireAuth` → `requirePermission(permission)`

---

## 2. Database Schema & Indexing

### 2.1. User & Authentication Context

#### User Model (`users` collection)
```javascript
{
  displayName: String (required),
  phone: String (unique),
  hashedPassword: String (required),
  email: String (required, unique),
  address: String,
  avatarUrl: String,
  roleId: ObjectId (ref: Role),  // null cho khách hàng thường
  status: Enum ["active", "inactive"] (default: "active"),
  deleted: Boolean (default: false),
  deletedAt: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

#### Role Model (`roles` collection)
```javascript
{
  title: String (required, unique),
  description: String,
  permissions: [String],  // Array of permission codes
  status: Enum ["active", "inactive"] (default: "active"),
  deleted: Boolean (default: false),
  deletedAt: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

#### Session Model (`sessions` collection)
```javascript
{
  userId: ObjectId (ref: User, required),
  refreshToken: String (required, unique),
  expireAt: Date (required)
}
// TTL Index: { expireAt: 1 } với expireAfterSeconds: 0
```

#### ForgotPassword Model (`forgot_passwords` collection)
```javascript
{
  email: String (required, unique),
  otp: String (required, unique),
  expireAt: Date (required)
}
// TTL Index: { expireAt: 1 } với expireAfterSeconds: 0
```

### 2.2. Product Context

#### Category Model (`categories` collection)
```javascript
{
  name: String (required),
  slug: String (required, unique, lowercase),
  description: String,
  parentCategory: ObjectId (ref: Category, default: null),
  status: Enum ["active", "inactive"] (default: "active"),
  deleted: Boolean (default: false),
  deletedAt: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

#### Product Model (`products` collection)
```javascript
{
  name: String (required),
  slug: String (required, unique, lowercase),
  description: String (required),
  ingredients: String (required),  // Thành phần món ăn
  categoryId: ObjectId (ref: Category, required),
  price: Number (required),
  images: [String],  // Array of Cloudinary URLs
  stock: Number (required, min: 0, default: 0),
  averageRating: Number (default: 0, min: 0, max: 5),
  numReviews: Number (default: 0),
  status: Enum ["active", "inactive"] (default: "active"),
  deleted: Boolean (default: false),
  deletedAt: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
// Compound Index: { deleted: 1, categoryId: 1, status: 1, createdAt: -1 }
```

### 2.3. Transaction Context

#### Cart Model (`carts` collection)
```javascript
{
  userId: ObjectId (ref: User, required, unique),
  items: [{
    productId: ObjectId (ref: Product, required),
    quantity: Number (required, min: 1),
    price: Number (required)  // Snapshot giá hiện tại
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Model (`orders` collection)
```javascript
{
  userId: ObjectId (ref: User, required),
  items: [{
    productId: ObjectId (ref: Product, required),
    name: String (required),  // Snapshot tên sản phẩm
    quantity: Number (required, min: 1),
    price: Number (required)  // Snapshot giá tại thời điểm đặt
  }],
  shippingAddress: {
    fullName: String (required),
    phone: String (required),
    address: String (required),
    city: String (required)
  },
  paymentMethod: Enum ["COD", "VNPAY", "MOMO", "STRIPE"] (default: "COD"),
  paymentStatus: Enum ["Pending", "Paid", "Failed", "Refunded"] (default: "Pending"),
  orderStatus: Enum ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] (default: "Pending"),
  shippingFee: Number (default: 0),
  totalAmount: Number (required),
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, orderStatus: 1, createdAt: -1 }
```

#### Promotion Model (`promotions` collection)
```javascript
{
  title: String (required),
  code: String (required, unique, uppercase),
  description: String,
  discountType: Enum ["percentage", "fixed"] (required),
  discountValue: Number (required),
  minOrderValue: Number (default: 0),
  maxDiscountAmount: Number (nullable),  // Chỉ áp dụng cho percentage
  usageLimit: Number (nullable),  // null = unlimited
  usedCount: Number (default: 0),
  startDate: Date (required),
  endDate: Date (required),
  status: Enum ["active", "inactive"] (default: "active"),
  deleted: Boolean (default: false),
  deletedAt: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

#### Review Model (`reviews` collection)
```javascript
{
  productId: ObjectId (ref: Product, required),
  userId: ObjectId (ref: User, required),
  rating: Number (required, min: 1, max: 5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. API Endpoints Specification

### 3.1. Client APIs (`/api/v1`)

#### Authentication
- `POST /auth/sign-up` - Đăng ký tài khoản
- `POST /auth/sign-in` - Đăng nhập
- `POST /auth/sign-out` - Đăng xuất
- `POST /auth/refresh-token` - Làm mới token
- `POST /auth/forgot-password` - Gửi OTP qua email
- `POST /auth/verify-otp` - Xác thực OTP
- `POST /auth/reset-password` - Đặt lại mật khẩu

#### User Profile
- `GET /user` - Lấy thông tin user (requireAuth)
- `PATCH /user` - Cập nhật thông tin user (requireAuth)
- `POST /user/upload-avatar` - Upload avatar (requireAuth)

#### Category
- `GET /category` - Danh sách danh mục (public)

#### Product
- `GET /product` - Danh sách sản phẩm (public, pagination, search, filter)
  - Query params: `keyword`, `categorySlug`, `page`, `limit`
- `GET /product/:slug` - Chi tiết sản phẩm (public)

#### Cart
- `GET /cart` - Lấy giỏ hàng (requireAuth)
- `POST /cart/add` - Thêm vào giỏ (requireAuth)
- `PATCH /cart/update/:productId` - Cập nhật số lượng (requireAuth)
- `PATCH /cart/remove/:productId` - Xóa khỏi giỏ (requireAuth)

#### Order
- `POST /order` - Tạo đơn hàng (requireAuth)
- `GET /order/my` - Lịch sử đơn hàng (requireAuth)

### 3.2. Admin APIs (`/api/v1/admin`)

#### Authentication
- `POST /auth/login` - Đăng nhập admin
- `POST /auth/logout` - Đăng xuất admin
- `POST /auth/refresh-token` - Làm mới token

#### Dashboard
- `GET /dashboard` - Thống kê tổng quan (requireAuth)

#### User Profile
- `GET /user` - Lấy thông tin admin user (requireAuth)

#### Category Management
- `GET /category` - Danh sách danh mục (requireAuth, requirePermission("categories_view"))
  - Query params: `keyword`, `page`, `limit`
  - Pagination: default limit = 5
- `POST /category` - Tạo danh mục (requireAuth, requirePermission("categories_create"))
- `PATCH /category/:id` - Cập nhật danh mục (requireAuth, requirePermission("categories_edit"))
- `DELETE /category/:id` - Xóa danh mục (requireAuth, requirePermission("categories_delete"))

#### Product Management
- `GET /product` - Danh sách sản phẩm (requireAuth, requirePermission("products_view"))
  - Query params: `keyword`, `categorySlug`, `page`, `limit`
  - Pagination: default limit = 12
- `POST /product` - Tạo sản phẩm (requireAuth, requirePermission("products_create"))
  - Hỗ trợ upload nhiều ảnh (max 10)
- `PATCH /product/:id` - Cập nhật sản phẩm (requireAuth, requirePermission("products_edit"))
- `DELETE /product/:id` - Xóa sản phẩm (requireAuth, requirePermission("products_delete"))

#### Order Management
- `GET /order` - Danh sách đơn hàng (requireAuth, requirePermission("orders_view"))
- `PATCH /order/:id` - Cập nhật trạng thái đơn (requireAuth, requirePermission("orders_edit"))

#### User Management
- `GET /users` - Danh sách tài khoản (requireAuth, requirePermission("accounts_view"))
  - Query params: `keyword`, `page`, `limit`
  - Pagination: default limit = 10
- `GET /users/:id` - Chi tiết tài khoản (requireAuth, requirePermission("accounts_view"))
- `POST /users` - Tạo tài khoản (requireAuth, requirePermission("accounts_create"))
- `PATCH /users/:id` - Cập nhật tài khoản (requireAuth, requirePermission("accounts_edit"))
- `DELETE /users/:id` - Xóa tài khoản (requireAuth, requirePermission("accounts_delete"))

#### Role Management
- `GET /role` - Danh sách vai trò (requireAuth, requirePermission("roles_view"))
  - Pagination: default limit = 10
- `GET /role/permissions` - Danh sách tất cả permissions (requireAuth, requirePermission("roles_view"))
- `POST /role` - Tạo vai trò (requireAuth, requirePermission("roles_create"))
- `PATCH /role/:id` - Cập nhật vai trò (requireAuth, requirePermission("roles_edit"))
- `DELETE /role/:id` - Xóa vai trò (requireAuth, requirePermission("roles_delete"))

#### Promotion Management
- `GET /promotion` - Danh sách khuyến mãi (requireAuth, requirePermission("promotions_view"))
  - Query params: `keyword`, `page`, `limit`
  - Pagination: default limit = 10
- `GET /promotion/:id` - Chi tiết khuyến mãi (requireAuth, requirePermission("promotions_view"))
- `POST /promotion` - Tạo khuyến mãi (requireAuth, requirePermission("promotions_create"))
- `PATCH /promotion/:id` - Cập nhật khuyến mãi (requireAuth, requirePermission("promotions_edit"))
- `DELETE /promotion/:id` - Xóa khuyến mãi (requireAuth, requirePermission("promotions_delete"))

---

## 4. Middleware System

### 4.1. Authentication Middleware

#### Client Auth (`api/v1/client/middlewares/auth.middleware.js`)
```javascript
export const requireAuth = async (req, res, next) => {
  // 1. Lấy token từ header Authorization: Bearer <token>
  // 2. Verify JWT token
  // 3. Tìm user trong DB theo userId từ token
  // 4. Gán req.user = user
  // 5. next()
}
```

#### Admin Auth (`api/v1/admin/middlewares/auth.middleware.js`)
```javascript
export const requireAuth = async (req, res, next) => {
  // 1. Lấy token từ header Authorization: Bearer <token>
  // 2. Verify JWT token
  // 3. Tìm user trong DB, populate roleId
  // 4. Kiểm tra user.roleId tồn tại (phải có vai trò)
  // 5. Gán req.user = user (đã có roleId populated)
  // 6. next()
}
```

### 4.2. Permission Middleware

#### Permission Check (`api/v1/admin/middlewares/permission.middleware.js`)
```javascript
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    // 1. Lấy role từ req.user.roleId (đã populated)
    // 2. Kiểm tra role.permissions.includes(permission)
    // 3. Nếu có quyền → next()
    // 4. Nếu không → 403 Forbidden
  }
}

export const requireAnyPermission = (permissions) => {
  return async (req, res, next) => {
    // Kiểm tra user có ít nhất 1 trong các permissions
  }
}
```

### 4.3. Upload Middleware

#### Cloudinary Upload (`api/v1/admin/middlewares/uploadCloud.middleware.js`)
```javascript
export const uploadSingle = async (req, res, next) => {
  // Upload 1 file lên Cloudinary
  // Gán req.body.imageUrl = cloudinary_url
}

export const uploadMulti = async (req, res, next) => {
  // Upload nhiều files lên Cloudinary
  // Gán req.body.images = [cloudinary_urls]
}
```

---

## 5. RBAC Permission System

### 5.1. Danh sách Permissions

#### Quản lý sản phẩm (Products)
- `products_view` - Xem danh sách sản phẩm
- `products_create` - Thêm sản phẩm mới
- `products_edit` - Chỉnh sửa sản phẩm
- `products_delete` - Xóa sản phẩm

#### Quản lý danh mục (Categories)
- `categories_view` - Xem danh sách danh mục
- `categories_create` - Thêm danh mục mới
- `categories_edit` - Chỉnh sửa danh mục
- `categories_delete` - Xóa danh mục

#### Quản lý vai trò (Roles)
- `roles_view` - Xem danh sách vai trò
- `roles_create` - Tạo vai trò mới
- `roles_edit` - Chỉnh sửa vai trò
- `roles_delete` - Xóa vai trò
- `roles_permissions` - Phân quyền cho vai trò

#### Quản lý tài khoản (Accounts)
- `accounts_view` - Xem danh sách tài khoản
- `accounts_create` - Tạo tài khoản mới
- `accounts_edit` - Chỉnh sửa tài khoản
- `accounts_delete` - Xóa tài khoản

#### Quản lý đơn hàng (Orders)
- `orders_view` - Xem danh sách đơn hàng
- `orders_edit` - Cập nhật trạng thái đơn hàng

#### Quản lý khuyến mãi (Promotions)
- `promotions_view` - Xem danh sách khuyến mãi
- `promotions_create` - Tạo mã khuyến mãi
- `promotions_edit` - Chỉnh sửa khuyến mãi
- `promotions_delete` - Xóa khuyến mãi

### 5.2. Vai trò mẫu (Seed Data)

#### Super Admin
```javascript
{
  title: "Super Admin",
  permissions: [
    "products_view", "products_create", "products_edit", "products_delete",
    "categories_view", "categories_create", "categories_edit", "categories_delete",
    "roles_view", "roles_create", "roles_edit", "roles_delete", "roles_permissions",
    "accounts_view", "accounts_create", "accounts_edit", "accounts_delete",
    "orders_view", "orders_edit",
    "promotions_view", "promotions_create", "promotions_edit", "promotions_delete"
  ]
}
```

#### Nhân viên kho
```javascript
{
  title: "Nhân viên kho",
  permissions: [
    "products_view", "products_edit",
    "categories_view",
    "orders_view", "orders_edit"
  ]
}
```

#### Nhân viên marketing
```javascript
{
  title: "Nhân viên marketing",
  permissions: [
    "products_view",
    "categories_view",
    "promotions_view", "promotions_create", "promotions_edit"
  ]
}
```

---

## 6. Business Logic Rules

### 6.1. Phân trang (Pagination)

**Quy tắc chung:**
1. Nhận `page` (default 1), `limit` từ `req.query`
2. Parse sang Integer, validate > 0
3. Tính `skip = (page - 1) * limit`
4. Dùng `Promise.all` để query data và countDocuments song song
5. Response phải có: `data`, `totalItems`, `totalPages`

**Default limits:**
- Product: 12 items/page
- Category (admin): 5 items/page
- User: 10 items/page
- Role: 10 items/page
- Promotion: 10 items/page
- Order: Chưa có phân trang (cần thêm sau)

### 6.2. Tìm kiếm (Search)

**Product:**
- Query param: `keyword`
- Filter: `{ name: { $regex: keyword, $options: "i" } }`

**Category:**
- Query param: `keyword`
- Filter: `{ name: { $regex: keyword, $options: "i" } }`

**User:**
- Query param: `keyword`
- Filter: `{ $or: [{ displayName: regex }, { email: regex }] }`

**Promotion:**
- Query param: `keyword`
- Filter: `{ $or: [{ title: regex }, { code: regex }] }`

### 6.3. Lọc theo danh mục (Category Filter)

**Product list:**
- Query param: `categorySlug`
- Tìm category theo slug
- Filter: `{ categoryId: category._id }`

### 6.4. Soft Delete Pattern

**Tất cả entity quan trọng có:**
- `deleted: Boolean (default: false)`
- `deletedAt: Date (default: null)`

**Khi xóa:**
```javascript
await Model.updateOne(
  { _id: id },
  { deleted: true, deletedAt: new Date() }
);
```

**Khi query:**
```javascript
const filter = { deleted: false };
```

### 6.5. Đặt hàng & Trừ kho (Order Creation)

**Quy trình:**
1. Validate items array không rỗng
2. Validate shippingAddress đầy đủ
3. Loop qua từng item:
   - Tìm product, kiểm tra `status: "active"` và `deleted: false`
   - Kiểm tra `product.stock >= item.quantity`
   - Tính `lineTotal = product.price * item.quantity`
   - Tạo snapshot: `{ productId, name, quantity, price }`
4. Tính `totalAmount = subtotal + shippingFee`
5. Tạo order với snapshot data
6. Trừ kho atomic: `Product.updateOne({ _id }, { $inc: { stock: -quantity } })`

**Quan trọng:**
- Frontend KHÔNG được gửi totalAmount lên
- Backend tự tính totalAmount từ giá sản phẩm hiện tại
- Snapshot giá và tên sản phẩm vào order items

### 6.6. Cập nhật trạng thái đơn hàng

**Order Status Flow:**
```
Pending → Processing → Shipped → Delivered
                    ↓
                Cancelled
```

**Quy tắc:**
- Chỉ cho phép tiến về phía trước
- Không cho phép lùi trạng thái
- `Cancelled` và `Delivered` là trạng thái kết thúc

### 6.7. Khuyến mãi (Promotion)

**Validation khi tạo/cập nhật:**
- `code` phải unique, tự động uppercase
- `discountType === "percentage"` → `discountValue` phải 0-100
- `startDate < endDate`
- `discountType === "percentage"` → có thể có `maxDiscountAmount`
- `discountType === "fixed"` → `maxDiscountAmount` = null

**Kiểm tra khi áp dụng:**
- `status === "active"`
- `deleted === false`
- `startDate <= now <= endDate`
- `usedCount < usageLimit` (nếu có limit)
- `orderTotal >= minOrderValue`

### 6.8. Upload File

**Quy tắc:**
- Chỉ cho phép ảnh: jpg, jpeg, png, webp
- Kích thước tối đa: 5MB/file
- Product: nhiều ảnh (max 10)
- User avatar: 1 ảnh
- Upload lên Cloudinary, lưu URL vào DB

---

## 7. HTTP Status Codes & Error Handling

### 7.1. Status Codes

| HTTP Status | Trường hợp sử dụng                                                          |
| :---------- | :-------------------------------------------------------------------------- |
| **200**     | GET/PATCH thành công                                                        |
| **201**     | POST tạo mới thành công                                                     |
| **400**     | Thiếu payload, validation fail, sai định dạng                               |
| **401**     | Token sai, token hết hạn, chưa có token                                     |
| **403**     | Không có quyền (permission denied)                                          |
| **404**     | Không tìm thấy resource (Category/Product/Order/User không tồn tại)         |
| **409**     | Conflict: Trùng slug/email/phone, hết hàng, trạng thái đơn hàng không hợp lệ |
| **500**     | Lỗi server, try/catch cuối cùng                                             |

### 7.2. Response Format

**Success Response:**
```javascript
{
  message: "Thông báo thành công",
  data: { ... },           // Hoặc array
  totalItems: 100,         // Chỉ có khi pagination
  totalPages: 10           // Chỉ có khi pagination
}
```

**Error Response:**
```javascript
{
  message: "Thông báo lỗi"
}
```

### 7.3. Error Handling Pattern

```javascript
try {
  // Business logic
  res.status(200).json({ message: "...", data: ... });
} catch (error) {
  console.log("Lỗi khi gọi [function name]", error);
  res.status(500).json({ message: "Lỗi hệ thống" });
}
```

---

## 8. Security & Best Practices

### 8.1. Password Security
- Hash với bcrypt, salt rounds = 10
- Không bao giờ trả về `hashedPassword` trong response
- Dùng `.select("-hashedPassword")` khi query user

### 8.2. JWT Security
- Access Token: 15 phút
- Refresh Token: 7 ngày, lưu trong DB
- Khi logout: xóa refresh token khỏi DB
- Verify token ở mọi protected route

### 8.3. Input Validation
- Validate tất cả input từ client
- Kiểm tra required fields
- Validate email format, phone format
- Validate số lượng, giá tiền > 0
- Validate enum values

### 8.4. Database Security
- Không cho phép stock < 0
- Dùng atomic operations ($inc) cho stock
- Soft delete thay vì hard delete
- Index các field thường query

### 8.5. API Security
- CORS configuration
- Rate limiting (nên thêm)
- Helmet.js cho security headers
- Validate file upload (type, size)

---

## Kết luận

Tài liệu này mô tả chi tiết kỹ thuật Backend của hệ thống FOOD_ORDER_MERN. Tất cả API endpoints, database schema, business rules đều phải tuân thủ theo specification này để đảm bảo tính nhất quán và bảo mật của hệ thống.
