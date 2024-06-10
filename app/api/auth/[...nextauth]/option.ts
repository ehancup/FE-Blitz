import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getProviders } from "next-auth/react";
// import useAuthModule from "@/app/(auth)/lib";
// import { axiosClient } from "@/lib/axiosClient";

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID as string,
        //     clientSecret: process.env.GITHUB_SECRET as string,
        // }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        //   }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: 'text',
                    placeholder: "Type your email",
                },
                password: {
                    label: "Password",
                    type: 'password',
                    placeholder: "Enter your password",
                }
            },
            authorize: async (credentials: any) => {
                // console.log(credentials);
                return {
                    ...credentials
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session,profile }) {
            // const {useLoginGithub} = useAuthModule()
            // const {mutate, data} = useLoginGithub()
            // console.log('token', token);
            // console.log('user', user);
            // console.log('account', account);
            // console.log('profile    ', profile  );
            // console.log('trigger', trigger);
            // console.log('session', session);

            // if (account?.provider == 'google') {
            //     console.log('p');
            //     console.log(token);
            //     console.log(user);

            //     const payload = {
            //         ...user,
            //         id_client: user.id
            //     }
            //     const data = await axiosClient.post("/auth/login-google", payload).then(response => {
            //         console.log('berhasil');
            //         console.log(response.data);
            //         return response.data
            //     }).catch(err => {
            //         console.log('gagal');
            //     })

            //     console.log(data);
            //     const final = data.data
            //     await mutate(payload, {
            //         onSuccess(data, variables, context) {
            //             console.log(data);
            //         },
            //     })
            //     return {
            //         ...token,
            //         ...user,
            //         ...final
            //     }
            // }

            // if (account?.provider == 'github') {
            //     console.log('github prov');
            //     console.log(token);
            //     console.log(user);

            //     const payload = {
            //         ...user,
            //         id_client: user.id
            //     }
            //     const data = await axiosClient.post("/auth/login-github", payload).then(response => {
            //         console.log('berhasil');
            //         console.log(response.data);
            //         return response.data
            //     }).catch(err => {
            //         console.log('gagal');
            //     })

            //     console.log(data);
            //     const final = data.data
            //     // await mutate(payload, {
            //     //     onSuccess(data, variables, context) {
            //     //         console.log(data);
            //     //     },
            //     // })
            //     return {
            //         ...token,
            //         ...user,
            //         ...final
            //     }
            // }
            // console.log("prov", account);
            if (trigger === "update") {
              return { ...token, ...session.user };
            }
      
            return {
              ...token,
              ...user,
              ...account
            };
          },
        async session({ session, user, token }) {
            // console.log('session', session); 
            // console.log('user', user);
            // console.log('token', token);
            // console.log(token);

            session.user = {
                ...session.user,
                id: token?.id,
                name: token.name,
                email: token.email,
                role: token.role,
                accessToken: token.access_token,
                refreshToken: token.refresh_token,


            }

            return session
        }
    },

    pages: {
        signIn: "/login",
        error: "/login",
    }   
}