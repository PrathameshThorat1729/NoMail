import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import "../css/Login.css";
import * as Database from "../utils/Database";

const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <input
        className={meta.touched ? (meta.error ? "error" : "good") : ""}
        {...field}
        {...props}
      />
      <div className="error-msg">
        {meta.touched && meta.error ? meta.error : "‎ "}
      </div>
    </>
  );
};

export function Login() {
  let [errors, setErrors] = useState();
  let [response, setResponse] = useState();
  const navigate = useNavigate();
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if(localStorage.getItem("loginToken")) navigate("/dashboard");
  }, [])

  useEffect(() => {
    if(!response) return;
    else if (response.status == false) setErrors(response.message);
    else {
      localStorage.setItem("loginToken", response.token);
      navigate("/dashboard");
    }
    return () => controller.abort();
  }, [response]);

  return (
    <>
      <div className="signin-container flex-center">
        {errors && <div className="error-box">{errors}</div>}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Enter Email"),
            password: Yup.string().required("Enter Password"),
          })}
          onSubmit={async (values) =>
            setResponse(await Database.loginUser(values, signal))
          }
        >
          <Form className="signin-form flex-center">
            <CustomInput name="email" type="email" placeholder="Email" />
            <CustomInput
              name="password"
              type="password"
              placeholder="Enter Strong Password"
            />
            <input type="submit" value="Login" />
            <span>
              Don't have a Account, &nbsp;
              <Link to={"/signup"}>Signup</Link>
            </span>
          </Form>
        </Formik>
      </div>
    </>
  );
}

export function Signup() {
  let [errors, setErrors] = useState();
  let [response, setResponse] = useState();
  const navigate = useNavigate();
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if(localStorage.getItem("loginToken")) navigate("/dashboard");
  }, [])

  useEffect(() => {
    if(!response) return;
    else if (response.status == false) setErrors(response.message);
    else navigate("/login");

    return () => controller.abort();
  }, [response]);

  return (
    <>
      <div className="signin-container flex-center">
        {errors && <div className="error-box">{errors}</div>}
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            username: Yup.string()
              .required("Enter Username")
              .min(3, "Usernbame must be greater than 3")
              .max(12, "Usernbame must be less than 12"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Enter Email"),
            password: Yup.string().required("Enter Password"),
            confirmPassword: Yup.string()
              .required("Enter Password")
              .oneOf([Yup.ref("password")], "Password don't match"),
          })}
          onSubmit={async (values) =>
            setResponse(await Database.signupUser(values, signal))
          }
        >
          <Form className="signin-form flex-center">
            <CustomInput name="username" type="text" placeholder="Username" />
            <CustomInput name="email" type="email" placeholder="Email" />
            <CustomInput
              name="password"
              type="password"
              placeholder="Enter Strong Password"
            />
            <CustomInput
              name="confirmPassword"
              type="password"
              placeholder="Re-Enter Your Password"
            />
            <input type="submit" value="Signup" />
            <span>
              Already have a Account, &nbsp;
              <Link to={"/login"}>Login</Link>
            </span>
          </Form>
        </Formik>
      </div>
    </>
  );
}
