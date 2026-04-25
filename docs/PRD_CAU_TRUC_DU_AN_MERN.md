# 🧾 PRODUCT REQUIREMENTS DOCUMENT (PRD)

# 🍔 FOOD_ORDER_MERN — Nền tảng E-Commerce bán đồ ăn (Full Stack MERN)

| Thuộc tính             | Giá trị                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **Tên sản phẩm**       | FOOD_ORDER_MERN — Nền tảng E-Commerce bán đồ ăn (Client + Admin) |
| **Phiên bản tài liệu** | 5.0 (RBAC System & Complete Architecture)                        |
| **Giai đoạn**          | MVP → Production Ready                                           |
| **Ngày cập nhật**      | 2026-04-25                                                       |
| **Căn cứ**             | `docs/PRD_CAU_HINH_AI.md`, `docs/PRD_BACKEND.md`, `docs/PRD_FRONTEND.md` |

> **Lưu ý:** Đây là tài liệu gốc quy định luồng nghiệp vụ và kiến trúc tổng thể. Chi tiết kỹ thuật API và DB Schema nằm ở bản Backend PRD.

## Mục lục

1. [Tổng quan hệ thống](#1-tong-quan-he-thong)
2. [Vai trò người dùng (Personas)](#2-vai-tro-nguoi-dung-personas)
3. [Hệ thống phân quyền (RBAC)](#3-he-thong-phan-quyen-rbac)
4. [Luồng người dùng chính (User Flows)](#4-luong-nguoi-dung-chinh-user-flows)
5. [Phạm vi tính năng (Scope)](#5-pham-vi-tinh-nang-scope)
6. [Quy tắc nghiệp vụ cốt lõi (Core Business Rules)](#6-quy-tac-nghiep-vu-cot-loi)
7. [Kiến trúc hệ thống](#7-kien-truc-he-thong)

---

## 1. Tổng quan hệ thống

Xây dựng nền tảng đặt đồ ăn trực tuyến (MERN Stack) chia làm 2 phân hệ rõ rệt:

- **Client App:** Nơi khách hàng xem menu, lọc sản phẩm, thêm vào giỏ hàng, đặt đơn và theo dõi lịch sử.
- **Admin Dashboard:** Nơi nhân viên/quản trị viên quản lý danh mục, hàng hóa, duyệt đơn hàng, phân quyền và thống kê doanh thu.

**Công nghệ sử dụng:**
- Frontend: React.js + React Router + Axios
- Backend: Node.js + Express.js + MongoDB (Mongoose)
- Authentication: JWT (Access Token + Refresh Token)
- File Upload: Cloudinary
- Authorization: Role-Based Access Control (RBAC)

---

## 2. Vai trò người dùng (Personas)

| Vai trò               | Phân quyền & Mô tả                                                                                       |
| :-------------------- | :------------------------------------------------------------------------------------------------------- |
| **Guest (Khách)**     | Truy cập tự do để xem Menu, tìm kiếm món ăn. Yêu cầu đăng nhập khi bắt đầu đặt hàng.                     |
| **User (Khách hàng)** | Có tài khoản. Sở hữu 1 Giỏ hàng duy nhất (Cart). Tạo đơn hàng, theo dõi vòng đời đơn, đánh giá (Review). |
| **Staff (Nhân viên)** | Có roleId được gán quyền cụ thể. Quản lý đơn hàng, sản phẩm theo permissions được cấp.                   |
| **Admin (Quản trị)**  | Có roleId với toàn quyền. Quản lý tài khoản, phân quyền, xem thống kê doanh thu toàn sàn.                |

---

## 3. Hệ thống phân quyền (RBAC)

### 3.1. Cấu trúc phân quyền

Hệ thống sử dụng **Role-Based Access Control (RBAC)** với cấu trúc:
- **User** có `roleId` (ObjectId) tham chiếu đến **Role**
- **Role** chứa mảng `permissions` (array of strings)
- Mỗi route admin được bảo vệ bởi middleware `requirePermission(permission)`

### 3.2. Danh sách permissions

**Quản lý sản phẩm:**
- `products_view` - Xem danh sách sản phẩm
- `products_create` - Thêm sản phẩm mới
- `products_edit` - Chỉnh sửa sản phẩm
- `products_delete` - Xóa sản phẩm

**Quản lý danh mục:**
- `categories_view` - Xem danh sách danh mục
- `categories_create` - Thêm danh mục mới
- `categories_edit` - Chỉnh sửa danh mục
- `categories_delete` - Xóa danh mục

**Quản lý vai trò:**
- `roles_view` - Xem danh sách vai trò
- `roles_create` - Tạo vai trò mới
- `roles_edit` - Chỉnh sửa vai trò
- `roles_delete` - Xóa vai trò
- `roles_permissions` - Phân quyền cho vai trò

**Quản lý tài khoản:**
- `accounts_view` - Xem danh sách tài khoản
- `accounts_create` - Tạo tài khoản mới
- `accounts_edit` - Chỉnh sửa tài khoản
- `accounts_delete` - Xóa tài khoản

**Quản lý đơn hàng:**
- `orders_view` - Xem danh sách đơn hàng
- `orders_edit` - Cập nhật trạng thái đơn hàng

**Quản lý khuyến mãi:**
- `promotions_view` - Xem danh sách khuyến mãi
- `promotions_create` - Tạo mã khuyến mãi
- `promotions_edit` - Chỉnh sửa khuyến mãi
- `promotions_delete` - Xóa khuyến mãi

### 3.3. Luồng kiểm tra quyền

1. User đăng nhập → Nhận JWT token chứa `userId`
2. Request đến admin route → Middleware `requireAuth` verify token
3. Middleware `requireAuth` populate `roleId` từ User
4. Middleware `requirePermission(permission)` kiểm tra `role.permissions` có chứa permission không
5. Nếu có → Cho phép truy cập, nếu không → Trả về 403 Forbidden

---

## 4. Luồng người dùng chính (User Flows)

### 4.1. Flow mua hàng cốt lõi (Happy Path)

1. Khách hàng lướt xem danh sách món ăn (có hỗ trợ phân trang tự động để không lag).
2. Lọc món ăn theo `Danh mục` hoặc tìm kiếm theo `Tên món`.
3. Thêm món vào Giỏ hàng (Hệ thống tự động kiểm tra xem kho còn hàng không).
4. Vào trang Thanh toán → Xác nhận thông tin giao hàng.
5. Tạo đơn (Hệ thống **chụp lại giá** hiện tại của món ăn và **trừ kho**).
6. Nhân viên nhận đơn trên Admin → Đổi trạng thái sang "Đang xử lý" → "Đang giao".

### 4.2. Flow quản lý sản phẩm (Admin)

1. Admin/Staff đăng nhập vào Admin Dashboard
2. Hệ thống kiểm tra `roleId` và `permissions`
3. Nếu có quyền `products_view` → Hiển thị danh sách sản phẩm (có phân trang, tìm kiếm)
4. Nếu có quyền `products_create` → Cho phép thêm sản phẩm mới (upload ảnh lên Cloudinary)
5. Nếu có quyền `products_edit` → Cho phép chỉnh sửa thông tin sản phẩm
6. Nếu có quyền `products_delete` → Cho phép xóa mềm sản phẩm

### 4.3. Flow phân quyền (Admin)

1. Super Admin truy cập trang Quản lý vai trò
2. Tạo vai trò mới (VD: "Nhân viên kho")
3. Chọn permissions cho vai trò (VD: products_view, products_edit, orders_view, orders_edit)
4. Lưu vai trò
5. Vào trang Quản lý tài khoản → Gán `roleId` cho user

---

## 5. Phạm vi tính năng (Scope)

### 5.1. Hệ thống Client

- **Auth System:** Đăng ký, Đăng nhập, Đăng xuất, Quên mật khẩu (OTP qua Email), Refresh Token
- **Catalog System:** Xem danh sách sản phẩm (phân trang, tìm kiếm, lọc theo danh mục)
- **Shopping System:** Giỏ hàng (Cart) lưu trữ theo userId, CRUD giỏ hàng
- **Order System:** Tạo đơn hàng, xem lịch sử đơn hàng, chọn phương thức thanh toán (COD, Momo, VNPay)
- **User Profile:** Xem/cập nhật thông tin cá nhân, upload avatar

### 5.2. Hệ thống Admin

- **Auth System:** Đăng nhập admin, Refresh Token
- **Dashboard:** Thống kê tổng quan (doanh thu, đơn hàng, sản phẩm)
- **Product Management:** CRUD sản phẩm (có upload ảnh, ingredients field, phân trang, tìm kiếm)
- **Category Management:** CRUD danh mục (có phân trang, tìm kiếm)
- **Order Management:** Xem danh sách đơn hàng, cập nhật trạng thái đơn hàng
- **User Management:** CRUD tài khoản người dùng, gán roleId
- **Role Management:** CRUD vai trò, phân quyền cho vai trò
- **Promotion Management:** CRUD mã khuyến mãi (percentage/fixed discount, usage limit, date range)

---

## 6. Quy tắc nghiệp vụ cốt lõi (Business Rules)

_Dành cho cả team Tech và team Business tuân thủ tuyệt đối:_

### 6.1. Quy tắc hiển thị & Phân trang (Pagination)

- Bắt buộc áp dụng phân trang (Page, Limit) ở mọi danh sách dữ liệu để chống quá tải.
- Giới hạn hiển thị mặc định:
  - Product: 12 items/page
  - Category: 5 items/page (admin), unlimited (client)
  - User: 10 items/page
  - Order: unlimited (cần thêm phân trang sau)
  - Role: 10 items/page
  - Promotion: 10 items/page
- Khách hàng chỉ nhìn thấy Sản phẩm và Danh mục có trạng thái `active` và `deleted: false`.

### 6.2. Định giá & Bất biến đơn hàng (Order Immutability)

- Giá bán của sản phẩm là giá duy nhất (không có field discount). 
- **Quy tắc Snapshot:** Khi đơn hàng tạo thành công, phải "chụp" lại tên món và giá tiền lưu thẳng vào đơn. Nếu hôm sau Admin tăng/giảm giá món ăn, đơn hàng cũ **không được phép** thay đổi giá.
- Frontend **tuyệt đối không** được gửi tổng tiền lên backend để tạo đơn (phòng chống hack giá).

### 6.3. Quy tắc Kho hàng (Stock Rules)

- Không bao giờ cho phép kho hàng bị âm (< 0).
- Khi tạo đơn hàng, backend phải kiểm tra `product.stock >= item.quantity` trước khi trừ kho.
- Sử dụng `$inc` operator của MongoDB để trừ kho atomic (tránh race condition).

### 6.4. Vòng đời đơn hàng (Order State Machine)

**Order Status:**
- Trạng thái đi theo 1 chiều tiến: `Pending` → `Processing` → `Shipped` → `Delivered`
- Trạng thái `Cancelled` là trạng thái kết thúc (Terminal)
- Tuyệt đối không được phép lùi trạng thái (Ví dụ: Từ Đã giao hàng lùi về Đang xử lý)

**Payment Status:**
- `Pending` - Chưa thanh toán
- `Paid` - Đã thanh toán
- `Failed` - Thanh toán thất bại
- `Refunded` - Đã hoàn tiền

### 6.5. Quy tắc Soft Delete

- Tất cả các entity quan trọng (User, Product, Category, Role, Promotion, Order) đều có field `deleted` và `deletedAt`.
- Khi xóa, chỉ set `deleted: true` và `deletedAt: new Date()`, không xóa vật lý khỏi database.
- Các query phải luôn filter `deleted: false` để không hiển thị dữ liệu đã xóa.

### 6.6. Quy tắc Authentication & Authorization

- Client routes: Chỉ cần `requireAuth` middleware (verify JWT)
- Admin routes: Cần cả `requireAuth` và `requirePermission(permission)` middleware
- JWT Access Token có thời gian sống ngắn (15 phút)
- JWT Refresh Token có thời gian sống dài (7 ngày), lưu trong collection `sessions`
- Khi user đăng xuất, phải xóa refresh token khỏi database

### 6.7. Quy tắc Upload File

- Chỉ cho phép upload ảnh (jpg, jpeg, png, webp)
- Kích thước tối đa: 5MB/file
- Upload lên Cloudinary, lưu URL vào database
- Product có thể có nhiều ảnh (array), User chỉ có 1 avatar

### 6.8. Quy tắc Promotion (Khuyến mãi)

- Mã khuyến mãi phải unique (uppercase)
- `discountType`: "percentage" (0-100%) hoặc "fixed" (số tiền cố định)
- `minOrderValue`: Giá trị đơn hàng tối thiểu để áp dụng
- `maxDiscountAmount`: Giảm tối đa (chỉ áp dụng cho percentage)
- `usageLimit`: Số lần sử dụng tối đa (null = unlimited)
- `usedCount`: Số lần đã sử dụng
- `startDate` và `endDate`: Thời gian hiệu lực
- Kiểm tra: `startDate < endDate`, `usedCount < usageLimit`, `status: active`, `deleted: false`

---

## 7. Kiến trúc hệ thống

### 7.1. Cấu trúc thư mục Backend

```
backend/
├── api/
│   └── v1/
│       ├── admin/
│       │   ├── controllers/
│       │   │   ├── auth.controller.js
│       │   │   ├── dashboard.controller.js
│       │   │   ├── user.controller.js
│       │   │   ├── users.controller.js
│       │   │   ├── category.controller.js
│       │   │   ├── product.controller.js
│       │   │   ├── order.controller.js
│       │   │   ├── role.controller.js
│       │   │   └── promotion.controller.js
│       │   ├── middlewares/
│       │   │   ├── auth.middleware.js
│       │   │   ├── permission.middleware.js
│       │   │   └── uploadCloud.middleware.js
│       │   └── routes/
│       │       ├── index.route.js
│       │       ├── auth.route.js
│       │       ├── dashboard.route.js
│       │       ├── user.route.js
│       │       ├── users.route.js
│       │       ├── category.route.js
│       │       ├── product.route.js
│       │       ├── order.route.js
│       │       ├── role.route.js
│       │       └── promotion.route.js
│       └── client/
│           ├── controllers/
│           │   ├── auth.controller.js
│           │   ├── user.controller.js
│           │   ├── category.controller.js
│           │   ├── product.controller.js
│           │   ├── cart.controller.js
│           │   └── order.controller.js
│           ├── middlewares/
│           │   ├── auth.middleware.js
│           │   └── uploadCloud.middleware.js
│           └── routes/
│               ├── index.route.js
│               ├── auth.route.js
│               ├── user.route.js
│               ├── category.route.js
│               ├── product.route.js
│               ├── cart.route.js
│               └── order.route.js
├── models/
│   ├── user.model.js
│   ├── role.model.js
│   ├── category.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   ├── order.model.js
│   ├── promotion.model.js
│   ├── session.model.js
│   ├── forgot-password.model.js
│   └── review.model.js
├── config/
│   └── database.js
├── helpers/
│   └── sendMail.js
└── index.js
```

### 7.2. Database Schema Overview

**Collections:**
1. `users` - Thông tin người dùng (có roleId)
2. `roles` - Vai trò và permissions
3. `categories` - Danh mục sản phẩm
4. `products` - Sản phẩm (có categoryId, ingredients)
5. `carts` - Giỏ hàng (theo userId)
6. `orders` - Đơn hàng (có userId, items snapshot)
7. `promotions` - Mã khuyến mãi
8. `sessions` - Refresh tokens
9. `forgot_passwords` - OTP quên mật khẩu
10. `reviews` - Đánh giá sản phẩm

### 7.3. API Structure

**Client API:**
- `POST /api/v1/auth/sign-up` - Đăng ký
- `POST /api/v1/auth/sign-in` - Đăng nhập
- `POST /api/v1/auth/sign-out` - Đăng xuất
- `POST /api/v1/auth/refresh-token` - Làm mới token
- `GET /api/v1/category` - Danh sách danh mục
- `GET /api/v1/product` - Danh sách sản phẩm (phân trang, tìm kiếm, lọc)
- `GET /api/v1/product/:slug` - Chi tiết sản phẩm
- `GET /api/v1/cart` - Lấy giỏ hàng
- `POST /api/v1/cart/add` - Thêm vào giỏ
- `PATCH /api/v1/cart/update/:productId` - Cập nhật số lượng
- `PATCH /api/v1/cart/remove/:productId` - Xóa khỏi giỏ
- `POST /api/v1/order` - Tạo đơn hàng
- `GET /api/v1/order/my` - Lịch sử đơn hàng

**Admin API:**
- `POST /api/v1/admin/auth/login` - Đăng nhập admin
- `GET /api/v1/admin/category` - Danh sách danh mục (phân trang, tìm kiếm)
- `POST /api/v1/admin/category` - Tạo danh mục
- `PATCH /api/v1/admin/category/:id` - Cập nhật danh mục
- `DELETE /api/v1/admin/category/:id` - Xóa danh mục
- `GET /api/v1/admin/product` - Danh sách sản phẩm (phân trang, tìm kiếm, lọc)
- `POST /api/v1/admin/product` - Tạo sản phẩm (upload ảnh)
- `PATCH /api/v1/admin/product/:id` - Cập nhật sản phẩm
- `DELETE /api/v1/admin/product/:id` - Xóa sản phẩm
- `GET /api/v1/admin/order` - Danh sách đơn hàng
- `PATCH /api/v1/admin/order/:id` - Cập nhật trạng thái đơn
- `GET /api/v1/admin/users` - Danh sách tài khoản (phân trang, tìm kiếm)
- `GET /api/v1/admin/users/:id` - Chi tiết tài khoản
- `POST /api/v1/admin/users` - Tạo tài khoản
- `PATCH /api/v1/admin/users/:id` - Cập nhật tài khoản
- `DELETE /api/v1/admin/users/:id` - Xóa tài khoản
- `GET /api/v1/admin/role` - Danh sách vai trò
- `GET /api/v1/admin/role/permissions` - Danh sách permissions
- `POST /api/v1/admin/role` - Tạo vai trò
- `PATCH /api/v1/admin/role/:id` - Cập nhật vai trò
- `DELETE /api/v1/admin/role/:id` - Xóa vai trò
- `GET /api/v1/admin/promotion` - Danh sách khuyến mãi (phân trang, tìm kiếm)
- `GET /api/v1/admin/promotion/:id` - Chi tiết khuyến mãi
- `POST /api/v1/admin/promotion` - Tạo khuyến mãi
- `PATCH /api/v1/admin/promotion/:id` - Cập nhật khuyến mãi
- `DELETE /api/v1/admin/promotion/:id` - Xóa khuyến mãi

---

## Kết luận

Tài liệu này mô tả kiến trúc tổng thể và quy tắc nghiệp vụ của hệ thống FOOD_ORDER_MERN. Để biết chi tiết kỹ thuật về API endpoints, request/response format, và database schema, vui lòng tham khảo:
- `docs/PRD_BACKEND.md` - Chi tiết Backend API
- `docs/PRD_FRONTEND.md` - Chi tiết Frontend Components
- `docs/PRD_CAU_HINH_AI.md` - Cấu hình AI Assistant
