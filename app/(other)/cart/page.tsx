"use client";

import { formatRupiah } from "@/components/productCart";
import useCartModule from "@/lib/cart";
import { Cart, GroupedByStoreItem } from "@/lib/cart/interface";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import CartItem from "@/components/cartItem";
import useOrderPayload from "@/lib/hook/useOrderPayload";
import SelectInput from "@/components/selectInput";
import useOption from "@/lib/hook/useOption";
import toast from "react-hot-toast";
// import { Product } from "@/lib/product/interface";

// interface Store {
//   id: string;
//   name: string;
// }

// export interface GroupedByStoreItem {
//   store: Store;
//   items: Cart[];
// }

export function groupCartItemsByStore(p: Cart[]): GroupedByStoreItem[] {
  const grouped = p.reduce(
    (acc: { [key: string]: GroupedByStoreItem }, item: Cart) => {
      const storeId = item.product.store.id;
      if (!acc[storeId]) {
        acc[storeId] = {
          store: item.product.store,
          items: [],
        };
      }
      acc[storeId].items.push(item);
      return acc;
    },
    {}
  );

  return Object.values(grouped);
}

const Page = () => {
  const { useMyCart, useRealMyCart, useCartAmount } = useCartModule();
  //   const [orderPayload, setOrderPayload] = useState<{product_id: string, quantity: number}[]>([])
  const {
    payload: order,
    addPayload,
    addForce,
    addMany,
  } = useOrderPayload((p) => p);

  const allElementsExist = (a: string[], b: string[]): boolean => {
    return a.every((element) => b.includes(element));
  };

  const { data: amount, isLoading: amountLoad } = useCartAmount(order);
  const { optionAddress } = useOption();

  // const [loading, setLoading] = useState<boolean>(true);
  // const [grouped, setGrouped] = useState<GroupedByStoreItem[]>([]);
  const [address, setAddress] = useState<string>("");
  const { data, isLoading } = useMyCart();
  console.log(address);
  const { data: rill, isLoading: rilload } = useRealMyCart();
  const checked = useMemo(() => {
    if (!rill) {
      return { isAllCheced: false };
    }
    const isAllChecked = rill.data.every((n) => order.includes(n.id));

    return { isAllCheced: isAllChecked };
  }, [order, rill]);
  //   const total = data?.data.reduce(
  //     (acc, item) => acc + item.quantity * item.product.price,
  //     0
  //   );

  //   const groupedByStore: GroupedByStoreItem[] = groupCartItemsByStore(
  //     data?.data as any
  //   );

  //   const groupedByStore = data?.data.reduce((acc, item) => {
  //     const existIndex = acc.indexOf({})
  //   },[])

  //   useEffect(() => {
  //     if (!isLoading) {
  //       const groupedByStore: GroupedByStoreItem[] = groupCartItemsByStore(
  //         data?.data as any
  //       );
  //       setGrouped(groupedByStore);
  //     }
  //   }, [data, isLoading]);
  //   console.log(groupedByStore);
  //   const checked = useMemo(() => {
  //     if (!allPro) {
  //       return { isAllCheced: false };
  //     }
  //     const isAllChecked = allPro.data.every((n) => deletePayload.includes(n.id));

  //     return { isAllCheced: isAllChecked };
  //   }, [deletePayload, allPro]);
  console.log(data);
  return isLoading ? (
    <div className="w-full min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner"></span>
    </div>
  ) : (
    <div className="w-full flex flex-col mt-32 px-52">
      <h1 className="font-poppins text-2xl font-bold mb-3">Cart</h1>
      <div className="flex flex-row w-full gap-5 ">
        <div className="flex-1 flex flex-col gap-5">
          <div className="w-full py-3 px-4 flex flex-row rounded-lg border border-base-200">
            <label className="flex flex-row items-center gap-5" htmlFor="all">
              <input
                type="checkbox"
                name=""
                id="all"
                className="checkbox checkbox-sm"
                checked={checked.isAllCheced}
                onChange={() => {
                  if (checked.isAllCheced) {
                    addForce([]);
                  } else {
                    if (!rill) {
                      addForce([]);
                    } else {
                      const selected: string[] = Array.from(
                        new Set([
                          ...order,
                          ...(rill?.data.map((n) => n.id) as string[]),
                        ])
                      );

                      addForce(selected);
                    }
                  }
                }}
              />
              <p className="">Select All</p>
            </label>
          </div>
          {data?.map((dt, i) => {
            const cartInclude = dt.items.map((item) => item.id);
            const isChecked = order.every((i) => order.includes(i));
            const result = allElementsExist(cartInclude, order);
            console.log(cartInclude);
            return (
              <div
                className="w-full px-4 pt-3 flex flex-col rounded-lg border border-base-200"
                key={i}
              >
                <div className="w-full flex flex-row ">
                  <label
                    className="flex flex-row items-center gap-3"
                    htmlFor={`store[${i}]`}
                  >
                    <input
                      type="checkbox"
                      name=""
                      id={`store[${i}]`}
                      className="checkbox checkbox-sm"
                      checked={result}
                      onChange={(o) => {
                        if (o.target.checked) {
                          const selected: string[] = Array.from(
                            new Set([...order, ...cartInclude])
                          );
                          addForce(selected);
                        } else {
                          const filtered = order.filter(
                            (k) => !cartInclude.includes(k)
                          );
                          addForce(filtered);
                        }
                      }}
                    />
                    <p className="text-sm font-poppins font-bold">
                      {dt.store.name}
                    </p>
                  </label>
                </div>
                {dt.items.map((item, i) => {
                  // const [qty, setQty] = useState()
                  return <CartItem item={item} key={i} />;
                })}
              </div>
            );
          })}
        </div>
        <div className="w-80 border rounded-lg border-base-300 p-5 flex flex-col h-fit sticky top-20">
          <h1 className="text- font-bold font-quicksand">Shopping summary</h1>
          {order.length < 1 ? (
            <div className="w-full flex flex-row items-center justify-between text-gray-400 mt-3 ">
              <h3 className="">Total</h3>
              <p className="">-</p>
            </div>
          ) : !amountLoad ? (
            <div className="w-full flex flex-row items-center justify-between mt-3">
              <h3 className="">Total</h3>
              <p className="font-bold font-poppins">
                Rp{formatRupiah(amount?.data as number)},-
              </p>
            </div>
          ) : (
            <div className="w-full mt-3 flex items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          )}
          <div className="flex flex-col mt-3">
            <div className="w-full">
              <SelectInput
                id="selectAddress"
                name="selectAddress"
                label="Send to"
                value={address}
                sm
                option={optionAddress}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="w-full border-b border-base-200/50 my-2"></div>
          <button
            className="w-full btn btn-neutral"
            onClick={() => {
              if (address == "" || order.length < 1) {
                toast.error(
                  "Please order something and select the destination"
                );
              } else {
                console.log({
                  data: order,
                  address: address,
                });
              }
            }}
          >
            {amountLoad ? (
              <span className="loading loading-spinner"></span>
            ) : (
              `Order ${order.length < 1 ? "" : `(${order.length})`}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
