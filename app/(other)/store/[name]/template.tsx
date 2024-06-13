"use client";
"1320";
import useEtalaseModule from "@/lib/etalase";
import useStoreModule from "@/lib/store";
import { formatDate } from "@/utils/date.utils";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { InboxStackIcon } from "@heroicons/react/24/outline";

interface TemplateProps {
  children: ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  const params = useParams();
  const router = useRouter();
  const { useDetailStore } = useStoreModule();
  const { useEtalaseByStore } = useEtalaseModule();
  const { data: etalase, isLoading: etalaseLoad } = useEtalaseByStore(
    params.name as string
  );
  const { data: store, isLoading: storeLoad } = useDetailStore(
    params.name as string
  );
  console.log(etalase);
  return (
    <div className="flex flex-col pt-20 px-3 sm:px-0 max-w-[1200px] w-full">
      {storeLoad ? (
        <div className="flex flex-row p-5 border border-base-200 rounded-md items-center justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : (
        <div className="flex flex-row p-5 border border-base-200 rounded-md justify-between items-center">
          <div className="flex flex-row gap-5">
            <div
              className="h-20 w-20 rounded-full overflow-hidden"
              style={{
                backgroundImage: `url(${store?.data.avatar?.replace('localhost:5002', process.env.IP as string)})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
            <div className="flex flex-col justify-between">
              <h1 className="text-2xl font-poppins font-bold">
                {store?.data.name}
              </h1>
              <div className="flex flex-row">
                <button className="btn btn-sm btn-wide btn-neutral">
                  Follow
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className=" font-bold font-quicksand">Joined since</h1>
            <p className="text-sm">
              {formatDate(store?.data.created_at as string)}
            </p>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-row gap-5 ">
        <div className="w-60 flex flex-col p-3 rounded-lg shadow-lg h-fit">
          <h1 className="font-medium text-sm">Store Etalase</h1>
          <ul className="menu">
            <li
              onClick={() => {
                router.push(`/store/${params.name}`);
              }}
            >
              <a
                className={`${
                  params.etalase == "" || params.etalase == undefined
                    ? "active font-bold"
                    : ""
                }`}
              >
                <InboxStackIcon className="h-5 text-blue-600" />
                All Item
              </a>
            </li>
            {etalase?.data.map((item, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                    router.push(`/store/${params.name}/${item.id}`);
                  }}
                >
                  <a
                    className={`${
                      params.etalase == item.id ? "active font-bold" : ""
                    }`}
                  >
                    <div
                      className="h-4 w-4"
                      style={{
                        backgroundImage: `url(${item.avatar?.replace('localhost:5002', process.env.IP as string)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                      }}
                    ></div>
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Template;
