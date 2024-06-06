"use client";
import { ReactElement, ReactNode } from "react";
import { HomeIcon, InboxStackIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useParams, usePathname, useRouter } from "next/navigation";
import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";
import useStoreModule from "@/lib/store";
import clsx from "clsx";
import Link from "next/link";
import { useAuthModule } from "@/lib/auth/auth";
interface TemplateProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

const menus: { label: string; route: string; icon: ReactElement }[] = [
  {
    label: "Home",
    route: "",
    icon: <HomeIcon className="h-5 font-bold" />,
  },
  {
    label: "Product",
    route: "/product",
    icon: <ShoppingBagIcon className="h-5 font-bold" />,
  },
  {
    label: "Etalase",
    route: "/etalase",
    icon: <InboxStackIcon className="h-5 font-bold" />,
  },
];

const Template = ({ children }: TemplateProps) => {
  const params = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const { useDetailStore, useMyStore } = useStoreModule();
  const { data: myStore, isLoading: myLoad } = useMyStore();
  const { useProfile } = useAuthModule();
  const { data: profile, isLoading: profileLoad } = useProfile();
  const {
    data: dataDetail,
    isLoading: detailLoad,
    error,
    isError,
  } = useDetailStore((params as { id: string }).id);
  console.log(dataDetail);

  console.log(params);
  return (
    <div className="flex flex-row">
      <div className="w-60 bg-base-100 shadow-xl min-h-screen p-4 flex flex-col max-h-screen sticky top-0">
        <button
          className="btn btn-ghost text-3xl text-blitz w-fit"
          onClick={() => router.push("/")}
        >
          Blitz.co
        </button>
        <ul className="menu mt-16 gap-1">
          {menus.map((menu, i) => {
            return (
              <li
                className=""
                key={i}
                onClick={() => router.push(`/seller/${params.id}${menu.route}`)}
              >
                <a
                  className={clsx("flex flex-row items-center gap-2", {
                    active: pathName == `/seller/${params.id}${menu.route}`,
                  })}
                >
                  {menu.icon}
                  {menu.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="flex-1 flex flex-col justify-end">
          {detailLoad ? (
            <button className="btn btn-ghost w-full">
              <span className="loading loading-spinner"></span>
            </button>
          ) : (
            <div className="dropdown dropdown-right dropdown-end">
              <div tabIndex={0} className="btn btn-outline btn-lg ">
                <div className="flex flex-row gap-3 w-full">
                  <div
                    className="h-10 aspect-square rounded-full"
                    style={{
                      backgroundImage: `url(${dataDetail?.data.avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  ></div>
                  <div className="flex flex-col items-start">
                    <h1 className="text-sm">{dataDetail?.data.name}</h1>
                    <h1 className="text-[8px] line-clamp-1 text-ellipsis">
                      {dataDetail?.data.location}
                    </h1>
                  </div>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ml-5 "
              >
                {myLoad ? (
                  <li>
                    <a>
                      <span className="loading loading-spinner"></span>
                    </a>
                  </li>
                ) : (
                  myStore?.data.map((data, i) => {
                    return (
                      <li className="" key={i}>
                        <Link
                          href={`/seller/${data.id}`}
                          className={params.id == data.id ? "active" : ""}
                        >
                          <div
                            className="h-10 aspect-square rounded-full"
                            style={{
                              backgroundImage: `url(${data.avatar})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center center",
                            }}
                          ></div>
                          {data.name}
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col p-8 ">
          <div className="w-full flex flex-row justify-between">
            <h1 className="text-xl font-poppins">
              Welcome back, {profile?.data.name}
            </h1>
            <div
              className="btn btn-ghost btn-square"
              onClick={() => router.push("/profile/setting")}
            >
              <div
                className="h-10 aspect-square rounded-full"
                style={{
                  backgroundImage: `url(${profile?.data.avatar})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }}
              ></div>
            </div>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Template;
