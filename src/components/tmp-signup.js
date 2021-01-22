/* import { useState, useRef } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  NativeSelect,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import countries from "../data-stores/login and signup.json";

const Birthdate = (props) => {
  const minPossibleYear = 1900;
  const date = new Date();

  const [dob, setDob] = useState({ day: null, month: null, year: null });

  const checkIfCanUpdateParentDOB = () => {
    console.log("To CHECKKKK ==> ", dob);
    if (dob.day && dob.month && dob.year) {
      const userDob = new Date(dob.year, dob.month, dob.day);

      // If the user DOB havn't come yet, then i can be a true DOB.
      if (new Date() > userDob)
        props.setDob(`${dob.year}/${dob.month}/${dob.day}`);
    }
  };

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
        id="in-select-days"
        style={{ width: 300 }}
        options={days}
        autoHighlight
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <TextField {...params} label="Day of birth" variant="outlined" />
          );
        }}
        onChange={async (e, newDay) => {
          const newDob = JSON.parse(JSON.stringify(dob));
          if (newDay) newDob.day = newDay.value;
          else newDob.day = null;
          console.log("new DOB day", newDob);
          setDob(newDob);
          console.log("DOB day", newDob);
          checkIfCanUpdateParentDOB();
        }}
        required
      />
      <Autocomplete
        id="in-select-monthes"
        style={{ width: 300 }}
        options={monthes}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <TextField {...params} label="Month of birth" variant="outlined" />
          );
        }}
        onChange={(e, newMonth) => {
          const newDob = JSON.parse(JSON.stringify(dob));
          if (newMonth) newDob.month = newMonth.value;
          else newDob.month = null;
          console.log("new DOB Month", newDob);
          setDob(newDob);
          console.log("DOB Month", newDob);
          checkIfCanUpdateParentDOB();
        }}
        required
      />
      <Autocomplete
        id="in-select-years"
        style={{ width: 300 }}
        options={years}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <TextField {...params} label="Year of birth" variant="outlined" />
          );
        }}
        onChange={(e, newYear) => {
          const newDob = JSON.parse(JSON.stringify(dob));
          if (newYear) newDob.year = newYear.value;
          else newDob.year = null;
          console.log("new DOB Year", newDob);
          setDob(newDob);
          console.log("DOB Year", newDob);
          checkIfCanUpdateParentDOB();
        }}
        required
      />
    </FormControl>
  );
};

const Signup = (props) => {
  const url = "http://localhost:8080";
  const maxNameLen = 20,
    minNameLen = 2,
    maxPassLen = 20,
    minPassLen = 6,
    maxCityLen = 20,
    minCityLen = 2;

  const [pass2Err, setPass2Err] = useState(0);
  const [fName, setFname] = useState(null);
  const [lName, setLname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [password2, setPassword2] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [city, setCity] = useState(null);
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(dob); // TMP

    if (password !== password2) {
      // Passwords don't match
      setPass2Err(true);
      return;
    } else setPass2Err(false);

    const user = {
      fName,
      lName,
      email,
      password,
      country: countryCode,
      city,
      gender,
      dob,
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
      console.log(res.status);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormControl>
        <TextField
          id="in-txt-fname"
          name="fname"
          inputProps={{ minLength: minNameLen, maxLength: maxNameLen }}
          onChange={(e) => {
            setFname(e.target.value);
          }}
          label="First Name"
          variant="outlined"
          required
        />
        <TextField
          id="in-txt-lname"
          name="lname"
          inputProps={{ minLength: minNameLen, maxLength: maxNameLen }}
          onChange={(e) => {
            setLname(e.target.value);
          }}
          label="Last Name"
          variant="outlined"
          required
        />
        <TextField
          id="in-txt-email"
          type="email"
          inputMode={{ email: true }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          label="Email"
          variant="outlined"
          required
        />
        <TextField
          id="in-txt-pass1"
          type="password"
          inputProps={{ minLength: minPassLen, maxLength: maxPassLen }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          label="Password"
          variant="outlined"
          required
        />
        <TextField
          id="in-txt-pass2"
          type="password"
          inputProps={{ minLength: minPassLen, maxLength: maxPassLen }}
          onChange={(e) => {
            setPassword2(e.target.value);
            setPass2Err(false);
          }}
          label="Confirm Password"
          helperText={!pass2Err || "Passwords do not match."}
          error={pass2Err}
          variant="outlined"
          required
        />

        <Birthdate setDob={setDob} />

        <FormControl>
          <InputLabel htmlFor="in-select-gender">Gender</InputLabel>
          <NativeSelect
            id="in-select-gender"
            onChange={(e) => {
              setFname(e.target.value);
            }}
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </NativeSelect>
        </FormControl>
        <FormControl>
          <Autocomplete
            id="in-select-country"
            style={{ width: 300 }}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label="Choose a country"
                  variant="outlined"
                />
              );
            }}
            onChange={(e, val) => {
              if (val) {
                setCountryCode(val.code);
              } else {
                setCountryCode(null);
              }
            }}
          />
          <TextField
            id="in-txt-city"
            inputProps={{ minLength: minCityLen, maxLength: maxCityLen }}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            label="City"
            required
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          SignUp
        </Button>
      </FormControl>
    </form>
  );
};

export default Signup;
 */
