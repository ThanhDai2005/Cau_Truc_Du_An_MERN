# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Ten san pham (working title):** FOOD_ORDER_MERN — Nen tang web ban do an (Client + Admin)

**Nen tang**

- **Frontend:** React 19, TypeScript, Vite 7, React Router 7, Zustand, Tailwind CSS 4, shadcn/ui, Axios
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT + refresh cookie `httpOnly`, Multer, Cloudinary

**Phien ban tai lieu:** 2.0 (Food Ordering Adaptation from MERN Base PRD)
**Giai doan:** MVP -> Production Ready
**Can cu:** `docs/PRD_CAU_HINH_AI.md`, `docs/features/*.md`, codebase hien tai cua du an

> **Luu y:** Tai lieu dung tieng Viet khong dau de tranh loi encoding tren mot so moi truong.

---

## 1. Tom tat san pham (Executive Summary)

He thong la web ban do an theo mo hinh:

1. **Client:** xem menu, loc mon theo category, tim kiem mon, dat hang, theo doi don cua toi.
2. **Admin:** quan ly category, product, order, dashboard thong ke co ban.

Kien truc nghiep vu chinh:

- **Category = metadata dieu huong** (menu trai / tab)
- **Product = du lieu hien thi chinh** (loc theo category qua query)
- **Order = snapshot du lieu mua tai thoi diem dat**

Flow chu dao can dam bao:

- Vao trang menu -> hien tat ca mon
- Bam category -> goi API product voi query category -> hien dung mon theo nhom
- Dat don -> tru ton kho -> luu order item snapshot

---

## 2. Muc tieu va van de giai quyet

### 2.1. Van de

- Du an can 1 cau truc backend ro trach nhiem de de mo rong ve sau.
- Can dong nhat logic loc category/product de frontend menu hoat dong dung nhu UX.
- Can giu an toan du lieu don hang khi gia/discount san pham thay doi.

### 2.2. Muc tieu MVP

- Hoan thien luong category -> product filter tren client.
- Hoan thien CRUD category/product va cap nhat trang thai order tren admin.
- Hoan thien luong tao order client (kiem ton kho, tinh tong tien, tru kho).
- Giu nguyen pattern hien tai theo AI EXECUTION CONTRACT.

---

## 3. Personas

| Persona            | Mo ta             | Nhu cau                         |
| ------------------ | ----------------- | ------------------------------- |
| Khach vang lai     | Chua dang nhap    | Xem menu, loc mon, xem chi tiet |
| Khach da dang nhap | Co tai khoan user | Dat don, xem don cua toi        |
| Quan tri vien      | Tai khoan admin   | Quan ly category/product/order  |

---

## 4. Scope

### 4.1. In-scope

**Client**

- `GET /api/v1/category` -> list category thuần (active, not deleted)
- `GET /api/v1/category/:slug` -> chi tiet category
- `GET /api/v1/product` -> list tat ca product active
- `GET /api/v1/product?categorySlug=<slug>` -> loc product theo category slug
- `GET /api/v1/product?category=<id>` -> loc product theo category id
- `GET /api/v1/product?keyword=<text>` -> tim theo ten mon
- `GET /api/v1/product/:slug` -> chi tiet mon
- `POST /api/v1/order` -> tao don
- `GET /api/v1/order/my` -> don cua nguoi dung dang nhap

**Admin**

- `POST/PATCH/DELETE /api/v1/admin/category`
- `GET /api/v1/admin/category` (list de quan ly)
- `POST/PATCH/DELETE /api/v1/admin/product`
- `GET /api/v1/admin/product` (list de quan ly)
- `GET /api/v1/admin/order`
- `PATCH /api/v1/admin/order/:id` (cap nhat orderStatus, paymentStatus)

### 4.2. Out-of-scope (phase sau)

- Thanh toan online thuc te (VNPAY/MOMO/Stripe gateway live)
- Khuyen mai nang cao (voucher, combo, flash sale)
- Danh gia/binh luan mon an
- App mobile native

---

## 5. Quy tac nghiep vu

### 5.1. Category

- Category co `name`, `slug`, `parentCategory`, `status`, soft delete.
- Client chi nhan category `active + not deleted`.

### 5.2. Product

- Product phai thuoc 1 category hop le.
- Product dung `price` (gia chuan) va `discount` (decimal 0 -> 1).
- Product client chi lay `active + not deleted`.
- Backend la noi tinh gia cuoi cung (single source of truth), frontend chi hien thi.

### 5.3. Category -> Product filtering (QUAN TRONG)

- **Khong nhung products trong API category list.**
- Frontend bam category se goi API product voi query:
  - `categorySlug` (uu tien)
  - hoac `category` id
- Day la flow chuan de de mo rong them sort/pagination sau nay.

### 5.4. Order

- Khi tao don:
  - User phai dang nhap moi duoc tao order
  - `order.user` lay tu token, khong lay tu body
  - Validate item + shippingAddress
  - Kiem tra san pham ton tai va con hang
  - Tru stock phai dam bao:
    - Khong cho phep stock < 0
    - Neu khong du hang -> reject order
  - Tinh gia moi theo cong thuc hien tai: `priceNew = price * (1 - discount)`
  - Luu snapshot vao order item
  - Tru stock
  - Tinh `totalAmount`

### 5.5. Soft delete behavior

- Tat ca query client chi lay du lieu `deleted = false`.
- Admin mac dinh quan ly du lieu `deleted = false`; co the mo rong bo loc xem ca deleted neu can (khong doi API hien tai).

---

## 6. Kien truc ky thuat

### 6.1. Frontend

- Tach vung `client`/`admin` theo route.
- Data layer dung `services` + `axios`.
- State auth dung `Zustand`.

### 6.2. Backend

- API namespace:
  - `/api/v1/*` cho client
  - `/api/v1/admin/*` cho admin
- Auth middleware `requireAuth` cho route can dang nhap.
- Pattern hien tai: `routes` + `controllers` + `models` (giu theo codebase hien tai).

### 6.3. Data

- MongoDB collections chinh:
  - `categories`
  - `products`
  - `orders`
  - `users`, `sessions`, `forgotpasswords`

---

## 7. Ma tran API rut gon

| Method | API                          | Mo ta                     | Auth        |
| ------ | ---------------------------- | ------------------------- | ----------- |
| GET    | `/api/v1/category`           | List category cho menu    | No          |
| GET    | `/api/v1/category/:slug`     | Category detail           | No          |
| GET    | `/api/v1/product`            | List product (all/filter) | No          |
| GET    | `/api/v1/product/:slug`      | Product detail            | No          |
| POST   | `/api/v1/order`              | Tao don hang              | Yes         |
| GET    | `/api/v1/order/my`           | Don cua toi               | Yes         |
| GET    | `/api/v1/admin/category`     | List category admin       | Yes (admin) |
| POST   | `/api/v1/admin/category`     | Tao category              | Yes (admin) |
| PATCH  | `/api/v1/admin/category/:id` | Sua category              | Yes (admin) |
| DELETE | `/api/v1/admin/category/:id` | Soft delete category      | Yes (admin) |
| GET    | `/api/v1/admin/product`      | List product admin        | Yes (admin) |
| POST   | `/api/v1/admin/product`      | Tao product               | Yes (admin) |
| PATCH  | `/api/v1/admin/product/:id`  | Sua product               | Yes (admin) |
| DELETE | `/api/v1/admin/product/:id`  | Soft delete product       | Yes (admin) |
| GET    | `/api/v1/admin/order`        | List order admin          | Yes (admin) |
| PATCH  | `/api/v1/admin/order/:id`    | Update status order       | Yes (admin) |

---

## 8. Acceptance Criteria

1. Trang menu ban dau hien tat ca mon khi goi `GET /product`.
2. Bam category (vd `mon-khai-vi`) goi `GET /product?categorySlug=mon-khai-vi` va tra dung danh sach.
3. `GET /category` khong chua danh sach product long trong response.
4. Tao order thanh cong se tru stock va luu snapshot item theo model order.
5. Admin list category/product/order hoat dong, CRUD category/product hoat dong.

---

## 9. Rui ro & phu thuoc

- Dong bo chinh xac logic `discount` giua frontend va backend.
- Du lieu seed category/product phai co slug dung format.
- Env JWT, MongoDB, Cloudinary phai dung theo moi truong deploy.

---

## 10. Lo trinh thuc thi de xuat

1. Khoa API contract category/product cho frontend.
2. Hoan thien UI menu trai + filter product theo categorySlug.
3. Hoan thien luong cart -> order -> order history.
4. Hoan thien admin management pages (category/product/order).
5. Bo sung sort, pagination, logging, test API.

---

_Tai lieu nay la baseline PRD cho huong trien khai web ban do an tren nen MERN cua du an hien tai._
