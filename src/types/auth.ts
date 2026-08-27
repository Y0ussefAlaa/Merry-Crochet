export type AdminUser = {
  uid: string;
  email: string;
  displayName: string;
};

export type AuthState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
