import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const PROMO_CODE = "VIET50";

function useDailyCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

function CountdownCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-['Bricolage_Grotesque',system-ui] text-xl font-bold text-[#F5EDE6] leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
        {label}
      </div>
    </div>
  );
}

function PromoCard({ onCopy }: { onCopy: () => void }) {
  const time = useDailyCountdown();

  return (
    <div
      onClick={onCopy}
      className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 min-w-[160px] text-center backdrop-blur-sm cursor-pointer transition-transform duration-200 hover:-translate-y-1 active:scale-95 select-none mx-auto sm:mx-0 w-full max-w-[280px] sm:w-auto"
    >
      <div className="font-['Bricolage_Grotesque',system-ui] text-5xl font-extrabold tracking-tight text-[#F5A623] leading-none">
        50%
      </div>
      <div className="text-[13px] font-semibold text-white/90 uppercase tracking-wide mt-0.5">
        OFF
      </div>
      <div className="text-[11px] text-white/40 mt-1 leading-snug">
        Đơn hàng đầu tiên
        <br />
        Tối thiểu 99K
      </div>

      <div className="w-full h-px bg-white/10 my-3" />

      <div className="flex items-center justify-center gap-1.5 bg-[#C8321A]/10 border border-dashed border-[#C8321A]/30 rounded-md px-2.5 py-1.5 transition-colors hover:bg-[#C8321A]/20">
        <span className="font-['Bricolage_Grotesque',system-ui] text-sm font-semibold text-[#FF8C6B] tracking-widest">
          {PROMO_CODE}
        </span>
        <span className="text-[11px] text-[#FF8C6B]/60 material-symbols-outlined text-base">
          content_copy
        </span>
      </div>

      <div className="flex items-start justify-center gap-2 mt-3">
        <CountdownCell value={time.hours} label="Giờ" />
        <div className="font-['Bricolage_Grotesque',system-ui] text-lg text-white/20 pt-0.5">
          :
        </div>
        <CountdownCell value={time.minutes} label="Phút" />
        <div className="font-['Bricolage_Grotesque',system-ui] text-lg text-white/20 pt-0.5">
          :
        </div>
        <CountdownCell value={time.seconds} label="Giây" />
      </div>
    </div>
  );
}

const Banner = () => {
  const navigate = useNavigate();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      toast.success(`Đã sao chép mã ${PROMO_CODE}`);
    } catch {
      toast.error("Không thể sao chép mã");
    }
  };

  return (
    <section className="mt-6 px-4 max-w-7xl mx-auto">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-[#2D1A10]">
        {/* Tối ưu hiển thị ảnh theo thiết bị */}
        <picture className="absolute inset-0 w-full h-full">
          {/* Màn hình dưới 768px (Mobile) sẽ tải ảnh dọc */}
          <source media="(max-width: 768px)" srcSet="/banner-mobile.jpg" />
          {/* Màn hình lớn (Desktop) tải ảnh ngang gốc */}
          <img
            src="/banner.jpg"
            alt="Khuyến mãi giảm 50% đơn đầu tiên"
            fetchPriority="high"
            className="w-full h-full object-cover object-center md:object-right"
          />
        </picture>

        {/* Tối ưu lớp phủ Gradient che mờ nền để đọc chữ rõ hơn trên mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-[#2D1A10]/80 to-black/90 md:bg-gradient-to-br md:from-black/80 md:via-[#2D1A10]/80 md:to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-6 sm:p-8 md:p-12 text-center md:text-left">
          <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-[#C8321A]/20 border border-[#C8321A]/30 text-[#FF6B4A] text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
                Ưu đãi hôm nay
              </div>
            </div>

            <h1 className="font-extrabold leading-[1.1] tracking-tight text-[#F5EDE6] mb-3 text-2xl sm:text-3xl md:text-5xl font-['Bricolage_Grotesque']">
              Giảm <em className="not-italic text-[#F5A623]">50%</em>
              <br />
              đơn hàng đầu tiên
            </h1>

            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-6 max-w-sm">
              Hàng nghìn món ngon từ nhà hàng uy tín.
              <br className="hidden md:block" />
              Giao trong 30 phút — hoặc miễn phí.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2.5 bg-[#C8321A] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:bg-[#D94020] active:scale-95 shadow-md shadow-[#C8321A]/30 standard-button"
            >
              Đặt ngay
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
            <PromoCard onCopy={handleCopyCode} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
