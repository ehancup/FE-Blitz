"use client";
import { useFormik, Form, FormikProvider, getIn } from "formik";
import bg from "../../../public/bg.jpg";
import * as yup from "yup";
import InputText from "@/components/inputText";
import { LoginPayload } from "@/lib/auth/interface";
import { useAuthModule } from "@/lib/auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const loginSchema = yup.object().shape({
  email: yup.string().email().required().default(""),
  password: yup.string().required().default(""),
});

const Page = () => {
  const searchParam = useSearchParams();
  const isCallback = searchParam.has('callbackUrl')
  const callbackUrl = searchParam.get('callbackUrl')
  console.log(callbackUrl);
  const { useLogin } = useAuthModule();
  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const formik = useFormik<LoginPayload>({
    initialValues: loginSchema.getDefault(),
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: (value: LoginPayload) => {
      console.log(value);
      mutate(value, {
        onSuccess(data, variables, context) {
          router.replace(callbackUrl || "/");
        },
      });
    },
  });
  const { values, errors, handleChange, handleBlur, handleSubmit } = formik;
  return (
    <div className="w-full min-h-screen flex flex-row">
      <div
        className="flex-1 "
        style={{
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="w-[500px] flex items-center justify-center px-6 sm:px-12">
        <div className="w-full flex-col ">
          <h1 className="font-montserrat text-3xl text-center font-bold mb-5 ">
            Login
          </h1>
          <FormikProvider value={formik}>
            <Form className="flex flex-col gap-1" onSubmit={handleSubmit}>
              <InputText
                id="email"
                name="email"
                onChange={handleChange}
                disabled={isPending}
                onBlur={handleBlur}
                isRequired
                label="email"
                isError={getIn(errors, "email")}
                messageError={getIn(errors, "email")}
              />
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

              <button
                className="btn btn-primary w-full mt-4 font-medium"
                type="submit"
              >
                {isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : "login"}
              </button>
            </Form>
          </FormikProvider>
          <div className="flex justify-center mt-2 btn btn-link btn-secondary">
            <Link href={'/register'}>{'don\'t have account? Register'}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
