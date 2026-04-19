# MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD)

| Thuộc tính             | Giá trị                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **Tên sản phẩm**       | FOOD_ORDER_MERN — Nền tảng E-Commerce bán đồ ăn (Client + Admin) |
| **Phiên bản tài liệu** | 3.1 (Dong bo schema voi `backend/models/*` — User, Session, ForgotPassword, Category, Product, Cart, Order, Review) |
| **Giai đoạn**          | MVP → Production Ready                                           |
| **Căn cứ**             | docs/PRD_CAU_HINH_AI.md, codebase hiện tại                       |

> **Lưu ý:** Tài liệu dùng tiếng Việt không dấu (đối với một số thuật ngữ) để tránh lỗi encoding khi AI đọc/parse dữ liệu.

## Mục lục

1. [Nền tảng & Kiến trúc kỹ thuật](#1-nền-tảng--kiến-trúc-kỹ-thuật)
2. [Vai trò người dùng (Personas & Roles)](#2-vai-trò-người-dùng-personas--roles)
3. [Database Design (Schema & Indexing)](#3-database-design-schema--indexing)
4. [Scope & Phân quyền API](#4-scope--phân-quyền-api)
5. [Quy tắc nghiệp vụ cốt lõi (Core Business Rules)](#5-quy-tắc-nghiệp-vụ-cốt-lõi-core-business-rules)
6. [Bảo mật & Hiệu năng (NFR)](#6-bảo-mật--hiệu-năng-nfr)
7. [API Contract: Response & HTTP Status](#7-api-contract-response--http-status)

---

## 1. Nền tảng & Kiến trúc kỹ thuật

Hệ thống tuân thủ nghiêm ngặt mô hình RESTful API và kiến trúc MERN phân lớp:

| Lớp            | Công nghệ cốt lõi                                                                         |
| -------------- | ----------------------------------------------------------------------------------------- |
| **Frontend**   | React 19, TypeScript, Vite 7, React Router 7, Zustand, Tailwind CSS 4, shadcn/ui, Axios   |
| **Backend**    | Node.js, Express 5, MongoDB (Mongoose), JWT + refresh cookie httpOnly, Multer, Cloudinary |
| **Deployment** | Frontend: Vercel/Netlify; Backend: VPS/AWS; DB: MongoDB Atlas                             |

### Pattern Code Bắt Buộc (LOCK)

**routes → controllers → models**

- Express route modules map HTTP paths đến controller handlers.
- Controllers gọi trực tiếp Mongoose models.
- **CẤM** tự ý đẻ thêm các abstraction layer (như Service layer) nếu không có lệnh.

---

## 2. Vai trò người dùng (Personas & Roles)

Hệ thống có cấu trúc Multi-role rõ ràng:

| Persona (Role)        | Mô tả & Quyền hạn                                                                      |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Khách vãng lai**    | Xem menu, lọc/tìm kiếm sản phẩm. Chưa đăng nhập.                                       |
| **User (Khách hàng)** | Có tài khoản. Thêm giỏ hàng, đặt món, thanh toán, theo dõi đơn hàng my-order.          |
| **Staff (Nhân viên)** | Có quyền truy cập Admin Dashboard (bị giới hạn). Xử lý đơn hàng, cập nhật orderStatus. |
| **Admin (Quản trị)**  | Toàn quyền. CRUD sản phẩm/danh mục/user, thống kê doanh thu, quản lý hệ thống.         |

---

## 3. Database Design (Schema & Indexing)

Thiết kế DB ưu tiên tốc độ truy vấn (Indexing) và an toàn dữ liệu (Soft delete).

### 3.1 Auth & User Data

**Collection `users`** (model `User`)

| Field                    | Kiểu / Ghi chú                                     |
| ------------------------ | -------------------------------------------------- |
| `displayName`            | String, required, trim                             |
| `phone`                  | String, required, **unique**, trim                 |
| `hashedPassword`         | String, required                                   |
| `email`                  | String, required, **unique**, trim, lowercase      |
| `address`                | String, trim, default `""`                         |
| `avatarUrl`              | String (optional)                                  |
| `role`                   | Enum: `user` \| `admin` \| `staff`, default `user` |
| `status`                 | Enum: `active` \| `inactive`, default `active`     |
| `createdAt`, `updatedAt` | timestamps                                         |

**Collection `sessions`** (model `Session`)

| Field          | Kiểu / Ghi chú                                      |
| -------------- | --------------------------------------------------- |
| `userId`       | ObjectId ref `User`, required, indexed              |
| `refreshToken` | String, **unique**, required                        |
| `expireAt`     | Date, required                                      |
| **TTL**        | Index `{ expireAt: 1 }` với `expireAfterSeconds: 0` |

**Collection `forgot-password`** (model `ForgotPassword`)

| Field                    | Kiểu / Ghi chú                                      |
| ------------------------ | --------------------------------------------------- |
| `email`                  | String, required, **unique**, trim, lowercase       |
| `otp`                    | String, required, **unique**                        |
| `expireAt`               | Date, required                                      |
| **TTL**                  | Index `{ expireAt: 1 }` với `expireAfterSeconds: 0` |
| `createdAt`, `updatedAt` | timestamps                                          |

### 3.2 Product & Category (Metadata)

**Collection `categories`** (model `Category`)

| Field                    | Kiểu / Ghi chú                                 |
| ------------------------ | ---------------------------------------------- |
| `name`                   | String, required, trim, **unique**             |
| `slug`                   | String, required, **unique**, lowercase        |
| `description`            | String (optional)                              |
| `parentCategory`         | ObjectId ref `Category`, default `null`        |
| `status`                 | Enum: `active` \| `inactive`, default `active` |
| `deleted`                | Boolean, default `false`                       |
| `deletedAt`              | Date, default `null`                           |
| `createdAt`, `updatedAt` | timestamps                                     |

**Index trong code:** (khong) — co the bo sung sau theo query (goi y: `{ slug: 1 }`, `{ status: 1, deleted: 1 }`).

**Collection `products`** (model `Product`)

| Field                    | Kiểu / Ghi chú                                 |
| ------------------------ | ---------------------------------------------- |
| `name`                   | String, required, trim                         |
| `slug`                   | String, required, **unique**, lowercase        |
| `description`            | String, required                               |
| `ingredients`            | String, required (thanh phan / nguyen lieu)   |
| `categoryId`             | ObjectId ref `Category`, required              |
| `price`                  | Number, required                               |
| `images`                 | `[String]`                                     |
| `stock`                  | Number, required, min `0`, default `0`         |
| `averageRating`          | Number, default `0`, min `0`, max `5`          |
| `numReviews`             | Number, default `0`                            |
| `status`                 | Enum: `active` \| `inactive`, default `active` |
| `deleted`                | Boolean, default `false`                       |
| `deletedAt`              | Date, default `null`                           |
| `createdAt`, `updatedAt` | timestamps                                     |

**Compound index (trong code):** `{ deleted: 1, categoryId: 1, status: 1, createdAt: -1 }`

**Ghi chú tim kiem:** Text index **chua** khai bao trong model; `keyword` (neu co) dung regex/`$text` sau khi bo sung index — khong ghi nhan la da co trong schema hien tai.

### 3.3 Giỏ hàng (Cart)

**Collection `carts`** (model `Cart`)

| Field                    | Kiểu / Ghi chú                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `userId`                 | ObjectId ref `User`, **required** (nghiep vu: mot user mot gio — cap nhat `findOneAndUpdate` theo `userId`) |
| `items`                  | Mảng subdocument: `productId` (ObjectId ref `Product`, required), `quantity` (Number, min 1), `price` (Number, **snapshot** don gia tai thoi diem them gio) |
| `createdAt`, `updatedAt` | timestamps                                                                                                  |

### 3.4 Transaction (Orders)

**Collection `orders`** (model `Order`)

| Field                    | Kiểu / Ghi chú                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `userId`                 | ObjectId ref `User`, required                                                                 |
| `items`                  | Mảng (không `_id` con): `productId`, `quantity`, `price` — **snapshot** don hang               |
| `shippingAddress`        | Subdocument: `recipient`, `phone`, `address` (tat ca required)                                  |
| `paymentMethod`          | Enum: `COD` \| `VNPAY` \| `MOMO` \| `STRIPE`, default `COD`                                   |
| `paymentStatus`          | Enum: `Pending` \| `Paid` \| `Failed` \| `Refunded`, default `Pending`                        |
| `orderStatus`            | Enum: `Pending` \| `Processing` \| `Shipped` \| `Delivered` \| `Cancelled`, default `Pending` |
| `shippingFee`            | Number, default `0`                                                                           |
| `totalAmount`            | Number, required                                                                              |
| `createdAt`, `updatedAt` | timestamps                                                                                    |

**Dinh danh don:** dung `_id` MongoDB (khong co field `code` trong model hien tai).

**Index (trong `order.model.js`):** `{ userId: 1, orderStatus: 1, createdAt: -1 }` (GET `/order/my` + dashboard).

### 3.5 Đánh giá sản phẩm (Review)

**Collection `reviews`** (model `Review`)

| Field                    | Kiểu / Ghi chú                                      |
| ------------------------ | --------------------------------------------------- |
| `productId`              | ObjectId ref `Product`, required                    |
| `userId`                 | ObjectId ref `User`, required                       |
| `rating`                 | Number, required, min `1`, max `5`                  |
| `comment`                | String, required                                    |
| `createdAt`, `updatedAt` | timestamps                                          |

**Ghi chú nghiệp vụ:** Khi tạo/sửa/xóa review, backend can dong bo `Product.averageRating` + `Product.numReviews` (aggregate hoac cap nhat tang/giam) — logic nam o controller, khong nam trong schema.

---

## 4. Scope & Phân quyền API

Namespace quy chuẩn: Client là `/api/v1/...` | Admin/Staff là `/api/v1/admin/...`

### 4.1 Client API (Public & RequireAuth)

| Nhóm     | Method    | Endpoint                                         | Note / Yêu cầu Auth                 |
| -------- | --------- | ------------------------------------------------ | ----------------------------------- |
| Auth     | POST      | `/auth/register`, `/auth/login`, `/auth/refresh` | Quản lý Cookie `clientRefreshToken` |
| Category | GET       | `/category`, `/category/:slug`                   | Chỉ lấy active + `deleted` = false  |
| Product  | GET       | `/product`, `/product/:slug`                     | Có Pagination/Sort (xem mục 5.1)    |
| Review   | GET/POST  | `/product/:slug/reviews` (hoặc tương đương)      | GET public; POST `requireAuth` — contract tách biet khi implement |
| Order    | POST, GET | `/order`, `/order/my`                            | Bắt buộc User đã đăng nhập          |

### 4.2 Admin API (RequireAdmin / RequireStaff)

| Nhóm     | Method     | Endpoint                                   | Note / Yêu cầu Auth                |
| -------- | ---------- | ------------------------------------------ | ---------------------------------- |
| Auth     | POST       | `/admin/auth/login`, `/admin/auth/refresh` | Quản lý Cookie `adminRefreshToken` |
| Category | CRUD       | `/admin/category/...`                      | Soft delete support                |
| Product  | CRUD       | `/admin/product/...`                       | Có Pagination y hệt Client         |
| Order    | GET, PATCH | `/admin/order`, `/admin/order/:id`         | Update `orderStatus`               |

---

## 5. Quy tắc nghiệp vụ cốt lõi (Core Business Rules)

Đây là các quy tắc VÀNG, AI hoặc Dev không được phép phá vỡ hay code sai logic.

### 5.1 Pagination & Sort (Rule Phân Trang Toàn Cục)

Áp dụng bắt buộc cho API GET List Product.

- **Pagination:** Bắt từ query `page` (mặc định 1) và `limit` (mặc định 20).
- **Clamp Rule:** `limit` tối đa = 100. Vượt quá tự ép về 100.
- **Lỗi 400:** Nếu `page` hoặc `limit` < 1 hoặc không phải số nguyên.
- **Sort:** Chỉ cho phép sort theo `createdAt`, `name`, `price`. Mặc định là `createdAt=desc` (mới nhất). Trượt khỏi whitelist → Lỗi 400.
- **Response:** Bắt buộc trả thêm object `meta: { page, limit, total, totalPages }` cùng cấp với mảng `data`.

### 5.2 Giá sản phẩm (Product không có field discount)

- Don gia hien tai lay tu `Product.price` (model khong co `discount`).
- Frontend chi hien thi; **khong** gui `price` / tong tien line / `totalAmount` de server tin tuong khi tao Order — server tinh lai tu DB + gio hang tai thoi diem dat.

### 5.3 Kỷ luật Order (Giao dịch)

- **Atomic Stock (Trừ kho an toàn):** Bắt buộc dùng `findOneAndUpdate` với điều kiện `stock >= quantity` (hoặc Transaction). Không cho phép trừ âm kho. Hết hàng trả về HTTP **409 Conflict**.
- **Order Immutability (Bất biến):** Mỗi line item luu snapshot `productId`, `quantity`, `price` (don gia tai luc dat). Order sau khi tao khong phu thuoc vao gia Product sau nay.
- **Total Amount:** Chi tinh tu backend: tong (`quantity * price` theo tung line snapshot) + `shippingFee`.

### 5.4 Vòng đời đơn hàng (Order Status Lifecycle)

- **State Machine:** `Pending` → `Processing` → `Shipped` → `Delivered`.
- Hoặc rẽ nhánh: `Cancelled` (Terminal state).
- **Quy tắc:** Không được phép chuyển trạng thái ngược (Ví dụ: `Delivered` → `Pending`). Invalid transition trả về HTTP **409 Conflict**.

---

## 6. Bảo mật & Hiệu năng (NFR)

**Security:**

- JWT ngắn hạn + Refresh Token rotation (Lưu HTTP-Only Cookie).
- Không trộn lẫn logic auth/cookie của Client và Admin.
- Validate dữ liệu đầu vào chặt chẽ.

**Performance:**

- Tối ưu MongoDB Index (đặc biệt cho category filter và soft delete).
- API response < 300ms (cho phép cache sau này).

---

## 7. API Contract: Response & HTTP Status

### 7.1 Cấu trúc Response (Lock Shape)

Định dạng JSON phải ổn định: **KHÔNG** tự ý đổi tên field, cấu trúc lồng nhau (nesting) hoặc kiểu dữ liệu khi chưa có yêu cầu. Các field mới non-breaking được phép thêm vào nhưng không phá field cũ.

### 7.2 HTTP Status Chuẩn

| Status        | Ý nghĩa và Trường hợp dùng                                                |
| ------------- | ------------------------------------------------------------------------- |
| **200 / 201** | Thành công (201 cho Create).                                              |
| **400**       | Bad Request (Validation lỗi, page/limit sai, thiếu trường bắt buộc).      |
| **401**       | Unauthorized (Chưa đăng nhập, token hết hạn/sai).                         |
| **403**       | Forbidden (Đã login nhưng sai Role, VD: User mò vào route Admin).         |
| **404**       | Not Found (Resource không tồn tại).                                       |
| **409**       | Conflict (Hết hàng/Stock âm, Trùng slug, Chuyển orderStatus sai quy tắc). |
| **500**       | Lỗi server/DB.                                                            |
