import axios from "axios";

export const API_BASE_URL =
  (import.meta.env.API_URL as string | undefined) ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach token from localStorage
apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("admin_token") ?? localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdmin = window.location.pathname.startsWith("/admin");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = isAdmin ? "/admin-login" : "/";
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    login: "/auth/login",
    adminLogin: "/auth/admin/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  profile: {
    get: "/profile",
    update: "/profile",
    deleteImage: "/profile/image",
  },
  projects: {
    list: "/projects",
    create: "/projects",
    get: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },
  skills: {
    list: "/skills",
    create: "/skills",
    get: (id: string) => `/skills/${id}`,
    update: (id: string) => `/skills/${id}`,
    delete: (id: string) => `/skills/${id}`,
  },
  experience: {
    list: "/experience",
    create: "/experience",
    get: (id: string) => `/experience/${id}`,
    update: (id: string) => `/experience/${id}`,
    delete: (id: string) => `/experience/${id}`,
  },
  messages: {
    list: "/messages",
    create: "/messages",
    get: (id: string) => `/messages/${id}`,
    update: (id: string) => `/messages/${id}`,
    delete: (id: string) => `/messages/${id}`,
    markAsRead: (id: string) => `/messages/${id}`,
  },
};
