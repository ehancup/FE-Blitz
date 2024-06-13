"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useProductModule from "@/lib/product/product";
import ProductCard from "@/components/productCart";
import useMore from "@/lib/hook/useMore";
import { useEffect, useState } from "react";
import { Product } from "@/lib/product/interface";
import { axiosClient } from "@/lib/axios/axiosClient";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation, Autoplay} from "swiper/modules";
import "swiper/css";
import banner1 from "../public/banner1.webp";
import banner2 from "../public/banner2.webp";
import banner3 from "../public/banner3.webp";
import banner4 from "../public/banner4.webp";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { useProducts } = useProductModule();
  // const {products, addMore, setData} = useMore(res => res)
  const { data, isLoading } = useProducts();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>(data?.data || []);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  console.log(session);
  console.log(data);

  useEffect(() => {
    if (!isLoading) {
      setProducts(data?.data || []);
    }
  }, [isLoading, data?.data]);

  const loadProducts = async (page: number) => {
    setLoading(true);
    try {
      const res = await axiosClient
        .get("/product/list", { params: { page } })
        .then((res) => res.data);
      console.log(res);
      setProducts((prevProducts) => [...prevProducts, ...(res as any).data]);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!loading) {
      setLoading(true);
      setPage((prevPage) => prevPage + 1);
      const res = await axiosClient
        .get("/product/list", { params: { page } }) 
        .then((res) => res.data);
      console.log(res);
      setProducts((prevProducts) => [...prevProducts, ...(res as any).data]);
      setLoading(false);
    }
  };

  return (
    <div className=" w-full max-w-[1100px] pt-16 sm:pt-28 flex flex-col">
      <div className="w-full sm:rounded-xl bg-blue-600 mb-10 aspect-[4/1] overflow-hidden relative group/swiper flex flex-row items-center">
        <button className="swipe-prev1 btn btn-xs hidden sm:flex btn-square btn-neutral absolute left-5 group-hover/swiper:left-0 z-10 opacity-0 group-hover/swiper:opacity-100 transition-all duration-150">
          <ChevronLeftIcon className="h-4" />
        </button>
        <button className="swipe-next1 btn btn-xs hidden sm:flex btn-square btn-neutral absolute right-5 group-hover/swiper:right-0 z-10 opacity-0 group-hover/swiper:opacity-100 transition-all duration-150">
          <ChevronRightIcon className="h-4" />
        </button>
        <Swiper
          slidesPerView={1}
          modules={[Navigation, Autoplay]}
          className="w-full h-full mySwiper"
          navigation={{
            nextEl: ".swipe-next1",
            prevEl: ".swipe-prev1",
          }}
          loop
          autoplay={{
            delay: 3000
          }}
        >
          <SwiperSlide>
            <div
              className="w-full h-full "
              style={{
                backgroundImage: `url(${banner1.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="w-full h-full "
              style={{
                backgroundImage: `url(${banner2.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="w-full h-full "
              style={{
                backgroundImage: `url(${banner3.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="w-full h-full "
              style={{
                backgroundImage: `url(${banner4.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            ></div>
          </SwiperSlide>
        </Swiper>
      </div>
      <h1 className="text-3xl font-bold px-3 sm:px-0">All Product</h1>
      <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-6 gap-x-3 gap-y-5 px-3 sm:px-0">
        {products.map((product, i) => {
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
      <div className="w-full py-5 flex items-center justify-center">
        <button
          className="btn btn-neutral btn-outline btn-wide"
          onClick={handleLoadMore}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
