import { useState } from "react";
import Cookies from "js-cookie";

import { Navigate } from "react-router-dom";
import Navbar from "../Navbar";

const Login = (props) => {
  const [isClicked, setClick] = useState(false);
  const token = Cookies.get("jwt_toke");

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [verify, setVerify] = useState(false);

  const verification = async (event) => {
    event.preventDefault();
    const details = { email };
    const url = "http://localhost:5000/api/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(details),
    };

    const response = await fetch(url, options);
    const jsonData = await response.json();
    // console.log(jsonData.token)
    if (response.ok) {
      //   const jsonDt =
      //   console.log(jsonData.msg);
      //   console.log(jsonDt);
      setClick(true);
    }
    // else {
    //   console.log(jsonData.msg);
    // }
  };

  const verifyPass = async (event) => {
    event.preventDefault();
    const details = { otp: pass };
    const url = "http://localhost:5000/api/verify";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(details),
    };

    const response = await fetch(url, options);
    const jsonData = await response.json();
    // console.log(jsonData.token)
    if (response.ok) {
      //   console.log(jsonData.jwt_token)
      Cookies.set("jwt_toke", jsonData.token, { expires: 30 });
      //   const { history } = props;
      //   history.replace("/");
      //   console.log(props.history);
      setVerify(true);
    } else {
      console.log(jsonData.error_msg);
    }

    //   console.log(jsonDt);
  };

  if (verify) {
    return <Navigate to="/loginhome" />;
  }

  if (token !== undefined) {
    return <Navigate to="/loginhome" />;
  }

  return (
    <div>
      <Navbar />
      <h2>Login Your Account</h2>
      {isClicked ? (
        <form onSubmit={verifyPass}>
          <p>
            Please verify your email ID to continue We have sent an OTP to this-
            {email.toUpperCase()}
          </p>
          <br />
          <input
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            required
            type="text"
            placeholder="Enter OTP"
          />
          <br />
          <button type="submit">Countinue</button>
        </form>
      ) : (
        <form onSubmit={verification}>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            type="text"
            placeholder="Enter Your Email Id"
          />
          <br />
          <button type="submit">Countinue</button>
        </form>
      )}
    </div>
  );
};

export default Login;
