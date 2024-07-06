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

    console.log(user);
    console.log(session.user.refreshToken);

    const res = await axiosClient.get("/auth/refresh-token", {
      headers: {
        Authorization: `Bearer ${session.user.refreshToken}`,
      },
    });

    console.log(res);

    await update({
      ...session,
      user: {
        ...user,
        accessToken: res.data.data.access_token,
        refreshToken: res.data.data.refresh_token,
      },
    });
  };

  return { refreshToken };
};
