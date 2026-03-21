export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    username: string;
    email: string;
    is_staff: boolean;
  };
}