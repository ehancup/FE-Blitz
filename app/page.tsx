"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useProductModule from "@/lib/product/product";
import ProductCard from "@/components/productCart";
import useMore from "@/lib/hook/useMore";
import { useEffect, useState } from "react";
import { Product } from "@/lib/product/interface";
import { axiosClient } from "@/lib/axios/axiosClient";

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

      setProducts(data?.data || [])
    }
  }, [isLoading])

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
    <div className=" px-3 sm:px-0 w-full max-w-[1320px] pt-32 flex flex-col">
      <h1 className="text-3xl font-bold">All Product</h1>
      <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-6 gap-x-3 gap-y-5">
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
