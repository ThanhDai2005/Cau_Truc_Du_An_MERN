import Banner from "@/components/client/Banner";
import ProductList from "@/components/client/ProductList";
import Service from "@/components/client/Service";
import { useAuthStore } from "@/stores/useAuthStore";

const HomePage = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <>
      <Banner />
      <Service />
      <ProductList />
    </>
  );
};

export default HomePage;
