"use client";
import InputCurrency from "@/components/currencyInput";
import InputText from "@/components/inputText";
import SelectInput from "@/components/selectInput";
import TextArea from "@/components/textErea";
import useOption from "@/lib/hook/useOption";
import { UpdateProductPayload } from "@/lib/product/interface";
import useProductModule from "@/lib/product/product";
import { Form, FormikProvider, getIn, useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as yup from "yup";

const updateProductSchema = yup.object().shape({
  name: yup.string().required().default(""),
  description: yup.string().required().default(""),
  price: yup.number().required().default(0),
  type: yup.mixed().oneOf(["ready_stok", "pre_order"]).default("ready_stok"),
  stock: yup.number().required().default(0),
  etalase_id: yup.string().required().default(""),
});

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { useEtalaseStore } = useOption();
  const { optionEtalase } = useEtalaseStore(params.id as string);
  const { useDetailProduct, useDeleteImage, useUpdateProduct } = useProductModule();
  const {mutate, isPending} = useUpdateProduct(params.id as string, params.slug as string)
  const { data, isLoading } = useDetailProduct(params.slug as string);
  const { mutate: deleteImage } = useDeleteImage(params.id as string);
  console.log(data);

  const formik = useFormik<UpdateProductPayload>({
    initialValues: {
      name: data?.data.name || "",
      description: data?.data.description || "",
      price: data?.data.price || 0,
      type: data?.data.type || "ready_stok",
      stock: data?.data.stock || 0,
      etalase_id: data?.data.etalase_id || "",
    },
    validationSchema: updateProductSchema,
    enableReinitialize: true,
    onSubmit: (value: UpdateProductPayload) => {
        value.stock = Number(value.stock)
        console.log(value);
        mutate(value, {
            onSuccess(data, variables, context) {
                router.push(`/seller/${params.id}/product/${params.slug}`)
            },
        })
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

  const dltImage = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteImage(id);
      }
    });
  };
  return (
    <div className="flex flex-col p-5">
      <h1 className="text-xl font-medium">Edit product</h1>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {data?.data.image.map((e, i) => {
          return (
            <div
              className="w-full aspect-square rounded-md indicator"
              key={i}
              style={{
                backgroundImage: `url(${e.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            >
              <div className="indicator-item cursor-pointer flex items-center justify-center">
                <span
                  className="btn btn-error btn-xs btn-circle aspect-square"
                  onClick={() => dltImage(e.id)}
                >
                  x
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="">
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit} className="flex flex-col">
            <InputText
              sm
              value={values.name}
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
              sm
              value={values.description}
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
              sm
            //   value={values.description}
              id="price"
              name="price"
              placeholder="enter price in rupiah"
              isRequired
              value={values.price}
              onBlur={handleBlur}
              onValueChange={(e, i, k) => {
                console.log(k);
                setFieldValue(`price`, k?.float);
              }}
              isError={getIn(errors, "price")}
              messageError={getIn(errors, "price")}
              label="price"
            />
            <SelectInput
              sm
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
              sm
              id="stock"
              name="stock"
              value={values.stock}
              isRequired
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "stock")}
              messageError={getIn(errors, "stock")}
              label="stock"
            />
            <SelectInput
              sm
              id="etalase_id"
              name="etalase_id"
              isRequired
              value={values.etalase_id}
              option={optionEtalase}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "etalase_id")}
              messageError={getIn(errors, "etalase_id")}
              label="etalase"
            />
            <div className="flex flex-row justify-between mt-3">
                <button className="btn btn-error btn-sm" type="button" onClick={() => router.back()}>back</button>
                <button className="btn btn-info btn-sm" type="submit">submit</button>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default Page;
