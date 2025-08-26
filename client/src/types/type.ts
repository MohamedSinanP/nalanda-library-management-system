export type User = {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
};

export type Auth = {
  user: User | null;
  accessToken: string | null;
};
