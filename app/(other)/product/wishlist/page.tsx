"use client";

import InputText from "@/components/inputText";
import { Pagination } from "@/components/pagination";
import ProductCard from "@/components/productCart";
import SelectInput from "@/components/selectInput";
import useProductModule from "@/lib/product/product";
import useWishlistModule from "@/lib/wishlist";
import { useEffect } from "react";

const Page = () => {

  // const { useProducts } = useProductModule();
  const {useMyWishlist} = useWishlistModule()
  const {
    data,
    isLoading,
    query,
    setQuery,
    setFilterQuery,
    handleClear,
    handlePage,
    handlePageSize,
  } = useMyWishlist();
  console.log(data);



  return (
    <div className="flex flex-row p-3 sm:px-0 max-w-[1200px] mt-24 gap-5 w-full">
      <div className="min-h-96 w-52 rounded-lg shadow-lg flex flex-col p-3 h-fit sticky top-28">
        <h1 className="font-medium">Filter</h1>
        <div className="flex flex-col">
          <InputText
            id="from_harga"
            name="from_harga"
            sm
            placeholder="from harga"
            type="number"
            value={query.from_price}
            onChange={(e) => {
              setQuery((prev) => ({
                ...prev,
                from_price: e.target.value,
              }));
            }}
          />
          <InputText
            id="from_harga"
            name="from_harga"
            type="number"
            sm
            placeholder="to harga"
            value={query.to_price}
            onChange={(e) => {
              setQuery((prev) => ({
                ...prev,
                to_price: e.target.value,
              }));
            }}
          />
          <SelectInput
            id="type"
            name="type"
            value={query.type}
            sm
            option={[
              { label: "pre order", value: "pre_order" },
              { label: "ready stok", value: "ready_stok" },
            ]}
            label="type"
            onChange={(e) => {
              setQuery((prev) => ({ ...prev, type: e.target.value as "" }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <button
            className="btn btn-neutral btn-sm"
            onClick={() => {
              console.log(query);
              setFilterQuery(query);
            }}
          >
            filter
          </button>
          <button
            className="btn btn-neutral btn-sm btn-outline"
            onClick={handleClear}
          >
            clear
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl">
          My Wishlist
        </h1>
        {isLoading ? (
          <div className="w-full flex items-center justify-center h-96 rounded-lg shadow-xl">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-5 gap-y-5 gap-x-3 mt-5">
            {data?.data.map((wishlist, i) => {
              return (
                <ProductCard id={wishlist.product.id} key={i} image={(wishlist?.product?.image as {image : string;}[])[0].image} name={wishlist.product.name} price={wishlist.product.price} store={wishlist.product.store.name}/>
              )
            })}
          </div>
        )}
        <div className="">
          <Pagination
            handlePage={handlePage}
            handlePageSize={handlePageSize}
            page={query.page}
            pageSize={query.pageSize}
            pagination={data?.pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
