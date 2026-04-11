import { RouterProvider } from "react-router-dom";
import router from "./routes/indexRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
