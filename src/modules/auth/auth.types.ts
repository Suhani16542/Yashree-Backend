export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  user: UserResponse;
  token: string;
}
