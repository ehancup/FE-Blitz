"use client";

import bg from "../../../../../public/bg.jpg";
import * as yup from "yup";
import { useFormik, FormikProvider, Form, getIn } from "formik";
import { ResetPassPayload } from "@/lib/auth/interface";
import InputText from "@/components/inputText";
import { useAuthModule } from "@/lib/auth/auth";
import { useParams, useRouter } from "next/navigation";

const submitSchema = yup.object().shape({
    password: yup.string().required().default(""),
    rpw: yup
      .string()
      .required()
      .default("")
      .oneOf([yup.ref("password")], "repeat password does not match"),
});

const Page = () => {
    const params = useParams() as {id: string, token: string};
    const router = useRouter()
    const {useResetPassword} = useAuthModule();
    const {mutate, isPending} = useResetPassword(params.id, params.token)
  const formik = useFormik({
    initialValues: submitSchema.getDefault(),
    validationSchema: submitSchema,
    onSubmit: (value: ResetPassPayload) => {
      console.log(value);
      delete value.rpw;
        mutate(value, {
          onSuccess(data, variables, context) {
            console.log("success");
            router.push(`/login`);
          },
        });
    },
  });

  const { values, handleSubmit, handleChange, errors, handleBlur } = formik;
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
          <h1 className="text-2xl font-bold">Reset Password</h1>

          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
            <InputText
                id="password"
                name="password"
                onChange={handleChange}
                disabled={isPending}
                onBlur={handleBlur}
                isRequired
                protect
                label="password"
                isError={getIn(errors, "password")}
                messageError={getIn(errors, "password")}
              />
              <InputText
                id="rpw"
                name="rpw"
                isRequired
                onChange={handleChange}
                disabled={isPending}
                protect
                onBlur={handleBlur}
                label="repeat password"
                isError={getIn(errors, "rpw")}
                messageError={getIn(errors, "rpw")}
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
