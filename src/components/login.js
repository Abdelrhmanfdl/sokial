import { useState, useRef } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

import * as yup from "yup";
import { useFormik } from "formik";

const maxPassLen = 20,
  minPassLen = 6;

const validationSchema = yup.object({
  email: yup
    .string()
    .email("This email is invalid")
    .required("Email is required"),

  password: yup
    .string()
    .min(
      minPassLen,
      `Password should be of minimum ${minPassLen} characters length`
    )
    .max(
      maxPassLen,
      `Password should be of maximum ${maxPassLen} characters length`
    )
    .required("Password is required"),
});

const Login = (props) => {
  // Redirection to 'home' is a token recognised
  /*if (document.cookie.indexOf("; token") > -1) {
    window.location.replace("/home");
    // TODO :: Get a way to enforce not show Login component
  }*/

  const [loginError, setLoginError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const user = {
        email: values.email,
        password: values.password,
      };

      try {
        const res = await fetch("/login", {
          method: "post",
          body: JSON.stringify(user),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const resJson = await res.json();
        if (!resJson.valid) {
          setLoginError({ message: resJson.message });
          console.log(resJson.message);
        } else {
          // valid request
          props.gotUserData(resJson.userData);
        }
      } catch (err) {
        console.log(err.message);
      }
    },
  });

  return (
    <form id="login-form" onSubmit={formik.handleSubmit}>
      <FormControl error={loginError}>
        <FormHelperText disabled={loginError}>
          {loginError && loginError.message}
        </FormHelperText>
        <TextField
          id="in-txt-email"
          name="email"
          type="email"
          label="Email"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
        <small>
          <span style={{ color: "gray" }}>want to create an account? </span>
          <a href="\signup">signup</a>
        </small>
      </FormControl>
    </form>
  );
};

export default Login;
