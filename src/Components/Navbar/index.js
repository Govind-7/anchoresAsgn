import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const Navbar = () => {
  const [user, setUser] = useState("");
  const [verify, setVerify] = useState(false);
  const userdetails = async () => {
    const url = "http://localhost:5000/api/profile";
    const token = Cookies.get("jwt_toke");
    // console.log("from navbar", token);
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(url, options);
    const jsondata = await response.json();
    setUser(jsondata.username);
    // console.log(jsondata);
  };

  const logoutFunction = () => {
    Cookies.remove("jwt_toke");
    setVerify(true);
  };

  useEffect(() => {
    userdetails();
  }, [user]);

  if (verify) {
    return <Navigate to="/" />;
  }
  return (
    <nav className="navbar-bg">
      <img
        className="logo"
        alt="logo"
        src="https://www.anchors.in/static/media/logo-invite-only.05788d79bfb2d37a65d2.png"
      />
      {user && (
        <div className="logout-container">
          <p>Welcome , {user}</p>
          <button className="logout-button" onClick={logoutFunction}>
            logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
