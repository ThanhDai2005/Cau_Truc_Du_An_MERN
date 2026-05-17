---
name: Food Ordering Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5c403a'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#906f69'
  outline-variant: '#e5beb6'
  surface-tint: '#ba1d00'
  primary: '#b51c00'
  on-primary: '#ffffff'
  primary-container: '#db3416'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a5'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#00647f'
  on-tertiary: '#ffffff'
  tertiary-container: '#007fa0'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3e0400'
  on-primary-fixed-variant: '#8e1400'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#bce9ff'
  tertiary-fixed-dim: '#64d3fe'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d63'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 16px
  gutter: 12px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
---

## Brand & Style
Thiết kế hướng tới sự hiện đại, tối giản và tập trung tối đa vào trải nghiệm người dùng (User-Centric). Lấy cảm hứng từ các nền tảng dẫn đầu thị trường như GrabFood và ShopeeFood, hệ thống này ưu tiên sự rõ ràng của hình ảnh món ăn và tốc độ thực hiện tác vụ. 

Phong cách chủ đạo là **Corporate / Modern**, kết hợp với tinh thần **Minimalism** để loại bỏ các yếu tố gây nhiễu. Giao diện sử dụng không gian trắng (white space) rộng rãi, các thành phần UI có góc bo tròn thân thiện và hiệu ứng đổ bóng nhẹ nhàng để tạo chiều sâu mà không gây nặng nề về mặt thị giác. Mục tiêu là khơi gợi cảm giác ngon miệng, tin cậy và sự nhanh chóng.

## Colors
Bảng màu được xây dựng dựa trên mã màu chủ đạo **#FF4D2D** (Cam đỏ), một tông màu kích thích vị giác và tạo sự năng động. 

- **Primary (#FF4D2D):** Sử dụng cho các hành động quan trọng (CTA), nút bấm chính và các trạng thái active.
- **Secondary (#2ECC71):** Dùng cho các chỉ số tích cực như giảm giá, thanh toán thành công hoặc tình trạng "Còn hàng".
- **Neutrals:** Hệ thống thang xám được tính toán để tạo độ tương phản tốt nhất cho việc đọc nội dung. Màu nền chính luôn là trắng tinh khiết (#FFFFFF) để làm nổi bật hình ảnh món ăn, trong khi màu nền phụ là xám nhạt (#F5F5F5).
- **Trạng thái:** Màu sắc thông báo được giữ ở mức bão hòa vừa phải để không làm vỡ tổng thể thiết kế tối giản.

## Typography
Hệ thống sử dụng duy nhất font chữ **Inter** để đảm bảo tính nhất quán và khả năng hiển thị hoàn hảo trên mọi thiết bị kỹ thuật số.

- **Headlines:** Sử dụng độ đậm (Bold/SemiBold) cao để phân cấp thông tin rõ ràng, đặc biệt là tên quán ăn và tiêu đề món ăn.
- **Body:** Ưu tiên kích thước 14px cho nội dung chính để cân bằng giữa lượng thông tin và sự thoáng đãng.
- **Mobile Scaling:** Các tiêu đề lớn (Headline-xl) khi hiển thị trên Mobile sẽ tự động thu nhỏ về Headline-lg để tránh tràn dòng và chiếm quá nhiều diện tích màn hình. 
- **Line-height:** Luôn được thiết lập từ 1.2 đến 1.5 lần kích thước font để tối ưu khả năng đọc (readability).

## Layout & Spacing
Hệ thống áp dụng phương pháp **8pt Grid System** để tạo ra nhịp điệu thị giác đồng nhất.

- **Grid:** Sử dụng Fluid Grid cho Mobile (4 cột) và Fixed Grid (12 cột, max-width 1200px) cho Desktop.
- **Margins:** Lề an toàn cho di động là 16px. Các thành phần bên trong Card sử dụng padding 12px hoặc 16px tùy theo kích thước card.
- **Rhythm:** Khoảng cách giữa các section lớn thường là 32px (xl), giữa các item trong danh sách là 12px hoặc 16px. Việc tuân thủ bội số của 8 giúp giao diện trông chuyên nghiệp và gọn gàng hơn.

## Elevation & Depth
Hệ thống sử dụng **Ambient Shadows** kết hợp với các tầng màu sắc (Tonal layers) để phân cấp nội dung mà không cần dùng đến quá nhiều đường kẻ (borders).

- **Mức độ 1 (Surface):** Nền trắng mặc định của ứng dụng.
- **Mức độ 2 (Cards/Inputs):** Sử dụng shadow cực nhẹ (0px 2px 8px rgba(0,0,0,0.05)) để phân biệt với nền.
- **Mức độ 3 (Modals/Popovers):** Sử dụng shadow sâu hơn (0px 10px 25px rgba(0,0,0,0.1)) để tạo cảm giác nổi hẳn lên trên bề mặt nội dung, đi kèm với lớp phủ backdrop mờ (overlay 40% black).
- **Đường kẻ:** Chỉ sử dụng đường kẻ 1px màu #EEEEEE cho các danh sách dài hoặc để chia tách các khu vực thông tin quá dày đặc.

## Shapes
Ngôn ngữ hình khối của hệ thống là **Rounded** (Tròn trịa) với thông số chủ đạo là **12px**.

- **Radius 12px:** Áp dụng cho hầu hết các thành phần như Cards, Input Fields, Buttons và Modals. Đây là "điểm ngọt" tạo ra cảm giác hiện đại, trẻ trung nhưng vẫn đủ cấu trúc.
- **Radius 8px:** Dùng cho các thành phần nhỏ hơn như Badge, nhãn tag hoặc ảnh nhỏ trong danh sách.
- **Radius 50% (Circle):** Dùng cho Avatar người dùng và các nút hành động tròn (ví dụ: nút quay lại, nút yêu thích).

## Components

### Button
- **Primary:** Background #FF4D2D, chữ trắng, bo góc 12px. Hiệu ứng hover giảm nhẹ độ sáng.
- **Secondary:** Viền #FF4D2D, chữ #FF4D2D, background trắng.
- **Ghost:** Không viền, không nền, chữ #FF4D2D hoặc màu xám.

### Input Field
- Chiều cao tiêu chuẩn 48px. 
- Border 1px màu #E0E0E0, bo góc 12px.
- Trạng thái Focus: Border chuyển sang màu Primary #FF4D2D với hiệu ứng bóng nhẹ xung quanh.

### Card
- Sử dụng background trắng, bo góc 12px.
- Hình ảnh món ăn/nhà hàng chiếm vị trí ưu tiên ở phía trên.
- Đổ bóng nhẹ mức độ 2 để tách biệt khỏi nền xám phụ.

### Modal
- Căn giữa màn hình hoặc dạng Bottom Sheet cho Mobile.
- Bo góc 16px ở các góc trên.
- Có nút đóng (X) rõ ràng ở góc phải hoặc một thanh kéo (handle) ở phía trên đối với Bottom Sheet.

### Skeleton
- Sử dụng hiệu ứng màu xám nhạt biến thiên (shimmer effect).
- Hình khối của Skeleton phải trùng khớp hoàn toàn với Border Radius của component thực tế (12px).

### Empty State
- Sử dụng minh họa (illustration) tối giản với màu sắc nhạt.
- Bao gồm 1 dòng Headline-md miêu tả trạng thái và 1 nút Primary CTA để dẫn dắt người dùng quay lại luồng chính (ví dụ: "Tiếp tục đặt món").