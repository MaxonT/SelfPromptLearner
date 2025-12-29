declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
    }

    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      login(user: User, callback: (err?: Error) => void): void;
      logout(callback: (err?: Error) => void): void;
      session?: {
        destroy(callback: (err?: Error) => void): void;
      };
      requestId?: string;
    }
  }
}

export {};

