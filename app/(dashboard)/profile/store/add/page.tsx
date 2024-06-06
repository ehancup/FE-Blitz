"use client"
import * as yup from 'yup';
import { useFormik, FormikProvider, Form, getIn } from 'formik';
import { CreateStorePayload } from '@/lib/store/interface';
import InputText from '@/components/inputText';
import TextArea from '@/components/textErea';
import useStoreModule from '@/lib/store';
import { useRouter } from 'next/navigation';

const createStoreSchema = yup.object().shape({
    name: yup.string().required().default(""),
    route: yup.string().required().default(""),
    description: yup.string().required().default(""),
    location: yup.string().required().default(""),
})

const Page = () => {
    const {useCreateStore} = useStoreModule();
    const {mutate, isPending} = useCreateStore();
    const router = useRouter();
    const formik = useFormik<CreateStorePayload>({
        initialValues: createStoreSchema.getDefault(),
        validationSchema: createStoreSchema,
        onSubmit: (values: CreateStorePayload) => {
            mutate(values, {
                onSuccess(data, variables, context) {
                    router.push('/profile/store')
                },
            })
        }
    })

    const { values, handleBlur, handleChange, handleSubmit, errors } = formik;
  return (
    <div className="mt-5 flex flex-col border border-base-300 rounded-md p-5">
      <div className="">
        <h1 className="text-3xl font-montserrat font-bold">Add New Store</h1>
      </div>
      <div className="">
      <FormikProvider value={formik}>
        <Form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
          <InputText
            id="name"
            name="name"
            isRequired
            onBlur={handleBlur}
            onChange={handleChange}
            isError={getIn(errors, "name")}
            messageError={getIn(errors, "name")}
            label="name"
          />
          <InputText
            id="route"
            name="route"
            isRequired
            onBlur={handleBlur}
            onChange={handleChange}
            isError={getIn(errors, "route")}
            messageError={getIn(errors, "route")}
            label="route"
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
          <InputText
            id="location"
            name="location"
            isRequired
            // type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            isError={getIn(errors, "location")}
            messageError={getIn(errors, "location")}
            label="location"
          />

          <button className="btn btn-info w-fit mt-3">{isPending ? <span className="loading loading-spinner"></span> : "Submit"}</button>
        </Form>
      </FormikProvider>
      </div>
    </div>
  );
};

export default Page;
