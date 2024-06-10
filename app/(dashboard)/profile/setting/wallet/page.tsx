"use client";

import { formatRupiah } from "@/components/productCart";
import useWalletModule from "@/lib/wallet";
import { useState } from "react";

const Page = () => {
  const { useMyWallet, useTopupWallet } = useWalletModule();
  const {mutate, isPending} = useTopupWallet()
  const { data, isLoading } = useMyWallet();
  const [show, setShow] = useState<boolean>(false);
  const [pyld, setPyld] = useState<number>(0)
  console.log(data);
  return (
    <div className="w-full flex flex-col">
      <h1 className="">My wallet</h1>
      {isLoading || isPending ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <div className="flex flex-row gap-5 items-center">
          <p className="text-xl font-bold font-poppins">
            Rp{formatRupiah(Number(data?.data.currency))},-
          </p>
          {show ? (
            <div className="flex flex-row items-center gap-2">
                <input type="number" className="input input-bordered input-sm" onChange={(e) => {
                    setPyld(Number(e.target.value))
                }}/>
                <button className="btn btn-neutral btn-sm" onClick={() => {
                    mutate({currency: pyld})
                    setShow(false)
                }}>submit</button>
                <button className="btn btn-neutral btn-sm btn-outline" onClick={() => setShow(false)}>cancel</button>
            </div>
          ) : (
            <button className="btn btn-sm btn-neutral" onClick={() => setShow(true)}>topup</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
