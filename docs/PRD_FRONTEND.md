# 🎨 FRONTEND SPECIFICATION DOCUMENT (PRD FRONTEND)

| Thuộc tính         | Giá trị                                                               |
| ------------------ | --------------------------------------------------------------------- |
| **Căn cứ pháp lý** | `docs/PRD_CAU_TRUC_DU_AN_MERN.md` (Master PRD), `docs/PRD_BACKEND.md` |
| **Phạm vi**        | UI/UX, State Management, Routing, API Integration (React)             |
| **Phiên bản**      | 5.0 (RBAC System & Complete Frontend Specification)                   |
| **Ngày cập nhật**  | 2026-04-25                                                            |

> **Mục tiêu:** Frontend bám chặt nghiệp vụ và API Contract từ Backend. Frontend chỉ hiển thị + thu thập input; mọi tính toán logic (giá tiền, kho, trạng thái đơn) do Backend quyết định.

---

## Mục lục

1. [Kiến trúc & Công nghệ](#1-kien-truc--cong-nghe)
2. [Cấu trúc thư mục](#2-cau-truc-thu-muc)
3. [Quản lý State](#3-quan-ly-state)
4. [API Integration](#4-api-integration)
5. [Pages & Components](#5-pages--components)
6. [RBAC Implementation](#6-rbac-implementation)
7. [UI/UX Guidelines](#7-uiux-guidelines)
8. [Error Handling](#8-error-handling)

---

## 1. Kiến trúc & Công nghệ

### 1.1. Tech Stack

- **Core Framework:** React 19 + TypeScript + Vite 7
- **Routing:** React Router v7
- **State Management:** Zustand (Auth, Cart, UI Session)
- **Styling/UI:** Tailwind CSS 4 + shadcn/ui
- **HTTP Client:** Axios (`withCredentials: true`)
- **Form Handling:** React Hook Form + Zod validation
- **Image Upload:** Cloudinary widget hoặc custom upload component

### 1.2. Nguyên tắc LOCK

- Tách biệt rõ logic/UI của **Client** và **Admin**
- Không dùng Redux nếu chưa có chỉ định
- Giữ state gọn trong Zustand
- Không mở rộng hệ thống type/interface ngoài phạm vi store đang dùng
- Mọi tính toán nghiệp vụ (giá tiền, tổng tiền, trạng thái) do Backend xử lý

---

## 2. Cấu trúc thư mục

```text
frontend/
├── src/
│   ├── app/                    # App context, providers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── routes/                 # Router definitions
│   │   ├── index.tsx
│   │   ├── clientRoutes.tsx
│   │   └── adminRoutes.tsx
│   ├── pages/
│   │   ├── client/
│   │   │   ├── Home.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── OrderHistory.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Login.tsx
│   │       ├── CategoryList.tsx
│   │       ├── CategoryForm.tsx
│   │       ├── ProductList.tsx
│   │       ├── ProductForm.tsx
│   │       ├── OrderList.tsx
│   │       ├── OrderDetail.tsx
│   │       ├── UserList.tsx
│   │       ├── UserForm.tsx
│   │       ├── RoleList.tsx
│   │       ├── RoleForm.tsx
│   │       ├── PromotionList.tsx
│   │       └── PromotionForm.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── client/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── OrderCard.tsx
│   │   └── admin/
│   │       ├── Sidebar.tsx
│   │       ├── DataTable.tsx
│   │       ├── PermissionCheckbox.tsx
│   │       └── ImageUpload.tsx
│   ├── services/
│   │   ├── api.ts              # Axios instance
│   │   ├── authService.ts
│   │   ├── categoryService.ts
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   ├── userService.ts
│   │   ├── roleService.ts
│   │   └── promotionService.ts
│   ├── stores/
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   └── useUIStore.ts
│   ├── hooks/
│   │   ├── usePermission.ts
│   │   └── useDebounce.ts
│   ├── lib/
│   │   ├── axios.ts
│   │   └── utils.ts
│   └── types/
│       ├── auth.ts
│       ├── product.ts
│       ├── order.ts
│       └── user.ts
├── public/
└── package.json
```

---

## 3. Quản lý State

### 3.1. useAuthStore.ts

**State:**
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

**Actions:**
```typescript
{
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>,
  checkAuth: () => Promise<void>,  // Restore session từ cookie
  updateProfile: (data: Partial<User>) => void
}
```

**Lưu ý:**
- Phân biệt rõ auth Client (`/api/v1/auth`) và Admin (`/api/v1/admin/auth`)
- Client auth: Không cần check roleId
- Admin auth: Phải có roleId và permissions

### 3.2. useCartStore.ts

**State:**
```typescript
{
  items: CartItem[],
  isLoading: boolean
}
```

**Actions:**
```typescript
{
  fetchCart: () => Promise<void>,
  addToCart: (productId: string, quantity: number) => Promise<void>,
  updateQuantity: (productId: string, quantity: number) => Promise<void>,
  removeItem: (productId: string) => Promise<void>,
  clearCart: () => void
}
```

**Rules:**
- Validate `quantity > 0` ở UI trước khi gọi API
- Không lưu hoặc tính `totalAmount` trong store
- Đồng bộ với backend cart sau mỗi action

### 3.3. useUIStore.ts

**State:**
```typescript
{
  sidebarOpen: boolean,
  theme: 'light' | 'dark',
  notifications: Notification[]
}
```

**Actions:**
```typescript
{
  toggleSidebar: () => void,
  setTheme: (theme: 'light' | 'dark') => void,
  addNotification: (notification: Notification) => void,
  removeNotification: (id: string) => void
}
```

---

## 4. API Integration

### 4.1. Axios Configuration

**Base Setup:**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // Bắt buộc để gửi cookie
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Request Interceptor:**
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor (Refresh Token Flow):**
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Gọi refresh token endpoint
        const { data } = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // Lưu access token mới
        localStorage.setItem('accessToken', data.accessToken);
        
        // Retry request ban đầu
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token fail → logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 4.2. Service Layer Pattern

**Example: productService.ts**
```typescript
export const productService = {
  getList: async (params: {
    keyword?: string;
    categorySlug?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get('/product', { params });
    return data;
  },
  
  getDetail: async (slug: string) => {
    const { data } = await api.get(`/product/${slug}`);
    return data;
  }
};
```

### 4.3. API Response Format

**Success Response:**
```typescript
{
  message: string,
  data: T | T[],
  totalItems?: number,    // Có khi pagination
  totalPages?: number     // Có khi pagination
}
```

**Error Response:**
```typescript
{
  message: string
}
```

---

## 5. Pages & Components

### 5.1. Client Pages

#### Home Page
- Hero section với search bar
- Featured categories
- Featured products (carousel hoặc grid)

#### Product List Page
- Search bar
- Category filter (sidebar hoặc dropdown)
- Product grid với pagination
- Sort options: Mới nhất, Tên A-Z, Giá thấp-cao
- Empty state khi không có sản phẩm

#### Product Detail Page
- Product images (gallery)
- Product info: name, price, description, ingredients
- Quantity selector
- Add to cart button
- Reviews section (nếu có)

#### Cart Page
- List cart items với thumbnail, name, price, quantity
- Update quantity, remove item
- Subtotal calculation (hiển thị, không gửi lên backend)
- Checkout button

#### Checkout Page
- Shipping address form
- Payment method selection
- Order summary (items, subtotal, shipping fee, total)
- Place order button

#### Order History Page
- List orders với status badge
- Order detail modal/page
- Filter by status

#### Profile Page
- User info display/edit
- Avatar upload
- Change password

### 5.2. Admin Pages

#### Dashboard
- Stats cards: Total orders, revenue, products, users
- Recent orders table
- Charts (nếu có)

#### Category Management
- List với search, pagination
- Create/Edit form: name, description, parentCategory, status
- Delete confirmation

#### Product Management
- List với search, filter by category, pagination
- Create/Edit form: name, description, ingredients, category, price, images (multiple), stock, status
- Image upload component (Cloudinary)
- Delete confirmation

#### Order Management
- List với filter by status, pagination
- Order detail với items, shipping address, payment info
- Update status dropdown (chỉ cho phép tiến về phía trước)

#### User Management
- List với search, pagination
- Create/Edit form: displayName, email, phone, password, roleId, status, address
- Role selector dropdown
- Delete confirmation

#### Role Management
- List với pagination
- Create/Edit form: title, description, permissions (checkbox groups)
- Permission groups: Products, Categories, Roles, Accounts, Orders, Promotions
- Delete confirmation

#### Promotion Management
- List với search, pagination
- Create/Edit form: title, code, description, discountType, discountValue, minOrderValue, maxDiscountAmount, usageLimit, startDate, endDate, status
- Validation: percentage 0-100, startDate < endDate
- Delete confirmation

---

## 6. RBAC Implementation

### 6.1. Permission Check Hook

```typescript
// hooks/usePermission.ts
export const usePermission = (permission: string) => {
  const { user } = useAuthStore();
  
  if (!user?.roleId) return false;
  
  return user.roleId.permissions.includes(permission);
};

export const useAnyPermission = (permissions: string[]) => {
  const { user } = useAuthStore();
  
  if (!user?.roleId) return false;
  
  return permissions.some(p => user.roleId.permissions.includes(p));
};
```

### 6.2. Protected Route Component

```typescript
// components/ProtectedRoute.tsx
const ProtectedRoute = ({ 
  children, 
  permission 
}: { 
  children: React.ReactNode; 
  permission?: string;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const hasPermission = usePermission(permission);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  if (permission && !hasPermission) {
    return <Navigate to="/admin/403" />;
  }
  
  return <>{children}</>;
};
```

### 6.3. Conditional Rendering

```typescript
// Example: Product List Page
const ProductList = () => {
  const canCreate = usePermission('products_create');
  const canEdit = usePermission('products_edit');
  const canDelete = usePermission('products_delete');
  
  return (
    <div>
      {canCreate && (
        <Button onClick={handleCreate}>Thêm sản phẩm</Button>
      )}
      
      <Table>
        {products.map(product => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {canEdit && (
                <Button onClick={() => handleEdit(product._id)}>Sửa</Button>
              )}
              {canDelete && (
                <Button onClick={() => handleDelete(product._id)}>Xóa</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};
```

---

## 7. UI/UX Guidelines

### 7.1. Loading States

- **Skeleton loading** cho list/detail (không kéo dài spinner toàn màn hình)
- **Button loading state** khi submit form (disabled + spinner icon)
- **Lazy loading** cho images (blur placeholder)

### 7.2. Empty States

- Icon/illustration + text hướng dẫn
- Call-to-action button (nếu có)
- Examples:
  - Empty cart: "Giỏ hàng trống" + "Tiếp tục mua sắm" button
  - No products: "Không tìm thấy sản phẩm" + "Xóa bộ lọc" button
  - No orders: "Bạn chưa có đơn hàng nào"

### 7.3. Confirmation Dialogs

Bắt buộc confirm cho các hành động nguy hiểm:
- Xóa sản phẩm, danh mục, user, role, promotion
- Hủy đơn hàng
- Xóa khỏi giỏ hàng (optional)

### 7.4. Form Validation

- Client-side validation với React Hook Form + Zod
- Hiển thị error message dưới input field
- Disable submit button khi form invalid
- Highlight input field có lỗi (border red)

### 7.5. Responsive Design

- Mobile first approach
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- Sidebar collapse trên mobile
- Table scroll horizontal trên mobile
- Grid columns responsive: 1 col (mobile) → 2-3 cols (tablet) → 4 cols (desktop)

### 7.6. Accessibility

- Semantic HTML tags
- Alt text cho images
- ARIA labels cho interactive elements
- Keyboard navigation support
- Focus visible styles

---

## 8. Error Handling

### 8.1. HTTP Status Code Handling

| Mã lỗi | UI Action                                         |
| ------ | ------------------------------------------------- |
| `400`  | Toast validation + highlight input sai            |
| `401`  | Chạy refresh flow, fail thì về login              |
| `403`  | Redirect trang 403 Forbidden                      |
| `404`  | Hiển thị empty/not-found state                    |
| `409`  | Toast/Popup conflict (hết hàng, trùng slug...)    |
| `500`  | Alert lỗi hệ thống + cho retry                    |

### 8.2. Toast Notification

```typescript
// Success
toast.success('Thêm sản phẩm thành công');

// Error
toast.error(error.response?.data?.message || 'Có lỗi xảy ra');

// Warning
toast.warning('Sản phẩm sắp hết hàng');

// Info
toast.info('Đơn hàng đang được xử lý');
```

### 8.3. Error Boundary

Wrap app với Error Boundary để catch React errors:
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

---

## 9. Performance Optimization

### 9.1. Code Splitting

- Lazy load routes với `React.lazy()`
- Lazy load heavy components (charts, editors)

### 9.2. Image Optimization

- Use Cloudinary transformations (resize, format, quality)
- Lazy load images với `loading="lazy"`
- Use WebP format khi có thể

### 9.3. Memoization

- `React.memo()` cho components render nhiều lần
- `useMemo()` cho expensive calculations
- `useCallback()` cho functions truyền vào child components

### 9.4. Debounce Search

```typescript
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchProducts({ keyword: debouncedSearch });
  }
}, [debouncedSearch]);
```

---

## 10. Security Best Practices

### 10.1. XSS Prevention

- Không dùng `dangerouslySetInnerHTML` trừ khi cần thiết
- Sanitize user input trước khi render
- Use React's built-in escaping

### 10.2. CSRF Protection

- Backend set `httpOnly` cookie cho refresh token
- Frontend gửi `withCredentials: true`

### 10.3. Sensitive Data

- Không log sensitive data (password, token) ra console
- Không lưu sensitive data trong localStorage (chỉ lưu access token)
- Clear sensitive data khi logout

---

## 11. Definition of Done (DoD)

- [ ] API integration hoạt động ổn định, không lỗi CORS/Unauthorized
- [ ] Render đúng contract backend (`data`, `meta`)
- [ ] Form có validation trước khi gọi API
- [ ] Loading states và error handling đầy đủ
- [ ] Responsive trên mobile và desktop
- [ ] RBAC hoạt động đúng (show/hide based on permissions)
- [ ] No console errors/warnings
- [ ] Code đã được review và test

---

## Kết luận

Tài liệu này mô tả chi tiết Frontend specification của hệ thống FOOD_ORDER_MERN. Tất cả pages, components, state management, API integration đều phải tuân thủ theo specification này để đảm bảo tính nhất quán và chất lượng của ứng dụng.
