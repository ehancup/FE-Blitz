"use client";

import { Cart } from "@/lib/cart/interface";
import { formatRupiah } from "./productCart";
import {
  HeartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import useCartModule from "@/lib/cart";
import useDebouncedValue from "@/lib/hook/useDebounce";
import useOrderPayload from "@/lib/hook/useOrderPayload";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: Cart;
  //   order: string[];
  //   addPayload: (pyld: string) => void;
}

const CartItem = ({ item }: CartItemProps) => {
  let [qty, setQty] = useState<number>(item.quantity);
  const { useUpdateQty, useDeleteCart } = useCartModule();
  const { mutate: deleteCart, isPending: deletePending } = useDeleteCart(
    item.id
  );
  const { mutate: updateQty, isPending } = useUpdateQty(item.id);
  const debouncedQtyTerm = useDebouncedValue(qty, 500);
  const router = useRouter();
  const { payload: order, addPayload, addForce } = useOrderPayload((p) => p);
  console.log(order);

  useEffect(() => {
    updateQty({ quantity: qty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQtyTerm]);

  const increment = () => {
    if (item.product.type == "ready_stok") {
      if (item.product.stock > qty) {
        setQty((prev) => prev + 1);
      }
    } else {
      setQty((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };
  return (
    <div className="w-full flex flex-row items-start py-3 gap-3 border-b border-base-200/50">
      <input
        type="checkbox"
        name=""
        id="all"
        className="checkbox checkbox-sm"
        checked={order.includes(item.id)}
        onChange={(o) => {
          if (o.target.checked) {
            addPayload(item.id);
          } else {
            const filtered = order.filter((n) => n !== item.id);
            addForce(filtered);
          }
        }}
      />
      <div
        className="w-20 aspect-square rounded-md overflow-hidden cursor-pointer"
        onClick={() => router.push(`/product/detail/${item.product.id}`)}
        style={{
          backgroundImage: `url(${
            (item.product.image as { image: string }[])[0].image?.replace('http://localhost:5002', process.env.IP as string)
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="flex-1 flex flex-col justify-between h-full">
        <div
          className="flex flex-row justify-between items-center gap-5 cursor-pointer"
          onClick={() => router.push(`/product/detail/${item.product.id}`)}
        >
          <div className="flex flex-col flex-1">
            <h1 className="text-sm sm:text-base">{item.product.name}</h1>
            <p className="font-poppins font-bold mt-1 text-xs block sm:hidden">
              Rp{formatRupiah(item.product.price)}
            </p>
            {item.product.type == "ready_stok" ? (
              <p className="text-xs text-gray-500">
                Stock : {item.product.stock}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Pre Order</p>
            )}
          </div>
          <p className="font-poppins font-bold hidden sm:block">
            Rp{formatRupiah(item.product.price)}
          </p>
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <div className="flex flex-row">
            <button className="btn btn-sm btn-square btn-ghost text-gray-500 hover:text-black">
              <HeartIcon className="h-5 text-gray-500" />
            </button>
            {deletePending ? (
              <button className="btn btn-sm btn-square btn-ghost">
                <span className="loading loading-spinner"></span>
              </button>
            ) : (
              <button
                className="btn btn-sm btn-square btn-ghost text-gray-500 hover:text-black"
                onClick={() => deleteCart()}
              >
                <TrashIcon className="h-5 text-gray-500" />
              </button>
            )}
          </div>
          <div className="flex flex-row w-fit p-1 border border-base-300 rounded-lg gap-2">
            <button
              className="btn btn-xs btn-ghost btn-square"
              disabled={qty <= 1}
              onClick={decrement}
            >
              <MinusIcon className="h-4" />
            </button>
            <p className="">{qty}</p>
            <button
              className="btn btn-xs btn-ghost btn-square"
              disabled={
                qty == item.product.stock && item.product.type == "ready_stok"
              }
              onClick={increment}
            >
              <PlusIcon className="h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
