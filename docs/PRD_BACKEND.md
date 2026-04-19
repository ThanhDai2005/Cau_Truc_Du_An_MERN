# PRD Backend — FOOD_ORDER_MERN (Phase 2: Core implementation spec)

| Thuộc tính                           | Giá trị                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------- |
| **Căn cứ pháp lý (source of truth)** | `docs/PRD_CAU_TRUC_DU_AN_MERN.md` (Master PRD)                            |
| **Phạm vi tài liệu**                 | Chỉ backend Node.js/Express + MongoDB/Mongoose, contract API, schema, NFR |
| **Phiên bản**                        | 1.1 — đồng bộ Master PRD v3.1 + schema `backend/models/*`                  |

> **Lưu ý:** Một số thuật ngữ tiếng Việt không dấu (encoding-safe) theo Master PRD.

---

## 0. Mục tiêu Phase 2 (Backend)

Biến backend thành hệ thống **chạy được end-to-end**, bám sát Master PRD:

- Auth đủ flow: JWT access ngắn hạn + refresh lưu DB (`Session`) + HTTP-only cookie **tách** Client/Admin.
- Category / Product: CRUD Admin + đọc Client có lọc, phân trang, sort theo whitelist.
- Cart + Order: luồng đặt món, snapshot giá, trừ kho an toàn, state machine `orderStatus`.
- Admin: dashboard aggregation, quản order (PATCH status), user/role theo phân quyền.
- Response shape và HTTP status **khóa** theo mục 7 Master PRD.

---

## 1. Kiến trúc & pattern code (LOCK — không được phá)

### 1.1 Luồng bắt buộc

**`routes` → `controllers` → `models`**

- Route module map path HTTP → handler controller.
- Controller gọi **trực tiếp** Mongoose models (query, aggregate, `findOneAndUpdate`, v.v.).
- **CẤM** tự ý thêm abstraction layer (ví dụ Service/Repository) nếu **không có lệnh** rõ ràng trong issue/PRD.

**Ghi chú thực tế repo:** Nếu codebase đang có thư mục `services/`, hướng xử lý chuẩn là **gộp logic vào controller** hoặc helper thuần (không tạo thêm layer mới) cho đến khi có quyết định kiến trúc khác — **Master PRD ưu tiên pattern trên.**

### 1.2 Namespace API

| Vùng                            | Base path           |
| ------------------------------- | ------------------- |
| Client (public + auth một phần) | `/api/v1/...`       |
| Admin / Staff                   | `/api/v1/admin/...` |

### 1.3 Công nghệ

- Node.js, **Express 5**, MongoDB, **Mongoose**.
- JWT (access) + refresh token trong DB + cookie httpOnly.
- Upload: Multer + Cloudinary (ảnh sản phẩm / avatar nếu có).

---

## 2. Database — schema & index (bắt buộc khớp Master PRD)

### 2.1 `users` — model `User`

| Field                    | Kiểu / quy tắc                                     |
| ------------------------ | -------------------------------------------------- |
| `displayName`            | String, required, trim                             |
| `phone`                  | String, required, **unique**, trim                 |
| `hashedPassword`         | String, required                                   |
| `email`                  | String, required, **unique**, trim, lowercase      |
| `address`                | String, trim, default `""`                         |
| `avatarUrl`              | String, optional                                   |
| `role`                   | Enum: `user` \| `admin` \| `staff`, default `user` |
| `status`                 | Enum: `active` \| `inactive`, default `active`     |
| `createdAt`, `updatedAt` | timestamps                                         |

**Nghiệp vụ:** `inactive` → không cho login. `phone` + `email` unique.

### 2.2 `sessions` — model `Session`

| Field          | Kiểu / quy tắc                                   |
| -------------- | ------------------------------------------------ |
| `userId`       | ObjectId ref `User`, required, indexed           |
| `refreshToken` | String, **unique**, required                     |
| `expireAt`     | Date, required                                   |
| **TTL**        | Index `{ expireAt: 1 }`, `expireAfterSeconds: 0` |

### 2.3 `forgot-password` — model `ForgotPassword`

| Field                    | Kiểu / quy tắc                                   |
| ------------------------ | ------------------------------------------------ |
| `email`                  | String, required, **unique**, trim, lowercase    |
| `otp`                    | String, required, **unique**                     |
| `expireAt`               | Date, required                                   |
| **TTL**                  | Index `{ expireAt: 1 }`, `expireAfterSeconds: 0` |
| `createdAt`, `updatedAt` | timestamps                                       |

### 2.4 `categories` — model `Category`

| Field                    | Kiểu / quy tắc                                 |
| ------------------------ | ---------------------------------------------- |
| `name`                   | String, required, trim, **unique**             |
| `slug`                   | String, required, **unique**, lowercase        |
| `description`            | String, optional                               |
| `parentCategory`         | ObjectId ref `Category`, default `null`        |
| `status`                 | Enum: `active` \| `inactive`, default `active` |
| `deleted`                | Boolean, default `false`                       |
| `deletedAt`              | Date, default `null`                           |
| `createdAt`, `updatedAt` | timestamps                                     |

**Index trong model:** (không) — có thể bổ sung `{ slug: 1 }` hoặc `{ status: 1, deleted: 1 }` theo query thực tế.

### 2.5 `products` — model `Product`

| Field                    | Kiểu / quy tắc                                 |
| ------------------------ | ---------------------------------------------- |
| `name`                   | String, required, trim                         |
| `slug`                   | String, required, **unique**, lowercase        |
| `description`            | String, required                               |
| `ingredients`            | String, required                               |
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

**Compound index:** `{ deleted: 1, categoryId: 1, status: 1, createdAt: -1 }`.

**Text search:** chưa khai báo text index trong model; `keyword` (nếu implement) dùng regex hoặc cần migration thêm index.

**Client list:** chỉ trả bản ghi `status === active` và `deleted === false` (trừ route Admin).

### 2.6 `carts` — model `Cart`

| Field                    | Kiểu / quy tắc                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `userId`                 | ObjectId ref `User`, **required** (nghiệp vụ: một giỏ / user — `findOneAndUpdate` theo `userId`)         |
| `items`                  | Subdoc: `productId` (ref Product, required), `quantity` (Number, min 1), `price` (Number, snapshot đơn giá) |
| `createdAt`, `updatedAt` | timestamps                                                                                             |

### 2.7 `orders` — model `Order`

| Field                    | Kiểu / quy tắc                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `userId`                 | ObjectId ref `User`, required                                                                    |
| `items`                  | Mảng **không** `_id` con: `productId`, `quantity`, `price` — **snapshot**                        |
| `shippingAddress`        | `recipient`, `phone`, `address` — đều required                                                  |
| `paymentMethod`          | Enum: `COD` \| `VNPAY` \| `MOMO` \| `STRIPE`, default `COD`                                      |
| `paymentStatus`          | Enum: `Pending` \| `Paid` \| `Failed` \| `Refunded`, default `Pending`                           |
| `orderStatus`            | Enum: `Pending` \| `Processing` \| `Shipped` \| `Delivered` \| `Cancelled`, default `Pending`    |
| `shippingFee`            | Number, default `0`                                                                              |
| `totalAmount`            | Number, required — **chỉ server tính**                                                           |
| `createdAt`, `updatedAt` | timestamps                                                                                       |

**Định danh đơn:** `_id` MongoDB (không có field `code` trong model hiện tại).

**Index (trong code):** `{ userId: 1, orderStatus: 1, createdAt: -1 }` (hỗ trợ `GET /order/my` và dashboard).

### 2.8 `reviews` — model `Review`

| Field                    | Kiểu / quy tắc                         |
| ------------------------ | -------------------------------------- |
| `productId`              | ObjectId ref `Product`, required       |
| `userId`                 | ObjectId ref `User`, required          |
| `rating`                 | Number, required, min `1`, max `5`     |
| `comment`                | String, required                        |
| `createdAt`, `updatedAt` | timestamps                               |

**Đồng bộ rating tổng:** cập nhật `Product.averageRating` / `numReviews` trong controller khi có thay đổi review (aggregate hoặc công thức running).

---

## 3. Phân quyền & middleware

| Middleware / vai trò | Ý nghĩa                                     |
| -------------------- | ------------------------------------------- |
| Public               | Không JWT (menu, danh mục, sản phẩm public) |
| `requireAuth`        | JWT access hợp lệ → `req.user`              |
| `requireStaff`       | Staff hoặc Admin                            |
| `requireAdmin`       | Chỉ Admin                                   |

**Quy tắc:** User thường vào route Admin → **403 Forbidden**. Token hết hạn/sai → **401**.

**Cookie refresh (tách biệt, không trộn):**

| Luồng  | Cookie name          |
| ------ | -------------------- |
| Client | `clientRefreshToken` |
| Admin  | `adminRefreshToken`  |

---

## 4. Danh mục endpoint (contract)

### 4.1 Client — `/api/v1`

| Nhóm     | Method                | Path                                                                | Auth                     | Ghi chú                                                                                                                  |
| -------- | --------------------- | ------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Auth     | POST                  | `/auth/register`                                                    | Public                   | **Contract Master PRD.** Implementation hiện có thể dùng alias `/auth/signup` — nên thống nhất một tên (ưu tiên Master). |
| Auth     | POST                  | `/auth/login`                                                       | Public                   | Alias có thể là `/auth/signin`.                                                                                          |
| Auth     | POST                  | `/auth/refresh`                                                     | Cookie refresh           | Đọc `clientRefreshToken`.                                                                                                |
| Auth     | POST                  | `/auth/logout` hoặc `/auth/signout`                                 | Cookie + optional access | Xóa session, clear cookie.                                                                                               |
| Auth     | POST                  | `/auth/forgot-password`, `/auth/verify-otp`, `/auth/reset-password` | Public                   | Theo model ForgotPassword + TTL.                                                                                         |
| User     | GET/PATCH             | `/user/...`                                                         | `requireAuth`            | Profile / cập nhật (field theo model).                                                                                   |
| Category | GET                   | `/category`                                                         | Public                   | Chỉ `active` + `deleted: false`.                                                                                         |
| Category | GET                   | `/category/:slug`                                                   | Public                   | Chi tiết theo slug.                                                                                                      |
| Product  | GET                   | `/product`                                                          | Public                   | Pagination + sort + filter (mục 5).                                                                                      |
| Product  | GET                   | `/product/:slug`                                                    | Public                   | Chi tiết.                                                                                                                |
| Review   | GET/POST              | `/product/:slug/reviews` (hoặc tương đương)                         | GET public; POST auth  | Bám schema `Review`; cập nhật aggregate rating product sau ghi.                                                          |
| Cart     | GET/POST/PATCH/DELETE | `/cart/...`                                                         | `requireAuth`            | Một giỏ / user; validate stock khi thêm/sửa.                                                                             |
| Order    | POST                  | `/order`                                                            | `requireAuth`            | Tạo đơn: snapshot + trừ kho + tính `totalAmount`.                                                                        |
| Order    | GET                   | `/order/my`                                                         | `requireAuth`            | Lịch sử theo `userId`, sort `createdAt` desc.                                                                            |
| Payment  | POST                  | `/payment/...`                                                      | Theo từng cổng           | Webhook cập nhật `paymentStatus` (idempotent).                                                                           |

### 4.2 Admin — `/api/v1/admin`

| Nhóm      | Method    | Path                              | Auth                | Ghi chú                                                |
| --------- | --------- | --------------------------------- | ------------------- | ------------------------------------------------------ |
| Auth      | POST      | `/admin/auth/login`               | Public              | Set `adminRefreshToken`.                               |
| Auth      | POST      | `/admin/auth/refresh`             | Cookie              | Đọc `adminRefreshToken`.                               |
| Auth      | POST      | `/admin/auth/logout`              | Cookie              | Xóa session admin.                                     |
| Dashboard | GET       | `/admin/dashboard/...`            | Staff+ hoặc Admin   | Revenue, orders, breakdown status.                     |
| Category  | CRUD      | `/admin/category/...`             | Staff+              | Soft delete.                                           |
| Product   | CRUD      | `/admin/product/...`              | Staff+              | Pagination list **cùng rule** Client (mục 5.1).        |
| User      | GET/PATCH | `/admin/user`, `/admin/users/...` | Admin (theo policy) | Role, status.                                          |
| Order     | GET       | `/admin/order`                    | Staff+              | Lọc theo `orderStatus`, phân trang.                    |
| Order     | PATCH     | `/admin/order/:id`                | Staff+              | Chỉ cập nhật `orderStatus` theo state machine (mục 6). |

---

## 5. Quy tắc nghiệp vụ backend (bắt buộc)

### 5.1 Pagination & sort — **GET list Product** (Client & Admin list public-style)

Theo **Master PRD §5.1** và implementation `parseProductListQuery`:

| Query                  | Quy tắc                                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                 | Mặc định `1`. Phải là số nguyên ≥ 1; sai → **400**.                                                                                                                                           |
| `limit`                | Mặc định `20`. Phải là số nguyên ≥ 1; sai → **400**. **Clamp tối đa 100** (vượt → ép về 100).                                                                                                 |
| `sortBy`               | Whitelist: `createdAt`, `name`, `price` — ngoài danh sách → **400**.                                                                                                                          |
| `sortOrder`            | `asc` \| `desc`; sai → **400**. Nếu có `sortBy` mà thiếu `sortOrder`: mặc định `createdAt` → `desc`, các field khác → `asc` (theo logic parser hiện tại — document trong code cho đồng nhất). |
| `keyword`              | Optional; tim kiem (regex hoac bo sung text index sau).                                                                                                                                      |
| `categorySlug`         | Optional; join category theo slug.                                                                                                                                                            |
| `minPrice`, `maxPrice` | Optional; validate number; NaN → **400**.                                                                                                                                                     |

**Response list bắt buộc có:**

```json
{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

`totalPages` = `Math.ceil(total / limit)` (với `limit` sau clamp).

### 5.2 Giá sản phẩm

- Model `Product` **không** có `discount`; đơn giá nguồn là `price`.
- **Client không được gửi** `price` / line total / `totalAmount` để server tin tưởng — server tính lại từ DB + giỏ tại thời điểm đặt hàng.

### 5.3 Order — stock & bất biến

1. **Atomic stock:** dùng `findOneAndUpdate` (hoặc transaction multi-document) với điều kiện `stock >= quantity`. Không cho âm kho. Vi phạm → **409 Conflict**.
2. **Snapshot:** mỗi line item lưu `productId`, `quantity`, `price` tại thời điểm đặt; sau đó giá product thay đổi **không** làm đổi order cũ.
3. **`totalAmount`:** chỉ từ tổng `quantity * price` (theo line snapshot) + `shippingFee`.

### 5.4 State machine `orderStatus`

Luồng hợp lệ: `Pending` → `Processing` → `Shipped` → `Delivered`.

- `Cancelled` là terminal; chỉ cho phép khi nghiệp vụ quy định (ví dụ từ `Pending` / `Processing` — chi tiết policy product owner).
- **Không** chuyển ngược (ví dụ `Delivered` → `Pending`). Transition sai → **409 Conflict**.

_(Tách biệt: `paymentStatus` có lifecycle riêng; webhook thanh toán không được phép sửa snapshot line items.)_

### 5.5 Category / Product — soft delete & slug

- Client: ẩn `deleted: true` hoặc `status: inactive`.
- Slug unique; trùng slug khi tạo/sửa → **409** (hoặc 400 nếu team chọn validation message — thống nhất một kiểu).

### 5.6 Cart

- Một document / `userId` (upsert theo `userId`; schema không có `unique` trên `userId` nhưng nghiệp vụ vẫn là một giỏ / user).
- Mỗi item có `price` snapshot khi thêm/cập nhật giỏ (khớp `Cart` schema).
- Mọi thao tác phải kiểm tra product còn bán, đủ stock cho `quantity` yêu cầu.

---

## 6. API contract — response & HTTP status (LOCK)

### 6.1 Cấu trúc response

- **Không** đổi tên field top-level đã thống nhất (`data`, `meta`, `message`, …) khi chưa có migration API version.
- Field mới **non-breaking** được phép thêm.

### 6.2 Bảng HTTP status (Master PRD §7.2)

| Status  | Dùng khi                                                                          |
| ------- | --------------------------------------------------------------------------------- |
| **200** | GET/PATCH/PUT thành công.                                                         |
| **201** | POST tạo resource thành công.                                                     |
| **400** | Validation, `page`/`limit`/`sortBy` sai, thiếu field bắt buộc.                    |
| **401** | Chưa đăng nhập / access token invalid/expired.                                    |
| **403** | Đã login nhưng sai role.                                                          |
| **404** | Không tìm thấy resource.                                                          |
| **409** | Hết hàng, trùng slug, chuyển `orderStatus` không hợp lệ, conflict nghiệp vụ khác. |
| **500** | Lỗi server/DB không lường trước.                                                  |

**Lỗi có cấu trúc:** Dùng `AppError` (hoặc tương đương) với `statusCode` + `message`; middleware error tập trung map về JSON thống nhất.

---

## 7. Bảo mật & NFR (backend)

- Hash password: bcrypt (cost hợp lý).
- JWT access TTL ngắn; refresh rotate (invalidate session cũ khi policy yêu cầu).
- **Không** dùng chung cookie/logic refresh giữa Client và Admin.
- Validate body/query params chặt (enum, string length, ObjectId format).
- Helmet / CORS / rate limit (theo môi trường triển khai).
- Hiệu năng: index như mục 2; mục tiêu p95 list đơn giản < 300ms (đo được sau này).

---

## 8. Upload & Cloudinary

- Middleware upload (Multer) giới hạn kích thước, loại MIME.
- Ảnh lưu URL string trên `Product.images` / `User.avatarUrl`.
- Không lưu secret Cloudinary trong client.

---

## 9. Checklist nghiệm thu backend (Definition of Done)

- [ ] Toàn bộ route Master §4 + cart/payment đã mount đúng `/api/v1` và `/api/v1/admin`.
- [ ] Auth: register/login/refresh/logout + cookie đúng tên; session TTL hoạt động.
- [ ] GET `/product` đủ pagination meta + sort whitelist + clamp limit.
- [ ] POST `/order` snapshot + atomic stock + **409** khi hết hàng.
- [ ] PATCH `/admin/order/:id` tuân state machine + **409** khi transition sai.
- [ ] Client category/product chỉ thấy active & không soft-deleted.
- [ ] Lỗi đi qua middleware tập trung; không leak stack trace ra production.

---

## 10. Liên kết tài liệu

- Master PRD: `docs/PRD_CAU_TRUC_DU_AN_MERN.md`
- Cấu hình AI / quy tắc agent: `docs/PRD_CAU_HINH_AI.md`

---

_Tài liệu này là spec implementation backend; mọi thay đổi breaking API hoặc schema cần cập nhật đồng thời Master PRD hoặc phiên bản API._
