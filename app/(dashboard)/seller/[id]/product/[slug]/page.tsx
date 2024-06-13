"use client";

import useProductModule from "@/lib/product/product";
import { formatDate } from "@/utils/date.utils";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { useDetailProduct, useDeleteProduct } = useProductModule();
  const { mutate: deleteProduct, isPending } = useDeleteProduct(
    params.id as string
  );
  const { data, isLoading } = useDetailProduct(params.slug as string);
  // console.log(data);
  return !isLoading ? (
    <div className="p-5 flex flex-col">
      <div className="flex flex-row justify-between">
        <button
          className="btn btn-error btn-sm"
          onClick={() =>
            deleteProduct(data?.data.id as string, {
              onSuccess(data, variables, context) {
                router.push(`/seller/${params.id}/product`);
              },
            })
          }
        >
          delete
        </button>
        <button
          className="btn btn-info btn-sm"
          onClick={() =>
            router.push(`/seller/${params.id}/product/${params.slug}/edit`)
          }
        >
          edit
        </button>
      </div>
      <div
        className="w-full aspect-square mt-5 rounded-lg"
        style={{
          backgroundImage: `url(${data?.data.image[0].image?.replace('localhost:5002', process.env.IP as string)})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="flex flex-row flex-wrap mt-3 gap-2">
        {data?.data.categoryToProduct.map((cat, i) => {
          return (
            <span className="badge badge-outline" key={i}>
              {cat.category.name}
            </span>
          );
        })}
      </div>
      <div className="">
        <table className="table table-xs mt-3 align-top">
          <tr>
            <th className="align-top">Name</th>
            <th className="align-top">:</th>
            <td>{data?.data.name}</td>
          </tr>
          <tr>
            <th className="align-top">Type</th>
            <th className="align-top">:</th>
            <td>{data?.data.type}</td>
          </tr>
          <tr>
            <th className="align-top">Price</th>
            <th className="align-top">:</th>
            <td>{data?.data.price}</td>
          </tr>
          <tr>
            <th className="align-top">Stock</th>
            <th className="align-top">:</th>
            <td>{data?.data.stock}</td>
          </tr>
          <tr>
            <th className="align-top">Etalase</th>
            <th className="align-top">:</th>
            <td>{data?.data.etalase.name}</td>
          </tr>
          <tr>
            <th className="align-top">Desc</th>
            <th className="align-top">:</th>
            <td>{data?.data.description}</td>
          </tr>
          <tr>
            <th className="align-top">Created At</th>
            <th className="align-top">:</th>
            <td>{formatDate(data?.data.created_at as string)}</td>
          </tr>
        </table>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loading loading-spinner"></span>
    </div>
  );
};

export default Page;
