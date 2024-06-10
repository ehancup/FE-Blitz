"use client";

import { Pagination } from "@/components/pagination";
import ProductCard from "@/components/productCart";
import useProductModule from "@/lib/product/product";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const { useProductByStore } = useProductModule();
  const {
    data,
    isLoading,
    handlePage,
    handleClear,
    handlePageSize,
    query,
    setFilterQuery,
    setQuery,
  } = useProductByStore(params.name as string);
  console.log(data);
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">All Items</h1>
      {isLoading ? (
        <div className="w-full py-10 flex justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : (
        <div className="mt-5 w-full grid grid-cols-5 gap-3">
          {data?.data.map((pr, i) => {
            return (
              <ProductCard
                id={pr.id}
                name={pr.name}
                image={(pr.image as { image: string }[])[0].image}
                price={pr.price}
                store={pr.store.name}
                key={i}
              />
            );
          })}
        </div>
      )}
      <div className="w-full mb-20">
        <Pagination
          handlePage={handlePage}
          handlePageSize={handlePageSize}
          page={query.page}
          pageSize={query.pageSize}
          pagination={data?.pagination}
        />
      </div>
    </div>
  );
};

export default Page;
