"use client";
import { useAuthModule } from "@/lib/auth/auth";
import { UserIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface TemplateProps {
  children: ReactNode;
}

const menus: { label: string; route: string }[] = [
  { label: "Biodata", route: "" },
  { label: "Address", route: "/address" },
  { label: "Wallet", route: "/wallet" },
];

const Template = ({ children }: TemplateProps) => {
  const { useProfile } = useAuthModule();
  const { data, isLoading } = useProfile();
  const pathname = usePathname();
  console.log(pathname);
  return isLoading ? (
    <div className=" flex items-center justify-center mt-5   ">
      <span className="loading loading-spinner"></span>
    </div>
  ) : (
    <div className="flex flex-col mt-5">
      <div className="">
        <div className="flex flex-row items-center">
          <UserIcon className="h-4" />
          <p className="ml-2 font-montserrat font-medium">{data?.data.name}</p>
        </div>
      </div>
      <div className="mt-2 border border-base-300 rounded-lg">
        <div role="tablist" className="tabs tabs-bordered h-fit">
          {menus.map((menu, i) => {
            return (
              <Link
                href={`/profile/setting${menu.route}`}
                role="tab"
                className={clsx("tab ", {
                  "tab-active font-medium [--tab-bg:#3f7099] text-blitz":
                    pathname == `/profile/setting${menu.route}`,
                })}
                key={i}
              >
                {menu.label}
              </Link>
            );
          })}
        </div>
        <div className=" py-5 px-8 ">{children}</div>
      </div>
    </div>
  );
};

export default Template;
