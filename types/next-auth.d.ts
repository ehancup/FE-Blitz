import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: any;
      email: string | undefined | null;
      name: string | undefined | null;
      role: any;
      accessToken: any;
      refreshToken: any;
      token : any


    };


  }
}