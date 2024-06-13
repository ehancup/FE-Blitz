"use client";

import { useSearchParams } from "next/navigation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import bg from "../../../public/bg.jpg";
import { Suspense } from "react";

const Page = () => {
    const serachParams = useSearchParams();
    return (
        <div className="w-full min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}>
            <div className="w-80 p-5 aspect-square rounded-xl shadow-2xl bg-base-100 flex flex-col items-center justify-center text-gray-500">
                <EnvelopeIcon className="h-40"/> 
                <h1 className="text-center">Email sent to {serachParams.get('em')}</h1>
            </div>
        </div>
    )
}

export default function Pg () {
    return (
        <Suspense>
            <Page/>
        </Suspense>
    )
};