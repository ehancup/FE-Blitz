"use client";
import { useState } from "react";
import * as yup from "yup";
import { Form, FormikProvider, getIn, useFormik } from "formik";
import { CreateEtalasePayload } from "@/lib/etalase/interface";
import InputText from "@/components/inputText";
import toast from "react-hot-toast";
import { axiosClient } from "@/lib/axios/axiosClient";
import useEtalaseModule from "@/lib/etalase";
import { useParams, useRouter } from "next/navigation";

const createEtalaseSchema = yup.object().shape({
  name: yup.string().required().default(""),
});

const Page = () => {
  const params = useParams();
  const router = useRouter();
  let [preview, setPreview] = useState<string>();
  let [upload, setUpload] = useState<File | undefined>();
  const { useCreateEtalase } = useEtalaseModule();
  const { mutate, isPending } = useCreateEtalase(params.id as string);

  const formik = useFormik<CreateEtalasePayload>({
    initialValues: createEtalaseSchema.getDefault(),
    validationSchema: createEtalaseSchema,
    onSubmit: async (value: CreateEtalasePayload) => {
      if (!upload) {
        toast.error("please enter an image");
      } else {
        const compiled = new FormData();
        compiled.append("file", upload);

        const response = await axiosClient.post("/upload/file", compiled, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status !== 201) {
          toast.error((response as any).response.data.message);
          return;
        } else {
          value.avatar = response.data.data.file_url;
          console.log(value);
          mutate(value, {
            async onError(error, variables, context) {
              const filename = value.avatar?.split("/").pop();
              await axiosClient.delete(`/upload/delete/${filename}`);
            },
            onSuccess(data, variables, context) {
              router.push(`/seller/${params.id}/etalase`)
            },
          });
        }
      }
    },
  });
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
  } = formik;

  return (
    <div className="p-5 flex flex-row gap-5">
      <div className="w-60 p-5 bg-base-200 rounded-xl flex flex-col gap-5">
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            let file = e.target.files?.[0];

            if (!!file) {
              setUpload(file);

              let p = URL.createObjectURL(file);
              setPreview(p);
            }
          }}
        />
        {!!preview ? (
          <div
            className="w-full aspect-square rounded-xl"
            style={{
              backgroundImage: `url(${preview})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
        ) : (
          <div className="w-full aspect-square bg-white rounded-xl"></div>
        )}
        <label htmlFor="file" className="btn btn-neutral">
          add photo
        </label>
      </div>
      <div className="flex-1">
        <FormikProvider value={formik}>
          <Form
            onSubmit={handleSubmit}
            className="h-full flex flex-col justify-between"
          >
            <InputText
              id="name"
              name="name"
              isRequired
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "name")}
              messageError={getIn(errors, "name")}
              label="Name"
            />
            <button className="btn btn-info w-fit self-end" type="submit" disabled={isPending}>
              {isPending ? (<span className="loading loading-spinner"></span>) : "submit"}
            </button>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default Page;
