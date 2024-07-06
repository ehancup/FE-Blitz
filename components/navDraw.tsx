import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  ChartBarIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import usePop from "@/lib/hook/usePop";

interface NavDrawProps {
  name: string | null | undefined;
  role: string | null | undefined;
  image: string | null | undefined;
  isOpen: boolean;
  isAdmin: boolean;
}

const menus: { label: string; route: string; icon: any }[] = [
  // {
  //   label: "Dashboard",
  //   route: "",
  // },
  {
    label: "Profile",
    route: "/profile/setting",
    icon: <UserIcon className="h-4" />,
  },
  // {
  //   label: "Kategori",
  //   route: "/kategori",
  //   icon: <TagIcon className="h-4"/>
  // },
  {
    label: "Store",
    route: "/profile/store",
    icon: <ShoppingBagIcon className="h-4" />,
  },
  {
    label: "Transaction",
    route: "/profile/transaction",
    icon: <CreditCardIcon className="h-4" />,
  },
  // {
  //   label: "Order",
  //   route: "/order",
  //   icon: <TagIcon className="h-4"/>
  // },
];

const NavDraw = ({ name, role, isOpen = false, image }: NavDrawProps) => {
  const { popCls } = usePop((state) => state);
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role == "admin";
  return (
    <div className="">
      <div
        className={`w-56 hidden sm:flex h-fit fixed top-20 rounded-3xl bg-base-200  flex-col  items-center justify-center p-1 pt-8 transition-all duration-300 ${
          isOpen ? "right-3" : "-right-64"
        }`}
      >
        <div className="h-28 w-28 rounded-full border-4 p-1 border-neutral-content overflow-hidden">
          <div
            className="h-full w-full rounded-full"
            style={{
              backgroundImage: `url(${image?.replace('http://localhost:5002', process.env.IP as string)})`,
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
          <ul
            className="menu menu-sm "
            onClick={() => {
              console.log("nav closed");
              popCls();
            }}
          >
            <li>
              <Link href={"/profile/setting"}>
                <UserIcon className="h-4" />
                Profile
              </Link>
            </li>
            {isAdmin ? (
              <li>
                <Link href={"/admin"}>
                  <ChartBarIcon className="h-4" />
                  Dashboard
                </Link>
              </li>
            ) : null}
            <li>
              <button className="text-error" onClick={() => signOut()}>
                <ArrowLeftStartOnRectangleIcon className="h-4" />
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`w-screen flex sm:hidden h-screen fixed z-50 right-0 left-0 rounded-3xl bg-white  flex-col p-1 transition-all duration-300 ${
          isOpen ? "top-0" : "top-[200vh]"
        }`}
      >
        <div className="flex flex-row w-full p-4 gap-3 items-center border-b border-base-200/50 ">
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={() => popCls()}
          >
            <XMarkIcon className="h-4" />
          </button>
          <h1 className="text-lg font-medium">Menu</h1>
        </div>
        <div className="flex flex-row p-4 gap-3 items-center ">
          <div
            className="h-14 w-14 rounded-full"
            style={{
              backgroundImage: `url(${image?.replace('http://localhost:5002', process.env.IP as string)})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
          <div className="flex-1 flex flex-col">
            <h1 className=" font-medium text-lg">{name}</h1>
          </div>
          <button className="btn btn-sm btn-circle btn-ghost">
            <Cog6ToothIcon className="h-5" />
          </button>
        </div>
        <div className="flex flex-col">
          <ul
            className="menu menu-md"
            onClick={() => {
              console.log("nav closed");
              popCls();
            }}
          >
            {menus.map((e, i) => (
              <li key={i} onClick={() => router.push(e.route)}>
                <a
                  className={
                    pathname.startsWith(`/profile${e.route}`) ? "active" : ""
                  }
                >
                  {e.icon}
                  {e.label}
                  {/* <span className="badge badge-sm badge-error">admin</span> */}
                </a>
              </li>
            ))}
            <li className="text-error" onClick={() => signOut()}>
              <a>
              <ArrowLeftStartOnRectangleIcon className="h-4" />
              Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavDraw;
