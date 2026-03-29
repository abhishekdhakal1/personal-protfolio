import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("auth_token") || localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's admin or user
      const isAdmin = localStorage.getItem("admin_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");

      window.location.href = isAdmin ? "/admin-login" : "/login";
    }
    return Promise.reject(error);
  },
);

export const endpoints = {
  // Auth
  auth: {
    login: "/auth/login",
    adminLogin: "/auth/admin/login",
    logout: "/auth/logout",
    register: "/auth/register",
    me: "/auth/me",
  },
  // Messages
  messages: {
    list: "/messages",
    create: "/messages",
    get: (id: string) => `/messages/${id}`,
    update: (id: string) => `/messages/${id}`,
    delete: (id: string) => `/messages/${id}`,
    markAsRead: (id: string) => `/messages/${id}/read`,
  },
  // Projects
  projects: {
    list: "/projects",
    create: "/projects",
    get: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },
  // Skills
  skills: {
    list: "/skills",
    create: "/skills",
    get: (id: string) => `/skills/${id}`,
    update: (id: string) => `/skills/${id}`,
    delete: (id: string) => `/skills/${id}`,
  },
  // Profile
  profile: {
    get: "/profile",
    update: "/profile",
  },
};
