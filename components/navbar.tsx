"use client";
import usePop from "@/lib/hook/usePop";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NavDraw from "./navDraw";
import { Suspense, useEffect, useState } from "react";
import { useAuthModule } from "@/lib/auth/auth";
import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const Nv = () => {
  const searchParam = useSearchParams();
  const [target, setTarget] = useState<string>(searchParam.get("q") || "");
  const { useProfile } = useAuthModule();
  const router = useRouter();
  const pathName = usePathname();
  const { isOpen, popToggle } = usePop((res) => res);
  const disableRoute = ["/register", "/login", "/seller", "/forgot-password"];
  const spesificRoute =
    /^\/(login|forgot-password|sent|reset-password(?:\/.*)|register|seller(?:\/.*)?)$/;
  const { status } = useSession();
  const { data } = useProfile();
  console.log(data);
  console.log(
    data?.data.avatar?.replace("localhost", process.env.IP as string)
  );
  useEffect(() => {
    console.log(isOpen, status);
  }, [isOpen, status]);
  return !spesificRoute.test(pathName) ? (
    <div className="w-full navbar fixed z-50 px-10 top-0 inset-x-0 bg-base-100 flex flex-row justify-between shadow-md gap-2  sm:gap-10">
      <div className="hidden sm:block">
        <a
          className="btn btn-ghost text-2xl text-blitz"
          onClick={() => router.push("/")}
        >
          Blitz.co
        </a>
      </div>
      <div className="flex-1">
        <label className="input input-bordered input-sm flex items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onKeyUp={(e) => {
              if (e.key == "Enter") {
                router.push(`/product?q=${target}`);
              }
            }}
            onChange={(e) => setTarget(e.target.value)}
            value={target}
          />
        </label>
      </div>
      {status == "loading" ? (
        <div className="">
          <button className="">
            <span className="loading loading-spinner"></span>
          </button>
        </div>
      ) : status == "unauthenticated" ? (
        <div className="flex flex-row gap-1 ms:gap-5">
          <button
            className="btn btn-sm sm:btn-md btn-primary"
            onClick={() => signIn()}
          >
            Login
          </button>
          <button
            className="btn btn-sm sm:btn-md  btn-outline hidden sm:block"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="flex-row gap-3 mr-3 hidden sm:flex">
            <button
              className="btn btn-ghost btn-square btn-sm tooltip tooltip-bottom"
              data-tip="cart"
              onClick={() => router.push("/cart")}
            >
              <div className="indicator">
                <span className="indicator-item badge badge-primary badge-sm"></span>

                <ShoppingCartIcon className="h-6" />
              </div>
            </button>
            <button
              className="btn btn-ghost btn-square btn-sm tooltip tooltip-bottom"
              data-tip="wishlist"
              onClick={() => router.push("/product/wishlist")}
            >
              <div className="indicator">
                <span className="indicator-item badge badge-primary badge-sm text-xs"></span>

                <ShoppingBagIcon className="h-6" />
              </div>
            </button>
          </div>
          <button
            className="btn btn-ghost flex flex-row gap-3"
            onClick={() => popToggle()}
          >
            <p className="text-base-content text-xl">{data?.data.name}</p>
            <div
              className="h-7 w-7 rounded-full overflow-hidden"
              style={{
                backgroundImage: `url(${data?.data.avatar?.replace(
                  "http://localhost:5002",
                  process.env.IP as string
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
          </button>
          <NavDraw
            isOpen={isOpen}
            image={data?.data.avatar}
            name={data?.data.name}
            role={data?.data.role}
            isAdmin={true}
          />
        </div>
      )}
    </div>
  ) : (
    <div className=""></div>
  );
};

export default function Navbar() {
  return (
    <Suspense>
      <Nv />
    </Suspense>
  );
}
