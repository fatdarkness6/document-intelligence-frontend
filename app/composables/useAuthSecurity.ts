import type { ChangePasswordPayload } from "~/types/auth";

export const useAuthSecurity = () => {
  const api = useApi();

  const changePassword = (payload: ChangePasswordPayload) => {
    return api<void>("/auth/change-password", {
      method: "POST",
      body: payload,
    });
  };

  return {
    changePassword,
  };
};
