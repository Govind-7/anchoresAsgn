import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import Navbar from "../Navbar";

const Signup = () => {
  const [isClicked, setClick] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const token = Cookies.get("jwt_toke");

  const verification = async (event) => {
    event.preventDefault();
    const details = { email, username };
    const url = "https://anchores.onrender.com/api/signup";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(details),
    };

    const response = await fetch(url, options);
    await response.json();
    // console.log(jsonData.token)
    if (response.ok) {
      //   const jsonDt =
      setClick(true);
      console.log("otp send success");
      //   console.log(jsonDt);
    } else {
      console.log("error");
    }
  };

  const verifyPass = async (event) => {
    event.preventDefault();
    const details = { otp: pass };
    const url = "https://anchores.onrender.com/api/verify";
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
      const { history } = this.props;
      history.replace("/");
    } else {
      console.log(jsonData.error_msg);
    }

    //   console.log(jsonDt);
  };
  if (token !== undefined) {
    return <Navigate to="/loginhome" />;
  }

  return (
    <div>
      <Navbar />
      <h2>Create Your Account</h2>
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
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="Enter Your name"
            required
          />
          <br />
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

export default Signup;
