import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router";

const HomePage = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <>
      <div>HomePage</div>
      <Link to="signup">Đăng kí</Link>
      <Link to="signin">Đăng nhập</Link>
    </>
  );
};

export default HomePage;
