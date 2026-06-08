import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-6 px-4 max-w-7xl mx-auto">
      <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden shadow-sm flex items-center bg-gray-200">
        <img
          alt="Food promotion banner"
          className="absolute inset-0 w-full h-full object-cover"
          src="banner.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 px-6 md:px-12 w-full max-w-md">
          <span className="inline-block px-2 py-1 bg-green-600 text-white text-[10px] font-bold uppercase rounded mb-3">
            Ưu đãi hôm nay
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Giảm 50% cho đơn hàng đầu tiên
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#b51c00] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
