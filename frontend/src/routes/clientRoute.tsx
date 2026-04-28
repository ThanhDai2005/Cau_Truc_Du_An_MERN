import ClientLayout from "@/components/client/ClientLayout";
import HomePage from "@/pages/client/HomePage";
import SignUpPage from "@/pages/client/SignUpPage";
import SignInPage from "@/pages/client/SignInPage";
import PrivateRouter from "@/components/auth/PrivateRouter";
import ForgotPassword from "@/pages/client/ForgotPassword";
import VerifyOtp from "@/pages/client/VerifyOtp";
import ResetPassword from "@/pages/client/ResetPassword";
import NotFoundPage from "@/pages/client/NotFoundPage";
import ProfilePage from "@/pages/client/ProfilePage";

const clientRoute = {
  path: "/",
  children: [
    {
      path: "signup",
      element: <SignUpPage />,
    },
    {
      path: "signin",
      element: <SignInPage />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "verify-otp",
      element: <VerifyOtp />,
    },
    {
      path: "reset-password",
      element: <ResetPassword />,
    },
    {
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          element: <PrivateRouter />,
          children: [
            {
              path: "profile",
              element: <ProfilePage />,
            },
          ],
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ],
};

export default clientRoute;
