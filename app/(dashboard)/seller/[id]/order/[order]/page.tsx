"use client";

import DetailTransactionItem from "@/components/detailTransactionItem";
import { formatRupiah } from "@/components/productCart";
import SelectInput from "@/components/selectInput";
import useOrderModule from "@/lib/order";
import { formatDateTime } from "@/utils/date.utils";
import clsx from "clsx";
import { useParams } from "next/navigation";

const option = [
  {
    label: "Waiting",
    value: "wait",
  },
  {
    label: "Processing",
    value: "process",
  },
  {
    label: "Shipping",
    value: "shipping",
  },
  {
    label: "Done",
    value: "done",
  },
  {
    label: "Error",
    value: "error",
  },
];

const Page = () => {
  const params = useParams();
  const { useDtlOrder, useSetStatus, useCancelSeller } = useOrderModule();
  const { mutate: cancel } = useCancelSeller(params.order as string);
  const { mutate, isPending } = useSetStatus(params.order as string);
  const { data, isLoading } = useDtlOrder(params.order as string);
  console.log(data);
  return !isLoading ? (
    <div className="flex flex-col p-5 gap-2">
      <div className="w-full flex flex-row justify-between text-sm">
        <h1 className=" text-gray-400">No. Invoice</h1>
        <p className="font-bold text-blue-600">{data?.data.invoice}</p>
      </div>
      <div className="w-full flex flex-row justify-between text-sm">
        <h1 className=" text-gray-400">Status</h1>
        <span
          className={clsx("badge", {
            "badge-info": data?.data?.ship_status == "process",
            "badge-outline": data?.data?.ship_status == "wait",
            "badge-warning": data?.data?.ship_status == "shipping",
            "badge-success": data?.data?.ship_status == "done",
            "badge-error": ["error", "cancel_user", "cancel_seller"].includes(
              data?.data?.ship_status as string
            ),
          })}
        >
          {!["cancel_user", "cancel_seller"].includes(
            data?.data?.ship_status as string
          )
            ? data?.data?.ship_status
            : data?.data?.ship_status == "cancel_user"
            ? "canceled by user"
            : "canceled by seller"}
        </span>
      </div>
      <div className="w-full flex flex-row justify-between text-sm">
        <h1 className=" text-gray-400">Purchase Date</h1>
        <p className="">
          {formatDateTime(data?.data.created_at as string)} WIB
        </p>
      </div>
      <div className="w-full flex flex-row justify-between text-sm">
        <h1 className=" text-gray-400">Total quantity</h1>
        <p className=" ">{data?.data.total_quantity} item</p>
      </div>
      <div className="w-full flex flex-row justify-between text-sm">
        <h1 className=" text-gray-400">Total amount</h1>
        <p className=" font-bold">
          Rp{formatRupiah(data?.data.total_amount as number)}
        </p>
      </div>
      <div className="w-full flex flex-row justify-between text-sm">
        <h1 className=" text-gray-400">Send to</h1>
        <p className=" flex flex-col items-end text-end w-96">
          <span className="font-bold ">{data?.data.address.name}</span>
          <span className="">{data?.data.address.phone_number}</span>
          <span className="">{data?.data.address.address}</span>
        </p>
      </div>
      <div className="w-full flex flex-col">
        <h1 className="font-bold">Detail</h1>
        <div className="w-full flex flex-col mt-3 gap-3">
          {data?.data?.orderDetail.map((dt, i) => {
            return <DetailTransactionItem item={dt} key={i} />;
          })}
        </div>
      </div>
      {data?.data.ship_status == "cancel_user" ? (
        <div className="w-full flex justify-end mt-2">
          <span className="badge badge-error badge-lg">Canceled by user</span>
        </div>
      ) : data?.data.ship_status == "cancel_seller" ? (
        <div className="w-full flex justify-end mt-2">
          <span className="badge badge-error badge-lg">Canceled by seller</span>
        </div>
      ) : data?.data.ship_status == "done" ? (
        <div className="w-full flex justify-end mt-2">
          <span className="badge badge-success badge-lg">Order done</span>
        </div>
      ) : (
        <div className="w-full flex items-end flex-row justify-between">
          <div className="w-fit">
            <SelectInput
              id="status"
              label="set status"
              name="status"
              option={option}
              sm
              value={data?.data.ship_status}
              onChange={(e) => {
                mutate({
                  status: e.target.value as
                    | "wait"
                    | "process"
                    | "shipping"
                    | "done"
                    | "error"
                    | "cancel_user"
                    | "cancel_seller",
                });
              }}
            />
          </div>
          <button className="btn btn-error btn-sm" onClick={() => cancel()}>
            Cancel Order
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="w-full py-10 flex items-center justify-center">
      <span className="loading loading-spinner"></span>
    </div>
  );
};

export default Page;
