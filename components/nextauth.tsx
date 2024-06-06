"use client";
import { SessionProvider } from "next-auth/react";

import React, { ReactNode } from "react";
import { Session } from "next-auth";

interface NextAuthProps {
  children: ReactNode;
  session: Session | null | undefined;
}

const NextAuthProvider: React.FC<NextAuthProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;