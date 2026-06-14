import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Về Chúng Tôi - FoodieVN | Khám Phá Câu Chuyện Ẩm Thực</title>
        <meta
          name="description"
          content="Hành trình của FoodieVN - Nền tảng đặt đồ ăn trực tuyến ưu tiên chất lượng hàng đầu. Khám phá đội ngũ và giá trị cốt lõi của chúng tôi."
        />
      </Helmet>

      <div className="min-h-screen bg-white pb-20">
        {/* ================= HERO SECTION ================= */}
        <div className="relative h-[450px] bg-gradient-to-br from-[#b51c00] to-[#8e1400] overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full blur-[120px]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-center text-center">
            <div className="text-white max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-white/20">
                Câu chuyện của chúng tôi
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
                Về FoodieVN
              </h1>
              <p className="text-lg md:text-2xl text-red-100 font-medium leading-relaxed">
                Hành trình kết nối những tâm hồn đam mê ẩm thực với hàng ngàn
                hương vị tuyệt hảo, giao trọn niềm vui đến tận cửa nhà.
              </p>
            </div>
          </div>
        </div>

        {/* ================= STORY SECTION ================= */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-[#b51c00] rounded-3xl translate-x-4 translate-y-4 opacity-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="Đội ngũ FoodieVN đang chuẩn bị món ăn"
                className="relative rounded-3xl shadow-2xl z-10 w-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:-translate-y-2"
                loading="lazy"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-100 animate-bounce-slow hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-[#b51c00]">
                    <span className="material-symbols-outlined text-[32px]">
                      restaurant
                    </span>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">2+</p>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                      Năm Phục Vụ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Hương vị thật,
                <br />
                <span className="text-[#b51c00]">Chất lượng thật.</span>
              </h2>
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  FoodieVN ra đời từ một ý tưởng tưởng chừng đơn giản:{" "}
                  <strong>
                    Mọi người đều xứng đáng được thưởng thức những bữa ăn nóng
                    hổi, ngon miệng, bất kể họ bận rộn đến đâu.
                  </strong>
                </p>
                <p>
                  Năm 2024, từ một góc quán cà phê nhỏ tại Sài Gòn, ba người bạn
                  đam mê công nghệ và ẩm thực đã quyết định thay đổi cách mọi
                  người đặt đồ ăn. Chúng tôi nhận thấy thị trường cần một nền
                  tảng minh bạch hơn về nguồn gốc, ổn định hơn về chất lượng và
                  thần tốc hơn trong khâu giao nhận.
                </p>
                <p>
                  Và FoodieVN thành hình — không chỉ là một ứng dụng giao đồ ăn,
                  mà là một hệ sinh thái{" "}
                  <strong>ưu tiên trải nghiệm vị giác</strong>, nơi mỗi đối tác
                  nhà hàng đều là một nghệ nhân, mỗi shipper là một đại sứ mang
                  niềm vui đến cho bạn.
                </p>
              </div>
            </div>
          </div>

          {/* ================= VALUES SECTION ================= */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                Giá Trị Cốt Lõi
              </h2>
              <p className="text-gray-600 text-lg">
                Kim chỉ nam trong mọi hoạt động của hệ thống FoodieVN.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "verified_user",
                  title: "Kiểm Định Khắt Khe",
                  desc: "100% đối tác nhà hàng phải vượt qua quy trình thẩm định vệ sinh an toàn thực phẩm 5 bước trước khi lên app.",
                },
                {
                  icon: "rocket_launch",
                  title: "Tốc Độ Ánh Sáng",
                  desc: "Hệ thống điều phối tài xế thông minh bằng AI giúp rút ngắn thời gian giao hàng xuống mức trung bình 30 phút.",
                },
                {
                  icon: "support_agent",
                  title: "Tận Tâm 24/7",
                  desc: "Đội ngũ chăm sóc khách hàng luôn túc trực. Cam kết hoàn tiền ngay lập tức nếu món ăn không đạt chuẩn.",
                },
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#b51c00] transition-colors duration-300">
                    <span className="material-symbols-outlined text-[32px] text-[#b51c00] group-hover:text-white transition-colors duration-300">
                      {val.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {val.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= STATS SECTION ================= */}
          <div className="bg-[#b51c00] rounded-[40px] p-12 md:p-16 mb-24 text-white relative overflow-hidden shadow-2xl shadow-red-900/20">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 relative z-10">
              Những Con Số Biết Nói
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center relative z-10">
              {[
                { number: "50K+", label: "Đơn Hàng / Tháng" },
                { number: "200+", label: "Đối Tác Nhà Hàng" },
                { number: "4.8/5", label: "Đánh Giá Trung Bình" },
                { number: "30p", label: "Thời Gian Giao" },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-4xl md:text-6xl font-black mb-3 drop-shadow-md">
                    {stat.number}
                  </span>
                  <span className="text-sm md:text-base font-bold text-red-200 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= TEAM SECTION ================= */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                Đội Ngũ Sáng Lập
              </h2>
              <p className="text-gray-600 text-lg">
                Những bộ óc kết hợp giữa công nghệ tiên tiến và nghệ thuật ẩm
                thực.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  name: "Nguyễn Hùng",
                  role: "CEO & Founder",
                  exp: "Cựu Product Manager. 8 năm kinh nghiệm vận hành nền tảng Food-tech.",
                  img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
                },
                {
                  name: "Lê Minh",
                  role: "CTO & Co-founder",
                  exp: "Chuyên gia MERN Stack. Đam mê tối ưu hóa hệ thống cho hàng triệu traffic.",
                  img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
                },
                {
                  name: "Trần Lan",
                  role: "Head Chef",
                  exp: "15 năm đứng bếp trưởng tại các nhà hàng 5 sao. Bậc thầy thẩm định hương vị.",
                  img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
                },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-gray-100 text-center hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-red-50 group-hover:border-[#b51c00] transition-colors duration-300">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#b51c00] font-bold text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed px-4">
                    {member.exp}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CTA SECTION ================= */}
          <div className="bg-gray-50 rounded-[40px] p-12 md:p-20 text-center border border-gray-200">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Sẵn Sàng Khám Phá Món Ngon?
            </h2>
            <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Hàng trăm thực đơn đặc sắc đang chờ bạn thưởng thức. Đặt món ngay
              hôm nay để nhận ưu đãi vận chuyển!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-10 py-4 bg-[#b51c00] text-white rounded-xl font-bold hover:bg-[#8e1400] transition-all shadow-lg hover:shadow-red-900/30 active:scale-95 flex items-center justify-center gap-2"
              >
                Khám Phá Menu
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                to="/blog"
                className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:border-[#b51c00] hover:text-[#b51c00] transition-all active:scale-95"
              >
                Đọc Góc Ẩm Thực
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
