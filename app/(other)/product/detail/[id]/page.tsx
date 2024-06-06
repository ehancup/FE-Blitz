"use client";

import useProductModule from "@/lib/product/product";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import ProductCard, { formatRupiah } from "@/components/productCart";
import useWishlistModule from "@/lib/wishlist";
import clsx from "clsx";
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/pagination";

import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwipeType } from "swiper/types";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useCartModule from "@/lib/cart";
// import { useRouter } from "next/router";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [more, setMore] = useState<boolean>(false);
  const { useDetailProduct, useRandomProduct } = useProductModule();
  const { data: random, isLoading: randomLoad } = useRandomProduct();
  const { useCreateWishlist } = useWishlistModule();
  const { mutate: addWishlist, isPending } = useCreateWishlist();
  const [show, setShow] = useState<number>(0);
  const [swiper, setSwiper] = useState<SwipeType | null>(null);
  const { data, isLoading } = useDetailProduct(params.id as string);
  console.log(data);
  const [quantity, setQuantity] = useState<number>(1);
  const {useCreateCart} = useCartModule();
  const {mutate: addCart, isPending: cartPending} = useCreateCart(params.id as string)

  const increment = () => {
    if (data?.data.type == "ready_stok") {
      if (quantity < (data?.data.stock || 100)) {
        setQuantity((prev) => prev + 1);
      }
    } else {
      setQuantity((prev) => prev + 1);
    }
  };
  const decrement = () => {
    if (quantity != 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = () => {
    if (!!session) {
      addCart({quantity})
    } else {
      signIn()
    }
  }

  // const pagin = ()

  // const swiper1 = useSwiper()

  return isLoading ? (
    <div className="flex items-center justify-center min-h-screen w-full">
      <span className="loading loading-spinner"></span>
    </div>
  ) : (
    <div className="w-full flex flex-col px-52 mt-32">
      <div className="w-full  flex flex-row gap-10">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-row  gap-10">
            <div className="w-72  flex flex-col sticky h-fit top-32">
              <div className=" w-full aspect-square relative group/swiper flex flex-row items-center">
                <button className="swipe-prev1 btn btn-xs btn-square btn-neutral absolute left-5 group-hover/swiper:left-0 z-10 opacity-0 group-hover/swiper:opacity-100 transition-all duration-150">
                  <ChevronLeftIcon className="h-4" />
                </button>
                <button className="swipe-next1 btn btn-xs btn-square btn-neutral absolute right-5 group-hover/swiper:right-0 z-10 opacity-0 group-hover/swiper:opacity-100 transition-all duration-150">
                  <ChevronRightIcon className="h-4" />
                </button>
                <Swiper
                  slidesPerView={1}
                  // loop
                  modules={[Navigation, Pagination]}
                  spaceBetween={3}
                  className="mySwiper w-full aspect-square rounded-xl overflow-hidden"
                  navigation={{
                    nextEl: ".swipe-next1",
                    prevEl: ".swipe-prev1",
                  }}
                  // pagination={{
                  //   el: '.testd',
                  //   clickable: true,

                  // }}
                  onSwiper={(siper) => setSwiper(siper)}
                  onSlideChange={(swiper) => {
                    setShow(swiper.activeIndex);
                    console.log(swiper.activeIndex);
                  }}
                >
                  {data?.data.image.map((e, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <div
                          className="w-full aspect-square"
                          style={{
                            backgroundImage: `url(${e.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                          }}
                        ></div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              {(data?.data.image.length as number) > 5 ? (
                <div className="w-full mt-3 relative group/swiper1 flex flex-row items-center">
                  <button className="swipe-prev btn btn-xs btn-square btn-neutral absolute left-5 group-hover/swiper1:left-0 z-10 opacity-0 group-hover/swiper1:opacity-100 transition-all duration-150">
                    <ChevronLeftIcon className="h-4" />
                  </button>
                  <button className="swipe-next btn btn-xs btn-square btn-neutral absolute right-5 group-hover/swiper1:right-0 z-10 opacity-0 group-hover/swiper1:opacity-100 transition-all duration-150">
                    <ChevronRightIcon className="h-4" />
                  </button>

                  <Swiper
                    slidesPerView={5}
                    slidesPerGroup={5}
                    spaceBetween={12}
                    modules={[Navigation]}
                    navigation={{
                      nextEl: ".swipe-next",
                      prevEl: ".swipe-prev",
                    }}
                    // loop={true}
                    // pagination={{
                    //   clickable: true,
                    // }}
                    className="z-0 grid grid-cols-5"
                    // grid={{
                    //   fill:"column"
                    // }}
                    // id=""
                    onSwiper={(swiper) => console.log(swiper)}

                    // onClick={(e) => console.log(e)}
                  >
                    {data?.data.image.map((e, i) => {
                      return (
                        <div
                          className="w-full aspect-square"
                          key={i}
                          onClick={(s) => {
                            console.log(s);
                            setShow(i);
                          }}
                        >
                          <SwiperSlide>
                            <div
                              className={clsx(
                                "w-full aspect-square rounded-lg overflow-hidden",
                                {
                                  "border-2 border-blue-600": show == i,
                                }
                              )}
                              style={{
                                backgroundImage: `url(${e.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center center",
                              }}
                              // key={i}
                              onClick={() => {
                                setShow(i);
                                swiper?.slideTo(i);
                              }}
                            ></div>
                          </SwiperSlide>
                        </div>
                      );
                    })}
                  </Swiper>
                </div>
              ) : (
                <div className="w-full mt-3 grid grid-cols-5 gap-3">
                  {data?.data.image.map((e, i) => {
                    return (
                      <div
                        key={i}
                        className={clsx(
                          "w-full aspect-square rounded-lg overflow-hidden",
                          {
                            "border-2 border-blue-600": show == i,
                          }
                        )}
                        style={{
                          backgroundImage: `url(${e.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                        // key={i}
                        onClick={() => {
                          setShow(i);
                          swiper?.slideTo(i);
                        }}
                      ></div>
                    );
                  })}
                </div>
              )}
              {/* <div className="testd"></div> */}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-poppins">
                {data?.data.name}
              </h1>
              <p className="text-sm text-gray-500">
                <span className="text-black ">Sold</span>{" "}
                {data?.data._count.orderDetail}
              </p>
              <div className="flex flex-row flex-wrap mt-2 gap-3">
                {data?.data.categoryToProduct.map((cat, i) => {
                  return (
                    <span className="badge badge-neutral badge-outline" key={i}>
                      {cat.category.name}
                    </span>
                  );
                })}
              </div>
              <h1 className="text-3xl mt-5 font-bold">
                Rp{formatRupiah(data?.data.price as number)}
              </h1>
              <div className="w-full border-b border-base-300 mt-3">
                <p className="py-2 px-4 border-b-2 border-blue-600 text-blue-600 font-bold w-fit">
                  Detail
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <p className="text-sm">
                  <span className="text-gray-500">Condition : </span>New
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Min. purchase : </span>1 item
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Etalase : </span>
                  <button className="btn btn-ghost btn-xs text-blue-600">
                    {data?.data.etalase.name}
                  </button>
                </p>
                <p
                  style={{ whiteSpace: "pre-line" }}
                  className={more ? "" : "line-clamp-6 text-ellipsis"}
                >
                  {data?.data.description}
                </p>
                <p
                  className="cursor-pointer text-blue-600 font-bold text-xs w-fit"
                  onClick={() => setMore((prev) => !prev)}
                >
                  {more ? "Show less" : "Show more"}
                </p>
              </div>
              <div className="border-t border-b border-base-200 py-3 flex flex-row items-center mt-3 justify-between">
                <div className="flex flex-row gap-5">
                  <div
                    className="h-14 w-14 rounded-full"
                    style={{
                      backgroundImage: `url(${data?.data.store.avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  ></div>
                  <div className="">
                    <h1 className="text-xl font-bold">
                      {data?.data.store.name}
                    </h1>
                    <p className="text-gray-500 font-medium text-xs">
                      {data?.data.store.location}
                    </p>
                  </div>
                </div>
                <div className="">
                  <button
                    className="btn btn-neutral btn-outline btn-sm"
                    onClick={() =>
                      toast.loading("follow feature will coming soon")
                    }
                  >
                    Follow
                  </button>
                </div>
              </div>
              <div className="w-full flex flex-row justify-between items-center mt-4 px-2">
                <p className="text-xs text-gray-400">
                  have problem with this product?
                </p>
                <p className="text-xs text-error flex flex-row items-center gap-1 cursor-pointer btn btn-ghost btn-xs btn-error font-bold">
                  <ExclamationTriangleIcon className="h-4" />
                  Report
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border-b border-base-200 mt-4 flex flex-row justify-between"></div>
          <div className="mt-3 rounded-lg border border-base-200 flex items-center justify-center w-full py-14">
            <div className="flex flex-col items-center">
              <StarIcon className="h-20" />
              <h1 className="text-xl font-bold">Rating and Comments</h1>
              <p className="text-sm text-gray-500">coming soon!</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-base-200 flex items-center justify-center w-full py-14">
            <div className="flex flex-col items-center">
              <QuestionMarkCircleIcon className="h-20" />
              <h1 className="text-xl font-bold">Disscussion Forum</h1>
              <p className="text-sm text-gray-500">coming soon!</p>
            </div>
          </div>
        </div>
        <div className="w-64 border border-base-300 p-3 rounded-xl flex flex-col h-fit sticky top-32">
          <h1 className="font-bold font-quicksand">Set quantity</h1>
          <div className="w-full border-b border-base-200 mt-2"></div>
          <div className="flex flex-row items-center gap-2 mt-2">
            <div className="flex flex-row w-fit p-1 border border-base-300 rounded-lg gap-2">
              <button
                className="btn btn-xs btn-ghost btn-square"
                disabled={quantity == 1}
                onClick={decrement}
              >
                <MinusIcon className="h-4" />
              </button>
              <p className="">{quantity}</p>
              <button
                className="btn btn-xs btn-ghost btn-square"
                disabled={
                  quantity == data?.data.stock && data.data.type == "ready_stok"
                }
                onClick={increment}
              >
                <PlusIcon className="h-4" />
              </button>
            </div>

            {data?.data.type == "ready_stok" ? (
              <p className="flex flex-row gap-1 items-center">
                Stock :<span className="font-bold">{data?.data.stock}</span>{" "}
              </p>
            ) : (
              <p className="font-bold">Pre Order</p>
            )}
          </div>
          <div className="flex flex-row w-full items-center justify-between mt-4 font-quicksand">
            <p className="text-base-300">subtotal</p>
            <p className="font-bold">
              Rp{formatRupiah((data?.data.price || 0) * quantity)}
            </p>
          </div>
          <button className="btn btn-neutral w-full mt-5" onClick={addToCart}>+Cart</button>
          <button className="btn btn-neutral btn-outline w-full mt-2">
            Buy
          </button>
          <div className="w-full flex justify-center mt-3">
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => {
                if (!!session) {
                  addWishlist(data?.data.id as string);
                } else {
                  signIn();
                }
              }}
            >
              add to wishlist
            </button>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-base-200/50 mt-20 flex flex-col mb-10">
        <h1 className="text-3xl font-bold font-quicksand mt-3">
          Other Product
        </h1>
        <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-6 gap-x-3 gap-y-5">
          {random?.data.map((product, i) => {
            return (
              <ProductCard
                id={product.id}
                name={product.name}
                image={(product.image as { image: string }[])[0].image}
                price={product.price}
                store={product.store.name}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;