"use client";
import Swal from 'sweetalert2'
import InputText from "@/components/inputText";
import useAddressModule from "@/lib/address";
import { useRouter } from "next/navigation";
import { Pagination } from '@/components/pagination';

const Page = () => {
  const { useMyAddress, useDeleteAddress } = useAddressModule();
  const {mutate, isPending} = useDeleteAddress()
  const router = useRouter()
  const { data, isLoading, query, setQuery, setFilterQuery, handleClear, handlePage, handlePageSize } = useMyAddress();
  // console.log(data);
  const deleteAddress = (id:string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(id)
      }
    });
  }
  return isLoading ? (
    <div className="flex items-center justify-center">
      <span className="loading loading-spinner"></span>
    </div>
  ) : (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-row gap-3 items-end">
          <InputText
            id="search"
            name="search"
            placeholder="search address"
            value={query.keyword}
            onChange={(e) => {
              setQuery((prev) => ({ ...prev, keyword: e.target.value }));
            }}
            onKeyUp={(e) => {
              if (e.key == "Enter") setFilterQuery((prev) => (query))
            }}
            sm
          />
          <button
            className="btn bg-blitz hover:bg-blitz/70  btn-sm"
            onClick={() => setFilterQuery((prev) => (query))}
          >
            search
          </button>
          {
            query.keyword != "" ? (
              <button className="btn btn-outline btn-sm" onClick={() => handleClear()}>clear</button>
            ) : ""
          }
        </div>
        <div className="">
          <button className="btn btn-sm btn-primary" onClick={() => router.push('/profile/setting/address/add')}>add address</button>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {data?.data.length != 0 ? data?.data.map((dt, i) => {
          return (
            <div
              className="p-5 border border-base-300 rounded-md flex flex-row "
              key={i}
            >
              <div className="flex flex-col flex-1 font-montserrat">
                <h2 className="font-bold text-slate-500 font-montserrat">
                  {dt.title}
                </h2>
                <h1 className="font-bold text-lg">{dt.name}</h1>
                <p className="">{dt.phone_number}</p>
                <p className="line-clamp-1 text-ellipsis">{dt.address}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="btn btn-sm btn-info" onClick={() => router.push(`/profile/setting/address/edit/${dt.id}`)}>edit</button>
                <button className="btn btn-sm btn-error" onClick={() => deleteAddress(dt.id)}>delete</button>
              </div>
            </div>
          );
        }) : <div className='flex items-center justify-center text-base-300'>no address yet</div>}
      </div>
      <div className="">
        <Pagination handlePage={handlePage} handlePageSize={handlePageSize} page={query.page} pageSize={query.pageSize} pagination={data?.pagination}/>
      </div>
    </div>
  );
};

export default Page;
