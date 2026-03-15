export type UserStatus = 'allowed' | 'admin' | 'blacklisted';

export interface LoginResponse {
  status: UserStatus;
  reason?: string;
}
