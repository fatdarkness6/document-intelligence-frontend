// app/stores/auth.ts

import type { User, LoginResponse } from "~/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const accessToken = useCookie<string | null>("docintel.access-token");

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  function setToken(token: string) {
    accessToken.value = token;
  }

  function setUser(value: User | null) {
    user.value = value;
  }

  function clearAuth() {
    accessToken.value = null;
    user.value = null;
  }

  async function login(email: string, password: string) {
    const api = useApi();

    const body = new URLSearchParams();

    body.set("username", email);
    body.set("password", password);

    const response = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setToken(response.access_token);

    return response;
  }

  async function register(payload: { email: string; password: string }) {
    const api = useApi();

    return await api<User>("/auth/register", {
      method: "POST",
      body: payload,
    });
  }

  async function fetchCurrentUser() {
    const api = useApi();

    const currentUser = await api<User>("/auth/me");

    setUser(currentUser);

    return currentUser;
  }

  async function logout() {
    clearAuth();
    await navigateTo("/login");
  }

  return {
    user,
    accessToken,
    isAuthenticated,

    login,
    register,
    fetchCurrentUser,
    logout,

    setToken,
    setUser,
    clearAuth,
  };
});
