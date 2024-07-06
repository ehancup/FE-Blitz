"use client";

import { useAuthModule } from "@/lib/auth/auth";

const Page = () => {
  const { useProfile, useSetAvatar } = useAuthModule();
  const {mutate: setAvatar, isPending} = useSetAvatar()
  const { data, isLoading } = useProfile();
  console.log(data);
  return (
    <div className="flex flex-row">
      <div className="flex flex-col p-4 rounded-lg shadow-lg w-64 gap-4">
        <div
          className="w-full aspect-square rounded-md"
          style={{
            backgroundImage: `url(${data?.data.avatar?.replace('http://localhost:5002', process.env.IP as string)})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
        <input type="file" name="image" id="image" className="hidden" accept="image/*" onChange={(e) => {
          setAvatar(e.target.files?.[0])
        }}/>
        <label htmlFor="image" className="btn  btn-outline w-full">{isPending ? <span className="loading loading-spinner"></span> : "Select photo"}</label>
        <p></p>
      </div>
    </div>
  );
};

export default Page;
