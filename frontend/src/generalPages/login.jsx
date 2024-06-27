// src/components/Login.js
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/userslice";
import { useNavigate } from "react-router-dom";

const Login = () => {

// used yup and formik for form validation

  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.userslice);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Token exists, navigate to the dashboard
      navigate("/barchart");
    }
  }, [token]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className=" dark:bg-lightdark flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className=" dark:text-slate-200 drop-shadow-2xl text-2xl font-bold text-center text-gray-800 mb-8">
          blackcoffer Login
        </h2>
        <div className=" mb-4">
          <p>email : test@blackcoffer.com</p>
          <p>password : test1234</p>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            dispatch(loginUser(values));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block dark:text-gray-300 text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 dark:bg-gray-700 mt-1 border border-gray-200 dark:border-gray-500 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block dark:text-gray-200 text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 dark:bg-gray-700 mt-1 border border-gray-200 dark:border-gray-500 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
