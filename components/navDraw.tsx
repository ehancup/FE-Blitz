import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserIcon, ArrowLeftStartOnRectangleIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import usePop from "@/lib/hook/usePop";

interface NavDrawProps {
  name: string | null | undefined;
  role: string | null | undefined;
  image:string | null |undefined;
  isOpen: boolean;
  isAdmin: boolean;
}

const NavDraw = ({ name, role, isOpen = false, image}: NavDrawProps) => {
  const {popCls} = usePop((state) => state)
  const router = useRouter();
  const isAdmin = role == 'admin'
  return (
    <div
      className={`w-56 h-fit fixed top-20 rounded-3xl bg-base-200 flex flex-col  items-center justify-center p-1 pt-8 transition-all duration-300 ${
        isOpen ? "right-3" : "-right-64"
      }`}
    >
      <div className="h-28 w-28 rounded-full border-4 p-1 border-neutral-content overflow-hidden">
        <div
          className="h-full w-full rounded-full"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>
      <div className="text-center mt-3">
        <h1 className="text-2xl line-clamp-1 ">{name}</h1>
        <h1 className="text-xl text-base-content/35 ">{role}</h1>
      </div>
      <div className="w-full">
        <ul className="menu menu-sm " onClick={() => {
            console.log('nav closed');
            popCls();
          }}>
          <li><Link href={"/profile/setting"}  ><UserIcon className="h-4"/>Profile</Link></li>
          {isAdmin ? <li><Link href={"/admin"}><ChartBarIcon className="h-4"/>Dashboard</Link></li> : null}
          <li><button className="text-error" onClick={() => signOut()}><ArrowLeftStartOnRectangleIcon className="h-4"/>Log out</button></li>
        </ul>
        
      </div>
    </div>
  );
};

export default NavDraw;
