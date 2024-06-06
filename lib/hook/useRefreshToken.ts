import { axiosClient } from "../axios/axiosClient";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface SessionUser {
  id: string;
  refreshToken: string;
  accessToken: string;
  name: string;
  email: string;
}

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    if (!session) return;

    const { user } = session as Session & { user: SessionUser };

    const res = await axiosClient.post("/admin/refresh-token", {
      refresh_token: user.refreshToken,
      id: user.id,
    });

    

    await update({
      ...session,
      user: {
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      },
    });
  };

  return { refreshToken };
};
