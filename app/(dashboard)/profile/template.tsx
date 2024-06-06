"use client";
import React from "react";
import {
  HomeIcon,
  UserIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  TagIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
// import useAdminModule from "../lib";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModule } from "@/lib/auth/auth";

interface TemplateProps {
  children: React.ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  const { useProfile } = useAuthModule();
  const { data: session } = useSession();
  const { data } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const menus: { label: string; route: string; icon: any }[] = [
    // {
    //   label: "Dashboard",
    //   route: "",
    // },
    {
      label: "Profile",
      route: "/setting",
      icon: <UserIcon className="h-4" />,
    },
    // {
    //   label: "Kategori",
    //   route: "/kategori",
    //   icon: <TagIcon className="h-4"/>
    // },
    {
      label: "Store",
      route: "/store",
      icon: <ShoppingBagIcon className="h-4"/>
    },
    // {
    //   label: "Konsumen",
    //   route: "/konsumen",
    //   icon: <TagIcon className="h-4"/>
    // },
    // {
    //   label: "Order",
    //   route: "/order",
    //   icon: <TagIcon className="h-4"/>
    // },
  ];
  return (
    <div className="pt-16 pb-16 px-52 w-full flex flex-row gap-7 ">
      <div className="min-h-96 h-fit w-60 mt-5 bg-base-100 shadow-lg rounded-xl flex flex-col py-3">
        <div className="py-2 px-3 border-b border-neutral">
          <h1 className="font-bold text-xl font-poppin">
            Hai, {data?.data.name}!{" "}
          </h1>
        </div>
        <div className="border border-neutral p-2 rounded-lg mx-3 mt-3 bg-transparent hover:bg-black/10 transition-all duration-300">
          <h1 className="text-sm border-b border-neutral pb-1 font-bold">
            Welcome to Blitz.co!
          </h1>
          <h1 className="text-xs font-bold mt-1">
            Nikmatin Bebas Ongkir tanpa batas!
          </h1>
          <h1 className="text-xs font-thin">
            Dikirim cepat tanpa mengurangi kualitas pelayanan
          </h1>
        </div>
        <div className="mt-2">
          <ul className="menu menu-sm">
            {/* <li>
              <Link href={"/profile"}>
                <UserIcon className="h-4" />
                profile
              </Link>
            </li> */}
            <li>
              <Link href={""}>
                <ShoppingCartIcon className="h-4" />
                Cart <div className="badge badge-sm badge-info">25</div>
              </Link>
            </li>

            {menus.map((e, i) => (
              <li key={i}>
                <Link
                  href={`/profile/${e.route}`}
                  className={
                    pathname.startsWith(`/profile${e.route}`) ? "active" : ""
                  }
                >
                  {e.icon}
                  {e.label}
                  {/* <span className="badge badge-sm badge-error">admin</span> */}
                </Link>
              </li>
            ))}
            {data?.data.role === "admin" && (
              <li>
                <Link href={"/admin"}>
                  <ChartBarIcon className="h-4" />
                  Dashboard
                  <span className="badge badge-sm badge-error">admin</span>
                </Link>
              </li>
            )}
            <li>
              <Link href={"/profile/settings"}>
                <Cog6ToothIcon className="h-4" />
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Template;
