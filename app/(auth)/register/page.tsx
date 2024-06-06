"use client";
import { useFormik, Form, FormikProvider, getIn } from "formik";
import bg from "../../../public/bg.jpg";
import * as yup from "yup";
import InputText from "@/components/inputText";
import { RegisterPayload } from "@/lib/auth/interface";
import { useAuthModule } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = yup.object().shape({
  name: yup.string().required().default(""),
  email: yup.string().email().required().default(""),
  password: yup.string().required().default(""),
  rpw: yup
    .string()
    .required()
    .default("")
    .oneOf([yup.ref("password")], "repeat password does not match"),
});

const Page = () => {
  const { useRegister } = useAuthModule();
  const { mutate, isPending } = useRegister();
  const router = useRouter();
  const formik = useFormik({
    initialValues: registerSchema.getDefault(),
    validationSchema: registerSchema,
    enableReinitialize: true,
    onSubmit: (value: RegisterPayload) => {
      console.log(value);
      mutate(value, {
        onSuccess(data, variables, context) {
          router.push("/");
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
          <h1 className="font-poppins text-3xl text-center font-bold mb-5 ">
            Register
          </h1>
          <FormikProvider value={formik}>
            <Form className="flex flex-col gap-1" onSubmit={handleSubmit}>
              <InputText
                id="name"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isPending}
                isRequired
                label="name"
                isError={getIn(errors, "name")}
                messageError={getIn(errors, "name")}
              />
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

              <button
                className="btn btn-primary w-full mt-4 font-medium"
                type="submit"
              >
                {isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : "Register"}
              </button>
            </Form>
          </FormikProvider>
          <div className="flex justify-center mt-2 btn btn-link btn-secondary">
            <Link href={'/login'}>{'Already have account? Login'}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
