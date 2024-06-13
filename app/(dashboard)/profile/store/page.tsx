"use client";

import InputText from "@/components/inputText";
import { useAuthModule } from "@/lib/auth/auth";
import useStoreModule from "@/lib/store";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const Page = () => {
  const { useProfile } = useAuthModule();
  const { data, isLoading } = useProfile();
  const router = useRouter()
  const { useMyStore } = useStoreModule();
  const { data: stores, isLoading: storeLoading } = useMyStore();
  return isLoading ? (
    <div className="mt-5 flex items-center justify-center">
      {" "}
      <span className="loading loading-spinner"></span>
    </div>
  ) : (
    <div className="mt-5 flex flex-col">
      {data?.data.role != "seller" ? (
        <div role="alert" className="alert ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>You need to be seller first</span>
          <div>
            <button className="btn btn-sm ">Be seller</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col border border-base-300 rounded-md">
          <div className="py-2 px-3 border-b border-base-300 rounded-md">
            <h1 className="font-monserrat font-medium">My Store </h1>
          </div>
          <div className="px-5  flex justify-between flex-row items-end">
            <div className="flex flex-row gap-3 items-end">
              <InputText
                id="search"
                name="search"
                placeholder="search address"
                sm
              />
              <button className="btn bg-blitz hover:bg-blitz/70  btn-sm">
                search
              </button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => router.push('/profile/store/add')}>add store</button>
          </div>
          {storeLoading ? (
            <div className="flex items-center justify-center">
              {" "}
              <span className="loading loading-spinner"></span>
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-3">
              {stores?.data.map((store, i) => {
                return (
                  <div
                    className="border border-base-300 py-3 px-5 group/store hover:ring-1 cursor-pointer hover:ring-blue-600 ring-inset transition duration-150 flex flex-row justify-between items-center rounded-md"
                    key={i}
                    onClick={() => router.push(`/seller/${store.id}`)}
                  >
                    <div className="flex flex-row gap-5 items-center">
                      <div
                        className="h-14 rounded-full aspect-square"
                        style={{
                          backgroundImage: `url(${store.avatar?.replace('localhost:5002', process.env.IP as string)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      ></div>
                      <div className="flex flex-col">
                        <h1 className="font-montserrat font-bold text-xl">
                          {store.name}
                        </h1>
                        <p className=" text-sm">{store.location}</p>
                      </div>
                    </div>
                    <div className="pr-2 group-hover/store:pr-0 transition-all duration-150">
                        <ChevronRightIcon className="h-5 text-neutral-content group-hover/store:text-blue-600 transition duration-150"/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
