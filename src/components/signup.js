import { useState, useRef } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";

/*
TODO :: Show and handle invalidation of account creation
*/

import Autocomplete from "@material-ui/lab/Autocomplete";
import * as yup from "yup";
import { useFormik } from "formik";

import { countries } from "../data-stores/login and signup.json";

const maxNameLen = 20,
  minNameLen = 2,
  maxPassLen = 20,
  minPassLen = 6,
  maxCityLen = 20,
  minCityLen = 2;

const validationSchema = yup.object({
  fname: yup
    .string()
    .min(
      minNameLen,
      `First name should be of minimum ${minNameLen} characters length`
    )
    .max(
      maxNameLen,
      `First name should be of maximum ${maxNameLen} characters length`
    )
    .required("First name is required"),

  lname: yup
    .string()
    .min(
      minNameLen,
      `Last name should be of minimum ${minNameLen} characters length`
    )
    .max(
      maxNameLen,
      `Last name should be of maximum ${maxNameLen} characters length`
    )
    .required("Last name is required"),

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

  gender: yup.string().required("Gender is required"),

  birthday: yup.string().required("Birth day is required"),
  birthmonth: yup.string().required("Birth month is required"),
  birthyear: yup.string().required("Birth year is required"),

  country: yup.string().required("Country is required"),
  city: yup
    .string()
    .min(
      minCityLen,
      `City should be of minimum ${minPassLen} characters length`
    )
    .max(
      maxCityLen,
      `City should be of maximum ${maxPassLen} characters length`
    )
    .required("City is required"),
});

const Birthdate = (props) => {
  const minPossibleYear = 1900;
  const date = new Date();

  const years = [],
    days = Array.from(Array(31).keys()).map((x) => {
      return { label: String(x + 1), value: x + 1 };
    }),
    monthes = Array.from(Array(12).keys()).map((x) => {
      return { label: String(x + 1), value: x + 1 };
    });
  for (let i = date.getFullYear(); i >= minPossibleYear; i--)
    years.push({
      label: String(i),
      value: i,
    });

  return (
    <FormControl>
      <Autocomplete
        id="birthday"
        name="birthday"
        style={{ width: 300 }}
        options={days}
        autoHighlight
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <TextField
              error={
                props.formik.touched.birthday &&
                Boolean(props.formik.errors.birthday)
              }
              helperText={
                props.formik.touched.birthday && props.formik.errors.birthday
              }
              {...params}
              label="Day of birth"
              variant="outlined"
            />
          );
        }}
        onChange={async (e, newday) => {
          if (newday) props.formik.values.birthday = newday.value;
          else props.formik.values.birthday = "";
          await props.formik.handleChange("birthday");
        }}
        error={
          props.formik.touched.birthday && Boolean(props.formik.errors.birthday)
        }
        helperText={
          props.formik.touched.birthday && props.formik.errors.birthday
        }
      />
      <Autocomplete
        id="birthmonth"
        name="birthmonth"
        style={{ width: 300 }}
        options={monthes}
        autoHighlight
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <TextField
              error={
                props.formik.touched.birthmonth &&
                Boolean(props.formik.errors.birthmonth)
              }
              helperText={
                props.formik.touched.birthmonth &&
                props.formik.errors.birthmonth
              }
              {...params}
              label="Month of birth"
              variant="outlined"
            />
          );
        }}
        onChange={async (e, newmonth) => {
          if (newmonth) props.formik.values.birthmonth = newmonth.value;
          else props.formik.values.birthmonth = "";
          await props.formik.handleChange("birthmonth");
        }}
        error={
          props.formik.touched.birthmonth &&
          Boolean(props.formik.errors.birthmonth)
        }
        helperText={
          props.formik.touched.birthmonth && props.formik.errors.birthmonth
        }
      />

      <Autocomplete
        id="birthyear"
        name="birthyear"
        style={{ width: 300 }}
        options={years}
        autoHighlight
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <TextField
              error={
                props.formik.touched.birthyear &&
                Boolean(props.formik.errors.birthyear)
              }
              helperText={
                props.formik.touched.birthyear && props.formik.errors.birthyear
              }
              {...params}
              label="Year of birth"
              variant="outlined"
            />
          );
        }}
        onChange={async (e, newyear) => {
          if (newyear) props.formik.values.birthyear = newyear.value;
          else props.formik.values.birthyear = "";
          await props.formik.handleChange("birthyear");
        }}
        error={
          props.formik.touched.birthyear &&
          Boolean(props.formik.errors.birthyear)
        }
        helperText={
          props.formik.touched.birthyear && props.formik.errors.birthyear
        }
      />
    </FormControl>
  );
};

const Signup = (props) => {
  // Redirection to 'home' is a token recognised
  if (document.cookie.indexOf("; token") > -1) {
    window.location.replace("/home");
  }

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      birthday: "",
      birthmonth: "",
      birthyear: "",
      gender: "",
      country: "",
      city: "",
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const user = {
        fName: values.fname,
        lName: values.lname,
        email: values.email,
        password: values.password,
        country: values.country,
        city: values.city,
        gender: values.gender,
        dob: values.birthyear + "-" + values.birthmonth + "-" + values.birthday,
      };

      try {
        const res = await fetch("/signup", {
          method: "post",
          body: JSON.stringify(user),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const resJson = await res.json();
        if (!resJson.valid) {
          console.log(resJson.message);
        } else {
          // valid request
          props.gotUserData(resJson.userData);
        }
      } catch (err) {
        console.log(err.message);
      }

      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl>
        <TextField
          id="in-txt-fname"
          name="fname"
          label="First Name"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.fname && Boolean(formik.errors.fname)}
          helperText={formik.touched.fname && formik.errors.fname}
        />
        <TextField
          id="in-txt-lname"
          name="lname"
          label="Last Name"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.lname && Boolean(formik.errors.lname)}
          helperText={formik.touched.lname && formik.errors.lname}
        />
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

        <FormControl
          component="fieldset"
          error={formik.touched.gender && Boolean(formik.errors.gender)}
          helperText={formik.touched.gender && formik.errors.gender}
        >
          <RadioGroup name="gender" row onChange={formik.handleChange}>
            <FormControlLabel
              value="m"
              control={<Radio />}
              label="Male"
              labelPlacement="top"
            />
            <FormControlLabel
              value="f"
              control={<Radio />}
              label="Female"
              labelPlacement="top"
            />
            <FormHelperText
              disabled={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              {formik.errors.gender}
            </FormHelperText>
          </RadioGroup>
        </FormControl>

        <Birthdate formik={formik} />

        <Autocomplete
          id="country"
          style={{ width: 300 }}
          name="country"
          options={countries}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Choose a country"
                variant="outlined"
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            );
          }}
          onChange={(e, newcountry) => {
            if (newcountry) formik.values.country = newcountry.code;
            else formik.values.country = "";
            formik.handleChange("country");
          }}
        />
        <TextField
          id="city"
          name="city"
          label="City"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />

        <Button type="submit" variant="contained" color="primary">
          SignUp
        </Button>
        <small>
          <span style={{ color: "gray" }}>already have an account? </span>
          <a href="\login">login</a>
        </small>
      </FormControl>
    </form>
  );
};

export default Signup;
