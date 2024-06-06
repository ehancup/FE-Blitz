"use client";
import InputText from "@/components/inputText";
import TextArea from "@/components/textErea";
import useAddressModule from "@/lib/address";
import { CreateAddressPayload } from "@/lib/address/interface";
import { useFormik, FormikProvider, Form, getIn } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const createAddressSchema = yup.object().shape({
  title: yup.string().required().default(""),
  name: yup.string().required().default(""),
  address: yup.string().required().default(""),
  phone_number: yup.string().required().default(""),
  note: yup.string().default(""),
});

const Page = () => {
    const {useCreateAddress} = useAddressModule();
    const {mutate, isPending} = useCreateAddress();
    const router = useRouter()
  const formik = useFormik<CreateAddressPayload>({
    initialValues: createAddressSchema.getDefault(),
    validationSchema: createAddressSchema,
    onSubmit: (value) => {
        console.log(value);
        mutate(value, {
            onSuccess(data, variables, context) {
                router.push('/profile/setting/address')
            },
        })
    },
  });
  const { values, handleBlur, handleChange, handleSubmit, errors } = formik;
  return (
    <div className="flex flex-col">
      <div className="">
        <h1 className="text-3xl font-montserrat font-bold">Add Address</h1>
      </div>
      <FormikProvider value={formik}>
        <Form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
          <InputText
            id="title"
            name="title"
            isRequired
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
            onBlur={handleBlur}
            onChange={handleChange}
            isError={getIn(errors, "note")}
            messageError={getIn(errors, "note")}
            label="note (for courier)"
          />
          <button className="btn btn-info w-fit mt-3">{isPending ? <span className="loading loading-spinner"></span> : "Submit"}</button>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default Page;
