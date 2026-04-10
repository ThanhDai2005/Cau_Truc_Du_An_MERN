import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const ClientLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ClientLayout;
