"use client";

import InputText from "@/components/inputText";
import TransactionItem from "@/components/transactionItem";
import useOrderModule from "@/lib/order";
import clsx from "clsx";

const orderStatus: {
  label: string;
  value:
    | ""
    | "wait"
    | "process"
    | "shipping"
    | "error"
    | "done"
    | "cancel_user"
    | "cancel_seller";
}[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Waiting",
    value: "wait"
  },
  {
    label: "Process",
    value: "process"
  },
  {
    label: "Shipping",
    value: "shipping",

  },
  {
    label: "error",
    value: "error"
  },
  {
    label: "Done",
    value: "done"
  },
  {
    label: "Cancelled by user",
    value: "cancel_user"
  },{
    label: "Cancelled by seller",
    value: "cancel_seller"
  }
];

const Page = () => {
  const { useUserOrder } = useOrderModule();
  const { data, query, setQuery, setFilterQuery , isLoading, handleClear} = useUserOrder();
  console.log(data);

  const changeStatus = (p: | ""
    | "wait"
    | "process"
    | "shipping"
    | "error"
    | "done"
    | "cancel_user"
    | "cancel_seller") => {
    setQuery(prev => ({...prev, status: p}))
    setFilterQuery(prev => ({...prev, status: p}))
  }
  return (
    <div className="mt-10 flex flex-col">
      <h1 className="font-bold text-2xl">Transaction List</h1>
      <div className="w-full border border-base-200/75 rounded-lg px-4 py-4 flex flex-col mt-5">
        <div className="flex flex-row">
          <div className="flex flex-row items-end gap-2">
            <InputText
              id="search"
              name="search"
              placeholder="Search Order"
              sm
              onChange={(e) => {
                setQuery((prev) => ({ ...prev, keyword: e.target.value }));
              }}
              value={query.keyword}
            />
            <button className="btn btn-neutral btn-sm" onClick={() => setFilterQuery(query)}>search</button>
            {
              query.keyword != '' ? (
                <button className="btn btn-neutral btn-sm btn-outline" onClick={handleClear}>clear</button>

              ) : (
                <></>
              )
            }
          </div>
        </div>
        <div className="flex flex-row gap-1.5 items-center mt-3">
          <p className="font-bold text-xs font-poppins">Status</p>
          {
            orderStatus.map((status, i) => {
              return (
                <button className={clsx('btn btn-neutral btn-sm text-sm', {
                  'btn-outline' : query.status !== status.value
                })} key={i} onClick={() => changeStatus(status.value)}>{status.label}</button>
              )
            })
          }
          
        </div>
        <div className="w-full mt-3 flex flex-col gap-3">
            {
              isLoading ? (
                <div className="w-full rounded-md border border-base-200/75 flex items-center justify-center py-5"><span className="loading loading-spinner"></span></div>
                ) : data?.data.length == 0 ? (
                <div className="w-full rounded-md border border-base-200/75 flex items-center justify-center py-5">you have no order</div>

              ) : data?.data.map((dt, i) => {
                return <TransactionItem order={dt} key={i}/>
              })
            }
          </div>
      </div>
    </div>
  );
};

export default Page;
