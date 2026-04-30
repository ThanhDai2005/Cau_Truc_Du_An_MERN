import { useAdminStore } from "../stores/useAdminStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE == "development"
      ? "http://localhost:3000/api/v1/"
      : "/api/v1/",
  withCredentials: true, // giúp gửi cookie lên server
});

// Tự động gắn token vào header cho mọi request
api.interceptors.request.use((config) => {
  const { accessToken } = useAdminStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
export default api;

// Tự động gọi refresh api khi accessToken hết hạn

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; //{ url: "/users/me", method: "get", headers: {...}}

    // Bỏ qua các API Auth tránh vòng lặp vô hạn
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // đếm số lần đã thử lại yêu cầu này.
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status == 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      console.log("refresh", originalRequest._retryCount);
      try {
        const res = await api.post(
          "/admin/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data.accessToken;
        useAdminStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); //Request cũ: api.get("/users/me"); Sau khi refresh xong: return api({url: "/users/me", method: "get", headers: { Authorization: "Bearer NEW_TOKEN" }});
      } catch (error) {
        console.log(error);
        useAdminStore.getState().clearState();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
