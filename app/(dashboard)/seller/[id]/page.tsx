"use client";

import { useAuthModule } from "@/lib/auth/auth";
import usePop from "@/lib/hook/usePop";
import { useRouter } from "next/navigation";

const Page = () => {
    const {popToggle} = usePop()
  const { useProfile } = useAuthModule();
  const router = useRouter()
  const { data: profile, isLoading: profileLoad } = useProfile();
  return (
    <div className="flex flex-col  ">
      home
    </div>
  );
};

export default Page;
