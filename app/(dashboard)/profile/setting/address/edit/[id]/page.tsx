"use client";
import InputText from "@/components/inputText";
import TextArea from "@/components/textErea";
import useAddressModule from "@/lib/address";
import { CreateAddressPayload, UpdateAddressPayload } from "@/lib/address/interface";
import { useFormik, FormikProvider, Form, getIn } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

const createAddressSchema = yup.object().shape({
  title: yup.string().required().default(""),
  name: yup.string().required().default(""),
  address: yup.string().required().default(""),
  phone_number: yup.string().required().default(""),
  note: yup.string().default(""),
});

const Page = ({ params }: { params: { id: string } }) => {
  const { useUpdateAddress, useDetailAddress } = useAddressModule();
  const { data, isLoading, error, isError } = useDetailAddress(params.id);
  console.log(data);
  const { mutate, isPending } = useUpdateAddress(params.id);
  const router = useRouter();
  const formik = useFormik<UpdateAddressPayload>({
    initialValues: {
      title: data?.data.title || "",
      name: data?.data.name || "",
      address: data?.data.address || "",
      phone_number: data?.data.phone_number || "",
      note: data?.data.note || "",
    },
    validationSchema: createAddressSchema,
    enableReinitialize: true,
    onSubmit: (value) => {
      console.log(value);
      mutate(value, {
        onSuccess(data, variables, context) {
          router.push("/profile/setting/address");
        },
      });
    },
  });
  useEffect(() => {
    if (isError) {
        console.log(error);
        toast.error((error as any)!.response.data.message)
    }
  }, [isError, error])
  const { values, handleBlur, handleChange, handleSubmit, errors } = formik;
  return (
    <div className="flex flex-col">
      <div className="">
        <h1 className="text-3xl font-montserrat font-bold">Edit Address</h1>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      ) : (
        <FormikProvider value={formik}>
          <Form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
            <InputText
              id="title"
              name="title"
              isRequired
              value={values.title}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "title")}
              messageError={getIn(errors, "title")}
              label="Title"
            />
            <InputText
              id="name"
              name="name"
              isRequired
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "name")}
              messageError={getIn(errors, "name")}
              label="Name"
            />
            <TextArea
              id="address"
              name="address"
              isRequired
              value={values.address}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "address")}
              messageError={getIn(errors, "address")}
              label="Address"
            />
            <InputText
              id="phone_number"
              name="phone_number"
              isRequired
              value={values.phone_number}
              // type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "phone_number")}
              messageError={getIn(errors, "phone_number")}
              label="phone number"
            />
            <TextArea
              id="note"
              name="note"
              value={values.note}
              onBlur={handleBlur}
              onChange={handleChange}
              isError={getIn(errors, "note")}
              messageError={getIn(errors, "note")}
              label="note (for courier)"
            />
            <button className="btn btn-info w-fit mt-3">
              {isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Submit"
              )}
            </button>
          </Form>
        </FormikProvider>
      )}
    </div>
  );
};

export default Page;
