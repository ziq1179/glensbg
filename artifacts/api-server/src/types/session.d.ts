import "express-session";

declare module "express-session" {
  interface SessionData {
    staffUser?: {
      id: number;
      username: string;
      displayName: string;
    };
  }
}
