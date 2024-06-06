"use client";
import {
  useFormik,
  Form,
  FormikProvider,
  FieldArray,
  ArrayHelpers,
  getIn,
} from "formik";
import { ChangeEvent, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import * as yup from "yup";
import { CreateProductPayload, UploadMultiResponse } from "@/lib/product/interface";
import SelectInput from "@/components/selectInput";
import useOption from "@/lib/hook/useOption";
import InputText from "@/components/inputText";
import TextArea from "@/components/textErea";
import InputCurrency from "@/components/currencyInput";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { axiosClient } from "@/lib/axios/axiosClient";
import useProductModule from "@/lib/product/product";

const createProductSchema = yup.object().shape({
  name: yup.string().required().default(""),
  description: yup.string().required().default(""),
  price: yup.number().required().default(0),
  type: yup.mixed().oneOf(["ready_stok", "pre_order"]).default("ready_stok"),
  stock: yup.number().required().default(0),
  etalase_id: yup.string().required().default(""),
  category: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
      })
    )
    .default([]),
});

const Page = () => {
  const params = useParams();
  let [files, setFiles] = useState<File[]>([]);
  const router = useRouter()
  const { optionCategory, useEtalaseStore } = useOption();
  const { optionEtalase } = useEtalaseStore(params.id as string);
  const {useCreateProduct} = useProductModule();
  const {mutate, isPending} = useCreateProduct(params.id as string)
  // let [imagePreview, setImagePreview] = useState()

  const formik = useFormik<CreateProductPayload>({
    initialValues: createProductSchema.getDefault(),
    validationSchema: createProductSchema,
    onSubmit: async (values: CreateProductPayload) => {
      if (files.length == 0 ) {
        toast.error('please enter at least 1 image')
      } else {
        const compiled = new FormData();
        files.forEach(file => {
          compiled.append('files', file)
        })

        const response = await axiosClient.post("/upload/files", compiled, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })

        if (response.status !== 201) {
          toast.error((response as any).response.data.message)
          return;
        } else {
          console.log((response.data as UploadMultiResponse).data.file);
          let uploaded = (response.data as UploadMultiResponse).data.file;

          const imagePyld: {image:string}[] = uploaded.map((p) => ({image: p.file_url}))
          
          values.image = imagePyld;
          values.price = Number(values.price);
          values.stock = Number(values.stock);
          console.log(values);
          mutate(values, {
            onSuccess(data, variables, context) {
              router.push(`/seller/${params.id}/product`)
            },
          })
        }
      }
      console.log(values);
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => [...prev, file]);
    }
  };
  return (
    <div className="w-full mt-3">
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} className="flex gap-5 flex-row">
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold">Add Product</h1>
            <h3 className="text-xl mt-4">add image</h3>
            <div className="w-full grid grid-cols-6 gap-3 mt-5">
              {files.map((file, i) => {
                let alamat;
                if (file) {
                  // setFiles(prev => [...prev, file])
                  // const reader = new FileReader();
                  // reader.onloadend = () => {
                  //   // setImagePreview(reader.result);
                  // };
                  // reader.readAsDataURL(file);
                  alamat = URL.createObjectURL(file);
                  console.log(alamat);
                }
                return (
                  <div
                    className="w-full indicator rounded-lg border-4 border-base-300 border-dashed aspect-square"
                    key={i}
                    style={{
                      backgroundImage: `url(${alamat})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  >
                    <div className="indicator-item cursor-pointer">
                      <span
                        className="btn btn-error btn-xs btn-circle aspect-square"
                        onClick={() => {
                          const deleted = files.filter((fl) => fl != file);
                          setFiles(deleted);
                        }}
                      >
                        x
                      </span>
                    </div>
                    {/* <img src={alamat} alt="" className="w-full h-full" /> */}
                  </div>
                );
              })}
              <input
                type="file"
                accept="image/*"
                name="file"
                id="file"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="file"
                className=" cursor-pointer w-full rounded-lg border-4 border-base-300 border-dashed aspect-square flex items-center justify-center"
              >
                <PlusIcon className="h-10 text-base-300" />
              </label>
            </div>
            <div className="mt-5 flex flex-col">
              <h1 className="text-xl">Category</h1>
              <FieldArray
                name="category"
                render={(arrayHelpers: ArrayHelpers) => {
                  return (
                    <div className="w-full grid grid-cols-3 gap-3 mt-2">
                      {values.category.map((value: { id: string }, i) => {
                        return (
                          <div
                            className="flex flex-row items-end gap-2"
                            key={i}
                          >
                            <SelectInput
                              id={`category[${i}].id`}
                              name={`category[${i}].id`}
                              option={optionCategory}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              isError={getIn(errors, `category[${i}].id`)}
                              messageError={'tis is required'}
                              sm
                            />
                            <button
                              className="btn btn-sm btn-square"
                              onClick={() => arrayHelpers.remove(i)}
                            >
                              x
                            </button>
                          </div>
                        );
                      })}
                      <button
                        className=" btn btn-sm btn-neutral cursor-pointer w-full flex items-center justify-center self-end"
                        onClick={() =>
                          arrayHelpers.push({
                            id: "",
                          })
                        }
                      >
                        <PlusIcon className="h-5 " />
                      </button>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex-1 rounded-lg shadow-xl p-5 ">
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
            <TextArea
              id="description"
              name="description"
              isRequired
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "description")}
              messageError={getIn(errors, "description")}
              label="description"
            />
            <InputCurrency
              id="price"
              name="price"
              placeholder="enter price in rupiah"
              isRequired
              value={values.price}
              onBlur={handleBlur}
              onValueChange={(e, i, k) => {
                setFieldValue(`price`, k?.value);
              }}
              isError={getIn(errors, "price")}
              messageError={getIn(errors, "price")}
              label="price"
            />
            <SelectInput
              id="type"
              name="type"
              isRequired
              value={values.type}
              option={[
                { label: "ready stok", value: "ready_stok" },
                { label: "pre order", value: "pre_order" },
              ]}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "type")}
              messageError={getIn(errors, "type")}
              label="type"
            />
            <InputText
              id="stock"
              name="stock"
              isRequired
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "stock")}
              messageError={getIn(errors, "stock")}
              label="stock"
            />
            <SelectInput
              id="etalase_id"
              name="etalase_id"
              isRequired
              // value={values.etalase_id}
              option={optionEtalase}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "etalase_id")}
              messageError={getIn(errors, "etalase_id")}
              label="etalase"
            />
            <div className="">
              <button className="btn btn-primary mt-3" type="submit">
                submit
              </button>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default Page;
