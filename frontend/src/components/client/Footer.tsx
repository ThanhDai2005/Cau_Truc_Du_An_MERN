import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8 px-4 md:px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">FoodieVN</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Hệ thống đặt món trực tuyến nhanh chóng và tiện lợi. Giao hàng tận nơi — đảm bảo chất lượng.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">Liên kết</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Đơn hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">Hỗ trợ</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Trung tâm trợ giúp
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              email@foodievn.com
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">call</span>
              1900 xxxx
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              07:00 - 22:00 hằng ngày
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} FoodieVN. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-neutral-400 hover:text-white transition-colors">
            Facebook
          </a>
          <a href="#" className="text-neutral-400 hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="text-neutral-400 hover:text-white transition-colors">
            Tiktok
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
