"use client";
import Navbar from "@/components/navbar";
import React from "react";
import usePop from "@/lib/hook/usePop";

interface TemplateProps {
  children: React.ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  const popCls = usePop((state) => state.popCls);
  return (
    <div className="">
      <Navbar />
      <div className="w-full" onClick={() => popCls()}>
        {children}
      </div>
    </div>
  );
};

export default Template;
