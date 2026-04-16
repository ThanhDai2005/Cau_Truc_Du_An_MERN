# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Ten san pham (working title):** CAU_TRUC_DU_AN_MERN — Ung dung Web Full-Stack (MERN)

**Nen tang**

- **Frontend:** React 19, TypeScript, Vite 7, React Router 7, Zustand, Tailwind CSS 4, shadcn/ui (Radix), Axios, React Hook Form + Zod, Sonner
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT, cookie `httpOnly` cho refresh token, bcrypt, Nodemailer (OTP quen mat khau), Cloudinary (upload avatar), Multer (memory storage)

**Giai doan:** MVP / dang hoan thien (theo trang thai code hien tai)

**Phien ban tai lieu:** 1.0

**Can cu:** Cau truc repo `Cau_Truc_Du_An_MERN` (frontend + backend) va mau PRD `PRD_VN_GO_MVP.docx` (khung muc va do chi tiet).

> **Luu y:** File nay dung tieng Viet khong dau de tranh loi encoding tren mot so moi truong. Ban co the copy vao Word/Google Docs va them dau trong buoc hoan thien.

---

## 1. Tom tat san pham (Executive Summary)

He thong la **ung dung web MERN** gom hai vung trai nghiem:

1. **Khu vuc nguoi dung (Client):** dang ky, dang nhap, lam moi phien (refresh), xem ho so khi da xac thuc, **quen mat khau** qua email (OTP), xac thuc OTP, dat lai mat khau; cap nhat thong tin va **upload avatar** (qua Cloudinary).
2. **Khu vuc quan tri (Admin):** dang nhap / dang xuat admin, layout co sidebar (shadcn), trang **Dashboard** va **Quan ly nguoi dung**; API admin tach base path `/api/v1/admin`.

Kien truc tong the: **SPA React** goi **REST API** Express; xac thuc ket hop **JWT access token** (thoi han ngan) va **refresh token** luu session DB + cookie `httpOnly`; CORS bat `credentials` trung voi `CLIENT_URL`.

**Go y hinh minh hoa (tuong duong Hinh 1.1–1.2 trong PRD mau):**

- *Use case tong quat:* Nguoi dung (dang ky, dang nhap, profile, avatar, quen mat khau); Quan tri vien (admin login, dashboard, quan ly user); he thong gui OTP, luu session.
- *Sequence tong quat:* Client -> Express -> Controller -> Mongoose -> JSON; luong dang nhap: set cookie refresh + tra access token.

---

## 2. Muc tieu va van de giai quyet

### 2.1. Van de

- Nen tang web **tach kenh** nguoi dung va admin, co **bao mat phien** (access/refresh) va **khoi phuc tai khoan** qua OTP.
- **Cau truc code thong nhat:** routes/pages/components/stores/services tren FE; `api/v1/client` va `api/v1/admin` tren BE.

### 2.2. Muc tieu MVP

- Vong doi **dang ky -> dang nhap -> route bao ve -> /profile**.
- **Quen mat khau** voi OTP co TTL (MongoDB), verify, reset token, doi mat khau.
- API version `v1`, middleware `requireAuth` cho tai nguyen can dang nhap.
- Admin shell: `/admin/login`, `/admin/dashboard`, `/admin/user`.

---

## 3. Chan dung nguoi dung (User Personas)

| Persona | Mo ta | Nhu cau |
|--------|--------|---------|
| Nguoi dung da dang ky | Co tai khoan `user` | Dang nhap, `/profile`, cap nhat & avatar, dang xuat |
| Nguoi moi | Chua co tai khoan | Dang ky, chuyen sang dang nhap |
| Quen mat khau | Mat quyen truy cap | OTP email, dat lai mat khau |
| Quan tri vien | `admin` | Kenh `/admin`, dashboard, quan ly user |

---

## 4. Pham vi san pham (MVP Scope)

### 4.1. In-scope (theo repo)

**Client FE:** `ClientLayout`; `/`, `/signup`, `/signin`, `/forgot-password`, `/verify-otp`, `/reset-password`, 404; `PrivateRouter` -> `/profile`; Zustand `useAuthStore`, `useUserStore`.

**Client BE:** `POST /api/v1/auth/*` (signup, signin, signout, refresh, forgot, verify-otp, reset); `GET/PATCH /api/v1/user/*` sau `requireAuth`.

**Admin FE:** `adminRoute`, `AdminLayout`, sidebar, `DashboardPage`, `UserManagementPage`, `useAdminStore`.

**Admin BE:** `/api/v1/admin/auth/*`; `/dashboard`, `/user` voi `requireAuth`.

**Models:** `User` (role user|admin, status active|inactive, ...); `ForgotPassword` (TTL); `Session` (refresh).

### 4.2. Out-of-scope / backlog

- Controller admin (login, dashboard, user) hien **placeholder** — can sprint hoan thien xac thuc & phan quyen `admin`.
- CRUD user day du, phan trang — chua day du trong code hien tai.
- i18n; app mobile / offline — khong thuoc pham vi MERN web nay.

**Go y sequence:** Form -> authService -> API -> Zustand; forgot: email -> OTP -> verify -> reset.

---

## 5. Quy tac nghiep vu cot loi

### 5.1. Xac thuc (AUTH)

- **Dang ky:** bat buoc cac truong; username/email unique (lowercase); bcrypt.
- **Dang nhap:** JWT access (~30 phut theo BE); refresh luu Session + cookie `httpOnly`, `secure`, `sameSite: none` (FE/BE deploy rieng).
- **Dang xuat:** xoa session / cookie theo implementation.

### 5.2. OTP / reset (PWD)

- Ban ghi theo email; `expireAt` + TTL; sau verify tra `resetToken`; doi mat khau dong bo rule FE/BE.

### 5.3. USER

- `role`: `user` | `admin`; route admin nen kiem tra role.
- `status`: `active` | `inactive` — co the dung de khoa dang nhap (enforce trong signIn neu la yeu cau).

### 5.4. PROFILE

- Avatar: multipart -> Multer memory -> Cloudinary -> cap nhat `avatarUrl`.
- PATCH thong tin ca nhan.

### 5.5. Admin

- Endpoint da dinh tuyen nhung logic **placeholder** — quy tac day du sau khi implement (chi `role === 'admin'` dang nhap kenh admin).

---

## 6. NFR & kien truc

- REST JSON; loi hien thi qua toast; index DB hop ly; TTL collection OTP.
- Bao mat: khong luu mat khau plaintext; secret tu env; refresh httpOnly giam rui ro XSS lay refresh (van can chong XSS).
- CORS: `CLIENT_URL`, `credentials: true`.

**Frontend (`frontend/src/`):** `routes/`, `pages/`, `components/`, `stores/`, `services/`, `lib/`, `types/`.

**Backend (`backend/`):** `index.js`, `api/v1/client/`, `api/v1/admin/`, `models/`, `config/`, `helpers/`.

**Go y ERD:** User 1—n Session; ForgotPassword theo email/OTP. **Thanh phan:** Browser -> Vite SPA -> Express -> MongoDB; Mail; Cloudinary.

---

## 7. Ma tran API (rut gon)

| Phuong thuc | Path | Mo ta | Auth |
|-------------|------|--------|------|
| POST | `/api/v1/auth/signup` | Dang ky | Khong |
| POST | `/api/v1/auth/signin` | Dang nhap, set refresh cookie | Khong |
| POST | `/api/v1/auth/signout` | Dang xuat | Theo thiet ke |
| POST | `/api/v1/auth/refresh` | Lam moi access | Cookie refresh |
| POST | `/api/v1/auth/forgot-password` | Tao/gui OTP | Khong |
| POST | `/api/v1/auth/verify-otp` | Xac thuc OTP | Khong |
| POST | `/api/v1/auth/reset-password` | Dat lai mat khau | resetToken |
| GET | `/api/v1/user/detail` | Chi tiet user | requireAuth |
| PATCH | `/api/v1/user/uploadAvatar` | Upload avatar | requireAuth |
| PATCH | `/api/v1/user/profile` | Cap nhat profile | requireAuth |
| POST | `/api/v1/admin/auth/login` | Admin login | Khong (stub) |
| POST | `/api/v1/admin/auth/logout` | Admin logout | — |
| GET | `/api/v1/admin/dashboard` | Dashboard | requireAuth |
| GET | `/api/v1/admin/user` | Quan ly user | requireAuth |

---

## 8. Tieu chi chap nhan (vi du)

- Dang ky & dang nhap thanh cong; `/profile` khi da xac thuc.
- Quen mat khau end-to-end hoat dong.
- Avatar upload cap nhat `avatarUrl`.
- Admin: chap nhan "hoan tat" khi backend xac thuc that (khong con stub).

---

## 9. Rui ro & phu thuoc

- Bien moi truong (`CLIENT_URL`, JWT, MongoDB, SMTP, Cloudinary).
- HTTPS bat buoc cho cookie `secure` trong production.
- Ky vong do admin API dang stub.

---

## 10. Lo trinh goi y

1. Hoan thien admin auth + kiem tra `role === 'admin'`.
2. Dashboard & quan ly user thuc te.
3. Kiem thu tu dong (API + E2E).
4. Logging, rate limit, hardening upload.

---

*Tai lieu phan anh source tai thoi diem soan; cap nhat khi code doi.*
