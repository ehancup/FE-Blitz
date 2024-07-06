"use client";
import useEtalaseModule from "@/lib/etalase";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface TemplateProps {
  children: ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  const params = useParams();
  const router = useRouter()
  const { useEtalaseByStore } = useEtalaseModule();
  const { data, isLoading } = useEtalaseByStore(params.id as string);
  console.log(data);
  return (
    <div className="grid grid-cols-3 mt-3 gap-7">
      <div className="rounded-xl shadow-lg min-h-96 flex flex-col p-5">
        <div className="flex flex-row">
          <button className="btn btn-info btn-sm" onClick={() => router.push(`/seller/${params.id}/etalase/add`)}>add</button>
        </div>
        <ul className="menu">
          {data?.data.map((item, i) => {
            return (
              <li key={i}>
                <a>
                  <div
                    className="h-4 w-4"
                    style={{
                      backgroundImage: `url(${item.avatar?.replace('http://localhost:5002', process.env.IP as string)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  ></div>
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-xl shadow-lg col-span-2 h-fit">{children}</div>
    </div>
  );
};

export default Template;
