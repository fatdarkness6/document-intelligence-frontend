export interface User {
  id: number;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
