"use client";

import { Pagination } from "@/components/pagination";
import useProductModule from "@/lib/product/product";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

interface TemplateProps {
    children: ReactNode;
}

const Template = ({children}: TemplateProps) => {
  const [deletePayload, setDeletePayload] = useState<string[]>([]);
  const router = useRouter()
  const params = useParams();
  const { useProductByStore } = useProductModule();
  const {
    data: allPro,
    isLoading: allLoad,
    query,
    setQuery,
    setFilterQuery,
    handleClear,
    handlePage,
    handlePageSize,
  } = useProductByStore((params as { id: string }).id);

  const checked = useMemo(() => {
    if (!allPro) {
      return { isAllCheced: false };
    }
    const isAllChecked = allPro.data.every((n) => deletePayload.includes(n.id));

    return { isAllCheced: isAllChecked };
  }, [deletePayload, allPro]);
  //   console.log(allPro);
  return (
    <div className="w-full flex flex-col ">
      <div className="w-full flex flex-row gap-3">
        <div className="flex-1 rounded-lg shadow-lg h-fit">
          <div className="flex flex-row px-3 pt-3 justify-end gap-2">
            {deletePayload.length != 0 ? (
              <button className="btn btn-sm btn-error">Delete checked</button>
            ) : (
              <></>
            )}
            <button className="btn btn-neutral btn-sm" onClick={() => router.push(`/seller/${params.id}/add/product`)}>Add Product</button>
          </div>
          <div className="">
            <div className="overflow-x-auto mt-2">
              <table className="table table-sm w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={checked.isAllCheced}
                          onChange={() => {
                            if (checked.isAllCheced) {
                              setDeletePayload([]);
                            } else {
                              setDeletePayload((state) => {
                                if (!allPro) {
                                  return [];
                                }

                                const selected: string[] = Array.from(
                                  new Set([
                                    ...state,
                                    ...allPro?.data?.map((n) => n.id),
                                  ])
                                );

                                return [...selected];
                              });
                            }
                          }}
                        />
                      </label>
                    </th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {allLoad ? (
                    <tr>
                      <th className="row-span-5">
                        <span className="loading loading-spinner"></span>
                      </th>
                    </tr>
                  ) : allPro?.data.length != 0 ? (
                    allPro?.data.map((pro, i) => {
                      return (
                        <tr key={i} className={clsx('cursor-pointer', {
                          "bg-blue-600/15 w-full rounded-md" : pro.id == params.slug
                        })} onClick={() => router.push(`/seller/${params.id}/product/${pro.id}`)}>
                          <th>
                            <label>
                              <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={deletePayload.includes(pro.id)}
                                onChange={(o) => {
                                  if (o.target.checked) {
                                    setDeletePayload((state) => [
                                      ...state,
                                      pro.id,
                                    ]);
                                  } else {
                                    const filtered = deletePayload.filter(
                                      (n) => n !== pro.id
                                    );
                                    setDeletePayload(filtered);
                                  }
                                }}
                              />
                            </label>
                          </th>
                          <td>
                            <div className="flex items-center gap-3">
                              {/* <div className="avatar">
                        <div
                          className="mask mask-squircle w-6 aspect-square"
                          style={{
                            backgroundImage: `url(https://img.daisyui.com/tailwind-css-component-profile-2@56w.png)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                          }}
                        ></div>
                      </div> */}
                              <div>
                                <div className="font-bold">{pro.name}</div>
                              </div>
                            </div>
                          </td>
                          <td>{pro.price}</td>
                          <td>{pro.type}</td>
                          <th>
                            <button className="btn btn-ghost btn-xs">
                              {pro.stock}
                            </button>
                          </th>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="" >
                      <th className="" colSpan={5} >
                        no product yet
                      </th>
                    </tr>
                  )}
                  {/* row 2 */}
                </tbody>
                {/* foot */}
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Job</th>
                    <th>Favorite Color</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-1 w-full px-3 pb-3">
              <Pagination
                handlePage={handlePage}
                handlePageSize={handlePageSize}
                page={query.page}
                pageSize={query.pageSize}
                pagination={allPro?.pagination}
              />
            </div>
          </div>
        </div>
        <div className="w-80 rounded-lg shadow-lg min-h-96">{children}</div>
      </div>
    </div>
  );
};

export default Template;