"use client";

import bg from "../../../public/bg.jpg";
import * as yup from "yup";
import { useFormik, FormikProvider, Form, getIn } from "formik";
import { ForgotPassPayload } from "@/lib/auth/interface";
import InputText from "@/components/inputText";
import { useAuthModule } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";

const submitSchema = yup.object().shape({
  email: yup.string().email().required().default(""),
});

const Page = () => {
  const { useForgotPassword } = useAuthModule();
  const router = useRouter();
  const { mutate, isPending } = useForgotPassword();
  const formik = useFormik({
    initialValues: submitSchema.getDefault(),
    validationSchema: submitSchema,
    onSubmit: (value: ForgotPassPayload) => {
      console.log(value);
      mutate(value, {
        onSuccess(data, variables, context) {
          console.log("success");
          router.push(`/sent?em=${value.email}`);
        },
      });
    },
  });

  const { values, handleSubmit, handleChange, errors } = formik;
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="mockup-window border bg-base-200 w-96">
        <div className="bg-base-100 px-7 py-5">
          <h1 className="text-2xl font-bold">Forgot Password</h1>

          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <InputText
                id="email"
                name="email"
                onChange={handleChange}
                value={values.email}
                label="Email"
                isError={getIn(errors, "email")}
                messageError={getIn(errors, "email")}
              />
              <div className="`w-full flex justify-end mt-3">
                <button
                  className="btn btn-primary  "
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default Page;
