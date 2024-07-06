import { axiosClient } from "../axios/axiosClient";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
// import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const { refreshToken } = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosClient.interceptors.request.use(
      (config: any) => {
        config.headers[
          "Authorization"
        ] = `Bearer ${session?.user?.accessToken}`;

        return config;
      },
      (error: any) => Promise.reject(error),
    );

    const responseIntercept = axiosClient.interceptors.response.use(
      async (response: any) => response,
      async (error: any) => {
        // if (error.message === 'Network Error' && !error.response) {
        //   alert('gak ada jaringan');
        // }
        const prevRequest = error?.config;

        if (401 === error?.response?.status && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            console.log('try');
            await refreshToken();
            console.log('success');
            prevRequest.headers[
              "Authorization"
            ] = `Bearer ${session?.user?.accessToken}`;
            return axiosClient(prevRequest);
          } catch (err: any) {
            console.log(err);
            console.log('logout');
            signOut();
            // window.location.replace("/login");
            if (err.response?.status === 401) {
              // Handle unauthorized error
              window.location.replace("/login");
            } else {
              // signOut();
            }
          }
        } else {
          return Promise.reject(error);
        }
      },
    );

    return () => {
      axiosClient.interceptors.request.eject(requestIntercept);
      axiosClient.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosClient;
};

export default useAxiosAuth;
