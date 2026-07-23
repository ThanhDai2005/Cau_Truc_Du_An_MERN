import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

const ClientLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />

      <ChatWidget />
    </div>
  );
};

export default ClientLayout;
