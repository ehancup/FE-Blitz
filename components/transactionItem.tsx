import { DetailOrder, DetailOrderResponse, Order } from "@/lib/order/interface";
import { formatDateTime, formatDate } from "@/utils/date.utils";
import {
  ShoppingBagIcon,
  EllipsisHorizontalIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { formatRupiah } from "./productCart";
import { useSearchParams } from "next/navigation";
import useOrderModule from "@/lib/order";
import { useState } from "react";
import { AxiosResponse } from "axios";
import DetailTransactionItem from "./detailTransactionItem";

interface TransactionProps {
  order: Order;
}

const TransactionItem = ({ order }: TransactionProps) => {
  const searchParams = useSearchParams();
  const [detail, setDetail] = useState<DetailOrder>();
  const { useDetailOrder, useCancelUser } = useOrderModule();
  const { mutate: cancel } = useCancelUser(order.id);
  const { mutate, isPending } = useDetailOrder();

  const showDetail = () => {
    mutate(order.id, {
      onSuccess(data: AxiosResponse<DetailOrderResponse>, variables, context) {
        setDetail(data.data.data);

        (document.getElementById(`my_modal_${order.id}`) as any)!.showModal();
      },
    });
  };

  return (
    <div className="w-full rounded-lg shadow-lg p-4 flex flex-col">
      <div className="w-full flex flex-row gap-2">
        <ShoppingBagIcon className="h-4" />
        <p className="font-bold text-xs">Shopping</p>
        <p className="text-xs">{formatDate(order.created_at)}</p>
        <span
          className={clsx("badge badge-sm", {
            "badge-info": order.ship_status == "process",
            "badge-outline": order.ship_status == "wait",
            "badge-warning": order.ship_status == "shipping",
            "badge-success": order.ship_status == "done",
            "badge-error": ["error", "cancel_user", "cancel_seller"].includes(
              order.ship_status
            ),
          })}
        >
          {!["cancel_user", "cancel_seller"].includes(order.ship_status)
            ? order.ship_status
            : order.ship_status == "cancel_user"
            ? "canceled by user"
            : "canceled by seller"}
        </span>
        <p className="text-xs text-gray-400 font-medium">{order.invoice}</p>
      </div>
      <div className="w-full flex flex-col mt-3">
        <h1 className="font-medium text-sm">{order.store_name}</h1>
        <div className="w-full flex flex-row mt-3">
          <div className="flex-1 border-r border-base-200/50 flex flex-row pr-20 gap-5">
            <div
              className="w-14 rounded-md overflow-hidden h-14"
              style={{
                backgroundImage: `url(${order?.orderDetail[0]?.product?.image?.[0]?.image?.replace('http://localhost:5002', process.env.IP as string)})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
            <div className="flex flex-1 flex-col">
              <div className="flex flex-col">
                <h1 className="font-bold ">
                  {order.orderDetail[0].product_name}
                </h1>
                <p className="text-xs text-gray-400">
                  {order.orderDetail[0].quantity} item x Rp
                  {formatRupiah(order.orderDetail[0].product_price)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-5">
                {order.orderDetail.length > 1
                  ? `+${order.orderDetail.length - 1} other products`
                  : ""}
              </p>
            </div>
          </div>
          <div className="w-40 flex flex-col pl-3 justify-center">
            <p className="text-sm text-gray-400">Total Amount</p>
            <p className="text-sm font-bold">
              Rp{formatRupiah(order.total_amount)}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-row justify-end gap-1 mt-3">
          <button
            className="btn btn-sm btn-ghost text-blue-600"
            disabled={isPending}
            onClick={showDetail}
          >
            {isPending ? "Loading..." : "see detail"}
          </button>
          {!["cancel_user", "cancel_seller", "done"].includes(
            order.ship_status
          ) ? (
            <button className="btn btn-sm btn-error" onClick={() => cancel()}>cancel</button>
          ) : (
            <></>
          )}
          <button className="btn btn-sm btn-neutral btn-square btn-outline">
            <EllipsisHorizontalIcon className="h-4" />
          </button>
          <dialog id={`my_modal_${order.id}`} className="modal">
            <div className="modal-box h-[calc(100vh-150px)]">
              <div className=" w-full h-full flex items-center justify-center flex-col">
                <div className="w-full flex flex-row items-center border-b border-base-200/50 pb-3">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-xl font-quicksand ">
                    Detail Transaction
                  </h3>
                </div>
                <div className="flex-1 w-full overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
                  {isPending ? (
                    <div className=" h-full justify-center items-center flex">
                      <span className="loading loading-spinner"></span>
                    </div>
                  ) : (
                    <div className=" flex w-full flex-col items-start mt-3 px-2">
                      <div className="w-full flex flex-row justify-start gap-2 items-center">
                        <h1 className="text-xl font-bold font-quicksand">
                          Status
                        </h1>
                        <span
                          className={clsx("badge", {
                            "badge-info": detail?.ship_status == "process",
                            "badge-outline": detail?.ship_status == "wait",
                            "badge-warning": detail?.ship_status == "shipping",
                            "badge-success": detail?.ship_status == "done",
                            "badge-error": [
                              "error",
                              "cancel_user",
                              "cancel_seller",
                            ].includes(detail?.ship_status as string),
                          })}
                        >
                          {!["cancel_user", "cancel_seller"].includes(
                            detail?.ship_status as string
                          )
                            ? detail?.ship_status
                            : detail?.ship_status == "cancel_user"
                            ? "canceled by user"
                            : "canceled by seller"}
                        </span>
                      </div>
                      <div className="w-full flex flex-row justify-between text-sm mt-4">
                        <p className="text-gray-400">No. invoice</p>
                        <p className="font-medium text-blue-600">
                          {detail?.invoice}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between text-sm mt-1">
                        <p className="text-gray-400">Purchase Date</p>
                        <p className="">
                          {formatDateTime(order.created_at)} WIB
                        </p>
                      </div>
                      <div className="w-full flex flex-col mt-6">
                        <div className="w-full flex flex-row justify-between text-sm font-bold ">
                          <h1 className="">Product Detail</h1>
                          <p className="flex flex-row items-center gap-1">
                            <ShoppingBagIcon className="h-4" />
                            {detail?.store_name}
                            <ChevronRightIcon className="h-3" />
                          </p>
                        </div>
                      </div>
                      <div className="w-full flex flex-col mt-3 gap-2">
                        {detail?.orderDetail.map((dt, i) => {
                          return <DetailTransactionItem item={dt} key={i} />;
                        })}
                      </div>
                      <div className="flex flex-col w-full mt-8 ">
                        <h1 className="font-bold text-sm">Shipment info</h1>
                        <table className="table table-xs mt-3 align-top">
                          <tr>
                            <th className="align-top text-xs text-gray-400">
                              Address
                            </th>
                            <th className="align-top text-xs">:</th>
                            <td>
                              <h1 className="font-bold">
                                {detail?.address.name}
                              </h1>
                              <h1 className="">
                                {detail?.address.phone_number}
                              </h1>
                              <h1 className="">{detail?.address.address}</h1>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="flex flex-col w-full mt-8">
                        <h1 className="font-bold text-sm">Payment</h1>
                        <div className="text-xs flex flex-row justify-between font-bold mt-3 border-b border-base-200/50 pb-2">
                          <p className="text-gray-400">Payment Method</p>
                          <p className="">B-Pay</p>
                        </div>
                        <div className="text-xs flex flex-row justify-between font-bold mt-3 border-b border-base-200/50 pb-2">
                          <p className="text-gray-400">
                            Total Price ({order.total_quantity} item)
                          </p>
                          <p className="">
                            Rp{formatRupiah(order.total_amount)}
                          </p>
                        </div>
                        <div className=" flex flex-row justify-between font-bold mt-3 ">
                          <p className="">Total Expense</p>
                          <p className="">
                            Rp{formatRupiah(order.total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
