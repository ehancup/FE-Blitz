"use client";
import useOrderModule from "@/lib/order";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface TemplateProps {
  children: ReactNode;
}

const orderStatus: {
  label: string;
  value:
    | ""
    | "wait"
    | "process"
    | "shipping"
    | "error"
    | "done"
    | "cancel_user"
    | "cancel_seller";
}[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Waiting",
    value: "wait",
  },
  {
    label: "Process",
    value: "process",
  },
  {
    label: "Shipping",
    value: "shipping",
  },
  {
    label: "error",
    value: "error",
  },
  {
    label: "Done",
    value: "done",
  },
  {
    label: "Cancelled by user",
    value: "cancel_user",
  },
  {
    label: "Cancelled by seller",
    value: "cancel_seller",
  },
];

const Template = ({ children }: TemplateProps) => {
  const params = useParams();
  const router = useRouter();
  const { useSellerOrder } = useOrderModule();
  const { data, isLoading, query, setQuery, setFilterQuery } = useSellerOrder(
    params.id as string
  );
  console.log(data);
  const changeStatus = (
    p:
      | ""
      | "wait"
      | "process"
      | "shipping"
      | "error"
      | "done"
      | "cancel_user"
      | "cancel_seller"
  ) => {
    setQuery((prev) => ({ ...prev, status: p }));
    setFilterQuery((prev) => ({ ...prev, status: p }));
  };
  return (
    <div className="flex flex-col px-8">
      <h1 className="text-3xl font-bold">Order List</h1>
      <div className="w-full flex gap-5 flex-row mt-5">
        <div className="w-96 rounded-lg shadow-xl py-5 flex flex-col">
          <div className="flex flex-row gap-1.5 items-center px-5 mt-3 flex-wrap">
            <p className="font-bold text-xs font-poppins">Status</p>
            {orderStatus.map((status, i) => {
              return (
                <button
                  className={clsx("btn btn-neutral btn-sm text-sm", {
                    "btn-outline": query.status !== status.value,
                  })}
                  key={i}
                  onClick={() => changeStatus(status.value)}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
          {isLoading ? (
            <div className="w-full flex items-center justify-center mt-3">
              <span className="loading loading-spinner"></span>
            </div>
          ) : data?.data.length != 0 ? (
            <ul className="menu rounded-box w-full mt-3">
              {data?.data.map((dt, i) => {
                return (
                  <li
                    className={`border-b border-base-200/50 rounded-box `}
                    onClick={() => {
                      router.push(`/seller/${params.id}/order/${dt.id}`);
                    }}
                    key={i}
                  >
                    <a className={`${params.order == dt.id ? "active" : ""}`}>
                      {dt.invoice}
                      <span
                        className={clsx("badge", {
                          "badge-info": dt?.ship_status == "process",
                          "badge-outline": dt?.ship_status == "wait",
                          "badge-warning": dt?.ship_status == "shipping",
                          "badge-success": dt?.ship_status == "done",
                          "badge-error": [
                            "error",
                            "cancel_user",
                            "cancel_seller",
                          ].includes(dt?.ship_status as string),
                        })}
                      >
                        {!["cancel_user", "cancel_seller"].includes(
                          dt?.ship_status as string
                        )
                          ? dt?.ship_status
                          : dt?.ship_status == "cancel_user"
                          ? "canceled by user"
                          : "canceled by seller"}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="w-full flex items-center justify-center mt-3">
              <span className="">no order found</span>
              <button className="btn btn-ghost">dfsfsfd</button>
            </div>
          )}
        </div>
        <div className="flex-1 h-fit rounded-lg shadow-xl">{children}</div>
      </div>
    </div>
  );
};

export default Template;
